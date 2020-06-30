import { Component, TagComponent } from "ecsy";
import User from "types/User";

type LocalPlayerProps = {
  user?: User;
};

export default class LocalPlayer extends Component<LocalPlayerProps> {
  user?: User;
}

export class RoleCheckPending extends TagComponent {}

export class CommandsPending extends TagComponent {}
