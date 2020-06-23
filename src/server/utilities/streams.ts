const streamify = require("stream-array");
const es = require("event-stream");

export const streamArray = (array: any[], cb: Function) => {
  const readStream = streamify(array);
  readStream.pipe(es.mapSync(cb));
  return readStream;
};
