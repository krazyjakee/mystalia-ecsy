import React from "react";
import {
  useGameEvent,
  useEnemyChangeEvent,
} from "@client/react/Hooks/useGameEvent";
import { useEffect, useState } from "react";
import { EnemySpec } from "types/enemies";
import { Status } from "../Status";
import { percentageCalculator } from "utilities/math";
import gameState from "@client/gameState";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  root: {
    left: 342,
    top: 15,
  },
});

export const TargetedEnemyStatus = () => {
  const classes = useStyles();
  const [targetData, setTargetData] = useState<
    | {
        hp: number;
        mp: number;
        spec: EnemySpec;
      }
    | undefined
  >();
  const [enemyReference] = useGameEvent(
    "localPlayer:battle:targetEnemy",
    "reactstatus"
  );

  // TODO: This hook shouldnt be used. enemyReference should be updated by the enemy change event in useEffect
  const [enemyChangeReference] = useEnemyChangeEvent(
    enemyReference?.key,
    "targetedEnemy"
  );

  useEffect(() => {
    const reference = enemyReference || enemyChangeReference;
    if (reference && reference.enemySpec && reference.enemyState) {
      setTargetData({
        hp:
          100 -
          percentageCalculator(
            reference.enemySpec.hp,
            reference.enemyState.damage
          ),
        mp: 100,
        spec: reference.enemySpec,
      });
    } else {
      setTargetData(undefined);
    }

    gameState.subscribe("localPlayer:battle:unTarget", () => {
      setTargetData(undefined);
    });
  }, [enemyReference, enemyChangeReference]);

  if (!targetData) return null;

  const { hp, mp, spec } = targetData;

  return (
    <Status
      className={classes.root}
      name={spec.name}
      portrait={spec.portrait}
      hp={hp}
      mp={mp}
    />
  );
};
