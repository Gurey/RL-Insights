import React, { useEffect } from "react";

import { useSettings } from "./settings/settingsStore";
import { useReplays } from "./replays";
import { CircularProgress } from "@material-ui/core";

function doneLoading(states: { restored: boolean }[]) {
  return states.every((s) => s.restored);
}

export default function RehydrateStores(props: React.PropsWithChildren<any>) {
  const [settingsState, settingsActions] = useSettings();
  const [_, replayActions] = useReplays();
  useEffect(() => {
    settingsActions.initState();
    replayActions.initListeners();
  }, []);
  const done = doneLoading([settingsState]);
  if (!done) {
    console.log("Not done!");
    return <CircularProgress />;
  }
  return <div>{props.children}</div>;
}
