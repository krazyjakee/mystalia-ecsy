import { RoomMessage } from "types/gameState";
import { Command } from "@colyseus/command";
import MapState from "@server/components/map";
import PlayerState from "@server/components/player";
import { matchMaker } from "colyseus";

export class ChatPublishCommand extends Command<
  MapState,
  { sessionId: string; data: RoomMessage<"chat:publish"> }
> {
  execute({ sessionId, data }) {
    const player = this.state.players[sessionId] as PlayerState;
    const client = this.room.clients.find((c) => c.sessionId === sessionId);
    if (client) {
      client.send(`chat:subscribe:${this.room.roomName}`, {
        message: data.message,
        username: player.username,
        role: "player",
        date: new Date().getTime() + new Date().getMilliseconds(),
      });
    }
  }
}

export class GlobalChatPublishCommand extends Command<
  MapState,
  { sessionId: string; data: RoomMessage<"chat:publish:global"> }
> {
  execute({ sessionId, data }) {
    const player = this.state.players[sessionId] as PlayerState;
    matchMaker.presence.publish("chat:publish:global", {
      message: data.message,
      username: player.username,
      role: "player",
      date: new Date().getTime() + new Date().getMilliseconds(),
    });
  }
}
