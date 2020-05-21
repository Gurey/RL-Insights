import React, { useMemo } from "react";

import { useSettings } from "../../store/settings/settingsStore";
import { Settings } from "../settings";
import { makeStyles, Theme, createStyles } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginLeft: "30%",
      marginRight: "30%",
    },
  }),
);

export default function Onboarding(props: React.PropsWithChildren<any>) {
  const [settingsState, settingsActions] = useSettings();
  const classes = useStyles();
  useMemo(settingsActions.validateSettings, [settingsState.settingsOk]);
  if (!settingsState.settingsOk) {
    return (
      <div className={classes.container}>
        <Settings />
      </div>
    );
  }
  return <div>{props.children}</div>;
}
