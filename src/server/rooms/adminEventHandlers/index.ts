import { Command } from "@colyseus/command";
import MapState from "@server/components/map";
import { RoomMessage } from "types/gameState";
import { writeFile } from "@server/utilities/files";

export class ItemSpecUpdateCommand extends Command<
  MapState,
  { sessionId: string; data: RoomMessage<"admin:itemSpec:update"> }
> {
  execute({ sessionId, data }) {
    const client = this.room.clients.find((c) => c.sessionId === sessionId);
    if (client) {
      try {
        writeFile("utilities/data/items.json", data.specs);
        client.send("admin:itemSpec:updated", { result: true });
      } catch (e) {
        console.error(e);
        client.send("admin:itemSpec:updated", { result: false });
      }
    }
  }
}
