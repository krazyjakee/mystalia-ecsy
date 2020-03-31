import React, { useState } from "react";

import { TextInput as TextInputComponent } from "./TextInput";
import { Button as ButtonComponent } from "./Button";
import { TabButton as TabButtonComponent } from "./TabButton";
import SelectComponent from "./Select";

export default {
  title: "Form Controls"
};

export const TextInput = () => (
  <TextInputComponent placeholder="Placeholder Text" />
);

export const Button = () => <ButtonComponent value="Button Text" />;

export const TabButton = () => {
  const [active, setActive] = useState(0);
  return (
    <>
      <TabButtonComponent
        value="Tab Button 1 Text"
        active={active === 0}
        onClick={() => setActive(0)}
      />
      <br />
      <TabButtonComponent
        value="Tab Button 2 Text"
        active={active === 1}
        onClick={() => setActive(1)}
      />
      <br />
      <TabButtonComponent
        value="Tab Button 3 Text"
        active={active === 2}
        onClick={() => setActive(2)}
      />
    </>
  );
};

export const Select = () => {
  return <SelectComponent />;
};
