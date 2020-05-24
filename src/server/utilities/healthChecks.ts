import { mongoose } from "@colyseus/social";

export default (callback: Function) => {
  console.log("Running healthchecks...");
  if (!process.env.MONGO_URI) {
    throw new Error("No MONGO_URI environment variable defined");
  }

  const timeout = setTimeout(() => {
    console.error("could not connect to MongoDB. Connection timed out.");
  }, 20000);

  mongoose.connection.on("connected", () => {
    clearTimeout(timeout);
    console.log("Healthchecks complete.");
    callback();
  });
};
