import "./reactIndex";
import world from "./world";
import { Tile, Layer } from "./components/TileMap";
import TileMap from "./systems/TileMap";

world
  .registerComponent(Layer)
  .registerComponent(Tile)
  .registerSystem(TileMap);

const prevTime = performance.now();

function update(time: number) {
  const dt = time - prevTime;

  world.execute(dt, time);

  requestAnimationFrame(update);
}

requestAnimationFrame(update);
