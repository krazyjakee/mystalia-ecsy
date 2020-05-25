import EnemyState from "@server/components/enemy";
import { Size } from "./TileMap/standard";

type EnemyBehaviourProperty = {
  chance: number;
  distance: number;
};

type ScheduledWorldLocation = {
  mapName: string;
  tileId: number;
  departureTime: number;
};

type EnemyBehaviour = {
  skeptical?: EnemyBehaviourProperty;
  escape?: EnemyBehaviourProperty;
  attack?: EnemyBehaviourProperty;
  static?: {
    lookAround: boolean;
    lookAtPlayer: boolean;
    distance?: number; // Distance of player before looking at them
  };
  patrol?: {
    standTime: [number, number]; // Random time in ms to stand on a defined tile.
    lookAtPlayer: boolean;
    distance?: number;
  };
  biomeWanderer?: {
    campAtNight: boolean;
  };
  traveler?: {
    campAtNight: boolean;
  };
  scheduled?: {
    campAtNight: boolean;
    schedule: ScheduledWorldLocation[];
  };
};

type EnemyBehaviourNames = keyof EnemyBehaviour;

type EnemyDrop = {
  itemId: number;
  quantity: [number, number];
  chance: number;
};

export type EnemySpec = {
  id: number;
  name: string;
  portrait: string;
  spritesheet: string;
  spriteId: number;
  behavior: EnemyBehaviour;
  speed: number;
  maxDistance: number;
  hp: number;
  abilities: number[];
  spriteSize?: Size;
  drop?: EnemyDrop[];
  customName?: string;
  shopId?: number;
  personalityId?: number;
};

export type EnemyReference = {
  key?: string;
  enemySpec?: EnemySpec;
  enemyState?: EnemyState;
};
