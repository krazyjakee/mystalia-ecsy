import BaseCharacter from "./BaseCharacter";
import RemotePlayer from "@client/components/RemotePlayer";
import SpriteSheetAnimation from "@client/components/SpriteSheetAnimation";
import { generateCharacterAnimationSteps } from "../utilities/Animation/character";
import PlayerState from "@server/components/player";

export default function CreateRemotePlayer(opts: {
  state: PlayerState;
  key: string;
}) {
  return BaseCharacter()
    .addComponent(SpriteSheetAnimation, {
      speed: 10,
      steps: generateCharacterAnimationSteps("s"),
      loopAround: true,
    })
    .addComponent(RemotePlayer, opts);
}
