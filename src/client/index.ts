import "./reactIndex";
import world from "./world";
import { TileMap as TileMapComponent } from "./components/TileMap";
import TileMapLoader from "./systems/TileMap/TileMapLoader";
import TileMapDrawer from "./systems/TileMap/TileMapDrawer";
import Loader from "./systems/Loader";
import { Loadable } from "./components/Loadable";
import { Drawable } from "./components/Drawable";

world
  .registerComponent(TileMapComponent)
  .registerComponent(Loadable)
  .registerComponent(Drawable)
  .registerSystem(Loader)
  .registerSystem(TileMapLoader)
  .registerSystem(TileMapDrawer);

import "./entities/TileMap";
import context2d from "./canvas";

const resizeCanvas = () => {
  context2d.canvas.width = window.innerWidth;
  context2d.canvas.height = window.innerHeight;
};

window.onresize = () => resizeCanvas();
resizeCanvas();

const prevTime = performance.now();

function update(time: number) {
  const dt = time - prevTime;

  world.execute(dt, time);
  requestAnimationFrame(update);
}

requestAnimationFrame(update);
