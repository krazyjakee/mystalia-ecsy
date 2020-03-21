import { mongoose } from "@colyseus/social";

export default (callback: Function) => {
  console.log("Running healthchecks...");
  if (!process.env.MONGO_URI) {
    throw new Error("No MONGO_URI environment variable defined");
  }

  const timeout = setTimeout(() => {
    throw Error("could not connect to MongoDB. Connection timed out.");
  }, 5000);

  mongoose.connection.on("connected", () => {
    clearTimeout(timeout);
    console.log("Healthchecks complete.");
    callback();
  });
};
