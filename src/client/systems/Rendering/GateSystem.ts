import { System } from "ecsy";
import LocalPlayer from "@client/components/LocalPlayer";
import RemotePlayer from "@client/components/RemotePlayer";
import Gate from "@client/components/Gate";
import Position from "@client/components/Position";
import Drawable from "@client/components/Drawable";
import { tilesAdjacent } from "utilities/movement/surroundings";
import { sfxAssetPath } from "@client/utilities/assets";
import { playSound } from "@client/sound";

export default class GateSystem extends System {
  static queries = {
    localPlayer: {
      components: [LocalPlayer],
    },
    remotePlayers: {
      components: [RemotePlayer],
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
        .concat(this.queries.remotePlayers.results)
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

      const gateComponent = gateEntity.getComponent(Gate);
      if (!gateComponent.open && characterAdjacent) {
        playSound(sfxAssetPath("gate"));
      }
      gateComponent.open = characterAdjacent;
    });
  }
}
