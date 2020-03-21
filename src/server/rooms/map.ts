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
    this.state.players[client.sessionId] = new Player(user._id.toString());
    savePlayerState(this.state.players[client.sessionId], this.roomName);
  }

  onMessage(client: Client, message: any) {
    const player = this.state.players[client.sessionId];

    if (message.command === "move") {
      player.targetTile = message.targetTile;
    }
  }

  onLeave(client: Client, consented: boolean) {
    console.log(`${client.sessionId} left ${this.roomName}`);
    savePlayerState(this.state.players[client.sessionId], this.roomName);
    delete this.state.players[client.sessionId];
  }

  onDispose() {}
}
