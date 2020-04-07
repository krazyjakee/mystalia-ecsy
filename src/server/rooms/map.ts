import { Room, Client } from "colyseus";
import { User, verifyToken, IUser, mongoose } from "@colyseus/social";
import MapState from "../components/map";
import Player, { addItemToPlayer } from "../components/player";
import { savePlayerState } from "../utilities/dbState";
import { RoomMessage, GameStateEventName } from "types/gameState";
import ItemSpawner from "../utilities/itemSpawner";
import ItemSchema from "../db/ItemSchema";
import ItemState from "serverState/item";

export default class MapRoom extends Room<MapState> {
  // autoDispose: boolean = false;
  itemSpawner?: ItemSpawner;

  async onAuth(client: Client, options: any) {
    // verify token authenticity
    const token = verifyToken(options.token);

    // query the user by its id
    return await User.findById(token._id);
  }

  onCreate() {
    console.log(`MapRoom "${this.roomName}" created`);
    this.setState(new MapState());
    this.itemSpawner = new ItemSpawner(this.roomName, this.state.items);
    const items = mongoose.model("Item", ItemSchema);
    items.find({ room: this.roomName }, (err, res) => {
      if (err) return console.log(err.message);
      res.forEach((doc) => {
        const obj = doc.toJSON();
        this.state.items[obj.index] = new ItemState(
          obj.itemId,
          obj.tileId,
          obj.quantity
        );
      });
    });
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

    const itemIds = Object.keys(this.state.items);
    if (itemIds.length) {
      const Item = mongoose.model("Item", ItemSchema);
      itemIds.forEach((itemId) => {
        // TODO: we probably want to Promise.all this like the players below
        const itemState = this.state.items[itemId];
        const item = new Item({
          ...itemState,
          room: this.roomName,
          index: itemId,
        });
        item.save(function(err) {
          if (err) console.log(err.message);
        });
      });
    }

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
