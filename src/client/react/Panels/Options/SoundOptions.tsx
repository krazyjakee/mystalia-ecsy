import React, { useState } from "react";
import { SubSection } from "../SubSection";
import Slider from "@client/react/FormControls/Slider";
import { Label } from "@client/react/FormControls/Label";
import { Range } from "react-input-range";
import {
  getMusicVolume,
  getSoundVolume,
  setMusicVolume,
  setSoundVolume,
} from "@client/sound";

type Props = {
  show: boolean;
};

export default ({ show = false }: Props) => {
  const [musicVolume, setMusicSliderVolume] = useState<number | Range>(
    getMusicVolume() * 100
  );
  const [sfxVolume, setSfxSliderVolume] = useState<number | Range>(
    getSoundVolume() * 100
  );

  const saveMusicVolume = (value) => {
    setMusicSliderVolume(value);
    setMusicVolume(value / 100);
  };
  const saveSfxVolume = (value) => {
    setSfxSliderVolume(value);
    setSoundVolume(value / 100);
  };

  return show ? (
    <SubSection label="Sound Options">
      <Label>Music Volume:</Label>
      <Slider
        value={musicVolume}
        onChange={(value) => saveMusicVolume(value)}
      />
      <br />
      <Label>Sound Effects Volume:</Label>
      <Slider value={sfxVolume} onChange={(value) => saveSfxVolume(value)} />
    </SubSection>
  ) : null;
};
