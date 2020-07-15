import { Component, Types } from "ecsy";

export default class Effect extends Component<Effect> {
  static schema = {
    effectId: { type: Types.Number },
  };
  effectId?: number;
}
