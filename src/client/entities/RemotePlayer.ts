import { RemotePlayer } from "../components/Tags";
import BaseCharacter from "./BaseCharacter";

export default function CreateRemotePlayer() {
  return BaseCharacter().addComponent(RemotePlayer);
}
