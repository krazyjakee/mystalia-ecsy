import { RedisClient } from "redis";
import * as redisUrl from "redis-url";
import { AStarFinder } from "astar-typescript";
import { getBlockGrid } from "utilities/movement/aStar";
import * as AdmZip from "adm-zip";
import { getWorldSize, getWorldColumns, getWorldFirstTile } from "./worldSize";
import { tileIdToVector, tileIdToPixels } from "utilities/tileMap";

export default class WorldBlockList {
  redis?: RedisClient;
  aStar?: AStarFinder;

  connection() {
    return new Promise((accept, reject) => {
      if (this.redis && this.redis.connected) {
        return accept();
      }
      this.redis = new RedisClient(redisOptions);
      this.redis.on("connect", () => {
        accept();
      });
      this.redis.on("error", (err) => {
        reject(err);
      });
    });
  }

  setHash(hash: string) {
    return new Promise((accept, reject) => {
      this.redis?.set("worldBlockListHash", hash, (err, value) => {
        if (err) return reject(err);
        accept();
      });
    });
  }

  sameHash(hash: string): Promise<boolean> {
    return new Promise((accept, reject) => {
      this.redis?.get("worldBlockListHash", (err, value) => {
        if (err) return reject(err);
        accept(value === hash);
      });
    });
  }

  clearAll() {
    return new Promise((accept, reject) => {
      let counter = 0;
      const taskComplete = () => {
        counter += 1;
        if (counter === 3) {
          accept();
        }
      };
      this.redis?.del("worldBlockList", (err) => {
        if (err) return reject(err);
        taskComplete();
      });
      this.redis?.del("worldAllowList", (err) => {
        if (err) return reject(err);
        taskComplete();
      });
      this.redis?.del("worldAStarMatrix", (err) => {
        if (err) return reject(err);
        taskComplete();
      });
    });
  }

  addList(key: string, list: string[]): Promise<void> {
    return new Promise((accept, reject) => {
      this.redis?.sadd(key, list, (err) => {
        if (err) return reject(err);
        accept();
      });
    });
  }

  async addBlockList(blockList: string[]) {
    await this.addList("worldBlockList", blockList);
  }

  async addAllowList(allowList: string[]) {
    await this.addList("worldAllowList", allowList);
  }

  exists(key: string, id: number): Promise<boolean> {
    return new Promise((accept, reject) => {
      this.redis?.sismember(key, id.toString(), (err, value) => {
        if (err) return reject(err);
        accept(value === 1);
      });
    });
  }

  async tileAllowed(tileId: number) {
    return await this.exists("worldAllowList", tileId);
  }

  async tileBlocked(tileId: number) {
    return await this.exists("worldBlockList", tileId);
  }

  randomValidTile(): Promise<number> {
    return new Promise((accept, reject) => {
      this.redis?.srandmember("worldAllowList", (err, value) => {
        if (err) return reject(err);
        accept(parseInt(value));
      });
    });
  }

  setAStarMatrix(allowList: string[]) {
    return new Promise((accept, reject) => {
      console.log("Fueling world aStar engine...");
      const worldSize = getWorldSize();
      const worldColumns = getWorldColumns();
      const worldFirstTile = getWorldFirstTile();
      const allowListNumbers = allowList.map((s) => parseInt(s));
      const ProgressBar = require("progress");
      const matrix = Array(worldSize.height / 32)
        .fill(1)
        .map(() => {
          return Array(worldColumns).fill(1);
        });

      const bar = new ProgressBar(":bar :current/:total ", {
        total: matrix.length,
      });
      for (let i = 0; i < matrix.length; i += 1) {
        for (let j = 0; j < matrix[i].length; j += 1) {
          let tileId = i * worldColumns + j;
          if (allowListNumbers.includes(tileId + worldFirstTile)) {
            matrix[i][j] = 0;
          }
        }
        bar.tick();
      }

      this.redis?.set("worldAStarMatrix", JSON.stringify(matrix), (err) => {
        if (err) return reject(err);
        accept();
        console.log("World aStar engine fueled!");
      });
    });
  }

  getAStarMatrix(): Promise<number[][]> {
    return new Promise((accept, reject) => {
      this.redis?.get("worldAStarMatrix", (err, matrix) => {
        if (err) return reject(err);
        accept(JSON.parse(matrix));
      });
    });
  }

  async setupWorldAStar() {
    const matrix = await this.getAStarMatrix();
    this.aStar = new AStarFinder({
      grid: {
        matrix,
      },
      diagonalAllowed: false,
      includeStartNode: false,
    });
  }

  static getBlockListsFromZip() {
    console.log("Getting block lists from zip...");
    const zip = new AdmZip("./src/utilities/data/blockList.zip");
    const zipEntries = zip.getEntries();
    let allowList: number[] = [];
    let blockList: number[] = [];

    for (let entryKey in zipEntries) {
      const zipEntry = zipEntries[entryKey];
      if (zipEntry.entryName === "allowList.json") {
        allowList = zipEntry
          .getData()
          .toString()
          .split(",")
          .map((s) => parseInt(s));
      }
      if (zipEntry.entryName === "blockList.json") {
        blockList = zipEntry
          .getData()
          .toString()
          .split(",")
          .map((s) => parseInt(s));
      }
    }
    return {
      allowList,
      blockList,
    };
  }
}

const parsedUrl = redisUrl.parse(
  process.env.REDIS_URL || "redis://localhost:6379"
);

export const redisOptions = {
  ...parsedUrl,
  host: parsedUrl.host.split(":")[0],
};
