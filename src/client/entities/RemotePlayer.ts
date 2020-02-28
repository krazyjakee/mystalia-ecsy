import BaseCharacter from "./BaseCharacter";
import RemotePlayer from "../components/RemotePlayer";
import SpriteSheetAnimation from "../components/SpriteSheetAnimation";
import { generateAnimationSteps } from "../utilities/Animation/character";

export default function CreateRemotePlayer(opts: RemotePlayer) {
  return BaseCharacter()
    .addComponent(SpriteSheetAnimation, { steps: generateAnimationSteps("s") })
    .addComponent(RemotePlayer, opts);
}
