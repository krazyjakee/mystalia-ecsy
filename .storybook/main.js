const path = require("path");

module.exports = {
  stories: ["../src/client/react/**/*.stories.tsx"],
  addons: ["@storybook/addon-links"],
  webpackFinal: async (config) => {
    config.module.rules.push({
      include: path.resolve(__dirname, "../src"),
      test: /\.(ts|tsx)$/,
      use: [
        require.resolve("ts-loader"),
        {
          loader: require.resolve("react-docgen-typescript-loader"),
          options: {
            // Provide the path to your tsconfig.json so that your stories can
            // display types from outside each individual story.
            tsconfigPath: path.resolve(
              __dirname,
              "../src/client/tsconfig.json"
            ),
          },
        },
      ],
    });
    config.resolve.extensions.push(".ts", ".tsx");
    config.resolve.alias = {
      types: path.resolve(__dirname, "../src", "types"),
      utilities: path.resolve(__dirname, "../src", "utilities"),
      "@server": path.resolve(__dirname, "../src", "server"),
      "@client": path.resolve(__dirname, "../src", "client"),
    };

    return config;
  },
};
