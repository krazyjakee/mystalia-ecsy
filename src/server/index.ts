import * as express from "express";
import * as path from "path";

const port = 8080;
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

app.listen(port, "0.0.0.0", () =>
  console.log(`Server started. Listening at http://localhost:${port}`)
);
