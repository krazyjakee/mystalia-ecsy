import { Component } from "ecsy";

type GateProps = {
  open: boolean;
};

export default class Gate extends Component<GateProps> {
  open: boolean = false;
}
