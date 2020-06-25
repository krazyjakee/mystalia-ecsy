import { getWorld } from "../ecsy";
import Audio, { Music } from "@client/components/Audio";
import { SimpleLoadable, Loadable } from "@client/components/Loadable";

export default function() {
  return getWorld()
    .createEntity()
    .addComponent(Music)
    .addComponent(SimpleLoadable)
    .addComponent(Loadable)
    .addComponent(Audio);
}
