import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { GameStateEvents } from "types/gameState";

const useStyles = createUseStyles({
  root: {
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 10,
    height: 80,
  },
});

type Props = {
  stream?: GameStateEvents["chat:subscribe"];
  hide?: boolean;
};

export default ({ stream, hide = false }: Props) => {
  if (hide) return null;

  const classes = useStyles();
  const [messages, setMessages] = useState<GameStateEvents["chat:subscribe"][]>(
    []
  );
  const addMessage = () => {
    if (stream) {
      setMessages(messages.concat([stream]));
    }
  };

  useEffect(() => {
    addMessage();
  }, [stream]);

  return (
    <div className={classes.root}>
      {messages.map((message) => {
        return (
          <p>
            <strong>{message.username}: </strong>
            {message.message}
          </p>
        );
      })}
    </div>
  );
};
