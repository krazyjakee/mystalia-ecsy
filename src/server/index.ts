require("dotenv").config();

import * as express from "express";
import * as path from "path";
import * as http from "http";
import * as fs from "fs";
import { Server } from "colyseus";
import { monitor } from "@colyseus/monitor";
import socialRoutes from "@colyseus/social/express";
import { getMapProperties } from "./utilities/tmjTools";
import MapRoom from "./rooms/map";
import { hooks } from "@colyseus/social";
import { PlayerDBState } from "./components/player";

const port = parseInt(process.env.PORT || "8080");
const app = express();

if (process.env.NODE_ENV === "development") {
  const webpack = require("webpack");
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const config = require("./webpack.config").default;
  const compiler = webpack(config);

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath
    })
  );
}

app.use(express.static(path.resolve(__dirname, "..", "..", "public")));

app.use("/colyseus", monitor());

hooks.beforeAuthenticate((_, $setOnInsert) => {
  $setOnInsert.metadata = PlayerDBState;
});

app.use("/", socialRoutes);

const server = http.createServer(app);
const gameServer = new Server({
  server
});

console.log("Loading map rooms...");
const dir = fs.opendirSync("./assets/maps");
let file;
while ((file = dir.readSync()) !== null) {
  if (file.name.includes(".json")) {
    const rawBuffer = fs.readFileSync(`./assets/maps/${file.name}`).toString();
    const json = JSON.parse(rawBuffer);
    const properties = getMapProperties(json);
    gameServer.define(properties.name, MapRoom);
  }
}
dir.closeSync();
console.log("Done");

gameServer.listen(port);
console.log(
  `Server listening on port ${port} in ${process.env.NODE_ENV} mode!`
);
