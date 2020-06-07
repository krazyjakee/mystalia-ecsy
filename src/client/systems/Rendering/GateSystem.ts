import { System, Not } from "ecsy";
import TileMap from "@client/components/TileMap";
import { Loadable } from "@client/components/Loadable";
import LocalPlayer from "@client/components/LocalPlayer";
import RemotePlayer from "@client/components/RemotePlayer";
import Enemy from "@client/components/Enemy";
import Gate from "@client/components/Gate";
import Position from "@client/components/Position";
import Drawable from "@client/components/Drawable";
import { tilesAdjacent } from "utilities/movement/surroundings";
import { roundToNearestMultiple } from "utilities/math";

export default class GateSystem extends System {
  static queries = {
    localPlayer: {
      components: [LocalPlayer],
    },
    remotePlayers: {
      components: [RemotePlayer],
    },
    enemies: {
      components: [Enemy],
    },
    gates: {
      components: [Gate],
    },
  };

  execute() {
    this.queries.gates.results.forEach((gateEntity) => {
      let characterAdjacent = false;

      const gateDrawable = gateEntity.getComponent(Drawable);

      this.queries.localPlayer.results
        .concat(
          this.queries.remotePlayers.results.concat(
            this.queries.enemies.results
          )
        )
        .forEach((entity) => {
          if (!characterAdjacent) {
            const position = entity.getComponent(Position);
            const gatePosition = {
              x: gateDrawable.x / 32,
              y: gateDrawable.y / 32,
            };
            const characterPosition = {
              x: Math.round(position.value.x),
              y: Math.round(position.value.y),
            };
            if (
              gatePosition.x === characterPosition.x &&
              gatePosition.y === characterPosition.y
            ) {
              characterAdjacent = true;
            } else {
              characterAdjacent = tilesAdjacent(
                characterPosition,
                gatePosition
              );
            }
          }
        });

      gateEntity.getComponent(Gate).open = characterAdjacent;
    });
  }
}
