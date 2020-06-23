import { mongoose } from "@colyseus/social";
import * as redis from "redis";
import { redisOptions } from "./world/WorldBlockList";

export default (callback: Function) => {
  const numberOfChecks = 2;
  const checksComplete: number[] = [];
  const checkComplete = () => {
    checksComplete.push(0);
    if (checksComplete.length === numberOfChecks) {
      console.log("Healthchecks complete.");
      callback();
    }
  };

  console.log("Running healthchecks...");
  if (!process.env.MONGO_URI) {
    throw new Error("No MONGO_URI environment variable defined");
  }

  if (!process.env.REDIS_URL) {
    throw new Error("No REDIS_URL environment variable defined");
  }

  const mongoTimeout = setTimeout(() => {
    throw new Error("could not connect to MongoDB. Connection timed out.");
  }, 20000);

  mongoose.connection.on("connected", () => {
    clearTimeout(mongoTimeout);
    checkComplete();
  });

  const client = redis.createClient(redisOptions);

  client.on("connect", () => {
    checkComplete();
    client.quit();
  });

  client.on("error", function(error) {
    client.quit();
    console.error(new Error(error));
    process.exit(1);
  });
};
