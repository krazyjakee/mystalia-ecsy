import { Room, Client } from "colyseus";
import { User, verifyToken, IUser } from "@colyseus/social";
import MapState from "@server/components/map";
import Player, {
  addItemToPlayer,
  moveInventoryItem,
} from "@server/components/player";
import { savePlayerState, saveStateToDb } from "@server/utilities/dbState";
import { RoomMessage, GameStateEventName } from "types/gameState";
import ItemSpawner from "@server/workers/itemSpawner";
import { ObjectTileStore } from "utilities/ObjectTileStore";
import { readMapFiles } from "@server/utilities/mapFiles";
import { TMJ } from "types/TMJ";
import EnemySpawner from "@server/workers/enemySpawner";
import WeatherSpawner from "@server/workers/weatherSpawner";

export default class MapRoom extends Room<MapState> {
  itemSpawner?: ItemSpawner;
  enemySpawner?: EnemySpawner;
  weatherSpawner?: WeatherSpawner;

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
    this.weatherSpawner = new WeatherSpawner(this);
  }

  onJoin(client: Client, options: any, user: IUser) {
    const userId = user.isAnonymous ? user._id : user.username;
    console.log(`${userId} joined ${this.roomName}`);
    this.state.players[client.sessionId] = new Player(user, this.roomName);
    savePlayerState(this.state.players[client.sessionId], this.roomName);

    this.presence.subscribe(
      `${user.username}:commands`,
      (data: RoomMessage<GameStateEventName>) => {
        this.send(client, data);
      }
    );

    this.presence.subscribe(`${user.username}:requestState`, () => {
      this.presence.publish(
        `${user.username}:state`,
        this.state.players[client.sessionId]
      );
    });
  }

  onMessage(client: Client, message: RoomMessage<GameStateEventName>) {
    const player = this.state.players[client.sessionId] as Player;

    if (message.command === "localPlayer:movement:report") {
      const moveMessage = message as RoomMessage<"localPlayer:movement:report">;
      player.targetTile = moveMessage.targetTile;
    }

    if (message.command === "localPlayer:inventory:pickup") {
      const pickupMessage = message as RoomMessage<
        "localPlayer:inventory:pickup"
      >;
      if (this.itemSpawner && player.targetTile) {
        const item = this.itemSpawner.getItem(
          player.targetTile,
          pickupMessage.itemId
        );
        if (item) {
          addItemToPlayer(player.inventory, item);
        }
      }
    }

    if (message.command === "localPlayer:inventory:move") {
      const { from, to } = message as RoomMessage<"localPlayer:inventory:move">;
      moveInventoryItem(from, to, player.inventory);
    }
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

    if (this.weatherSpawner) {
      if (this.weatherSpawner.master) {
        await saveStateToDb("Weather", this.roomName, this.state.weather);
      }
      this.weatherSpawner.dispose();
    }

    await saveStateToDb("Item", this.roomName, this.state.items);
    await saveStateToDb("Enemy", this.roomName, this.state.enemies);

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
  }
}
