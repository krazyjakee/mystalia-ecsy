import { KeyboardInput, MouseInput } from "../components/Tags";
import BaseCharacter from "./BaseCharacter";
import { generateAnimationSteps } from "../utilities/Animation/character";
import SpriteSheetAnimation from "../components/SpriteSheetAnimation";
import User from "types/User";
import LocalPlayer from "../components/LocalPlayer";
import { tileIdToVector } from "../utilities/TileMap/calculations";

export default function CreateLocalPlayer(user: User) {
  return BaseCharacter(user.metadata.currentTile)
    .addComponent(SpriteSheetAnimation, {
      speed: 10,
      steps: generateAnimationSteps("s")
    })
    .addComponent(KeyboardInput)
    .addComponent(MouseInput)
    .addComponent(LocalPlayer, { user });
}
