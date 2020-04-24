export type AbilitySpec = {
  id: number;
  name: string;
  spritesheet: string;
  spriteId: number;
  type: AbilityType;
  damage: number[];
  energy: number;
};

export type AbilityType = "physical";
