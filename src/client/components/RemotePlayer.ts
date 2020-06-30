import { Component } from "ecsy";
import PlayerState from "@server/components/player";

export type RemotePlayerProps = {
  key?: string;
  state?: PlayerState;
};

export default class RemotePlayer extends Component<RemotePlayerProps> {
  key?: string;
  state?: PlayerState;
}
