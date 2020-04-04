import { Direction } from "types/Grid";
import { vectorToTileId, tileIdToVector } from "utilities/tileMap";
import addOffset from "../Vector/addOffset";
import compassToVector from "../Compass/compassToVector";

export default (
  tileId: number,
  direction: Direction | undefined,
  columns: number
) => {
  if (!direction) return tileId;
  return vectorToTileId(
    addOffset(tileIdToVector(tileId, columns), compassToVector(direction)),
    columns
  );
};
