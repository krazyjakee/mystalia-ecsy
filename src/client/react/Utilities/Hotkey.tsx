import React, { useState, useEffect } from "react";

type Props = {
  keys: string | string[];
  show?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default (props: Props) => {
  const [show, setShow] = useState(props.show || false);

  const toggleShow = () => {
    setShow(!show);
  };

  const eventListener = (e: KeyboardEvent) => {
    e.preventDefault();
    if (props.keys && props.keys.includes(e.code)) {
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
