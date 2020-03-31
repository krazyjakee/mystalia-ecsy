import React from "react";
import { guiAssetPath } from "../../cssUtilities";
import { createUseStyles } from "react-jss";
import { IndicatorProps } from "react-select";

const useStyles = createUseStyles({
  root: {
    width: 25,
    height: 22,
    backgroundImage: guiAssetPath("form-control/dropdown-button.png"),
    cursor: "pointer",
    "&:active": {
      filter: "brightness(0.8) !important"
    },
    "&:hover": {
      filter: "brightness(1.2)"
    }
  }
});

const CustomIndicator: React.ComponentType<IndicatorProps<{}>> = ({
  innerProps
}) => {
  const classes = useStyles();
  return <div {...innerProps} className={classes.root}></div>;
};

export default CustomIndicator;
