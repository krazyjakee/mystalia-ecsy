import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { guiAssetPath, spellAssetPath } from "../cssUtilities";
import { whiteText } from "../palette";
import { EnemyReference } from "types/enemies";
import gameState from "@client/gameState";
import abilitiesData from "utilities/data/abilities.json";
import { tileIdToPixels } from "utilities/tileMap";
import { AbilitySpec } from "types/types";
import { isPresent } from "utilities/guards";

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
  healthBar: {
    position: "absolute",
    backgroundImage: guiAssetPath("panel/enemy-status/healthbar-empty.png"),
    width: 124,
    height: 13,
    left: 79,
    top: 23,
  },
  healthBarInner: {
    backgroundImage: guiAssetPath("panel/enemy-status/healthbar.png"),
    width: 124,
    height: 13,
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
});

export const EnemyStatus = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const classes = useStyles();

  const [enemy, setEnemy] = useState<EnemyReference>({});
  const [mouseOver, setMouseOver] = useState(false);
  const { key } = enemy;

  const enemyUnHovered = (data: EnemyReference) => {
    if (!mouseOver || !data.key) {
      setEnemy({});
    }
  };

  useEffect(() => {
    const enemyUpdate = (data: EnemyReference) => {
      if (data.key === key) {
        setEnemy(data);
      }
    };

    const enemyHovered = (data: EnemyReference) => {
      setEnemy(data);
    };

    gameState.subscribe("enemy:change", enemyUpdate);
    gameState.subscribe("enemy:hovered", enemyHovered);
    gameState.subscribe("enemy:unhovered", enemyUnHovered);
    return () => {
      gameState.unsubscribe("enemy:change", enemyUpdate);
      gameState.unsubscribe("enemy:hovered", enemyHovered);
      gameState.unsubscribe("enemy:unhovered", enemyUnHovered);
    };
  }, [key, mouseOver]);

  if (!enemy.enemySpec) return null;
  const { name, abilities: specAbilities } = enemy.enemySpec;

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
    <div
      {...props}
      id="enemyStateComponent"
      className={classes.root}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => {
        setMouseOver(false);
        enemyUnHovered({});
      }}
    >
      <div className={classes.label}>{name}</div>
      <div className={classes.healthBar}>
        <div className={classes.healthBarInner}> </div>
      </div>
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
