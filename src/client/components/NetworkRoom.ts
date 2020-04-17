import { Component } from "ecsy";
import { Room } from "colyseus.js";
import MapState from "@server/components/map";

export type RoomState = Room<MapState>;

export default class NetworkRoom extends Component {
  room?: RoomState;
  joining: boolean = false;
}
