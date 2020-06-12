import { getWorld } from "../ecsy";
import Drawable from "@client/components/Drawable";
import { SerializedObjectTile, tileIdToPixels } from "utilities/tileMap";
import LootState from "@server/components/loot";
import { TileSetStoreItem } from "types/TileMap/TileSetStore";
import Loot from "@client/components/Loot";
import { objectMap } from "utilities/loops";
import { LootSpec } from "types/loot";

const lootSpecs = require("utilities/data/loot.json") as LootSpec[];

export default function CreateLoot(
  objectTile: SerializedObjectTile<"loot">,
  lootState: LootState,
  mapColumns: number,
  tileSet: TileSetStoreItem
) {
  const spec = lootSpecs.find(
    (lootSpec) => lootSpec.id === objectTile.properties?.lootId
  );
  if (!spec) return;

  const tileSetPosition = tileIdToPixels(
    objectTile.tileId,
    tileSet.imagewidth / 32
  );
  const mapPosition = tileIdToPixels(objectTile.tileId, mapColumns);

  return getWorld()
    .createEntity()
    .addComponent(Loot, {
      items: Object.values(
        objectMap(lootState.items, (_, { itemId, position, quantity }) => ({
          itemId,
          position,
          quantity,
        }))
      ),
      tileId: objectTile.tileId,
    })
    .addComponent(Drawable, {
      image: tileSet.image,
      x: mapPosition.x,
      y: mapPosition.y - 32,
      sourceX: tileSetPosition.x,
      sourceY: tileSetPosition.y,
      sourceHeight: 32,
      sourceWidth: 32,
      width: 32,
      height: 32,
    });
}
