import { randomNumberBetween } from "./math";

export const makeHash = (input: string): string => {
  var hash = 0,
    i,
    chr;
  if (input.length === 0) return `i${hash}`;
  for (i = 0; i < input.length; i++) {
    chr = input.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return `i${hash}`;
};

export const randomHash = () => {
  const date = new Date().getTime() + new Date().getUTCMilliseconds();
  const randomNumber = randomNumberBetween(1000000);
  return makeHash(`${date}${randomNumber}`);
};
