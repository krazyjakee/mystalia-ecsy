//import MapRoom from "@server/rooms/map";
import config from "../../../config.json";
import { timeOfDayAsPercentage } from "../../../utilities/time";
import { hexToRgb, hexToHslObj, hslObjToRgbObj } from "utilities/color";
import gameState from "@client/gameState";

type LightSourceOptions = {
  radius?: number;
  pulse?: boolean;
  cone?: boolean;
  color?: string;
  intensity?: number;
};

let adminIntensity
let adminRadius

gameState.subscribe("admin:globalLightSpec:update", (value) => {
  
  if (!Number.isNaN(parseInt(value.radius))) {
    adminRadius = parseInt(value.radius)
  } else {
    adminRadius = null
  }
  if (!Number.isNaN(parseInt(value.intensity))) {
    adminIntensity = parseInt(value.intensity)
  } else {
    adminIntensity = null
  }
});

export const drawLightSource = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  {
    radius = 4,
    pulse = true, //true
    cone = false,
    color = "#ffbd54",
    intensity = 50,
  }: LightSourceOptions
) => {

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

  var gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);

  var stopOrigintransform = hexToHslObj(color)
      stopOrigintransform.h = Math.max(0, stopOrigintransform.h)
      stopOrigintransform.s = Math.min(100, stopOrigintransform.s * 2)
      stopOrigintransform.l = clamp(( intensity*1.7 ), 80, 100)

  var stopOriginRgb = hslObjToRgbObj(stopOrigintransform);

  var stop1transform = hexToHslObj(color)
      stop1transform.h = Math.max(0, stop1transform.h - 18)
      stop1transform.s = Math.max(0, stop1transform.s - 52)
      stop1transform.l = Math.max(0, stop1transform.l - 13)

  var stop1Rgb = hslObjToRgbObj(stop1transform);

  var stop2transform = hexToHslObj(color)
      stop2transform.h = Math.max(0, stop2transform.h - 30);
      stop2transform.s = clamp((stop2transform.s - 35), 0, 25);
      stop2transform.l = Math.max(0, stop2transform.l / 2);
 
  var stop2Rgb = hslObjToRgbObj(stop2transform)

  function clamp (num: number, min: number, max: number) {
    return Math.min(Math.max(num, min), max)
  }

  function gradientStop(baseStop: number) {
    return clamp((clamp(intensity,1,100)*baseStop) /100 * ((100 - (calculateBrightness()))/100),0,1)
  }

  function gradientAlpha(baseStop: number) {
    return clamp( ( (baseStop - (baseStop / intensity)) * ((100 - (calculateBrightness()/2))/100) ),0,1)
  }

  gradient.addColorStop(0, "rgba("+stopOriginRgb.r+","+stopOriginRgb.g+","+stopOriginRgb.b+","+gradientAlpha(0.8) + ")"); // always maximum opacity, base light tone
  gradient.addColorStop(gradientStop(0.35), hexToRgb(color, gradientAlpha(0.7) ) ); // always maximum opacity
  gradient.addColorStop(gradientStop(0.55), "rgba("+stop1Rgb.r+","+stop1Rgb.g+","+stop1Rgb.b+"," + gradientAlpha(0.6) + ")");
  gradient.addColorStop(gradientStop(0.95), "rgba("+stop2Rgb.r+","+stop2Rgb.g+","+stop2Rgb.b+"," + gradientAlpha(0.4) + ")");
  gradient.addColorStop(1, "rgba(8,8,8,0)");


  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = gradient;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  ctx.restore();

};

// dayLightPercentage default = 66.66   || this is equal to summer solstice day length, winter is 33.33
// transitionTime default = 8           || this is equal to sundown->sunset taking 1hr
let { dayLightPercentage, transitionTime } = config;

gameState.subscribe("admin:timePhase:update", (value) => {
    dayLightPercentage = value.dayLengthPerc;
    transitionTime = value.transitionPerc;
});

let prevPhaseInt = -1

export const calculateBrightness = () => {

  let brightness = 0;

  const baseMath = (50 * ((50 - dayLightPercentage) / 100))

  // Math.min/max used to prevent bugs in cases where the transition time is longer than the day/night available and viceversa. 
  // Unneeded if we are only hardcoding the day/night cycle however it could be used for seasons or an equatorial plane where northernmost maps have a higher nighttime ratio
  const dayMath = Math.max( Math.min( baseMath + (transitionTime/2), 49), 3)
  const nightMath = Math.max( Math.min( (baseMath - (transitionTime/2)) * -1, 49), 3) //inversion

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
