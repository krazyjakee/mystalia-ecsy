import { readMapFiles } from "@server/utilities/mapFiles";
import { User } from "@colyseus/social";
import { Command } from "@colyseus/command";
import MapState from "@server/components/map";
import { RoomMessage } from "types/gameState";

export class ListAllMapsCommand extends Command<
  MapState,
  { sessionId: string }
> {
  execute({ sessionId }) {
    const client = this.room.clients.find((c) => c.sessionId === sessionId);
    if (client) {
      const maps = readMapFiles();
      client.send("admin:list:allMaps", {
        all: Object.keys(maps),
      });
    }
  }
}

export class ListAllPlayersCommand extends Command<
  MapState,
  { sessionId: string; data: RoomMessage<"localPlayer:movement:report"> }
> {
  async execute({ sessionId }) {
    const client = this.room.clients.find((c) => c.sessionId === sessionId);
    if (client) {
      const all = await User.find({});
      client.send("admin:list:allPlayers", {
        all: all
          .filter(({ username, displayName }) => username && displayName)
          .map(({ username, displayName }) => ({
            username,
            displayName,
          })),
      });
    }
  }
}
