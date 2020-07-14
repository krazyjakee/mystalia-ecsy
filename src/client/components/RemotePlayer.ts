import { Component } from "ecsy";
import PlayerState from "@server/components/player";

export default class RemotePlayer extends Component<RemotePlayer> {
  key?: string;
  state?: PlayerState;
}
