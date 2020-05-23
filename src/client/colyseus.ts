import * as Colyseus from "colyseus.js";
import { websocket } from "./utilities/url";

const client = new Colyseus.Client(websocket);

export default client;
