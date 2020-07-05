import React, { useMemo } from "react";
import "./util/requireExtensions";
import "./store/middleware/saveState";
import Menu from "./menu";
import { hot } from "react-hot-loader/root";
import RehydrateStores from "./store/rehydrateStores";
import Onboarding from "./screens/onboarding";

import "./style.css";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";

function App() {
  const theme = useMemo(
    () => createMuiTheme({ palette: { type: "light" } }),
    [],
  );
  return (
    <RehydrateStores>
      <ThemeProvider theme={theme}>
        <Onboarding>
          <Menu />
        </Onboarding>
      </ThemeProvider>
    </RehydrateStores>
  );
}

export default App;
