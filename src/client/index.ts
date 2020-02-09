import "./reactIndex";
import world from "./world";
import TileMapComponent from "./components/TileMap";
import Loadable from "./components/Loadable";
import Drawable from "./components/Drawable";
import PlayerComponent from "./components/Player";
import KeyboardInputComponent from "./components/KeyboardInput";
import TileMapLoader from "./systems/TileMap/TileMapLoader";
import TileMapDrawer from "./systems/TileMap/TileMapDrawer";
import Loader from "./systems/Loader";
import PlayerMoverSystem from "./systems/Player/PlayerMover";
import KeyboardInputSystem from "./systems/KeyboardInput";
import context2d from "./canvas";
import "./entities";

world
  .registerComponent(TileMapComponent)
  .registerComponent(Loadable)
  .registerComponent(Drawable)
  .registerComponent(PlayerComponent)
  .registerComponent(KeyboardInputComponent)
  .registerSystem(Loader)
  .registerSystem(TileMapLoader)
  .registerSystem(TileMapDrawer)
  .registerSystem(PlayerMoverSystem)
  .registerSystem(KeyboardInputSystem);

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
