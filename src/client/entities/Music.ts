import { getWorld } from "../ecsy";
import Audio, { AudioFadeIn, Music } from "@client/components/Audio";
import { SimpleLoadable, Loadable } from "@client/components/Loadable";

export default function CreateMusic(audioPath: string) {
  return getWorld()
    .createEntity()
    .addComponent(Music)
    .addComponent(AudioFadeIn)
    .addComponent(SimpleLoadable)
    .addComponent(Audio)
    .addComponent(Loadable, { audioPath });
}
