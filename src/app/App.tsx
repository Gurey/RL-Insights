import React from "react";
import "./util/requireExtensions";
import "./store/middleware/saveState";
import Menu from "./menu";
import { hot } from "react-hot-loader/root";
import RehydrateStores from "./store/rehydrateStores";

import "./style.css";

function App() {
  return (
    <RehydrateStores>
      <Menu />
    </RehydrateStores>
  );
}

export default hot(App);
