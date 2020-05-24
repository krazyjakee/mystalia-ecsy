import { System, Entity, Not } from "ecsy";
import Enemy, { StaticBehaviour } from "@client/components/Enemy";
import { Direction } from "types/Grid";
import RemotePlayer from "@client/components/RemotePlayer";
import LocalPlayer from "@client/components/LocalPlayer";
import Movement from "@client/components/Movement";
import { Loadable } from "@client/components/Loadable";
import TileMap from "@client/components/TileMap";
import { tileIdToVector } from "utilities/tileMap";
import { facePosition } from "utilities/movement/surroundings";
import { randomNumberBetween } from "utilities/math";
import SpriteSheetAnimation from "@client/components/SpriteSheetAnimation";
import { generateCharacterAnimationSteps } from "@client/utilities/Animation/character";
import { AStarFinder } from "astar-typescript";

export default class StaticBehaviourSystem extends System {
  static queries = {
    enemies: {
      components: [Enemy, StaticBehaviour, Movement],
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
    const aStar = new AStarFinder({
      grid: { width: tileMap.width, height: tileMap.height },
      diagonalAllowed: false,
      includeStartNode: false,
    });
    const remotePlayerPositions = this.queries.remotePlayers.results.map(
      (entity) =>
        tileIdToVector(entity.getComponent(Movement).currentTile, mapColumns)
    );
    const localPlayerPosition = this.queries.localPlayer.results.map((entity) =>
      tileIdToVector(entity.getComponent(Movement).currentTile, mapColumns)
    );

    this.queries.enemies.results.forEach((entity: Entity) => {
      const enemy = entity.getComponent(Enemy);

      const currentPosition = tileIdToVector(
        entity.getComponent(Movement).currentTile,
        mapColumns
      );

      const spec = enemy.spec;
      let direction: Direction | undefined;

      if (spec && spec.behavior.static) {
        const staticSpec = spec.behavior.static;
        if (staticSpec.lookAtPlayer) {
          const specDistance = staticSpec.distance || 1;

          if (localPlayerPosition.length) {
            if (
              aStar.findPath(currentPosition, localPlayerPosition[0]).length <=
              specDistance
            ) {
              direction = facePosition(currentPosition, localPlayerPosition[0]);
            }
          }

          if (!direction) {
            const distances = remotePlayerPositions
              .filter(
                (position) =>
                  aStar.findPath(currentPosition, position).length <=
                  specDistance
              )
              .map((position) => ({
                distance: aStar.findPath(currentPosition, position).length,
                position,
              }));

            distances.sort((a, b) => a.distance - b.distance);

            if (distances.length) {
              direction = facePosition(currentPosition, distances[0].position);
            }
          }
        }

        if (!direction && staticSpec.lookAround) {
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
