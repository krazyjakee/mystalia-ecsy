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
        const response: PresenceMessage<"localPlayer:movement:nextMap"> = {
          command: "localPlayer:movement:nextMap",
          ...(teleportRequestData as GameStateEvents["localPlayer:movement:nextMap"]),
        };
        this.room.presence.publish(`${username}:commands`, response);
      } else {
        // Teleport me to
        this.room.presence.subscribe(
          `${username}:state`,
          ({ currentRoom, targetTile }: PlayerState) => {
            if (currentRoom && targetTile) {
              const response: RoomMessage<"localPlayer:movement:nextMap"> = {
                map: currentRoom,
                tileId: targetTile,
              };
              client.send("localPlayer:movement:nextMap", response);
            }
            this.room.presence.unsubscribe(`${username}:state`);
          }
        );
        this.room.presence.publish(`${username}:requestState`, undefined);
      }
    }
  }
}
