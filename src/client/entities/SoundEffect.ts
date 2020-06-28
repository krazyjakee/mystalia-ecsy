import { getWorld } from "../ecsy";
import Audio, { SoundEffect } from "@client/components/Audio";
import { SimpleLoadable, Loadable } from "@client/components/Loadable";
import { sfxAssetPath } from "@client/utilities/assets";

export default function CreateSoundEffect(fileName: string) {
  const audioPath = sfxAssetPath(fileName);
  return getWorld()
    .createEntity()
    .addComponent(SimpleLoadable)
    .addComponent(Loadable, { audioPath })
    .addComponent(SoundEffect)
    .addComponent(Audio);
}
