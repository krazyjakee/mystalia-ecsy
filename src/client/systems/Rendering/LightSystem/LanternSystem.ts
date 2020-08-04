import { System, Not } from "ecsy";
import Drawable from "@client/components/Drawable";
import context2d from "../../../canvas";
import LocalPlayer from "@client/components/LocalPlayer";
import Inventory from "@client/components/Inventory";
import addOffset from "@client/utilities/Vector/addOffset";
import Movement from "@client/components/Movement";
import Position from "@client/components/Position";
import { vectorToPixels } from "utilities/tileMap";
import { Loadable } from "@client/components/Loadable";
import TileMap from "@client/components/TileMap";

export default class LanternSystem extends System {
  static queries = {
    loadedTileMaps: {
      components: [Not(Loadable), Drawable, TileMap],
    },
    localPlayer: {
      components: [LocalPlayer],
    },
  };

  execute() {
    this.queries.loadedTileMaps.results.forEach((tileMapEntity) => {
      const tileMapDrawable = tileMapEntity.getComponent(Drawable);
      const { offset } = tileMapDrawable;
      this.queries.localPlayer.results.forEach((localPlayerEntity) => {
        const { value } = localPlayerEntity.getComponent(Position);
        const { savedDirection } = localPlayerEntity.getComponent(Movement);
        const inventory = localPlayerEntity.getMutableComponent(Inventory);
        if (
          inventory.inventory.find((item) => item.itemId === 3 && item.equipped)
        ) {
          context2d.save();
          context2d.fillStyle = "red";
          const position = addOffset(offset, vectorToPixels(value));
          switch (savedDirection) {
            case "n":
              position.y -= 32;
              break;
            case "e":
              position.x += 32;
              break;
            case "s":
              position.y += 32;
              break;
            case "w":
              position.x -= 32;
              break;
          }
          context2d.fillRect(position.x, position.y, 32, 32);
          context2d.restore();
        }
      });
    });
  }
}
