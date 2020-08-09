import "./css/index.sass";

const reactRootElem = document.getElementById("react-root") as HTMLElement;
const canvasRootElem = document.getElementById("root") as HTMLElement;
const loaderElem = document.getElementById("loader") as HTMLElement;

const script = (url, callback) => {
  var s = document.createElement("script");
  s.type = "text/javascript";
  s.async = true;
  s.src = url;
  s.onload = () => {
    callback();
  };
  document.body.appendChild(s);
};

script("/app.js", () => {
  reactRootElem.style.display = "block";
  canvasRootElem.style.display = "block";
  loaderElem.remove();
});
