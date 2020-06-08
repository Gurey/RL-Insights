import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  makeStyles,
  Theme,
  createStyles,
  CircularProgress,
  InputLabel,
  Select,
  FormControl,
} from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";
import { Check, Block } from "@material-ui/icons";
import { useSettings } from "../../store/settings/settingsStore";
import { useReplays } from "../../store/replays/index";
import { ReplayJSONPlayer, ReplayJSON } from "../../store/replays/ReplayJson";
import { findPlayerId } from "./findPlayerId";

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

export const Settings = (props: any) => {
  const classes = useStyles();
  const [state, actions] = useSettings();
  const [replayState, replayActions] = useReplays();
  const [localState, setLocalState] = useState({
    imporingReplay: false,
    knownPlayers: state.playerId
      ? ([
          { name: state.playerName, id: { id: state.playerId } },
        ] as ReplayJSONPlayer[])
      : [],
  });
  const [intallingCarball, setInstallingCarball] = useState(false);
  const [intallingCarballMessage, setInstallingCarballMessage] = useState("");
  useEffect(() => {
    actions.validateSettings();
  }, [
    state.replaysFolder,
    state.settingsOk,
    state.playerId,
    replayState.loadingReplays,
    replayState.replayJsons,
  ]);
  if (!state.restored) {
    return <CircularProgress />;
  }

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

  const onFindMyPlayerId = () => {
    setLocalState({ ...localState, imporingReplay: true });
    return findPlayerId(state.replaysFolder, console.log).then((replayFile) => {
      console.log("Updating state!!!");
      setLocalState({
        knownPlayers: replayFile.players,
        imporingReplay: false,
      });

      console.log(replayFile.players);
    });
  };

  const renderPlayerId = (
    validReplayPath: boolean,
    knownPlayers: ReplayJSONPlayer[],
  ) => {
    if (!validReplayPath) {
      return <Typography>You need to set a valid replay path</Typography>;
    } else if (replayState.loadingReplays || localState.imporingReplay) {
      return <CircularProgress />;
    } else if (knownPlayers.length === 0) {
      return (
        <Button variant="contained" color="primary" onClick={onFindMyPlayerId}>
          Find my Player ID
        </Button>
      );
    } else {
      const onPlayerSelectChange = (
        event: React.ChangeEvent<{ value: string }>,
      ) => {
        const { value } = event.target;
        if (!value || value.length === 0) {
          return;
        }
        const player = localState.knownPlayers.find((p) => p.id.id === value)!;
        console.log(name, player);
        actions.setPlayerId({
          playerId: player.id.id,
          playerName: player.name,
        });
        actions.validateSettings();
      };
      return (
        <div>
          <FormControl>
            <InputLabel htmlFor="playerIdSelect">Who are you?</InputLabel>
            <Select
              native
              value={state.playerId}
              onChange={onPlayerSelectChange}
              inputProps={{
                id: "playerIdSelect",
              }}
            >
              <option aria-label="Select one" value="" />
              {localState.knownPlayers.map((player) => {
                const { name, id } = player;
                return (
                  <option key={id.id} value={id.id}>
                    {name}
                  </option>
                );
              })}
            </Select>
          </FormControl>
        </div>
      );
    }
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
            Python: {state.python.version}
          </Typography>
          <Typography>
            {renderCheckListIcon(state.carrball.error === null)}
            Carball: {state.carrball.version || state.carrball.error}
          </Typography>
          <Typography>
            {renderCheckListIcon(state.playerId !== null)}
            Your player ID: {state.playerName || "Unknown"}
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
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} variant="h5">
            Player ID
          </Typography>
          {renderPlayerId(state.validReplayPath, localState.knownPlayers)}
        </CardContent>
      </Card>
    </div>
  );
};
