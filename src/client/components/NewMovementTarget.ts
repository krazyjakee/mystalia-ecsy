import { Component } from "ecsy";
import { Direction } from "types/Grid";

type NewMovementTargetProps = {
  targetTile: number;
  mapDir?: Direction;
};

export default class NewMovementTarget extends Component<
  Partial<NewMovementTargetProps>
> {
  targetTile: number = 0;
  mapDir?: Direction;
}
