import React, { useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  makeStyles,
  Theme,
  createStyles,
  CircularProgress,
} from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";
import { Check, Block } from "@material-ui/icons";
import { useSettings } from "../../store/settings/settingsStore";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginBottom: theme.spacing(3),
    },
    title: {
      marginBottom: theme.spacing(1),
    },
    selectButton: {
      marginTop: theme.spacing(1),
    },
  }),
);

export default function Settings(props: any) {
  const classes = useStyles();
  const [state, actions] = useSettings();
  if (!state.restored) {
    return <CircularProgress />;
  }
  useEffect(() => {
    actions.validateSettings();
  }, []);

  const onChangeRLReplayPath = async () => {
    await actions.selectReplayFolder();
    actions.validateSettings();
  };

  const renderCheckListIcon = (ok: boolean) => {
    return ok ? (
      <Check style={{ color: green[500] }} alignmentBaseline="baseline" />
    ) : (
      <Block style={{ color: red[500] }} alignmentBaseline="baseline" />
    );
  };

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} variant="h5">
            Checklist
          </Typography>
          <Typography>
            {renderCheckListIcon(state.validReplayPath)}
            Replay path
          </Typography>
          <Typography>
            {renderCheckListIcon(state.python.version !== null)}
            Python {state.python.version}
          </Typography>
          <Typography>
            {renderCheckListIcon(state.carrball !== null)}
            Carball {state.carrball.version}
          </Typography>
        </CardContent>
      </Card>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} variant="h5">
            Rocket League replay folder
          </Typography>
          <Typography>{state.replaysFolder}</Typography>
          <Button
            className={classes.selectButton}
            variant="contained"
            color="primary"
            onClick={onChangeRLReplayPath}
          >
            Select replay folder
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
