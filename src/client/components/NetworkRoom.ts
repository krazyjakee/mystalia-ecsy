import { Component } from "ecsy";
import { Room } from "colyseus.js";
import MapState from "@server/components/map";

export type RoomState = Room<MapState>;

type NetworkRoomProps = {
  room?: RoomState;
  joining: boolean;
};

export default class NetworkRoom extends Component<NetworkRoomProps> {
  room?: RoomState;
  joining: boolean = false;
}
