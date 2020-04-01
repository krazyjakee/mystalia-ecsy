import { Room, Client } from "colyseus";
import { User, verifyToken, IUser } from "@colyseus/social";
import MapState from "../components/map";
import Player from "../components/player";
import { savePlayerState } from "../utilities/dbState";

export default class MapRoom extends Room<MapState> {
  async onAuth(client: Client, options: any) {
    // verify token authenticity
    const token = verifyToken(options.token);

    // query the user by its id
    return await User.findById(token._id);
  }

  onCreate() {
    console.log(`MapRoom "${this.roomName}" created`);
    this.setState(new MapState());
  }

  onJoin(client: Client, options: any, user: IUser) {
    const userId = user.isAnonymous ? user._id : user.username;
    console.log(`${userId} joined ${this.roomName}`);
    this.state.players[client.sessionId] = new Player(user);
    savePlayerState(this.state.players[client.sessionId], this.roomName);
    // TODO use presence and subscribe to user based event messages
  }

  onMessage(client: Client, message: any) {
    const player = this.state.players[client.sessionId];

    if (message.command === "move" && message.targetTile) {
      player.targetTile = message.targetTile;
    }
  }

  async onLeave(client: Client, consented: boolean) {
    console.log(`${client.sessionId} left ${this.roomName}`);
    await savePlayerState(this.state.players[client.sessionId], this.roomName);
    delete this.state.players[client.sessionId];
    // TODO use presence and unsubscribe to user based event messages
  }

  async onDispose() {
    const sessionIds = Object.keys(this.state.players);
    if (sessionIds.length) {
      await Promise.all(
        sessionIds.map(sessionId =>
          savePlayerState(this.state.players[sessionId], this.roomName)
        )
      );
      console.log(
        `Saved ${sessionIds.length} players in "${this.roomName}" to db.`
      );
    }
  }
}
