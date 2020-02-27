import "./reactIndex";
import world from "./world";

import TileMapChanger from "./systems/TileMap/TileMapChanger";
import TileMapDrawer from "./systems/TileMap/TileMapDrawer";
import Loader from "./systems/Loader";
import PlayerNetworkInput from "./systems/Player/PlayerNetworkInput";
import TileMapObjectDrawer from "./systems/TileMap/TileMapObjectDrawer";
import Networking from "./systems/Networking";

import context2d from "./canvas";
import "./entities";
import CreateLocalPlayer from "./entities/LocalPlayer";
import KeyboardInputSystem from "./systems/Input/KeyboardInputSystem";
import MouseInputSystem from "./systems/Input/MouseInputSystem";
import MovementSystem from "./systems/MovementSystem";

world
  .registerSystem(Networking)
  .registerSystem(Loader)
  .registerSystem(KeyboardInputSystem)
  .registerSystem(MouseInputSystem)
  .registerSystem(MovementSystem)
  .registerSystem(PlayerNetworkInput)
  .registerSystem(TileMapDrawer)
  .registerSystem(TileMapObjectDrawer)
  .registerSystem(TileMapChanger);

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
