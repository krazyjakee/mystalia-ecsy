import "./reactIndex";
import world from "./world";

import TileMapChanger from "./systems/TileMap/TileMapChanger";
import TileMapDrawer from "./systems/TileMap/TileMapDrawer";
import Loader from "./systems/Loader";
import NetworkInputSystem from "./systems/Input/NetworkInputSystem";
import Networking from "./systems/Networking";
import KeyboardInputSystem from "./systems/Input/KeyboardInputSystem";
import MouseInputSystem from "./systems/Input/MouseInputSystem";
import MovementSystem from "./systems/MovementSystem";
import Animation from "./systems/Animation";

import context2d from "./canvas";
import "./entities";
import CreateLocalPlayer from "./entities/LocalPlayer";
import PlayerAnimation from "./systems/Player/PlayerAnimation";
import TileMapMover from "./systems/TileMap/TileMapMover";
import TileMapObjectListener from "./systems/TileMap/TileMapObjectListener";

world
  .registerSystem(Networking)
  .registerSystem(Loader)
  .registerSystem(KeyboardInputSystem)
  .registerSystem(MouseInputSystem)
  .registerSystem(NetworkInputSystem)
  .registerSystem(TileMapDrawer)
  .registerSystem(TileMapChanger)
  .registerSystem(TileMapMover)
  .registerSystem(TileMapObjectListener)
  .registerSystem(MovementSystem)
  .registerSystem(Animation)
  .registerSystem(PlayerAnimation);

CreateLocalPlayer();

const resizeCanvas = () => {
  context2d.canvas.width = window.innerWidth;
  context2d.canvas.height = window.innerHeight;
};

window.onresize = () => resizeCanvas();
resizeCanvas();

let prevTime = performance.now();

function update(time: number) {
  const dt = time - prevTime;
  prevTime = time;

  context2d.clearRect(0, 0, context2d.canvas.width, context2d.canvas.height);
  world.execute(dt, time);
  requestAnimationFrame(update);
}

requestAnimationFrame(update);
