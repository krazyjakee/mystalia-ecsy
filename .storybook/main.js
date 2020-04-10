const path = require("path");

module.exports = {
  stories: ["../src/client/react/**/*.stories.tsx"],
  addons: ["@storybook/addon-actions", "@storybook/addon-links"],
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve("ts-loader")
        },
        // Optional
        {
          loader: require.resolve("react-docgen-typescript-loader")
        }
      ]
    });
    config.resolve.extensions.push(".ts", ".tsx");
    config.resolve.alias = {
      types: path.resolve(__dirname, "../src/", "types"),
      utilities: path.resolve(__dirname, "../src/", "utilities"),
      serverState: path.resolve(__dirname, "../src/", "server/components")
    };

    return config;
  }
};
