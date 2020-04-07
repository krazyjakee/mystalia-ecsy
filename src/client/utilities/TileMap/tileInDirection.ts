import { Direction } from "types/Grid";
import { vectorToTileId, tileIdToVector } from "utilities/tileMap";
import addOffset from "../Vector/addOffset";
import compassToVector from "../Compass/compassToVector";

export default (
  tileId: number,
  direction: Direction | undefined,
  rows: number,
  columns: number
) => {
  if (!direction) return tileId;
  const destination = addOffset(
    tileIdToVector(tileId, columns),
    compassToVector(direction)
  );
  if (destination.x < 0 || destination.x >= columns) return undefined;
  if (destination.y < 0 || destination.y >= rows) return undefined;
  return vectorToTileId(destination, columns);
};
