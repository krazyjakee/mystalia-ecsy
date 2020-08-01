import memoize from "./memoize";

export const hexToRgb = memoize((hex: string, opacity: number) => {
  var hasHashReg = /^#/
  var regexToCheckInput = /^#([0-9A-F]{3}){1,2}$/i

  if (!hasHashReg.test(hex)) {
    hex = '#'+hex
  }
  if (hex.length > 7) {
    hex = hex.substring(0, hex.length - (hex.length - 7))
  }
  if (regexToCheckInput.test(hex)) { //is a valid hex value
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
  }
  return `rgba(255,255,255,${opacity})`;
});

export const hexToRgbObj = memoize((hex: string, opacity: number = 1) : { r: number; g: number; b: number; a?: number; } => {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {'r': parseInt(result[1], 16),'g': parseInt(result[2], 16),'b': parseInt(result[3], 16), 'a': opacity}
    : {'r': 255,'g': 255,'b': 255, 'a': opacity};
});

export const hexToHslObj = memoize((hex: string) : { h: number; s: number; l: number; } => {
  var rgbObj = hexToRgbObj(hex);
  var r = rgbObj.r
  var g = rgbObj.g
  var b = rgbObj.b

  r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
});

export const hslObjToRgbObj = memoize((hsl: { h: number; s: number; l: number; }) : { r: number; g: number; b: number; } => {
  var r, g, b;
  var h = hsl.h / 360
  var s = hsl.s / 100
  var l = hsl.l / 100

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
});
