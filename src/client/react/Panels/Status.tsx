import React from "react";
import { createUseStyles } from "react-jss";
import { guiAssetPath, portraitPath } from "../cssUtilities";
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
  portraitLarge: {
    position: "absolute",
    left: 20,
    top: 25,
  },
  portraitImageLarge: {
    position: "absolute",
    left: 4,
    top: 4,
    backgroundSize: "74px 74px",
    width: 74,
    height: 74,
    borderRadius: "50%",
  },
  portraitGlareLarge: {
    position: "absolute",
    width: 91,
    height: 93,
    backgroundImage: guiAssetPath("panel/player-status/portrait-large.png"),
  },
  portraitSmall: {
    position: "absolute",
    left: 0,
    top: 5,
  },
  portraitImageSmall: {
    position: "absolute",
    left: 2,
    top: 2,
    backgroundSize: "50px 50px",
    width: 50,
    height: 50,
    borderRadius: "50%",
  },
  portraitGlareSmall: {
    position: "absolute",
    width: 62,
    height: 66,
    backgroundImage: guiAssetPath("panel/player-status/portrait-small.png"),
  },
});

type Props = {
  name: string;
  portrait: string;
  hp?: number;
  mp?: number;
  large?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const Status = ({
  name,
  portrait,
  hp = 100,
  mp = 100,
  large = false,
  className,
  ...props
}: Props) => {
  const classes = useStyles();

  const healthBarTop = large ? 48 : 19;
  const energyBarTop = large ? 74 : 35;
  const healthBarLeft = large ? 128 : 74;
  const healthBarWidth = large ? 175 : 115;
  const healthBarHeight = large ? 13 : 10;

  // TODO show level (based on xp)
  return (
    <div
      {...props}
      id="enemyStateComponent"
      className={classnames(
        className,
        classes.root,
        large ? classes.rootLarge : classes.rootSmall
      )}
    >
      <div
        className={large ? classes.portraitLarge : classes.portraitGlareSmall}
      >
        <div
          style={{ backgroundImage: portraitPath(portrait) }}
          className={
            large ? classes.portraitImageLarge : classes.portraitImageSmall
          }
        ></div>
        <div
          className={
            large ? classes.portraitGlareLarge : classes.portraitGlareSmall
          }
        ></div>
      </div>
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
        percentage={hp}
      />
      <HealthBar
        width={healthBarWidth}
        height={healthBarHeight}
        top={energyBarTop}
        left={healthBarLeft}
        percentage={mp}
        hue={120}
      />
    </div>
  );
};
