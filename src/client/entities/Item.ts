import { ItemSpec } from "types/TileMap/ItemTiles";
import { getWorld } from "../ecsy";
import Item from "@client/components/Item";
import Drawable from "@client/components/Drawable";
import { Loadable, SimpleLoadable } from "@client/components/Loadable";
import { itemAssetPath } from "../utilities/assets";

export default function CreateItem(item: Item, itemSpec: ItemSpec) {
  const { itemId, tileId, quantity } = item;
  return getWorld()
    .createEntity()
    .addComponent(SimpleLoadable)
    .addComponent(Loadable, { imagePath: itemAssetPath(itemSpec.spritesheet) })
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
