import React, { useState, useEffect } from "react";

type Props = {
  keys: string | string[];
  show?: boolean;
  onShow?: VoidFunction;
  onHide?: VoidFunction;
} & React.HTMLAttributes<HTMLDivElement>;

export default (props: Props) => {
  const [show, setShow] = useState(props.show || false);

  const toggleShow = () => {
    setShow(!show);
    if (!show && props.onShow) {
      props.onShow();
    } else if (show && props.onHide) {
      props.onHide();
    }
  };

  const eventListener = (e: KeyboardEvent) => {
    e.preventDefault();
    if (!window.keyboardBusy && props.keys && props.keys.includes(e.code)) {
      toggleShow();
    }
  };

  useEffect(() => {
    document.addEventListener("keyup", eventListener, false);

    return () => {
      document.removeEventListener("keyup", eventListener);
    };
  }, [props.keys, show]);

  return show ? <>{props.children}</> : null;
};
