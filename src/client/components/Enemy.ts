import { Component, TagComponent, Types } from "ecsy";
import EnemyState from "@server/components/enemy";
import { EnemySpec } from "types/enemies";

export default class Enemy extends Component<Enemy> {
  static schema = {
    key: { type: Types.String },
    state: { type: Types.JSON },
    spec: { type: Types.JSON },
  };
  key?: string;
  state?: EnemyState;
  spec?: EnemySpec;
}

export class LookAtPlayer extends TagComponent {}
