import config from "../config.json";
import gameState from "@client/gameState";

let dayLengthInMinutes = config.dayLengthInMinutes
let time : any = ""

gameState.subscribe("admin:timeSpec:update", (value) => {
    dayLengthInMinutes = value.dayLengthMins;
});

gameState.subscribe("admin:forceTime:update", (value) => {
	//probably a better way of handling this	
	if (!Number.isNaN(parseInt(value.forceTime))) {
	    time = (parseInt(value.forceTime) + 15) * 100;
	} 
	if (!Number.isNaN(parseInt(value.forceMins)) && time) {
	    time = time + (parseInt(value.forceMins)*1.6667);
	} else if (!Number.isNaN(parseInt(value.forceMins)) && !time) {
		time = (parseInt(value.forceMins)*1.6667);
	}
	if (Number.isNaN(parseInt(value.forceTime)) && Number.isNaN(parseInt(value.forceMins)) ) {
	    time = ""
	}
});

export const timeOfDayAsPercentage = () => {
	if (time) {
		return (parseInt(time)) / 24;
	}
  const utcTime =
    new Date(new Date().toUTCString()).getTime() +
    new Date().getUTCMilliseconds();
  const minutesInMs = 1000 * 60 * dayLengthInMinutes;
  return ((utcTime / minutesInMs) % 1) * 100;
};
