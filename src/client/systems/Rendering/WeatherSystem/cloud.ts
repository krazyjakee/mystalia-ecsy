import { Vector } from "types/TMJ";
import Cloudgen from "./vendor/cloudgen";
import context2d from "@client/canvas";
import addOffset from "@client/utilities/Vector/addOffset";
import { Size } from "types/TileMap/standard";

const cloudCount = 10;
const cloudWidth = 800;
const cloudHeight = 600;

const randomSpeed = () => (Math.floor(Math.random() * 20) + 10) / 10;
let randomClouds: {
  x: number;
  y: number;
  speed: number;
  canvas: HTMLCanvasElement;
}[] = [];

const generateRandomClouds = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  randomClouds = Array(cloudCount)
    .fill(0)
    .map(() => {
      const cloudCanvas = document.createElement("canvas");
      cloudCanvas.width = 1024;
      cloudCanvas.height = 768;
      const cloudCanvasContext = cloudCanvas.getContext(
        "2d"
      ) as CanvasRenderingContext2D;
      const radius =
        Math.floor((Math.random() * Math.min(cloudWidth, cloudHeight)) / 3) +
        100;

      // TODO: Find a different way to render clouds than this crappy library
      Cloudgen.drawCloud(
        cloudCanvasContext,
        cloudWidth / 2,
        cloudHeight / 2,
        radius,
        { r: 0, g: 0, b: 0 },
        0.2,
        8
      );
      return {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
        speed: randomSpeed(),
        canvas: cloudCanvas,
      };
    });
};

export default (offset: Vector, size: Size) => {
  if (randomClouds.length === 0) {
    generateRandomClouds(size);
  }
  const { width, height } = size;

  for (let i = 0; i < cloudCount; i++) {
    if (randomClouds[i].x <= 0 - cloudWidth) {
      randomClouds[i].x = width;
      randomClouds[i].speed = randomSpeed();
    }
    if (randomClouds[i].x === width) {
      randomClouds[i].y =
        Math.floor(Math.random() * (height + cloudWidth)) - cloudHeight;
    }
    randomClouds[i].x -= randomClouds[i].speed;

    const position = addOffset(randomClouds[i], offset);
    context2d.drawImage(randomClouds[i].canvas, position.x, position.y);
  }
};
