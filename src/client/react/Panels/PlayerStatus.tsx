import React from "react";
import { createUseStyles } from "react-jss";
import { guiAssetPath } from "../cssUtilities";
import { whiteText } from "../palette";
import HealthBar from "./HealthBar";
import classnames from "classnames";

const useStyles = createUseStyles({
  root: {
    position: "absolute",
  },
  rootLarge: {
    backgroundImage: guiAssetPath("panel/player-status/bg-large.png"),
    width: 342,
    height: 117,
  },
  rootSmall: {
    backgroundImage: guiAssetPath("panel/player-status/bg-small.png"),
    width: 215,
    height: 67,
  },
  label: {
    position: "absolute",
    fontSize: 11,
    ...whiteText,
  },
  labelLarge: {
    left: 132,
    top: 15,
  },
  labelSmall: {
    left: 70,
    top: -10,
  },
});

type Props = {
  name: string;
  large?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const PlayerStatus = ({ name, large = false, ...props }: Props) => {
  const classes = useStyles();

  const healthBarTop = large ? 48 : 17;
  const energyBarTop = large ? 74 : 33;
  const healthBarLeft = large ? 128 : 74;
  const healthBarWidth = large ? 175 : 115;
  const healthBarHeight = large ? 13 : 10;

  return (
    <div
      {...props}
      id="enemyStateComponent"
      className={classnames(
        classes.root,
        large ? classes.rootLarge : classes.rootSmall
      )}
    >
      <div
        className={classnames(
          classes.label,
          large ? classes.labelLarge : classes.labelSmall
        )}
      >
        {name}
      </div>
      <HealthBar
        width={healthBarWidth}
        height={healthBarHeight}
        top={healthBarTop}
        left={healthBarLeft}
        percentage={100}
      />
      <HealthBar
        width={healthBarWidth}
        height={healthBarHeight}
        top={energyBarTop}
        left={healthBarLeft}
        percentage={100}
        hue={120}
      />
    </div>
  );
};
