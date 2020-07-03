import React, { useState } from "react";
import { SubSection } from "../SubSection";
import Slider from "@client/react/FormControls/Slider";
import { Label } from "@client/react/FormControls/Label";
import { Range } from "react-input-range";
import Storage from "@client/utilities/storage";

type Props = {
  show: boolean;
};

export default ({ show = false }: Props) => {
  const storedMusicVolume = Storage.get("musicVolume");
  const storedSfxVolume = Storage.get("sfxVolume");

  const [musicVolume, setMusicVolume] = useState<number | Range>(
    storedMusicVolume ? parseInt(storedMusicVolume) : 80
  );
  const [sfxVolume, setSfxVolume] = useState<number | Range>(
    storedSfxVolume ? parseInt(storedSfxVolume) : 80
  );

  const saveMusicVolume = (value) => {
    Storage.set("musicVolume", value);
    setMusicVolume(value);
  };
  const saveSfxVolume = (value) => {
    Storage.set("sfxVolume", value);
    setSfxVolume(value);
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
