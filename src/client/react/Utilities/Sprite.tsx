import React, { CSSProperties, useState, useEffect } from "react";
import { tileIdToPixels, tileIdToVector } from "utilities/tileMap";
import { itemAssetPath } from "@client/utilities/assets";
import { Size } from "types/TileMap/standard";

type Props = {
  spriteId: number;
  spritesheet: string;
  spriteSize: number;
  sizeMultiplier?: number;
} & React.HTMLAttributes<HTMLDivElement>;

export default ({
  spriteId,
  spritesheet,
  spriteSize,
  sizeMultiplier = 1,
  ...props
}: Props) => {
  const [spriteSheetSize, setSpriteSheetSize] = useState<Size>();

  useEffect(() => {
    const image = new Image();
    image.src = itemAssetPath(spritesheet);
    image.onload = () => {
      setSpriteSheetSize({ width: image.width, height: image.height });
    };
  });

  if (!spriteSheetSize) return null;

  const newSize = spriteSize * sizeMultiplier;

  const spriteOffset = tileIdToPixels(
    spriteId,
    spriteSheetSize.width / spriteSize,
    newSize
  );

  const spriteStyles: CSSProperties = {
    width: newSize,
    height: newSize,
    backgroundImage: `url(${itemAssetPath(spritesheet)})`,
    backgroundPosition: `-${spriteOffset.x}px -${spriteOffset.y}px`,
    backgroundSize: `${spriteSheetSize.width *
      sizeMultiplier}px ${spriteSheetSize.height * sizeMultiplier}px`,
  };

  return <div style={spriteStyles} {...props} />;
};
