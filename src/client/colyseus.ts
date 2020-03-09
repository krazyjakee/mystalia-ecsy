import * as Colyseus from "colyseus.js";

const hostname = location.hostname || "localhost";
const port = hostname === "localhost" ? 8080 : 80;
const client = new Colyseus.Client(`ws://${hostname}:${port}`);

export default client;
