import * as Colyseus from "colyseus.js";

const client = new Colyseus.Client("ws://localhost:8080");

export default client;
