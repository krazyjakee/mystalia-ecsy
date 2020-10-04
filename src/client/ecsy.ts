import context2d from "./canvas";
import User from "types/User";
import { World } from "ecsy";
import "./entities";

import CreateLocalPlayer from "./entities/LocalPlayer";
import CreateTileMap from "./entities/TileMap";
import CreateNetworkRoom from "./entities/NetworkRoom";

import MapChangeSystem from "./systems/Map/MapChangeSystem";
import MapLoadSystem from "./systems/Map/MapLoadSystem";
import RenderingSystem from "./systems/Rendering/RenderingSystem";
import LoadingSystem from "./systems/LoadingSystem";
import NetworkingSystem from "./systems/Network/NetworkingSystem";
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
import AdminNetworkSystem from "./systems/Network/AdminNetworkSystem";
import CommandsSystem from "./systems/Network/CommandsSystem";
import ItemSystem from "./systems/Rendering/ItemSystem";
import CleanupSystem from "./systems/CleanupSystem";
import FlameSystem from "./systems/Rendering/LightSystem/FlameSystem";
import GraySystem from "./systems/Rendering/GraySystem";
import WeatherSystem from "./systems/Rendering/WeatherSystem";
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
import SoundScapeSystem from "./systems/Audio/SoundScapeSystem";
import AnimatedTile, {
  AnimatedTilesInitiated,
} from "./components/AnimatedTile";
import CharacterHighlight, {
  AddCharacterHighlight,
  RemoveCharacterHighlight,
} from "./components/CharacterHighlight";
import Drawable from "./components/Drawable";
import Effect from "./components/Effect";
import Enemy, { LookAtPlayer } from "./components/Enemy";
import EnvironmentBrightness from "./components/EnvironmentBrightness";
import Fade from "./components/Fade";
import Gate from "./components/Gate";
import Inventory from "./components/Inventory";
import Item from "./components/Item";
import { Loadable, Unloadable, SimpleLoadable } from "./components/Loadable";
import LocalPlayer, {
  RoleCheckPending,
  CommandsPending,
} from "./components/LocalPlayer";
import Loot, { OpenLootAtDestination } from "./components/Loot";
import Movement from "./components/Movement";
import NetworkRoom from "./components/NetworkRoom";
import NewMovementTarget from "./components/NewMovementTarget";
import Position from "./components/Position";
import RemotePlayer from "./components/RemotePlayer";
import Shop, { OpenShopAtDestination } from "./components/Shop";
import SpriteSheetAnimation from "./components/SpriteSheetAnimation";
import TextBurst from "./components/TextBurst";
import TileMap, { ChangingMap, ChangeMap } from "./components/TileMap";
import Weather from "./components/Weather";
import {
  Remove,
  SendData,
  Move,
  KeyboardInput,
  MouseInput,
  AwaitingPosition,
  Gray,
  Disable,
  Focused,
  BattleTarget,
  PickUpAtDestination,
  GenerateSpriteSheetAnimationSteps,
  PlayerDeath,
} from "./components/Tags";
import Storage from "@client/utilities/storage";
import DeathSystem from "./systems/DeathSystem";

let world = new World();

export const getWorld = () => world;

export default (user: User) => {
  world
    .registerComponent(AnimatedTile)
    .registerComponent(AnimatedTilesInitiated)
    .registerComponent(CharacterHighlight)
    .registerComponent(AddCharacterHighlight)
    .registerComponent(RemoveCharacterHighlight)
    .registerComponent(Drawable)
    .registerComponent(Effect)
    .registerComponent(Enemy)
    .registerComponent(EnvironmentBrightness)
    .registerComponent(Fade)
    .registerComponent(Gate)
    .registerComponent(Inventory)
    .registerComponent(LookAtPlayer)
    .registerComponent(Item)
    .registerComponent(Loadable)
    .registerComponent(Unloadable)
    .registerComponent(SimpleLoadable)
    .registerComponent(LocalPlayer)
    .registerComponent(RoleCheckPending)
    .registerComponent(CommandsPending)
    .registerComponent(Loot)
    .registerComponent(Movement)
    .registerComponent(NetworkRoom)
    .registerComponent(NewMovementTarget)
    .registerComponent(Position)
    .registerComponent(RemotePlayer)
    .registerComponent(OpenShopAtDestination)
    .registerComponent(OpenLootAtDestination)
    .registerComponent(Shop)
    .registerComponent(SpriteSheetAnimation)
    .registerComponent(TextBurst)
    .registerComponent(TileMap)
    .registerComponent(ChangingMap)
    .registerComponent(ChangeMap)
    .registerComponent(Weather)
    .registerComponent(Remove)
    .registerComponent(Move)
    .registerComponent(SendData)
    .registerComponent(KeyboardInput)
    .registerComponent(MouseInput)
    .registerComponent(AwaitingPosition)
    .registerComponent(Gray)
    .registerComponent(Disable)
    .registerComponent(Focused)
    .registerComponent(BattleTarget)
    .registerComponent(PickUpAtDestination)
    .registerComponent(GenerateSpriteSheetAnimationSteps)
    .registerComponent(PlayerDeath)
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
    .registerSystem(DeathSystem)
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
    .registerSystem(CleanupSystem)
    .registerSystem(SoundScapeSystem);

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
    window.gameFocused = false;
    worker.postMessage("start");
  };
  window.onfocus = () => {
    window.gameFocused = true;
    worker.postMessage("stop");
  };

  // Load all settings from storage
  Storage.init();

  update();
};
