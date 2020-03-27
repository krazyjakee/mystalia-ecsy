import React from "react";

import { TextInput as TextInputComponent } from "./TextInput";
import { Button as ButtonComponent } from "./Button";

export default {
  title: "Form Controls"
};

export const TextInput = () => (
  <TextInputComponent placeholder="Placeholder Text" />
);

export const Button = () => <ButtonComponent value="Button Text" />;
