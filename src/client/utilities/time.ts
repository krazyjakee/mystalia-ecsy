import config from "../config.json";
import gameState from "@client/gameState";

let dayLengthInMinutes = config.dayLengthInMinutes
let time = ""

gameState.subscribe("admin:timeSpec:update", (value) => {
    dayLengthInMinutes = value.dayLengthMins;
});

gameState.subscribe("admin:forceTime:update", (value) => {	
	if (!Number.isNaN(parseInt(value.forceTime))) {
	    time = value.forceTime;
	  } else {
	    time = ""
	  }
});

export const timeOfDayAsPercentage = () => {
	if (time) {
		return ((parseInt(time) - 9) * 100) / 24;
	}
  const utcTime =
    new Date(new Date().toUTCString()).getTime() +
    new Date().getUTCMilliseconds();
  const minutesInMs = 1000 * 60 * dayLengthInMinutes;
  return ((utcTime / minutesInMs) % 1) * 100;
};
