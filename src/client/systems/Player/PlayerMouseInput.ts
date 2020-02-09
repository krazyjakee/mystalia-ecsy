import { System, Entity, Not } from "ecsy";
import Drawable from "../../components/Drawable";
import MouseInput from "../../components/MouseInput";
import PlayerComponent from "../../components/Player";
import Loadable from "../../components/Loadable";
import TileMap from "../../components/TileMap";
import {
  tileIdToVector,
  vectorToTileId
} from "../../utilities/TileMap/calculations";
import {
  getTileFromQueue,
  setNewCurrentTile
} from "../../utilities/Player/playerMovement";

export default class PlayerMouseInput extends System {
  static queries = {
    loadedTileMaps: {
      components: [Not(Loadable), Drawable, TileMap]
    },
    player: {
      components: [Not(Loadable), PlayerComponent, Drawable, MouseInput]
    }
  };

  execute() {
    // @ts-ignore
    this.queries.loadedTileMaps.results.forEach((tileMapEntity: Entity) => {
      const tileMap = tileMapEntity.getComponent(TileMap);
      const tileMapDrawable = tileMapEntity.getComponent(Drawable);
      const { width: columns, height: rows } = tileMapDrawable.data;

      // @ts-ignore
      this.queries.player.results.forEach((playerEntity: Entity) => {
        const player = playerEntity.getComponent(PlayerComponent);
        const mouseInput = playerEntity.getComponent(MouseInput);
        const drawable = playerEntity.getComponent(Drawable);

        if (!mouseInput.clickedPosition) {
          return;
        }

        const clickedTile = vectorToTileId(mouseInput.clickedPosition, columns);
        const playerTile = tileIdToVector(player.currentTile, columns);
        const destinationTile = tileIdToVector(clickedTile, columns);

        tileMap.aStar.findPath(
          playerTile.x / 32,
          playerTile.y / 32,
          destinationTile.x / 32,
          destinationTile.y / 32,
          path => {
            if (path) {
              player.tileQueue = path.map(p => p.x + p.y * columns);
              player.direction = getTileFromQueue(player, columns);
              if (!player.walking) {
                setNewCurrentTile(
                  tileMap,
                  player,
                  drawable,
                  columns,
                  rows,
                  player.direction
                );
              }
              player.direction = undefined;
            }
          }
        );
        tileMap.aStar.calculate();
      });
    });
  }
}
