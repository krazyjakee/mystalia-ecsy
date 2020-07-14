import { Component, Types } from "ecsy";
import { Room } from "colyseus.js";
import MapState from "@server/components/map";

export type RoomState = Room<MapState>;

export default class NetworkRoom extends Component<NetworkRoom> {
  static schema = {
    room: { type: Types.JSON },
    joining: { default: false, type: Types.Boolean },
  };
  room?: RoomState;
  joining: boolean = false;
}
