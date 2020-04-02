require("dotenv").config();

import * as express from "express";
import * as path from "path";
import * as http from "http";
import * as cors from "cors";
import { Server } from "colyseus";
import { monitor } from "@colyseus/monitor";
import socialRoutes from "@colyseus/social/express";
import { getMapProperties } from "./utilities/tmjTools";
import healthCheck from "./utilities/healthChecks";
import MapRoom from "./rooms/map";
import AdminRoom from "./rooms/admin";
import { readMapFiles } from "./utilities/mapFiles";

const port = parseInt(process.env.PORT || "8080");
const app = express();

if (process.env.NODE_ENV === "development") {
  const webpack = require("webpack");
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const config = require("./webpack.config").default;
  const compiler = webpack(config);

  app.use(
    cors({
      origin: "*"
    })
  );

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath
    })
  );
}

app.use(express.static(path.resolve(__dirname, "..", "..", "public")));

app.use("/colyseus", monitor());
app.use("/", socialRoutes);

const server = http.createServer(app);
const gameServer = new Server({
  server
});

console.log("Loading map rooms...");
const maps = readMapFiles();
Object.keys(maps).forEach(mapName => {
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
