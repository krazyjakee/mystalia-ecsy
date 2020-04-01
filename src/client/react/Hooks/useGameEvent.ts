import { useState, useEffect } from "react";
import gameState from "../../gameState";
import { GameStateEvents, GameStateEventName } from "types/gameState";

export const useGameEvent = <T extends GameStateEventName>(
  eventName: T
): [
  GameStateEvents[T] | undefined,
  React.Dispatch<React.SetStateAction<GameStateEvents[T] | undefined>>
] => {
  const [data, setData] = useState<GameStateEvents[T]>();
  useEffect(() => {
    gameState.subscribe(eventName, data => {
      console.log("received", eventName, data);
      setData(data);
    });
  }, []);
  return [data, setData];
};
