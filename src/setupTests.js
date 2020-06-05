const test = require("../assets/maps/test.json");
const first = require("../assets/maps/first.json");
const south = require("../assets/maps/south.json");

test.properties.push({ name: "fileName", type: "string", value: "test" });
first.properties.push({ name: "fileName", type: "string", value: "first" });
south.properties.push({ name: "fileName", type: "string", value: "south" });

jest.mock("@server/utilities/mapFiles", () => ({
  readMapFiles: () => ({ test, first, south }),
  getWorldMapItems: () => [
    { fileName: "test", x: 0, y: -320, width: 320, height: 320 },
    { fileName: "first", x: 0, y: 0, width: 3840, height: 2176 },
    { fileName: "south", x: 0, y: 2176, width: 3840, height: 2176 },
  ],
}));
