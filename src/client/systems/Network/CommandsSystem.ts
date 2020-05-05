import { System } from "ecsy";
import { Unloadable } from "@client/components/Loadable";
import LocalPlayer, { CommandsPending } from "@client/components/LocalPlayer";
import gameState from "../../gameState";
import TileMap from "@client/components/TileMap";
import Drawable from "@client/components/Drawable";
import Movement from "@client/components/Movement";
import { mapAssetPath } from "../../utilities/assets";
import Enemy from "@client/components/Enemy";
import { AddCharacterHighlight } from "@client/components/CharacterHighlight";
import TextBurst from "@client/components/TextBurst";
import CreateEffect from "@client/entities/Effect";
import Position from "@client/components/Position";
import { vectorToPixels } from "utilities/tileMap";
import { ItemSpec } from "types/TileMap/ItemTiles";
import { isPresent } from "utilities/guards";

const itemsData = require("utilities/data/items.json") as ItemSpec[];

export default class CommandsSystem extends System {
  static queries = {
    localPlayer: {
      components: [LocalPlayer, CommandsPending],
    },
    enemies: {
      components: [Enemy, CommandsPending],
    },
    tileMap: {
      components: [TileMap],
    },
  };

  execute() {
    this.queries.tileMap.results.forEach((tileMapEntity) => {
      this.queries.localPlayer.results.forEach((localPlayerEntity) => {
        const drawable = tileMapEntity.getMutableComponent(Drawable);
        const movement = localPlayerEntity.getMutableComponent(Movement);

        gameState.subscribe("admin:teleport:response", ({ map, tileId }) => {
          drawable.data = undefined;
          movement.currentTile = tileId;
          movement.tileQueue = [];
          movement.direction = undefined;
          tileMapEntity.addComponent(Unloadable, {
            dataPath: mapAssetPath(map),
          });
        });

        gameState.subscribe("localPlayer:movement:request", () => {
          gameState.trigger("localPlayer:movement:response", {
            currentTile: movement.currentTile,
          });
        });

        localPlayerEntity.removeComponent(CommandsPending);
      });

      this.queries.enemies.results.forEach((enemyEntity) => {
        const enemy = enemyEntity.getComponent(Enemy);
        const drawable = enemyEntity.getComponent(Drawable);

        gameState.subscribe("enemy:battle:damageTaken", (data) => {
          const positionComponent = enemyEntity.getComponent(Position);
          const position = vectorToPixels(positionComponent.value);
          if (data.enemyKey === enemy.key) {
            enemyEntity.addComponent(AddCharacterHighlight, { type: "damage" });
            enemyEntity.addComponent(TextBurst, {
              text: data.damage,
              colorHex: "#FF0000",
            });
            const item = itemsData.find((item) => item.id === data.itemId);
            if (item && isPresent(item.effect)) {
              CreateEffect({
                position,
                effectId: item.effect,
                destinationSize: {
                  width: drawable.width,
                  height: drawable.height,
                },
              });
            }
          }
        });
        enemyEntity.removeComponent(CommandsPending);
      });
    });
  }
}
