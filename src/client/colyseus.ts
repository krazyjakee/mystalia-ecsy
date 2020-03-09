import * as Colyseus from "colyseus.js";

const hostname = location.hostname || "localhost";
const port = hostname === "localhost" ? 8080 : 80;
const protocol = hostname === "localhost" ? "ws" : "wss";
const client = new Colyseus.Client(`${protocol}://${hostname}:${port}`);

export default client;
