import config from "../config.json";

export const timeOfDayAsPercentage = () => {
  const utcTime =
    new Date(new Date().toUTCString()).getTime() +
    new Date().getUTCMilliseconds();
  const minutesInMs = 1000 * 60 * config.dayLengthInMinutes;
  return ((utcTime / minutesInMs) % 1) * 100;
};
