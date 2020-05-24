import { Component, TagComponent } from "ecsy";
import EnemyState from "@server/components/enemy";
import { EnemySpec } from "types/enemies";
import { Direction } from "types/Grid";

export default class Enemy extends Component {
  key?: string;
  state?: EnemyState;
  spec?: EnemySpec;
}

export class StaticBehaviour extends TagComponent {}
