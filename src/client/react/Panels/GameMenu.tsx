import React from "react";
import { BasePanel } from "./BasePanel";
import { Button } from "../FormControls/Button";
import Hotkey from "../Utilities/Hotkey";
import { triggerGlobalKeypress } from "utilities/input";
import client from "@client/colyseus";

type Props = {
  forceEnable?: boolean;
  logout: Function;
};

export default (props: Props) => {
  const close = () => {
    triggerGlobalKeypress("Escape");
  };

  const openOptions = () => {
    close();
    triggerGlobalKeypress("T");
  };

  const logout = () => {
    window.ecsyError = true;
    location.reload();
  };

  return (
    <Hotkey
      keys={["Escape"]}
      show={props.forceEnable}
      onShow={() => (window.disableMovement = true)}
      onHide={() => (window.disableMovement = false)}
    >
      <BasePanel
        title="Menu"
        style={{ width: 200, height: 200, margin: "75px auto" }}
        onCloseClick={() => close()}
      >
        <Button value="Resume" onClick={() => close()} />
        <br />
        <Button value="Options" onClick={() => openOptions()} />
        <br />
        <Button value="Log Out" onClick={() => logout()} />
      </BasePanel>
    </Hotkey>
  );
};
