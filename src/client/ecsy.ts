import world from "./world";
import context2d from "./canvas";
import User from "types/User";

import MapChangeSystem from "./systems/Map/MapChangeSystem";
import RenderingSystem from "./systems/Rendering/RenderingSystem";
import LoadingSystem from "./systems/LoadingSystem";
import NetworkingSystem from "./systems/NetworkingSystem";
import KeyboardInputSystem from "./systems/Input/KeyboardInputSystem";
import MouseInputSystem from "./systems/Input/MouseInputSystem";
import MovementSystem from "./systems/MovementSystem";
import AnimationSystem from "./systems/Rendering/AnimationSystem";
import PlayerAnimationSystem from "./systems/Rendering/PlayerAnimationSystem";
import ScrollingSystem from "./systems/Rendering/ScrollingSystem";
import MapEventSystem from "./systems/Map/MapEventSystem";
import FadeSystem from "./systems/Rendering/FadeSystem";

import "./entities";
import CreateLocalPlayer from "./entities/LocalPlayer";

export default (user: User) => {
  world
    .registerSystem(LoadingSystem)
    .registerSystem(KeyboardInputSystem)
    .registerSystem(MouseInputSystem)
    .registerSystem(NetworkingSystem)
    .registerSystem(MapChangeSystem)
    .registerSystem(ScrollingSystem)
    .registerSystem(MapEventSystem)
    .registerSystem(MovementSystem)
    .registerSystem(AnimationSystem)
    .registerSystem(PlayerAnimationSystem)
    .registerSystem(RenderingSystem)
    .registerSystem(FadeSystem);

  CreateLocalPlayer(user);

  let prevTime = performance.now();

  function update(time: number) {
    const dt = time - prevTime;
    prevTime = time;

    context2d.clearRect(0, 0, context2d.canvas.width, context2d.canvas.height);
    world.execute(dt, time);
    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
};
