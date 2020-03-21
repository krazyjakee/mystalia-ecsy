const canvasElem = document.getElementById("root") as HTMLCanvasElement;
const context2d = canvasElem.getContext("2d") as CanvasRenderingContext2D;

const resizeCanvas = () => {
  context2d.canvas.width = window.innerWidth;
  context2d.canvas.height = window.innerHeight;
};

window.onresize = () => resizeCanvas();
resizeCanvas();

export default context2d;
