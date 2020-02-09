import "./reactIndex";
import world from "./world";
import TileMapComponent from "./components/TileMap";
import { Loadable, Unloadable, SimpleLoadable } from "./components/Loadable";
import Drawable from "./components/Drawable";
import PlayerComponent from "./components/Player";
import KeyboardInputComponent from "./components/KeyboardInput";
import MouseInputComponent from "./components/MouseInput";
import TileMapChanger from "./systems/TileMap/TileMapChanger";
import TileMapDrawer from "./systems/TileMap/TileMapDrawer";
import Loader from "./systems/Loader";
import PlayerMoverSystem from "./systems/Player/PlayerMover";
import KeyboardInputSystem from "./systems/KeyboardInput";
import MouseInput from "./systems/MouseInput";
import PlayerMouseInput from "./systems/Player/PlayerMouseInput";
import PlayerKeyboardInput from "./systems/Player/playerKeyboardInput";
import TileMapObjectDrawer from "./systems/TileMap/TileMapObjectDrawer";
import context2d from "./canvas";
import "./entities";
import { Enabled } from "./components/Tags";

world
  .registerComponent(Enabled)
  .registerComponent(TileMapComponent)
  .registerComponent(Loadable)
  .registerComponent(Unloadable)
  .registerComponent(SimpleLoadable)
  .registerComponent(Drawable)
  .registerComponent(PlayerComponent)
  .registerComponent(KeyboardInputComponent)
  .registerComponent(MouseInputComponent)
  .registerSystem(Loader)
  .registerSystem(KeyboardInputSystem)
  .registerSystem(MouseInput)
  .registerSystem(PlayerMoverSystem)
  .registerSystem(PlayerMouseInput)
  .registerSystem(PlayerKeyboardInput)
  .registerSystem(TileMapDrawer)
  .registerSystem(TileMapObjectDrawer)
  .registerSystem(TileMapChanger);

const resizeCanvas = () => {
  context2d.canvas.width = window.innerWidth;
  context2d.canvas.height = window.innerHeight;
};

window.onresize = () => resizeCanvas();
resizeCanvas();

const prevTime = performance.now();

function update(time: number) {
  const dt = time - prevTime;

  context2d.clearRect(0, 0, context2d.canvas.width, context2d.canvas.height);
  world.execute(dt, time);
  requestAnimationFrame(update);
}

requestAnimationFrame(update);
