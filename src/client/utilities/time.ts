import config from "../config.json";
import gameState from "@client/gameState";

let { dayLengthInMinutes } = config.time
const { offset } = config.time;

let time : any = ""

gameState.subscribe("admin:timeSpec:update", (value) => {
    dayLengthInMinutes = Number(value.dayLengthMins);
});

gameState.subscribe("admin:forceTime:update", (value) => {
	// probably a better way of handling this	
	if (!Number.isNaN(Number(value.hours))) {
	    time = (Number(value.hours));
	} 
	if (!Number.isNaN(Number(value.minutes)) && time) {
	    time = time + (Number(value.minutes)*1.6667/100);
	} else if (!Number.isNaN(Number(value.minutes)) && !time) {
		time = (Number(value.minutes)*1.6667/100);
	}
	if ( (Number.isNaN(Number(value.hours)) && Number.isNaN(Number(value.minutes)) ) || !value.active ) {
	    time = ""
	}
});

export const timeOfDayAsPercentage = () => {
	const minutesInMs = 1000 * 60 * dayLengthInMinutes;
	const utcTime =
	    new Date(new Date().toUTCString()).getTime() +
	    new Date().getUTCMilliseconds();
	if (time) {
		let manualTime = (100 / 24) * Number(time + (24 - (offset+1)));
		if (manualTime > 100) {
			manualTime = manualTime - 100
		}
		return manualTime;
	}
	return ((utcTime / minutesInMs) % 1) * 100;
};
