export type Weather =
  | "lightRain"
  | "heavyRain"
  | "thunder"
  | "windy"
  | "cloudy"
  | "snowy"
  | "foggy"
  | "dusty"
  | "northernLights";

export type Biome = "forest" | "desert" | "frozen" | "swamp" | "rocky";

export const biomeWeather: { [key in Biome]: Weather[] } = {
  forest: ["lightRain", "heavyRain", "thunder", "windy", "foggy", "cloudy"],
  desert: ["lightRain", "thunder", "windy", "cloudy", "dusty"],
  frozen: ["snowy", "windy", "northernLights", "foggy"],
  swamp: ["lightRain", "heavyRain", "foggy", "thunder", "cloudy"],
  rocky: ["heavyRain", "foggy", "thunder", "dusty", "cloudy", "windy"],
};

export const weatherChance: { [key in Weather]: number } = {
  lightRain: 10,
  heavyRain: 15,
  thunder: 25,
  windy: 20,
  cloudy: 20,
  snowy: 10,
  foggy: 25,
  dusty: 15,
  northernLights: 40,
};
