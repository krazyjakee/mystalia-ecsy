type EnemyBehaviourProperty = {
  chance: number;
  distance: number;
};

type EnemyBehaviourNames = "skeptical" | "escape" | "attack";

type EnemyBehaviour = {
  [key in EnemyBehaviourNames]: EnemyBehaviourProperty;
};

type EnemySpec = {
  id: number;
  name: string;
  spritesheet: string;
  spriteId: number;
  behavior: EnemyBehaviour;
  speed: number;
  maxDistance: number;
};
