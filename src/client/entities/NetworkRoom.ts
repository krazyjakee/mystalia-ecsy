import NetworkRoom from "../components/NetworkRoom";
import { getWorld } from "../ecsy";

export default function CreateNetworkRoom() {
  getWorld()
    .createEntity()
    .addComponent(NetworkRoom);
}
