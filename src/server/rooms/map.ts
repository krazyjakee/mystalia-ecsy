import { Room, Client } from "colyseus";

const players = {};

export default class MapRoom extends Room {
  onCreate(options: any) {
    console.log(`MapRoom "${this.roomName}" created`);
  }

  onJoin(client: Client, options: any) {
    console.log(`${client.sessionId} joined ${this.roomName}`);
    this.send(client, {
      client: client.id,
      message: {
        type: "map:listOthers",
        others: this.clients.map(c => c.id)
      }
    });
  }

  onMessage(client: Client, message: any) {
    this.broadcast({ client: client.id, message }, { except: client });
  }

  onLeave(client: Client, consented: boolean) {
    console.log(`${client.sessionId} left ${this.roomName}`);
    this.broadcast(
      { client: client.id, message: { type: "map:leave" } },
      { except: client }
    );
  }

  onDispose() {}
}
