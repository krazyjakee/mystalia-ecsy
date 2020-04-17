import { Component } from "ecsy";
import EnemyState from "@server/components/enemy";

export default class Enemy extends Component {
  key?: string;
  state?: EnemyState;
}
