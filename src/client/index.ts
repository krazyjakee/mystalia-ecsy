import "./reactIndex";
import world from "./world";
import { Tile, Layer } from "./components/TileMap";
import TileMap from "./systems/TileMap";
import Loader from "./systems/Loader";
import { Loadable } from "./components/Loadable";
import { Drawable } from "./components/Drawable";

world
  .registerComponent(Layer)
  .registerComponent(Tile)
  .registerComponent(Loadable)
  .registerComponent(Drawable)
  .registerSystem(Loader)
  .registerSystem(TileMap);

import "./entities/TileMap";

const prevTime = performance.now();

function update(time: number) {
  const dt = time - prevTime;

  world.execute(dt, time);

  requestAnimationFrame(update);
}

requestAnimationFrame(update);
