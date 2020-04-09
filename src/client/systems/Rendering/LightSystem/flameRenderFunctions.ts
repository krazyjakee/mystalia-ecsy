import { Attributes } from "types/TMJ";
import { serializeProperties } from "utilities/tileMap";

const glowCanvas = document.createElement("canvas"),
  gCtx = glowCanvas.getContext("2d") as CanvasRenderingContext2D;

export const flameOn = (flameObjectTile: Attributes) => {
  if (flameObjectTile.polygon && flameObjectTile.polygon.length) {
    const properties = serializeProperties<"flame">(flameObjectTile.properties);
    const blur = properties?.blur || 2;
    const color = properties?.color || "white";

    const polygon = flameObjectTile.polygon;
    const polygonWidth =
      Math.max(...polygon.map((point) => point.x)) + blur * 2;
    const polygonHeight =
      Math.max(...polygon.map((point) => point.y)) + blur * 2;
    glowCanvas.width = polygonWidth;
    glowCanvas.height = polygonHeight;

    gCtx.save();
    gCtx.clearRect(0, 0, polygonWidth, polygonHeight);
    gCtx.fillStyle = color;

    const drawPolygon = () => {
      gCtx.beginPath();
      gCtx.moveTo(blur, blur);
      polygon.forEach((point) => gCtx.lineTo(point.x, point.y));
      gCtx.closePath();
      gCtx.fill();
    };

    drawPolygon();
    // TODO: It would be nice if it glowed a bit more.
    gCtx.filter = `blur(${blur}px)`;
    drawPolygon();

    gCtx.restore();
    return glowCanvas;
  }
};
