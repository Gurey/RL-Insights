import React, { useMemo, useEffect } from "react";

import { useSettings } from "./settings/settingsStore";
import { CircularProgress } from "@material-ui/core";

function doneLoading(states: { restored: boolean }[]) {
  return states.every((s) => s.restored);
}

export default function RehydrateStores(props: React.PropsWithChildren<any>) {
  const [settingsState, settingsActions] = useSettings();
  useEffect(() => {
    settingsActions.initState();
  }, []);
  const done = doneLoading([settingsState]);
  if (!done) {
    console.log("Not done!");
    return <CircularProgress />;
  }
  return <div>{props.children}</div>;
}
