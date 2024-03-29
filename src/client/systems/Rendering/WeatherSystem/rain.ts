import context2d from "../../../canvas";
import { Vector } from "types/TMJ";
import { randomNumberBetween } from "utilities/math";

type RainParticle = {
  x: number;
  y: number;
  l: number;
  life: number;
  xs: number;
  ys: number;
};

const newParticle = (w: number, h: number, heavy: boolean): RainParticle => ({
  x: randomNumberBetween(w),
  y: randomNumberBetween(h),
  l: randomNumberBetween(heavy ? 3 : 2),
  life: randomNumberBetween(30),
  xs: -1 + randomNumberBetween(1 + 0.5),
  ys: randomNumberBetween(4 + 4),
});

const init: RainParticle[] = [];
const maxParts = 1000;
for (let a = 0; a < maxParts; a++) {
  init.push(newParticle(window.innerWidth, window.innerHeight, false));
}

export default (offset: Vector, heavy: boolean = false) => {
  context2d.save();
  context2d.strokeStyle = "rgba(174,194,224,0.8)";
  context2d.lineWidth = 1;
  context2d.lineCap = "round";

  const w = window.innerWidth;
  const h = window.innerHeight;
  const particles: RainParticle[] = [];
  for (let b = 0; b < (heavy ? maxParts : 300); b++) {
    particles[b] = init[b];
  }

  for (var c = 0; c < particles.length; c++) {
    var p = particles[c];
    context2d.beginPath();
    context2d.moveTo(p.x, p.y);
    context2d.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
    context2d.stroke();
  }

  for (var b = 0; b < particles.length; b++) {
    var p = particles[b];
    particles[b].life -= 1;
    p.x += p.xs + offset.x;
    p.y += p.ys + offset.y;

    if (p.x > w || p.y > h) {
      p.x = randomNumberBetween(w);
      p.y = -20;
    }

    if (p.life <= -10) {
      init[b] = newParticle(w, h, heavy);
    } else if (p.life <= 0) {
      particles[b].l = 0.5;
      particles[b].y -= 5;
    }
  }

  context2d.restore();
};
