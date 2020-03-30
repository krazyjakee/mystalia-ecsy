import { Component, TagComponent } from "ecsy";
import User from "types/User";

export default class LocalPlayer extends Component {
  user?: User;
}

export class RoleCheckPending extends TagComponent {}
