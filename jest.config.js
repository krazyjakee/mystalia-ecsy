module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^utilities(.*)$": "<rootDir>/src/utilities$1",
    "^serverState(.*)$": "<rootDir>/src/server/components$1"
  }
};
