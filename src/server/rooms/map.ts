import { Room, Client } from "colyseus";
import MapState from "../components/map";
import Player from "../components/player";

export default class MapRoom extends Room<MapState> {
  onCreate() {
    console.log(`MapRoom "${this.roomName}" created`);
    this.setState(new MapState());
  }

  onJoin(client: Client, options: any) {
    console.log(`${client.sessionId} joined ${this.roomName}`);
    this.state.players[client.sessionId] = new Player();
  }

  onMessage(client: Client, message: any) {
    const player = this.state.players[client.sessionId];

    if (message.command === "move") {
      player.targetTile = message.targetTile;
    }
  }

  onLeave(client: Client, consented: boolean) {
    console.log(`${client.sessionId} left ${this.roomName}`);
    delete this.state.players[client.sessionId];
  }

  onDispose() {}
}
