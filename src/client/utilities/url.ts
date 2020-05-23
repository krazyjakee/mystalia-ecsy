const hostname = location.hostname || "localhost";
const localhost = hostname === "localhost";
const port = localhost ? 8080 : 443;
const websocketProtocol = localhost ? "ws" : "wss";
const protocol = localhost ? "http" : "https";

export const domainBase = `${protocol}://${hostname}:${port}`;
export const websocket = `${websocketProtocol}://${hostname}:${port}`;
