import { Component } from "ecsy";
import PlayerState from "@server/components/player";

export default class RemotePlayer extends Component {
  key?: string;
  state?: PlayerState;
}
