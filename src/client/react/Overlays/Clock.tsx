import React, { useState, useEffect } from "react";
import { whiteText } from "../palette";
import { createUseStyles } from "react-jss";
import { timeOfDayAsPercentage } from "../../utilities/time";
import config from "../../config.json";

const useStyles = createUseStyles({
  container: {
    padding: 5,
    position: "absolute",
    top: 0,
    right: 0,
    opacity: 0.5,
    ...whiteText
  }
});

const { offset } = config.time;

export const Clock = () => {
  const [displayTime, setDisplayTime] = useState("00:00 AM");
  const classes = useStyles();
  useEffect(() => {
    setInterval(() => {
      const dayPercentage = timeOfDayAsPercentage();
      const dayLength = 1000 * 60 * 60 * 1;

      const msElapsed =
        Math.round(dayLength * 24 * (dayPercentage / 100)) + dayLength * offset;
      const elapsedDate = new Date(msElapsed);

      setDisplayTime(
        elapsedDate.toLocaleTimeString("en-US", {hour: "2-digit", minute:"2-digit"})
      );
    }, 100);
  }, []);

  return <div className={classes.container}>{displayTime}</div>;
};
