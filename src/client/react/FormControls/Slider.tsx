import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import RangeSlider, { Range } from "react-input-range";
import "react-input-range/lib/css/index.css"; // TODO: Replace this styling
import { guiAssetPath } from "../cssUtilities";

// TODO: Create JSS classes for "react-input-range/lib/css/index.css"
const useStyles = createUseStyles({
  root: {
    height: 20,
  },
  slider: {
    backgroundImage: guiAssetPath("form-control/slider-handle.png"),
    width: 25,
    height: 33,
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
          activeTrack: "",
          disabledInputRange: "",
          inputRange: "",
          labelContainer: "",
          maxLabel: "",
          minLabel: "",
          slider: classes.slider,
          sliderContainer: "",
          track: "",
          valueLabel: "",
        }}
        onChange={(newValue) => {
          setValue(newValue);
          props.onChange(newValue);
        }}
      />
    </div>
  );
};
