import { RoomMessage, PresenceMessage, GameStateEvents } from "types/gameState";
import PlayerState from "@server/components/player";
import { Command } from "@colyseus/command";
import MapState from "@server/components/map";

export class TeleportRequestCommand extends Command<
  MapState,
  { sessionId: string; data: RoomMessage<"localPlayer:movement:report"> }
> {
  execute({ sessionId, data }) {
    const client = this.room.clients.find((c) => c.sessionId === sessionId);
    if (client) {
      const { username, ...teleportRequestData } = data as RoomMessage<
        "admin:teleport:request"
      >;

      const { map, tileId } = teleportRequestData;

      // Teleport to me or teleport to specific map
      if (map && tileId) {
        const response: PresenceMessage<"admin:teleport:response"> = {
          command: "admin:teleport:response",
          ...(teleportRequestData as GameStateEvents["admin:teleport:response"]),
        };
        this.room.presence.publish(`${username}:commands`, response);
      } else {
        // Teleport me to
        this.room.presence.subscribe(
          `${username}:state`,
          ({ currentRoom, targetTile }: PlayerState) => {
            if (currentRoom && targetTile) {
              const response: RoomMessage<"admin:teleport:response"> = {
                map: currentRoom,
                tileId: targetTile,
              };
              client.send("admin:teleport:response", response);
            }
            this.room.presence.unsubscribe(`${username}:state`);
          }
        );
        this.room.presence.publish(`${username}:requestState`, undefined);
      }
    }
  }
}