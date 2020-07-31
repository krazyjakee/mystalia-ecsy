require("dotenv").config();

import * as express from "express";
import * as path from "path";
import * as http from "http";
import * as cors from "cors";
import * as compression from "compression";
import { Server } from "colyseus";
import { monitor } from "@colyseus/monitor";
import socialRoutes from "@colyseus/social/express";
import healthCheck from "./utilities/healthChecks";
import MapRoom from "./rooms/map";
import AdminRoom from "./rooms/admin";
import { readMapFiles } from "@server/utilities/mapFiles";
import mapRoutes from "./routes/maps";

const port = parseInt(process.env.PORT || "8080");
const app = express();

const isProduction = process.env.NODE_ENV !== "development";

if (!isProduction) {
  const webpack = require("webpack");
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const config = require("./webpack.config").default;
  const compiler = webpack(config);

  app.use(
    cors({
      origin: "*",
    })
  );

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath,
    })
  );
} else {
  app.use(compression);
}

app.use(express.static(path.resolve(__dirname, "..", "..", "public")));

app.use("/colyseus", monitor());
app.use("/", socialRoutes);
app.use("/maps", mapRoutes);

const server = http.createServer(app);
const gameServer = new Server({
  server,
  gracefullyShutdown: false,
});

function shutdown(signal: string) {
  return (err: any) => {
    console.log(`${signal}...`);
    if (err) console.error(err.stack || err);
    gameServer.gracefullyShutdown(true, err);
  };
}

process
  .on("SIGTERM", shutdown("SIGTERM"))
  .on("SIGINT", shutdown("SIGINT"))
  .on("uncaughtException", shutdown("uncaughtException"));

console.log("Loading map rooms...");
const maps = readMapFiles();
Object.keys(maps).forEach((mapName) => {
  gameServer.define(mapName, MapRoom);
});

gameServer.define("admin", AdminRoom);

console.log("Maps loaded");

healthCheck(() => {
  gameServer.listen(port);
  console.log(
    `Server listening on port ${port} in ${process.env.NODE_ENV} mode!`
  );
});

gameServer.onShutdown(() => {
  console.log("Graceful shutdown complete.");
});
