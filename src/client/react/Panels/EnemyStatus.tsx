import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { guiAssetPath, spellAssetPath, portraitPath } from "../cssUtilities";
import { whiteText } from "../palette";
import { EnemyReference, EnemySpec } from "types/enemies";
import gameState from "@client/gameState";
import abilitiesData from "utilities/data/abilities.json";
import { tileIdToPixels } from "utilities/tileMap";
import { AbilitySpec } from "types/types";
import { isPresent } from "utilities/guards";
import HealthBar from "./HealthBar";
import { percentageCalculator } from "utilities/math";

const useStyles = createUseStyles({
  root: {
    position: "absolute",
    backgroundImage: guiAssetPath("panel/enemy-status/bg.png"),
    width: 232,
    height: 80,
  },
  label: {
    position: "absolute",
    left: 70,
    top: -2,
    fontSize: 11,
    ...whiteText,
  },
  abilities: {
    position: "absolute",
    top: 42,
    left: 76,
  },
  ability: {
    float: "left",
    width: 25,
    height: 25,
  },
  blankAbility: {
    position: "absolute",
    width: 25,
    height: 25,
    backgroundImage: guiAssetPath("panel/enemy-status/ability.png"),
    pointerEvents: "none",
  },
  abilitySprite: {
    margin: 2,
    width: 21,
    height: 21,
  },
  portrait: {
    position: "absolute",
    left: 10,
    top: 8,
  },
  portraitImage: {
    position: "absolute",
    left: 2,
    top: 2,
    backgroundSize: "55px 55px",
    width: 55,
    height: 55,
    borderRadius: "50%",
  },
  portraitGlare: {
    position: "absolute",
    width: 59,
    height: 59,
    backgroundImage: guiAssetPath("panel/enemy-status/portrait.png"),
  },
});

type Props = {
  enemy?: EnemyReference;
} & React.HTMLAttributes<HTMLDivElement>;

export const EnemyStatus = (props: Props) => {
  const classes = useStyles();

  const [enemy, setEnemy] = useState<EnemyReference>(props.enemy || {});
  const { key } = enemy;

  useEffect(() => {
    const enemyUnFocused = () => {
      setEnemy({});
    };

    const enemyUpdate = (data: EnemyReference) => {
      if (data.key === key) {
        setEnemy(data);
      }
    };

    const enemyFocused = (data: EnemyReference) => {
      setEnemy(data);
    };

    gameState.subscribe("enemy:change", enemyUpdate);
    gameState.subscribe("enemy:focused", enemyFocused);
    gameState.subscribe("enemy:unfocused", enemyUnFocused);
    gameState.subscribe("localPlayer:battle:unTarget", enemyUnFocused);
    return () => {
      gameState.unsubscribe("enemy:change", enemyUpdate);
      gameState.unsubscribe("enemy:focused", enemyFocused);
      gameState.unsubscribe("enemy:unfocused", enemyUnFocused);
      gameState.unsubscribe("localPlayer:battle:unTarget", enemyUnFocused);
    };
  }, [key]);

  if (!enemy.enemySpec) return null;
  const { name, portrait, abilities: specAbilities = [] } = enemy.enemySpec;

  const abilities: AbilitySpec[] = specAbilities
    .map((specAbility) =>
      (abilitiesData as AbilitySpec[]).find((a) => a.id === specAbility)
    )
    .filter(isPresent);

  const blankAbilities = new Array(5).fill(0);

  const renderAbilitySprite = (ability?: AbilitySpec) => {
    if (ability) {
      const { spriteId } = ability;
      const vector = tileIdToPixels(spriteId, 15, 21);
      const style = {
        backgroundImage: spellAssetPath("spells.png"),
        backgroundPosition: `-${vector.x}px -${vector.y}px`,
        backgroundSize: `${1920 / 6.1}px ${1408 / 6.1}px`,
      };
      return (
        <div
          className={classes.abilitySprite}
          style={style}
          title={ability.name}
        ></div>
      );
    }
    return null;
  };

  return (
    <div {...props} id="enemyStateComponent" className={classes.root}>
      <div className={classes.label}>{name}</div>
      <div className={classes.portrait}>
        <div
          className={classes.portraitImage}
          style={{ backgroundImage: portraitPath(portrait) }}
        />
        <div className={classes.portraitGlare} />
      </div>
      <HealthBar
        width={124}
        top={23}
        left={79}
        percentage={
          100 -
          percentageCalculator(
            enemy.enemySpec.hp,
            enemy.enemyState?.damage || 0
          )
        }
      />
      <div className={classes.abilities}>
        {blankAbilities.map((_, index) => (
          <div className={classes.ability} key={index}>
            <div className={classes.blankAbility}></div>
            {renderAbilitySprite(abilities[index])}
          </div>
        ))}
      </div>
    </div>
  );
};
