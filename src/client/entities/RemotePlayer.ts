import BaseCharacter from "./BaseCharacter";
import RemotePlayer from "../components/RemotePlayer";

export default function CreateRemotePlayer(opts: RemotePlayer) {
  return BaseCharacter().addComponent(RemotePlayer, opts);
}
