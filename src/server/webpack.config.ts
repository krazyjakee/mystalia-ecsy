import * as path from "path";
import * as HTMLWebpackPlugin from "html-webpack-plugin";
import * as CopyWebpackPlugin from "copy-webpack-plugin";

const config = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  entry: path.resolve(__dirname, "..", "client", "index.ts"),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader",
        include: /flexboxgrid/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"],
    alias: {
      types: path.resolve(__dirname, "..", "types"),
      utilities: path.resolve(__dirname, "..", "utilities"),
      serverState: path.resolve(__dirname, "..", "server/components"),
      "@client": path.resolve(__dirname, "..", "client"),
    },
  },
  devtool:
    process.env.NODE_ENV === "production" ? "source-map" : "inline-source-map",
  devServer: {
    contentBase: "./public",
    hot: true,
    port: 8081,
  },
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "..", "..", "public"),
    publicPath: "/",
  },
  plugins: [
    new CopyWebpackPlugin([
      "assets/**/*",
      {
        from: "node_modules/normalize.css/normalize.css",
        to: "css/normalize.css",
      },
    ]),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, "..", "client", "index.html"),
    }),
  ],
};

export default config;
