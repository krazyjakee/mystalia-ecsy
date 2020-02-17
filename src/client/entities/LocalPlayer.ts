import KeyboardInput from "../components/KeyboardInput";
import MouseInput from "../components/MouseInput";
import { LocalPlayer } from "../components/Tags";
import BaseCharacter from "./BaseCharacter";

export default function CreateLocalPlayer() {
  return BaseCharacter()
    .addComponent(KeyboardInput)
    .addComponent(MouseInput)
    .addComponent(LocalPlayer);
}
