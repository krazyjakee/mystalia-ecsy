import EnemyState from "@server/components/enemy";

type EnemyBehaviourProperty = {
  chance: number;
  distance: number;
};

type EnemyBehaviour = {
  skeptical?: EnemyBehaviourProperty;
  escape?: EnemyBehaviourProperty;
  attack?: EnemyBehaviourProperty;
};

type EnemyBehaviourNames = keyof EnemyBehaviour;

export type EnemySpec = {
  id: number;
  name: string;
  spritesheet: string;
  spriteId: number;
  behavior: EnemyBehaviour;
  speed: number;
  maxDistance: number;
  hp: number;
  abilities: number[];
};

export type EnemyReference = {
  key?: string;
  enemySpec?: EnemySpec;
  enemyState?: EnemyState;
};
