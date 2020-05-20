import { System, Not } from "ecsy";
import { Unloadable } from "@client/components/Loadable";
import LocalPlayer, { CommandsPending } from "@client/components/LocalPlayer";
import gameState from "../../gameState";
import TileMap from "@client/components/TileMap";
import Drawable from "@client/components/Drawable";
import Movement from "@client/components/Movement";
import { mapAssetPath } from "../../utilities/assets";
import Enemy from "@client/components/Enemy";
import { AddCharacterHighlight } from "@client/components/CharacterHighlight";
import CreateEffect from "@client/entities/Effect";
import Position from "@client/components/Position";
import { vectorToPixels } from "utilities/tileMap";
import { ItemSpec } from "types/TileMap/ItemTiles";
import { isPresent } from "utilities/guards";
import CreateTextBurst from "@client/entities/TextBurst";
import RemotePlayer from "@client/components/RemotePlayer";
import { AbilitySpec } from "types/types";
import ChangeMap from "@client/components/ChangeMap";

const itemsData = require("utilities/data/items.json") as ItemSpec[];
const abilitySpecs = require("utilities/data/abilities") as AbilitySpec[];

export default class CommandsSystem extends System {
  static queries = {
    remotePlayers: {
      components: [RemotePlayer, CommandsPending],
    },
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
      this.queries.remotePlayers.results.forEach((playerEntity) => {
        const remotePlayer = playerEntity.getComponent(RemotePlayer);
        const positionComponent = playerEntity.getComponent(Position);

        gameState.subscribe(
          "remotePlayer:battle:damageTaken",
          ({ playerUsername, damage, ability }) => {
            const position = vectorToPixels(positionComponent.value);
            if (playerUsername === remotePlayer.state?.username) {
              playerEntity.addComponent(AddCharacterHighlight, {
                type: "damage",
              });
              CreateTextBurst(damage, "#FF0000", position);
              const abilitySpec = abilitySpecs.find(
                (abilitySpec) => abilitySpec.id === ability
              );
              if (abilitySpec && isPresent(abilitySpec.effect)) {
                CreateEffect({
                  position,
                  effectId: abilitySpec.effect,
                  destinationSize: {
                    width: 32,
                    height: 32,
                  },
                });
              }
            }
          }
        );

        playerEntity.removeComponent(CommandsPending);
      });

      this.queries.localPlayer.results.forEach((localPlayerEntity) => {
        const localPlayer = localPlayerEntity.getComponent(LocalPlayer);
        const drawable = tileMapEntity.getMutableComponent(Drawable);
        const movement = localPlayerEntity.getMutableComponent(Movement);
        const positionComponent = localPlayerEntity.getComponent(Position);

        gameState.subscribe(
          "localPlayer:movement:nextMap",
          ({ map, tileId }) => {
            drawable.data = undefined;
            movement.currentTile = tileId;
            movement.tileQueue = [];
            movement.direction = undefined;
            tileMapEntity.addComponent(Unloadable, {
              dataPath: mapAssetPath(map),
            });
          }
        );

        gameState.subscribe("localPlayer:movement:request", () => {
          gameState.trigger("localPlayer:movement:response", {
            currentTile: movement.currentTile,
          });
        });

        gameState.subscribe(
          "localPlayer:movement:nextMap",
          ({ map, tileId }) => {
            tileMapEntity.addComponent(ChangeMap, { nextMap: map, tileId });
          }
        );

        gameState.subscribe(
          "localPlayer:battle:damageTaken",
          ({ playerUsername, damage, ability }) => {
            const position = vectorToPixels(positionComponent.value);
            if (playerUsername === localPlayer.user?.username) {
              localPlayerEntity.addComponent(AddCharacterHighlight, {
                type: "damage",
              });
              CreateTextBurst(damage, "#FF0000", position);
              const abilitySpec = abilitySpecs.find(
                (abilitySpec) => abilitySpec.id === ability
              );
              if (abilitySpec && isPresent(abilitySpec.effect)) {
                CreateEffect({
                  position,
                  effectId: abilitySpec.effect,
                  destinationSize: {
                    width: 32,
                    height: 32,
                  },
                });
              }
            }
          }
        );

        localPlayerEntity.removeComponent(CommandsPending);
      });

      this.queries.enemies.results.forEach((enemyEntity) => {
        const enemy = enemyEntity.getComponent(Enemy);
        const drawable = enemyEntity.getComponent(Drawable);
        const positionComponent = enemyEntity.getComponent(Position);

        gameState.subscribe(
          "enemy:battle:damageTaken",
          (data) => {
            const position = vectorToPixels(positionComponent.value);
            if (data.enemyKey === enemy.key) {
              enemyEntity.addComponent(AddCharacterHighlight, {
                type: "damage",
              });
              CreateTextBurst(data.damage, "#FF0000", position);
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
          },
          enemy.key
        );
        enemyEntity.removeComponent(CommandsPending);
      });
    });
  }
}
