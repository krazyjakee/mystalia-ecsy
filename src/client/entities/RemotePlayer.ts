import RemotePlayer from "../components/RemotePlayer";
import Player from "./Player";

export default function CreateRemotePlayer() {
  return Player().addComponent(RemotePlayer);
}
