import { Component, TagComponent, Types } from "ecsy";
import User from "types/User";

export default class LocalPlayer extends Component<LocalPlayer> {
  static schema = {
    user: { type: Types.JSON },
  };
  user?: User;
}

export class RoleCheckPending extends TagComponent {}

export class CommandsPending extends TagComponent {}
