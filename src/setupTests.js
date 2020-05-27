const test = require("../assets/maps/test.json");
test.properties.push({ name: "fileName", type: "string", value: "test" });

jest.mock("@server/utilities/mapFiles", () => ({
  readMapFiles: () => ({ test }),
  getWorldMapItems: () => [
    { fileName: "test", x: 0, y: 0, width: 320, height: 320 },
    { fileName: "first", x: 0, y: 0, width: 3840, height: 2176 },
    { fileName: "south", x: 0, y: 2176, width: 3840, height: 2176 },
  ],
}));
