import { Room, Client } from "colyseus";
import { User, verifyToken, IUser } from "@colyseus/social";
import AdminState from "@server/components/admin";
import { adminCommands, AdminCommandsAvailable } from "./adminEventHandlers";
import { RoomMessage } from "types/gameState";
import { Dispatcher } from "@colyseus/command";

export default class AdminRoom extends Room<AdminState> {
  dispatcher = new Dispatcher(this);

  async onAuth(client: Client, options: any) {
    // verify token authenticity
    const token = verifyToken(options.token);

    // query the user by its id
    return await User.findById(token._id);
  }

  onCreate() {
    this.setState(new AdminState());

    const adminCommandsAvailable = Object.keys(
      adminCommands
    ) as AdminCommandsAvailable[];
    adminCommandsAvailable.forEach((cmd) => {
      const adminCommand = adminCommands[cmd];
      if (adminCommand) {
        this.onMessage(
          cmd,
          (client: Client, data?: RoomMessage<typeof cmd>) => {
            this.dispatcher.dispatch(new adminCommand(), {
              data,
              sessionId: client.sessionId,
            });
          }
        );
      }
    });
  }

  onJoin(client: Client, options: any, user: IUser) {
    if (user.metadata.role === 0) {
      client.close();
    }
  }

  async onLeave(client: Client, consented: boolean) {}

  async onDispose() {}
}
