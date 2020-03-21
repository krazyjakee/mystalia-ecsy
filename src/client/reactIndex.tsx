import * as React from "react";
import * as ReactDOM from "react-dom";
import MainMenu from "./react/MainMenu";

const App = () => {
  return <MainMenu />;
};

ReactDOM.render(<App />, document.getElementById("react-root"));
