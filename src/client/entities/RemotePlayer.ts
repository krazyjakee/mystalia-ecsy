import BaseCharacter from "./BaseCharacter";
import RemotePlayer, {
  RemotePlayerProps,
} from "@client/components/RemotePlayer";
import SpriteSheetAnimation from "@client/components/SpriteSheetAnimation";
import { generateCharacterAnimationSteps } from "../utilities/Animation/character";

export default function CreateRemotePlayer(opts: RemotePlayerProps) {
  return BaseCharacter()
    .addComponent(SpriteSheetAnimation, {
      speed: 10,
      steps: generateCharacterAnimationSteps("s"),
      loopAround: true,
    })
    .addComponent(RemotePlayer, opts);
}
