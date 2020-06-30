import { Component, TagComponent } from "ecsy";
import EnemyState from "@server/components/enemy";
import { EnemySpec } from "types/enemies";

type EnemyProps = {
  key?: string;
  state?: EnemyState;
  spec?: EnemySpec;
};

export default class Enemy extends Component<EnemyProps> {
  key?: string;
  state?: EnemyState;
  spec?: EnemySpec;
}

export class LookAtPlayer extends TagComponent {}
