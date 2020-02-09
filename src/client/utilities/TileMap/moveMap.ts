import Drawable from "../../components/Drawable";
import { tileIdToVector, addOffset, setOffsetRelative } from "./calculations";
import { TMJ } from "types/tmj";

export const scroll = (
  mapWidth: number,
  mapHeight: number,
  drawable: Drawable,
  targetTile: number | null = null
) => {
  if (targetTile) {
    const { width } = drawable.data as TMJ;
    const tileVector = tileIdToVector(targetTile, width);
    const tileVectorOffset = addOffset(tileVector, drawable.offset);

    const percentageX = Math.round(
      (tileVectorOffset.x * 100) / window.innerWidth
    );
    const percentageY = Math.round(
      (tileVectorOffset.y * 100) / window.innerHeight
    );

    let offsetX = 0;
    let offsetY = 0;

    if (percentageX > 50) {
      offsetX -= 4;
    }
    if (percentageY > 50) {
      offsetY -= 4;
    }
    if (percentageX < 50) {
      offsetX += 4;
    }
    if (percentageY < 50) {
      offsetY += 4;
    }

    if (offsetX === 0 && offsetY === 0) {
      return;
    }

    drawable.offset = setOffsetRelative(
      offsetX,
      offsetY,
      drawable.offset,
      mapWidth,
      mapHeight
    );
  }
};
