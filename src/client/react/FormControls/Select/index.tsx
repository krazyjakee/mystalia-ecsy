import React from "react";
import Select, { Styles, Props } from "react-select";
import { guiAssetPath } from "../../cssUtilities";
import { createUseStyles } from "react-jss";
import { whiteText } from "../../palette";
import CustomIndicator from "./CustomIndicator";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" }
];

const customStyles: Styles = {
  control: provided => ({
    ...provided,
    backgroundColor: "transparent",
    border: "none",
    boxShadow: "none",
    padding: "0 19px",
    alignItems: "baseline",
    "&:before, &:after": {
      zIndex: 1,
      content: '""',
      position: "absolute",
      top: 0,
      width: 19,
      height: 37,
      backgroundImage: guiAssetPath("form-control/dropdown-side.png")
    },
    "&:before": {
      left: 0
    },
    "&:after": {
      right: 0,
      transform: "scaleX(-1)"
    },
    "&:hover": {
      border: "none",
      boxShadow: "none"
    }
  }),
  valueContainer: provided => ({
    ...provided,
    height: 37,
    backgroundImage: guiAssetPath("form-control/dropdown-bg.png")
  }),
  indicatorsContainer: provided => ({
    ...provided,
    height: 37,
    padding: "2px 0",
    backgroundImage: guiAssetPath("form-control/dropdown-bg.png")
  }),
  singleValue: provided => ({
    ...provided,
    ...whiteText
  }),
  input: provided => ({
    ...provided,
    ...whiteText
  }),
  menu: provided => ({
    ...provided,
    border: "2px solid #383838",
    borderRadius: 5,
    backgroundColor: "rgba(56,56,56,0.8)",
    marginTop: 0
  }),
  option: (provided, state) => ({
    ...provided,
    ...whiteText,
    backgroundColor: state.isFocused ? "#383838" : "transparent"
  })
};

export default (props: Props<{}>) => {
  return (
    <Select
      {...props}
      styles={customStyles}
      components={{
        DropdownIndicator: CustomIndicator,
        IndicatorSeparator: null
      }}
    />
  );
};
