module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@client(.*)$": "<rootDir>/src/client$1",
    "^@server(.*)$": "<rootDir>/src/server$1",
    "^types(.*)$": "<rootDir>/src/types$1",
    "^utilities(.*)$": "<rootDir>/src/utilities$1",
  },
  setupFiles: ["<rootDir>/src/setupTests.js"],
};
