import PlayerState from "@server/components/player";
import { readJSONFile } from "../files";
import { readMapFiles } from "../mapFiles";

type WorldMapData = {
  fileName: string;
  x: number;
  y: number;
};

type WorldMapDataFile = {
  maps: WorldMapData[];
  type: string;
};

type WorldMapItem = {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

const worldData = readJSONFile("./assets/maps/maps.world") as WorldMapDataFile;
const mapData = readMapFiles();

const worldMapItems: WorldMapItem[] = worldData.maps.map((worldMapData) => {
  const { fileName, x, y } = worldMapData;
  const name = fileName.split(".")[0];
  const map = mapData[name];
  return {
    name,
    x,
    y,
    width: map.width * 32,
    height: map.height * 32,
  };
});

export const movementWalkOff = (player: PlayerState, mapName: string) => {
  // TODO: Get player position and map name and use maps.world file to find the next map.
};
