import { Room, Client } from "colyseus";
import { User, verifyToken, IUser } from "@colyseus/social";
import AdminState from "../components/admin";
import {
  GameStateEventName,
  RoomMessage,
  GameStateEvents
} from "types/gameState";
import { readMapFiles } from "../utilities/mapFiles";
import PlayerState from "serverState/player";

export default class AdminRoom extends Room<AdminState> {
  async onAuth(client: Client, options: any) {
    // verify token authenticity
    const token = verifyToken(options.token);

    // query the user by its id
    return await User.findById(token._id);
  }

  onCreate() {
    this.setState(new AdminState());
  }

  onJoin(client: Client, options: any, user: IUser) {
    if (user.metadata.role === 0) {
      client.close();
    }
  }

  async onMessage(
    client: Client,
    { command, ...data }: RoomMessage<GameStateEventName>
  ) {
    if (command === "admin:list:requestAllPlayers") {
      const all = await User.find({});
      this.send(client, {
        command: "admin:list:allPlayers",
        all: all
          .filter(({ username, displayName }) => username && displayName)
          .map(({ username, displayName }) => ({
            username,
            displayName
          }))
      });
    }
    if (command === "admin:list:requestAllMaps") {
      const maps = readMapFiles();
      this.send(client, {
        command: "admin:list:allMaps",
        all: Object.keys(maps)
      });
    }
    if (command === "admin:teleport:request") {
      const { username, ...teleportRequestData } = data as RoomMessage<
        "admin:teleport:request"
      >;

      const { map, tileId } = teleportRequestData;

      // Teleport to me or teleport to specific map
      if (map && tileId) {
        const response: RoomMessage<"admin:teleport:response"> = {
          command: "admin:teleport:response",
          ...(teleportRequestData as GameStateEvents["admin:teleport:response"])
        };
        this.presence.publish(`${username}:commands`, response);
      } else {
        // Teleport me to
        this.presence.subscribe(
          `${username}:state`,
          ({ currentRoom, targetTile }: PlayerState) => {
            if (currentRoom && targetTile) {
              const response: RoomMessage<"admin:teleport:response"> = {
                command: "admin:teleport:response",
                map: currentRoom,
                tileId: targetTile
              };
              this.send(client, response);
            }
            this.presence.unsubscribe(`${username}:state`);
          }
        );
        this.presence.publish(`${username}:requestState`, undefined);
      }
    }
  }

  async onLeave(client: Client, consented: boolean) {}

  async onDispose() {}
}
