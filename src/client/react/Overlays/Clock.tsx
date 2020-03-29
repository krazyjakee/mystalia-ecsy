import React, { useState, useEffect } from "react";
import { whiteText } from "../palette";
import { createUseStyles } from "react-jss";
import { timeOfDayAsPercentage } from "../../utilities/time";

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

export const Clock = () => {
  const [displayTime, setDisplayTime] = useState("00:00");
  const classes = useStyles();

  useEffect(() => {
    setInterval(() => {
      const dayPercentage = timeOfDayAsPercentage();
      const dayLength = 1000 * 60 * 60 * 1;

      const msElapsed =
        Math.round(dayLength * 24 * (dayPercentage / 100)) + dayLength * 8;
      const elapsedDate = new Date(msElapsed);
      setDisplayTime(
        elapsedDate
          .toLocaleTimeString()
          .split(":")
          .slice(0, 2)
          .join(":")
      );
    }, 100);
  }, []);

  return <div className={classes.container}>{displayTime}</div>;
};
