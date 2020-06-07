import { getWorld } from "../ecsy";
import Drawable from "@client/components/Drawable";
import Gate from "@client/components/Gate";
import { SerializedObjectTile, tileIdToPixels } from "utilities/tileMap";
import { TileSetStoreItem } from "types/TileMap/TileSetStore";
import { SimpleLoadable, Loadable } from "@client/components/Loadable";
import { itemAssetPath } from "@client/utilities/assets";

export default function CreateGate(
  tileId: number,
  mapColumns: number,
  tileSet: TileSetStoreItem,
  objectTile: SerializedObjectTile<"gate">
) {
  const tileSetPosition = tileIdToPixels(tileId, tileSet.imagewidth / 32);
  const mapPosition = tileIdToPixels(objectTile.tileId, mapColumns);

  return getWorld()
    .createEntity()
    .addComponent(Gate)
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
