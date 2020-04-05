import { ItemSpec } from "types/TileMap/ItemTiles";
import { getWorld } from "../ecsy";
import Item from "../components/Item";
import Drawable from "../components/Drawable";
import { Loadable, SimpleLoadable } from "../components/Loadable";
import { ItemAssetPath } from "../utilities/assets";

export default function CreateItem(item: Item, itemSpec: ItemSpec) {
  const { itemId, tileId, quantity } = item;
  return getWorld()
    .createEntity()
    .addComponent(SimpleLoadable)
    .addComponent(Loadable, { imagePath: ItemAssetPath(itemSpec.spritesheet) })
    .addComponent(Item, {
      itemId,
      tileId,
      quantity,
      sourceTileId: itemSpec.spriteId,
    })
    .addComponent(Drawable, {
      sourceHeight: 16,
      sourceWidth: 16,
      width: 16,
      height: 16,
    });
}
