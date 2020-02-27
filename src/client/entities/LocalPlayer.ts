import { LocalPlayer, KeyboardInput, MouseInput } from "../components/Tags";
import BaseCharacter from "./BaseCharacter";

export default function CreateLocalPlayer() {
  return BaseCharacter()
    .addComponent(KeyboardInput)
    .addComponent(MouseInput)
    .addComponent(LocalPlayer);
}
