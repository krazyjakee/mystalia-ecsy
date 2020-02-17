import { Component } from "ecsy";
import { Room } from "colyseus.js";
import MapState from "serverState/map";

export type RoomState = Room<MapState>;

export default class NetworkRoom extends Component {
  room?: RoomState;
  joining: boolean = false;
}
