import { getWorld } from "../ecsy";
import Drawable from "@client/components/Drawable";
import { SerializedObjectTile, tileIdToPixels } from "utilities/tileMap";
import { TileSetStoreItem } from "types/TileMap/TileSetStore";
import Loot from "@client/components/Loot";
import { LootSpec } from "types/loot";
import { SimpleLootItemState } from "@client/react/Panels/Loot/lootItemStateToArray";

const lootSpecs = require("utilities/data/loot.json") as LootSpec[];

export default function CreateLoot(
  objectTile: SerializedObjectTile<"loot">,
  sourceTileId: number,
  lootStateItems: SimpleLootItemState[],
  mapColumns: number,
  tileSet: TileSetStoreItem
) {
  const spec = lootSpecs.find(
    (lootSpec) => lootSpec.id === objectTile.properties?.lootId
  );
  if (!spec) return;

  const tileSetPosition = tileIdToPixels(sourceTileId, tileSet.imagewidth / 32);
  const mapPosition = tileIdToPixels(objectTile.tileId, mapColumns);

  return getWorld()
    .createEntity()
    .addComponent(Loot, {
      items: lootStateItems,
      tileId: objectTile.tileId,
    })
    .addComponent(Drawable, {
      image: tileSet.image,
      x: mapPosition.x,
      y: mapPosition.y,
      sourceX: tileSetPosition.x,
      sourceY: tileSetPosition.y,
      sourceHeight: 32,
      sourceWidth: 32,
      width: 32,
      height: 32,
    });
}
