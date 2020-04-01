import { Room, Client } from "colyseus";
import { User, verifyToken, IUser } from "@colyseus/social";
import AdminState from "../components/admin";
import { GameStateEventName, RoomMessage } from "types/gameState";
import { readMapFiles } from "../utilities/mapFiles";

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

  async onMessage(client: Client, message: RoomMessage<GameStateEventName>) {
    console.log("received", message.command);
    if (message.command === "admin:list:requestAllPlayers") {
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
    if (message.command === "admin:list:requestAllMaps") {
      const maps = readMapFiles();
      this.send(client, {
        command: "admin:list:allMaps",
        all: Object.keys(maps)
      });
    }
  }

  async onLeave(client: Client, consented: boolean) {}

  async onDispose() {}
}
