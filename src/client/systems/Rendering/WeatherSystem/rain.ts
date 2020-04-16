import context2d from "../../../canvas";
import { Vector } from "types/TMJ";

type RainParticle = {
  x: number;
  y: number;
  l: number;
  life: number;
  xs: number;
  ys: number;
};

const newParticle = (w: number, h: number): RainParticle => ({
  x: Math.random() * w,
  y: Math.random() * h,
  l: Math.random() * 2,
  life: Math.random() * 30,
  xs: -1 + Math.random() * 1 + 0.5,
  ys: Math.random() * 4 + 4,
});

const init: RainParticle[] = [];
const maxParts = 300;
for (let a = 0; a < maxParts; a++) {
  init.push(newParticle(window.innerWidth, window.innerHeight));
}

export default (offset: Vector) => {
  context2d.save();
  context2d.strokeStyle = "rgba(174,194,224,0.8)";
  context2d.lineWidth = 1;
  context2d.lineCap = "round";

  const w = window.innerWidth;
  const h = window.innerHeight;
  const particles: RainParticle[] = [];
  for (let b = 0; b < maxParts; b++) {
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
      p.x = Math.random() * w;
      p.y = -20;
    }

    if (p.life <= -10) {
      particles[b] = newParticle(w, h);
    } else if (p.life <= 0) {
      particles[b].y -= 5;
    }
  }

  context2d.restore();
};
