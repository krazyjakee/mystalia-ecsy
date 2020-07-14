import { Component, Types } from "ecsy";
import PlayerState from "@server/components/player";

export default class RemotePlayer extends Component<RemotePlayer> {
  static schema = {
    key: { type: Types.String },
    state: { type: Types.JSON },
  };
  key?: string;
  state?: PlayerState;
}
