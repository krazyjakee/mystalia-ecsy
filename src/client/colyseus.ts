import * as Colyseus from "colyseus.js";

const client = new Colyseus.Client(
  `ws://localhost:${process.env.PORT || 8080}`
);

export default client;
