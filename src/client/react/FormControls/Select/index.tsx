import React from "react";
import Select, { Styles, Props } from "react-select";
import { guiAssetPath } from "../../cssUtilities";
import { whiteText } from "../../palette";
import CustomIndicator from "./CustomIndicator";

const backgroundColor = "rgba(56,56,56,0.8)";

const customStyles: Styles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "transparent",
    border: "none",
    boxShadow: "none",
    padding: "0 19px",
    alignItems: "baseline",
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      top: 0,
      width: 19,
      height: 37,
      backgroundImage: guiAssetPath("form-control/dropdown-side.png"),
    },
    "&:before": {
      left: 0,
    },
    "&:after": {
      right: 0,
      transform: "scaleX(-1)",
    },
    "&:hover": {
      border: "none",
      boxShadow: "none",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: 37,
    backgroundImage: guiAssetPath("form-control/dropdown-bg.png"),
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: 37,
    padding: "2px 0",
    backgroundImage: guiAssetPath("form-control/dropdown-bg.png"),
  }),
  singleValue: (provided) => ({
    ...provided,
    ...whiteText,
  }),
  input: (provided) => ({
    ...provided,
    fontSize: 11,
    ...whiteText,
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: 11,
    ...whiteText,
    opacity: 0.5,
  }),
  menu: (provided) => ({
    ...provided,
    border: "2px solid #383838",
    borderRadius: 5,
    backgroundColor,
    marginTop: 0,
  }),
  option: (provided, state) => ({
    ...provided,
    ...whiteText,
    backgroundColor: state.isFocused ? backgroundColor : "transparent",
  }),
};

export type SelectValue = { label: string; value: string };
interface SelectProps extends Omit<Props<{}>, "onChange"> {
  onChange: (e: SelectValue) => void;
}

export default (props: SelectProps) => {
  // TODO https://github.com/DefinitelyTyped/DefinitelyTyped/issues/32553
  const internalOnChange = (e: any) => {
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <Select
      {...props}
      onChange={internalOnChange}
      styles={customStyles}
      components={{
        DropdownIndicator: CustomIndicator,
        IndicatorSeparator: null,
      }}
    />
  );
};
