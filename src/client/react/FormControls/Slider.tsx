import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import RangeSlider, { Range } from "react-input-range";
import { guiAssetPath } from "../cssUtilities";

const useStyles = createUseStyles({
  root: {
    marginTop: 45,
    height: 33,
  },
  inputRangeSlider: {
    backgroundImage: guiAssetPath("form-control/slider-handle.png"),
    appearance: "none",
    cursor: "pointer",
    display: "block",
    height: 33,
    marginLeft: "-0.5rem",
    marginTop: -8,
    outline: "none",
    position: "absolute",
    top: "50%",
    transition: "transform 0.3s ease-out, box-shadow 0.3s ease-out",
    width: 25,
    zIndex: 2,
    "&:active": {
      transform: "scale(1.1)",
    },
    "&:focus": {
      boxShadow: "0 0 0 5px rgba(63, 81, 181, 0.2)",
    },
  },
  inputRangeDisabled: {
    $inputRangeSlider: {
      background: "#cccccc",
      border: "1px solid #cccccc",
      boxShadow: "none",
      transform: "none",
    },
    $inputRangeTrack: {
      background: "#eeeeee",
    },
  },
  inputRangeSliderContainer: {
    top: 0,
    transition: "left 0.3s ease-out",
  },
  inputRangeLabel: {
    color: "#aaaaaa",
    fontFamily: '"Helvetica Neue", san-serif',
    fontSize: "0.8rem",
    transform: "translateZ(0)",
    whiteSpace: "nowrap",
  },
  inputRangeLabelMin: {
    bottom: "-1.4rem",
    position: "absolute",
    left: "0",
  },
  inputRangeLabelMax: {
    bottom: "-1.4rem",
    position: "absolute",
    right: "0",
    $inputRangeLabelContainer: {
      left: "50%",
    },
  },
  inputRangeLabelValue: {
    position: "absolute",
    top: "-1.9rem",
  },
  inputRangeLabelContainer: {
    left: "-28%",
    position: "relative",
  },
  inputRangeTrack: {
    backgroundImage: guiAssetPath("form-control/slider-bg.png"),
    cursor: "pointer",
    display: "block",
    height: 19,
    position: "relative",
    transition: "left 0.3s ease-out, width 0.3s ease-out",
  },
  inputRangeTrackBackground: {
    left: "0",
    marginTop: "-0.15rem",
    position: "absolute",
    right: "0",
    top: "50%",
  },
  inputRangeTrackActive: {
    backgroundImage: guiAssetPath("form-control/slider-filled.png"),
    backgroundSize: "cover",
    transition: "width 0.3s ease-out",
    position: "absolute",
    height: 5,
    top: 7,
  },
  inputRange: {
    height: "1rem",
    position: "relative",
    padding: "0 15px",
    width: "100%",
    boxSizing: "border-box",
    "&:before": {
      backgroundImage: guiAssetPath("form-control/slider-sides.png"),
      content: '""',
      position: "absolute",
      height: 19,
      width: 15,
      top: 0,
      zIndex: 1,
      left: 0,
    },
    "&:after": {
      backgroundImage: guiAssetPath("form-control/slider-sides.png"),
      position: "absolute",
      content: '""',
      right: 0,
      top: 0,
      height: 19,
      width: 15,
      backgroundPosition: "right center",
    },
  },
});

type Props = {
  value: number;
  onChange: (value: number | Range) => void;
};

export default (props: Props) => {
  const classes = useStyles();
  const [value, setValue] = useState<number | Range>(props.value);
  return (
    <div className={classes.root}>
      <RangeSlider
        value={value}
        minValue={0}
        maxValue={100}
        step={1}
        // TODO: Use JSS classes for "react-input-range/lib/css/index.css"
        classNames={{
          activeTrack: classes.inputRangeTrackActive,
          disabledInputRange: classes.inputRangeDisabled,
          inputRange: classes.inputRange,
          labelContainer: classes.inputRangeLabelContainer,
          maxLabel: classes.inputRangeLabelMax,
          minLabel: classes.inputRangeLabelMin,
          slider: classes.inputRangeSlider,
          sliderContainer: classes.inputRangeSliderContainer,
          track: classes.inputRangeTrack,
          valueLabel: classes.inputRangeLabelValue,
        }}
        onChange={(newValue) => {
          setValue(newValue);
          props.onChange(newValue);
        }}
      />
    </div>
  );
};
