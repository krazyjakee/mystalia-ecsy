import * as fs from "fs";

export const readJSONFile = (file) => {
  const rawBuffer = fs.readFileSync(file).toString();
  return JSON.parse(rawBuffer);
};

export const writeFile = (fileName, data) => {
  fs.writeFileSync(fileName, data);
};
