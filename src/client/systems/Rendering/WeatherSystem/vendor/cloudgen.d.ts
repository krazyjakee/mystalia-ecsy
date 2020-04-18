type RGB = { r: 0; g: 0; b: 0 };

export function drawCloud(
  context: CanvasRenderingContext2D,
  centreX?: number,
  centreY?: number,
  radius?: number,
  colour?: RGB,
  alpha?: number,
  circles?: number
): void;

export function drawCloudGroup(
  context: CanvasRenderingContext2D,
  centreX?: number,
  centreY?: number,
  radius?: number,
  colour?: RGB,
  alpha?: number,
  circles?: number
): void;
