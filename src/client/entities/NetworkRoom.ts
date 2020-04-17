import NetworkRoom from "@client/components/NetworkRoom";
import { getWorld } from "../ecsy";

export default function CreateNetworkRoom() {
  getWorld()
    .createEntity()
    .addComponent(NetworkRoom);
}
