import context2d from "./canvas";
import User from "types/User";

import MapChangeSystem from "./systems/Map/MapChangeSystem";
import MapLoadSystem from "./systems/Map/MapLoadSystem";
import RenderingSystem from "./systems/Rendering/RenderingSystem";
import LoadingSystem from "./systems/LoadingSystem";
import NetworkingSystem from "./systems/Network/NetworkingSystem";
import ToggleInputSystem from "./systems/Input/ToggleInputSystem";
import KeyboardInputSystem from "./systems/Input/KeyboardInputSystem";
import MouseInputSystem from "./systems/Input/MouseInputSystem";
import MovementSystem from "./systems/MovementSystem";
import AnimationSystem from "./systems/Rendering/AnimationSystem";
import PlayerAnimationSystem from "./systems/Rendering/PlayerAnimationSystem";
import ScrollingSystem from "./systems/Rendering/ScrollingSystem";
import MapEventSystem from "./systems/Map/MapEventSystem";
import FadeSystem from "./systems/Rendering/FadeSystem";
import PlayerNameSystem from "./systems/Rendering/PlayerNameSystem";
import LightSystem from "./systems/Rendering/LightSystem/LightSystem";
import TileAnimationSystem from "./systems/Rendering/TileAnimationSystem";
import CreateLocalPlayer from "./entities/LocalPlayer";
import CreateTileMap from "./entities/TileMap";
import { World } from "ecsy";
import CreateNetworkRoom from "./entities/NetworkRoom";
import AdminNetworkSystem from "./systems/Network/AdminNetworkSystem";
import CommandsSystem from "./systems/Network/CommandsSystem";
import ItemSystem from "./systems/Rendering/ItemSystem";
import CleanupSystem from "./systems/CleanupSystem";
import FlameSystem from "./systems/Rendering/LightSystem/FlameSystem";
import GraySystem from "./systems/Rendering/GraySystem";
import WeatherSystem from "./systems/Rendering/WeatherSystem";

import "./entities";
import EnemyStatusSystem from "./systems/HUD/EnemyStatusSystem";
import PickUpSystem from "./systems/MovementSystem/PickUpSystem";
import TileActionSystem from "./systems/MovementSystem/TileActionSystem";
import BattleSystem from "./systems/BattleSystem";
import InventorySystem from "./systems/InventorySystem";
import CharacterHighlightSystem from "./systems/Rendering/CharacterHighlightSystem";
import TextBurstSystem from "./systems/Rendering/TextBurstSystem";
import SpriteSheetAnimationSystem from "./systems/Rendering/SpriteSheetAnimationSystem";
import BehaviourSystem from "./systems/MovementSystem/Behaviour";
import LookAtPlayerSystem from "./systems/MovementSystem/Behaviour/LookAtPlayerSystem";
import GateSystem from "./systems/Rendering/GateSystem";
import LootSystem from "./systems/Rendering/LootSystem";
import BrightnessSystem from "./systems/Rendering/LightSystem/BrightnessSystem";

let world = new World();

export const getWorld = () => world;

export default (user: User) => {
  world
    .registerSystem(ToggleInputSystem)
    .registerSystem(KeyboardInputSystem)
    .registerSystem(MouseInputSystem)
    .registerSystem(MapEventSystem)
    .registerSystem(NetworkingSystem)
    .registerSystem(MapLoadSystem)
    .registerSystem(ScrollingSystem)
    .registerSystem(MovementSystem)
    .registerSystem(PickUpSystem)
    .registerSystem(TileActionSystem)
    .registerSystem(MapChangeSystem)
    .registerSystem(AnimationSystem)
    .registerSystem(ItemSystem)
    .registerSystem(PlayerAnimationSystem)
    .registerSystem(RenderingSystem)
    .registerSystem(WeatherSystem)
    .registerSystem(LightSystem)
    .registerSystem(FlameSystem)
    .registerSystem(BrightnessSystem)
    .registerSystem(TileAnimationSystem)
    .registerSystem(EnemyStatusSystem)
    .registerSystem(CharacterHighlightSystem)
    .registerSystem(BattleSystem)
    .registerSystem(InventorySystem)
    .registerSystem(GraySystem)
    .registerSystem(FadeSystem)
    .registerSystem(PlayerNameSystem)
    .registerSystem(BehaviourSystem)
    .registerSystem(LookAtPlayerSystem)
    .registerSystem(GateSystem)
    .registerSystem(LootSystem)
    .registerSystem(TextBurstSystem)
    .registerSystem(SpriteSheetAnimationSystem)
    .registerSystem(CommandsSystem)
    .registerSystem(AdminNetworkSystem)
    .registerSystem(LoadingSystem)
    .registerSystem(CleanupSystem);

  CreateNetworkRoom();
  CreateLocalPlayer(user);
  CreateTileMap(user);

  let prevTime = performance.now();

  const worker = new Worker("worker.js");

  let workerActive = false;

  function update() {
    const time = performance.now();
    const dt = time - prevTime;
    prevTime = time;

    context2d.clearRect(0, 0, context2d.canvas.width, context2d.canvas.height);
    world.execute(dt, time);

    if (window.ecsyError) {
      world.stop();
      world = new World();
      window.ecsyError = false;
    } else if (!workerActive) {
      requestAnimationFrame(update);
    }
  }

  worker.onmessage = (e) => {
    if (e.data === "stopped") {
      workerActive = false;
    }
    if (workerActive && !window.ecsyError) {
      update();
    }
  };

  window.onblur = () => {
    worker.postMessage("start");
  };
  window.onfocus = () => {
    worker.postMessage("stop");
  };

  update();
};
