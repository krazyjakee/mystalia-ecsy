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
          const position = entity.getComponent(Position);
          const positionPixels = {
            x: gateDrawable.x / 32,
            y: gateDrawable.y / 32,
          };
          if (!characterAdjacent) {
            // TODO: round positions to nearest multiple of 32
            // TODO: also include if the positions are equal
            characterAdjacent = tilesAdjacent(position.value, positionPixels);
          }
        });

      gateEntity.getComponent(Gate).open = characterAdjacent;
    });
  }
}
