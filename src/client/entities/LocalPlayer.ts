import { LocalPlayer, KeyboardInput, MouseInput } from "../components/Tags";
import BaseCharacter from "./BaseCharacter";
import { generateAnimationSteps } from "../utilities/Animation/character";
import SpriteSheetAnimation from "../components/SpriteSheetAnimation";

export default function CreateLocalPlayer() {
  return BaseCharacter()
    .addComponent(SpriteSheetAnimation, {
      speed: 10,
      steps: generateAnimationSteps("s")
    })
    .addComponent(KeyboardInput)
    .addComponent(MouseInput)
    .addComponent(LocalPlayer);
}
