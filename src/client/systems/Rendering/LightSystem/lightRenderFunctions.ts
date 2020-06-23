import config from "../../../config.json";
import { timeOfDayAsPercentage } from "../../../utilities/time";
import { hexToRgb } from "utilities/color";

type LightSourceOptions = {
  radius?: number;
  pulse?: boolean;
  color?: string;
  intensity?: number;
};

export const drawLightSource = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  {
    radius = 4,
    pulse = true,
    color = "#e5ae0b",
    intensity = 80,
  }: LightSourceOptions
) => {
  radius = radius * 32;

  if (pulse) {
    const rnd = 0.05 * Math.sin((1.1 * Date.now()) / 1000);
    radius = radius * (1 + rnd);
  }

  var gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);

  gradient.addColorStop(0, hexToRgb(color, intensity / 100));
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  ctx.save();
  ctx.fillStyle = gradient;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  ctx.restore();
};

const { dayLightPercentage } = config;

export const calculateBrightness = () => {
  let brightness = 0;

  const dayPercentage = timeOfDayAsPercentage();

  if (dayPercentage < dayLightPercentage) {
    const phaseProgress = (100 / dayLightPercentage) * dayPercentage;
    if (phaseProgress < 40) {
      brightness = 80 + phaseProgress;
    } else if (phaseProgress > 60) {
      brightness = 100 - (phaseProgress - 60);
    } else {
      brightness = 100;
    }
  } else {
    const phaseProgress =
      100 - (100 / (100 - dayLightPercentage)) * (100 - dayPercentage);
    if (phaseProgress < 40) {
      brightness = 60 - phaseProgress * 2;
    } else if (phaseProgress > 60) {
      brightness = (phaseProgress - 60) * 2;
    } else {
      brightness = 0;
    }
  }
  return brightness;
};
