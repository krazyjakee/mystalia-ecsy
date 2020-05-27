var timer;

var startTimer = () => {
  timer = setInterval(function() {
    postMessage("");
  }, 1000 / 50);
};

onmessage = function(e) {
  if (e.data === "start") {
    startTimer();
  }
  if (e.data === "stop") {
    clearInterval(timer);
    postMessage("stopped");
  }
};
