import KeyboardInput from "../components/KeyboardInput";
import MouseInput from "../components/MouseInput";
import { LocalPlayer } from "../components/Tags";
import Player from "./Player";

export default function CreateLocalPlayer() {
  return Player()
    .addComponent(KeyboardInput)
    .addComponent(MouseInput)
    .addComponent(LocalPlayer);
}
