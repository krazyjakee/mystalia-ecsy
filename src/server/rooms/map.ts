import { Room, Client } from "colyseus";
import { User, verifyToken, IUser } from "@colyseus/social";
import { Dispatcher } from "@colyseus/command";
import MapState from "@server/components/map";
import Player from "@server/components/player";
import { savePlayerState, saveStateToDb } from "@server/utilities/dbState";
import { RoomMessageType, PresenceMessage, RoomMessage } from "types/gameState";
import ItemSpawner from "@server/workers/itemSpawner";
import { ObjectTileStore } from "utilities/ObjectTileStore";
import { readMapFiles } from "@server/utilities/mapFiles";
import { TMJ } from "types/TMJ";
import EnemySpawner from "@server/workers/enemySpawner";
import WeatherSpawner from "@server/workers/weatherSpawner";
import {
  roomCommands,
  RoomCommandsAvailable,
  thisRoomCommands,
} from "./mapEventHandlers";
import Battle from "@server/workers/battle";
import WorldEnemySpawner from "@server/workers/worldEnemySpawner";

export default class MapRoom extends Room<MapState> {
  dispatcher = new Dispatcher(this);
  itemSpawner?: ItemSpawner;
  enemySpawner?: EnemySpawner;
  worldEnemySpawner?: WorldEnemySpawner;
  weatherSpawner?: WeatherSpawner;
  battleWorker?: Battle;

  objectTileStore?: ObjectTileStore;
  mapData?: TMJ;

  async onAuth(client: Client, options: any) {
    // verify token authenticity
    const token = verifyToken(options.token);

    // query the user by its id
    return await User.findById(token._id);
  }

  onCreate() {
    console.log(`MapRoom "${this.roomName}" created`);
    this.setState(new MapState());

    const maps = readMapFiles();
    this.mapData = maps[this.roomName];
    this.objectTileStore = new ObjectTileStore(this.mapData);

    this.itemSpawner = new ItemSpawner(this);
    this.enemySpawner = new EnemySpawner(this);
    this.battleWorker = new Battle(this);

    this.weatherSpawner = new WeatherSpawner(this);
    this.worldEnemySpawner = new WorldEnemySpawner(this);

    const roomCommandsAvailable = Object.keys(
      roomCommands
    ) as RoomCommandsAvailable[];
    roomCommandsAvailable.forEach((cmd) => {
      const RoomCommand = roomCommands[cmd];
      if (RoomCommand) {
        this.onMessage(
          cmd,
          (client: Client, data?: RoomMessage<typeof cmd>) => {
            this.dispatcher.dispatch(new RoomCommand(), {
              data,
              sessionId: client.sessionId,
            });
          }
        );
      }
    });

    const thisRoomCommandsAvailable = thisRoomCommands(this.roomName);
    Object.keys(thisRoomCommandsAvailable).forEach((cmd) => {
      const RoomCommand = thisRoomCommandsAvailable[cmd];
      if (RoomCommand) {
        this.onMessage(cmd, (client: Client, data?: any) => {
          this.dispatcher.dispatch(new RoomCommand(), {
            data,
            sessionId: client.sessionId,
          });
        });
      }
    });

    this.presence.subscribe("chat:publish:global", (data) => {
      this.broadcast("chat:subscribe:global", data);
    });
  }

  onJoin(client: Client, options: any, user: IUser) {
    const userId = user.isAnonymous ? user._id : user.username;
    console.log(`${userId} joined ${this.roomName}`);
    this.state.players[client.sessionId] = new Player(user, this.roomName);
    savePlayerState(this.state.players[client.sessionId], this.roomName);

    this.presence.subscribe(
      `${user.username}:commands`,
      (data: PresenceMessage<RoomMessageType>) => {
        client.send(data.command, data);
      }
    );

    this.presence.subscribe(`${user.username}:requestState`, () => {
      this.presence.publish(
        `${user.username}:state`,
        this.state.players[client.sessionId]
      );
    });
  }

  async onLeave(client: Client, consented: boolean) {
    console.log(`${client.sessionId} left ${this.roomName}`);
    await savePlayerState(this.state.players[client.sessionId], this.roomName);

    const username = this.state.players[client.sessionId].username;
    this.presence.unsubscribe(`${username}:commands`);
    this.presence.unsubscribe(`${username}:requestState`);

    delete this.state.players[client.sessionId];
  }

  async onDispose() {
    if (this.itemSpawner) {
      this.itemSpawner.dispose();
    }

    if (this.enemySpawner) {
      this.enemySpawner.dispose();
    }

    if (this.worldEnemySpawner) {
      this.worldEnemySpawner.dispose();
    }

    if (this.battleWorker) {
      this.battleWorker.dispose();
    }

    if (this.weatherSpawner) {
      await this.weatherSpawner.dispose();
    }
    await saveStateToDb("Item", this.roomName, this.state.items);

    const sessionIds = Object.keys(this.state.players);
    if (sessionIds.length) {
      await Promise.all(
        sessionIds.map((sessionId) =>
          savePlayerState(this.state.players[sessionId], this.roomName)
        )
      );
      console.log(
        `Saved ${sessionIds.length} players in "${this.roomName}" to db.`
      );
    }

    console.log(`MapRoom "${this.roomName}" disposed`);
  }
}
