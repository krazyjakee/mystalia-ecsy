import "./reactIndex";
import world from "./world";

import TileMapChanger from "./systems/TileMap/TileMapChanger";
import TileMapDrawer from "./systems/TileMap/TileMapDrawer";
import Loader from "./systems/Loader";
import PlayerMoverSystem from "./systems/Player/PlayerMover";
import KeyboardInputSystem from "./systems/KeyboardInput";
import MouseInput from "./systems/MouseInput";
import PlayerMouseInput from "./systems/Player/PlayerMouseInput";
import PlayerKeyboardInput from "./systems/Player/playerKeyboardInput";
import TileMapObjectDrawer from "./systems/TileMap/TileMapObjectDrawer";
import Networking from "./systems/Networking";

import context2d from "./canvas";
import "./entities";
import CreateLocalPlayer from "./entities/LocalPlayer";

world
  .registerSystem(Networking)
  .registerSystem(Loader)
  .registerSystem(KeyboardInputSystem)
  .registerSystem(MouseInput)
  .registerSystem(PlayerMoverSystem)
  .registerSystem(PlayerMouseInput)
  .registerSystem(PlayerKeyboardInput)
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
