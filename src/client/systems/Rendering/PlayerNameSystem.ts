import { System, Entity, Not } from "ecsy";
import { Loadable } from "../../components/Loadable";
import LocalPlayer from "../../components/LocalPlayer";
import context2d from "../../canvas";
import Position from "../../components/Position";
import TileMap from "../../components/TileMap";
import Drawable from "../../components/Drawable";
import addOffset from "../../utilities/Vector/addOffset";
import RemotePlayer from "../../components/RemotePlayer";
import { StaticQuery } from "types/ecsy";

export default class PlayerNameSystem extends System {
  static queries: StaticQuery = {
    loadedTileMaps: {
      components: [Not(Loadable), Drawable, TileMap],
    },
    localPlayer: {
      components: [Not(Loadable), LocalPlayer, Position],
    },
    remotePlayers: {
      components: [Not(Loadable), RemotePlayer, Position],
    },
  };

  execute() {
    this.queries.loadedTileMaps.results.forEach((tileMapEntity: Entity) => {
      const tileMapDrawable = tileMapEntity.getComponent(Drawable);
      const { offset } = tileMapDrawable;

      const drawName = (name: string, position: Position) => {
        context2d.save();
        context2d.font = "11px Tahoma";
        context2d.textAlign = "center";
        context2d.fillStyle = "white";
        context2d.lineWidth = 2;

        const textPosition = addOffset(offset, {
          x: position.value.x * 32 + 16,
          y: position.value.y * 32,
        });

        context2d.strokeText(name, textPosition.x, textPosition.y);
        context2d.fillText(name, textPosition.x, textPosition.y);
        context2d.restore();
      };

      this.queries.localPlayer.results.forEach((localPlayerEntity: Entity) => {
        const localPlayer = localPlayerEntity.getComponent(LocalPlayer);
        const position = localPlayerEntity.getComponent(Position);
        if (localPlayer.user && localPlayer.user.displayName) {
          drawName(localPlayer.user.displayName, position);
        }
      });

      this.queries.remotePlayers.results.forEach(
        (remotePlayerEntity: Entity) => {
          const remotePlayer = remotePlayerEntity.getComponent(RemotePlayer);
          const position = remotePlayerEntity.getComponent(Position);
          if (remotePlayer.state && remotePlayer.state.displayName) {
            drawName(remotePlayer.state.displayName, position);
          }
        }
      );
    });
  }
}
