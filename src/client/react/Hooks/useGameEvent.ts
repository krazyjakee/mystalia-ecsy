import { useState, useEffect } from "react";
import gameState from "../../gameState";
import { GameStateEvents, RoomMessageType } from "types/gameState";

export const useGameEvent = <T extends RoomMessageType>(
  eventName: T,
  key = ""
): [
  GameStateEvents[T] | undefined,
  React.Dispatch<React.SetStateAction<GameStateEvents[T] | undefined>>
] => {
  const [data, setData] = useState<GameStateEvents[T]>();
  useEffect(() => {
    gameState.subscribe(
      eventName,
      (data) => {
        setData(data);
      },
      key
    );
  }, [eventName, key]);
  return [data, setData];
};

// TODO: Delete this
export const useEnemyChangeEvent = (
  enemyStateKey?: string,
  key?: string
): [
  GameStateEvents["enemy:change"] | undefined,
  React.Dispatch<
    React.SetStateAction<GameStateEvents["enemy:change"] | undefined>
  >
] => {
  const [data, setData] = useState<GameStateEvents["enemy:change"]>();
  useEffect(() => {
    const doSetData = (data) => {
      if (data.key === enemyStateKey) {
        setData(data);
      }
    };

    gameState.subscribe("enemy:change", doSetData, key);
    return () => {
      gameState.unsubscribe("enemy:change", doSetData, key);
    };
  }, [enemyStateKey]);
  return [data, setData];
};
