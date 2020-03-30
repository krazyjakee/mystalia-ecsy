import { Room, Client } from "colyseus";
import { User, verifyToken, IUser } from "@colyseus/social";
import AdminState from "../components/admin";

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

  onMessage(client: Client, message: any) {}

  async onLeave(client: Client, consented: boolean) {}

  async onDispose() {}
}
