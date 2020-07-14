import { Component, TagComponent } from "ecsy";
import User from "types/User";

export default class LocalPlayer extends Component<LocalPlayer> {
  user?: User;
}

export class RoleCheckPending extends TagComponent {}

export class CommandsPending extends TagComponent {}
