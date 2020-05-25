import { System, Entity, Not } from "ecsy";
import Enemy, { LookAtPlayer } from "@client/components/Enemy";
import { Direction } from "types/Grid";
import RemotePlayer from "@client/components/RemotePlayer";
import LocalPlayer from "@client/components/LocalPlayer";
import Movement from "@client/components/Movement";
import { Loadable } from "@client/components/Loadable";
import TileMap from "@client/components/TileMap";
import {
  facePosition,
  distanceBetweenTiles,
} from "utilities/movement/surroundings";
import { randomNumberBetween } from "utilities/math";
import SpriteSheetAnimation from "@client/components/SpriteSheetAnimation";
import { generateCharacterAnimationSteps } from "@client/utilities/Animation/character";

export default class LookAtPlayerSystem extends System {
  static queries = {
    enemies: {
      components: [Enemy, LookAtPlayer, Movement],
      listen: {
        added: true,
      },
    },
    tileMap: {
      components: [Not(Loadable), TileMap],
    },
    remotePlayers: {
      components: [RemotePlayer, Movement],
    },
    localPlayer: {
      components: [LocalPlayer, Movement],
    },
  };

  ticked: boolean = true;

  init() {
    setInterval(() => {
      this.ticked = false;
    }, 1000);
  }

  execute() {
    if (this.ticked) return;
    this.ticked = true;

    const tileMap = this.queries.tileMap.results
      .find((entity) => entity)
      ?.getComponent(TileMap);
    if (!tileMap) return;

    const mapColumns = tileMap.width;

    const remotePlayerPositions = this.queries.remotePlayers.results.map(
      (entity) => entity.getComponent(Movement).currentTile
    );
    const localPlayerPosition = this.queries.localPlayer.results.map(
      (entity) => entity.getComponent(Movement).currentTile
    );

    this.queries.enemies.results.forEach((entity: Entity) => {
      const enemy = entity.getComponent(Enemy);

      const currentPosition = entity.getComponent(Movement).currentTile;

      const spec = enemy.spec;
      if (!spec) return;

      let direction: Direction | undefined;

      const behaviour = spec.behavior.static || spec.behavior.patrol;
      if (behaviour) {
        if (behaviour.lookAtPlayer) {
          const specDistance = behaviour.distance || 1;

          if (localPlayerPosition.length) {
            if (
              distanceBetweenTiles(
                currentPosition,
                localPlayerPosition[0],
                mapColumns
              ) <= specDistance
            ) {
              direction = facePosition(
                currentPosition,
                localPlayerPosition[0],
                mapColumns
              );
            }
          }

          if (!direction) {
            const distances = remotePlayerPositions
              .filter(
                (position) =>
                  distanceBetweenTiles(currentPosition, position, mapColumns) <=
                  specDistance
              )
              .map((position) => ({
                distance: distanceBetweenTiles(
                  currentPosition,
                  position,
                  mapColumns
                ),
                position,
              }));

            distances.sort((a, b) => a.distance - b.distance);

            if (distances.length) {
              direction = facePosition(
                currentPosition,
                distances[0].position,
                mapColumns
              );
            }
          }
        }

        if (
          !direction &&
          spec.behavior.static &&
          spec.behavior.static.lookAround
        ) {
          const directions: Array<false | Direction> = [
            false,
            false,
            false,
            false,
            "n",
            "e",
            "s",
            "w",
          ];
          const newDirection =
            directions[randomNumberBetween(directions.length) - 1];
          if (newDirection) {
            direction = newDirection;
          }
        }

        if (direction) {
          const spritesheet = entity.getComponent(SpriteSheetAnimation);
          spritesheet.steps = generateCharacterAnimationSteps(direction);
        }
      }
    });
  }
}
