import { Component, TagComponent } from "ecsy";
import EnemyState from "@server/components/enemy";
import { EnemySpec } from "types/enemies";

export default class Enemy extends Component<Enemy> {
  key?: string;
  state?: EnemyState;
  spec?: EnemySpec;
}

export class LookAtPlayer extends TagComponent {}
