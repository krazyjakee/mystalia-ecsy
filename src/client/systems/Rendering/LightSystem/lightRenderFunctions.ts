import config from "../../../config.json";
import { timeOfDayAsPercentage } from "@client/utilities/time";
import { hexToRgb, hexToHslObj, hslObjToRgbObj } from "utilities/color";
import { clampNumber } from "utilities/math";
import gameState from "@client/gameState";

type LightSourceOptions = {
  radius?: number | undefined;
  pulse?: boolean;
  color?: string;
  intensity?: number | undefined;
};

let adminIntensity
let adminRadius

gameState.subscribe("admin:globalLightSpec:update", (value) => {
  if (Number.isNaN(Number(value.radius))) {
    adminRadius = null || Number(value.radius)
  } 
  if (Number.isNaN(Number(value.intensity))) {
    adminIntensity = null || Number(value.intensity)
  }
});

// takes a base gradient stop point (between 0-1) that is altered depending on light intensity
export const dynamicStopPoint = (baseStop: number, intensity: number) => {
  baseStop = clampNumber(baseStop,0,1)
  return clampNumber((clampNumber(intensity, 1, 100)*baseStop) /100 * ((100 - (calculateBrightness()))/100),0,1)
}

// takes an rgb obj and returns an rgba string depending on light intensity
export const constructRGBAstring = (color: {r: number,g: number,b: number}, intensity: number, alpha: number = 1) => { 
  alpha = clampNumber(alpha,0,1)

  const dynamicAlpha = () => {
    // nested due to limited usage
    // takes a base alpha level (between 0-1) that is altered depending on light intensity
    return clampNumber( ( (alpha - (alpha / intensity)) * ((100 - (calculateBrightness()/2))/100) ),0,1)
  }

  return "rgba("+color.r+","+color.g+","+color.b+"," + dynamicAlpha() + ")";
}

// takes a base hex string and alters the HSL as required
export const dynamicColor = (
  baseHexColor: string, 
  props?: {
    h?: number, 
    s?: number, 
    l?: number
  },
  math?: {
    h?: string, 
    s?: string, 
    l?: string
  }) => {
  const result = hexToHslObj(baseHexColor)
  for (const i in result) {
    let max = 100
    if (i === "h") {
      max = 360
    }
    if (!props || !math) {
      break
    }
    if (!props[i] || (props[i] === 0 && math[i] !== "=") || math[i] === "") {
      continue
    } else if (math[i] === "+") {
      result[i] = clampNumber(result[i] + props[i],0,max)
    } else if (math[i] === "-") {
      result[i] = clampNumber(result[i] - props[i],0,max)
    } else if (math[i] === "*") {
      result[i] = clampNumber(result[i] * props[i],0,max)
    } else if (math[i] === "/") {
      result[i] = clampNumber(result[i] / props[i],0,max)
    } else if (math[i] === "=") {
      result[i] = clampNumber(props[i],0,max)
    }   
  }
  return hslObjToRgbObj(result)
}

export const drawLightSource = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  {
    radius = 6,
    pulse = true, // true
    color = "#ffbd54",
    intensity = 40,
  }: LightSourceOptions
) => {

  // overide with admin defaults for debugging
  if (adminRadius) {
    radius = adminRadius
  }
  if (adminIntensity) {
    intensity = adminIntensity
  }

  radius = radius * 32;

  if (pulse) {
    const rnd = 0.05 * Math.sin((1.1 *  Date.now()) / 1000 );
    radius = (radius * (1 + rnd) );
  }

  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);

  // this is a color manipulation profile that adjusts the HSL of the base color for each stop in a gradient
  const defaultColorProfile = [
    {stop: 0, color: dynamicColor(color, {h:0,s:2,l:80}, {h:"",s:"*",l:"="}), alpha: 0.9},
    {stop: 0.25, color: dynamicColor(color, {h:0,s:0,l:0}, {h:"",s:"",l:""}), alpha: 0.9},
    {stop: 0.55, color: dynamicColor(color, {h:12,s:0.8,l:1.2}, {h:"-",s:"*",l:"/"}), alpha: 0.65},
    {stop: 0.95, color: dynamicColor(color, {h:30,s:0.4,l:1.5}, {h:"-",s:"*",l:"/"}), alpha: 0.5},
    {stop: 1, color: dynamicColor(color, {h:0,s:0,l:2}, {h:"=",s:"=",l:"="}), alpha: 0}
  ]

  // build gradient...
  gradient.addColorStop(defaultColorProfile[0].stop, constructRGBAstring(defaultColorProfile[0].color, intensity, defaultColorProfile[0].alpha))
  gradient.addColorStop(dynamicStopPoint(defaultColorProfile[1].stop, intensity), constructRGBAstring(defaultColorProfile[1].color, intensity, defaultColorProfile[1].alpha))
  gradient.addColorStop(dynamicStopPoint(defaultColorProfile[2].stop, intensity), constructRGBAstring(defaultColorProfile[2].color, intensity, defaultColorProfile[2].alpha))
  gradient.addColorStop(dynamicStopPoint(defaultColorProfile[3].stop, intensity), constructRGBAstring(defaultColorProfile[3].color, intensity, defaultColorProfile[3].alpha))
  gradient.addColorStop(defaultColorProfile[4].stop, constructRGBAstring(defaultColorProfile[4].color, intensity, defaultColorProfile[4].alpha));

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = gradient;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  ctx.restore();
};


let { dayLightPercentage, transitionTime } = config.time;

gameState.subscribe("admin:timePhase:update", (value) => {
    dayLightPercentage = !Number.isNaN(Number(value.dayLengthPerc)) ? Number(value.dayLengthPerc) : dayLightPercentage;
    transitionTime = !Number.isNaN(Number(value.transitionPerc)) ? Number(value.transitionPerc) : transitionTime;
});

export const calculateBrightness = () => {
  let brightness = 0;

  const baseMath = (50 * ((50 - dayLightPercentage) / 100))
 
  // clamps used to prevent bugs in cases where the transition time is set to be longer than the day/night available and viceversa. 
  const dayMath = clampNumber( baseMath + (transitionTime/2), 49, 3)
  const nightMath = clampNumber( (baseMath - (transitionTime/2)) * -1, 49, 3) // inversion
  const dayPercentage = timeOfDayAsPercentage();
  
  if (dayPercentage < dayLightPercentage) {
    const phaseProgress = (100 / dayLightPercentage) * dayPercentage;

    const transitionPoint1 = dayMath
    const transitionPoint2 = 100 - dayMath

    if (phaseProgress < transitionPoint1) {
      brightness = 50 + (((100 / transitionPoint1)/2) * phaseProgress);
    } else if (phaseProgress > transitionPoint2) {
      brightness = 100 - ( ( 100 / (100 - transitionPoint2) ) * (( phaseProgress - transitionPoint2 )/2));
    } else {
      brightness = 100;
    }
    
  } else {
    const phaseProgress = 100 - (100 / (100 - dayLightPercentage)) * (100 - dayPercentage);
    
    const transitionPoint1 = nightMath
    const transitionPoint2 = 100 - nightMath

    if (phaseProgress < transitionPoint1) {
      brightness = 50 - (((100 / transitionPoint1)/2) * phaseProgress);
    } else if (phaseProgress > transitionPoint2) {
      brightness = 0 + ( ( 100 / (100 - transitionPoint2) ) * (( phaseProgress - transitionPoint2 )/2));
    } else {
      brightness = 0;
    }
  }

  return brightness;
};
