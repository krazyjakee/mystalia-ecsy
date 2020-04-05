import { KeyboardInput, MouseInput } from "../components/Tags";
import BaseCharacter from "./BaseCharacter";
import { generateAnimationSteps } from "../utilities/Animation/character";
import SpriteSheetAnimation from "../components/SpriteSheetAnimation";
import User from "types/User";
import LocalPlayer, {
  RoleCheckPending,
  CommandsPending,
} from "../components/LocalPlayer";
import { ItemSpec } from "types/TileMap/ItemTiles";
import { getWorld } from "../ecsy";
import Items from "../components/Item";
import Drawable from "../components/Drawable";
import { Loadable, SimpleLoadable } from "../components/Loadable";
import { mapAssetPath, ItemAssetPath } from "../utilities/assets";
import Item from "../components/Item";
import { tileIdToPixels } from "utilities/tileMap";

export default function CreateItem(item: Item, itemSpec: ItemSpec) {
  return getWorld()
    .createEntity()
    .addComponent(SimpleLoadable)
    .addComponent(Loadable, { imagePath: ItemAssetPath(itemSpec.spritesheet) })
    .addComponent(Items, { ...item, sourceTileId: itemSpec.spriteId })
    .addComponent(Drawable, {
      sourceHeight: 16,
      sourceWidth: 16,
      width: 16,
      height: 16,
    });
}
