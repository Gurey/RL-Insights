import React from "react";
import "./util/requireExtensions";
import "./store/middleware/saveState";
import Menu from "./menu";
import { hot } from "react-hot-loader/root";
import RehydrateStores from "./store/rehydrateStores";
import Onboarding from "./screens/onboarding";

import "./style.css";

function App() {
  return (
    <RehydrateStores>
      <Onboarding>
        <Menu />
      </Onboarding>
    </RehydrateStores>
  );
}

export default App;
