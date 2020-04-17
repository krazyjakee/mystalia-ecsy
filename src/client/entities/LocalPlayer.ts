import { KeyboardInput, MouseInput } from "@client/components/Tags";
import BaseCharacter from "./BaseCharacter";
import { generateAnimationSteps } from "../utilities/Animation/character";
import SpriteSheetAnimation from "@client/components/SpriteSheetAnimation";
import User from "types/User";
import LocalPlayer, {
  RoleCheckPending,
  CommandsPending,
} from "@client/components/LocalPlayer";

export default function CreateLocalPlayer(user: User) {
  return BaseCharacter({ currentTile: user.metadata.currentTile })
    .addComponent(SpriteSheetAnimation, {
      speed: 10,
      steps: generateAnimationSteps("s"),
    })
    .addComponent(KeyboardInput)
    .addComponent(MouseInput)
    .addComponent(LocalPlayer, { user })
    .addComponent(RoleCheckPending)
    .addComponent(CommandsPending);
}
