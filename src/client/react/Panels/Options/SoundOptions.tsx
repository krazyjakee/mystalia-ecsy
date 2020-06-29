import React, { useState } from "react";
import { SubSection } from "../SubSection";
import Slider from "@client/react/FormControls/Slider";
import { Label } from "@client/react/FormControls/Label";

type Props = {
  show: boolean;
};

export default ({ show = false }: Props) => {
  const [musicVolume, setMusicVolume] = useState(100);

  return show ? (
    <SubSection label="Sound Options">
      <Label>Music Volume:</Label>
      {/* <Slider value={musicVolume} onChange={(value) => setMusicVolume(value)} /> */}
    </SubSection>
  ) : null;
};
