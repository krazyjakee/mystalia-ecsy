import * as React from "react";
import * as ReactDOM from "react-dom";
import MainMenu from "./react/MainMenu";
import { Clock } from "./react/Overlays/Clock";

const App = () => {
  return (
    <div>
      <MainMenu />
      <Clock />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("react-root"));
