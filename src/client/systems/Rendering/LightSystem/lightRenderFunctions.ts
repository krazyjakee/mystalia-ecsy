const hexToRgb = (hex: string, opacity: number) => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgba(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(
        result[3],
        16
      )},${opacity})`
    : `rgba(255,255,255,${opacity})`;
};

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
    intensity = 80
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
