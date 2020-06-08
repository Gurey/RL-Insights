import React, { useState, useEffect } from "react";
const remote: Remote = window.require("electron").remote;
import Zip from "adm-zip";
import { downloadFile } from "../../util/downloadFile";

// Packages to look at
//www.npmjs.com/package/stream-length
import {
  useSettings,
  SettingsState,
  SettingsActions,
} from "../../store/settings/settingsStore";
import {
  makeStyles,
  Theme,
  createStyles,
  Card,
  CardContent,
  Typography,
  InputLabel,
  Select,
  FormControl,
} from "@material-ui/core";
import { renderCheckListIcon } from "../../components/check";
import { Remote } from "electron";
import { findPlayerId } from "../settings/findPlayerId";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginLeft: "30%",
      marginRight: "30%",
    },
  }),
);

const setupApplication = async (
  setStatus: (status: string) => void,
  settingsState: SettingsState,
  settingsActions: SettingsActions,
  setPlayers: (data: any[]) => void,
) => {
  const pythonZipPath = `${remote.app.getPath("temp")}/python.zip`;
  setStatus("Setting up RL Insight");
  if (!settingsState.python.version) {
    await downloadFile(
      "https://github.com/Gurey/RL-Insights/blob/master/python.zip?raw=true",
      pythonZipPath,
      (progress) => {
        setStatus(`Downloading python ${Math.floor(+progress)}`);
      },
    );
    setStatus("Installing python...");
    new Zip(pythonZipPath).extractAllTo(`${userData}/python`, false);
  }
  setStatus("Validating...");
  settingsActions.validateSettings();
  if (!settingsState.validReplayPath) {
    settingsActions.selectReplayFolder();
  }

  setStatus("Finding player ID");
  if (!settingsState.playerId) {
    const replayJson = await findPlayerId(
      settingsState.replaysFolder,
      setStatus,
    );
    const players = replayJson.players.map((p) => ({
      id: p.id.id,
      name: p.name,
    }));
    setPlayers(players);
    console.log(players);
  }

  setStatus("Validating settings...");
};

const userData = remote.app.getPath("userData");
export default function Onboarding(props: React.PropsWithChildren<any>) {
  const [settingsState, settingsActions] = useSettings();
  const classes = useStyles();
  const [status, setStatus] = useState("");
  const [settingsValidated, setSettingsValidated] = useState(false);
  const [players, setPlayers] = useState([] as { id: string; name: string }[]);
  useEffect(() => {
    settingsActions.validateSettings().then(() => setSettingsValidated(true));
  }, [settingsState.settingsOk]);
  useEffect(() => {
    if (settingsValidated && !settingsState.settingsOk) {
      setupApplication(setStatus, settingsState, settingsActions, setPlayers);
    }
  }, [settingsValidated]);
  const onPlayerSelectChange = (
    event: React.ChangeEvent<{ value: string }>,
  ) => {
    const { value } = event.target;
    if (!value || value.length === 0) {
      return;
    }
    const player = players.find((p) => p.id === value)!;
    console.log(name, player);
    settingsActions.setPlayerId({
      playerId: player.id,
      playerName: player.name,
    });
    settingsActions.validateSettings();
  };

  if (!settingsState.settingsOk) {
    return (
      <div className={classes.container}>
        <Card>
          <CardContent>
            <Typography variant="h5">Setting up RL-Insight</Typography>
            <Typography variant="caption">{status}</Typography>
            <div>
              <Typography>
                {renderCheckListIcon(!!settingsState.python.version)} Python
              </Typography>
            </div>
            <div>
              <Typography>
                {renderCheckListIcon(!!settingsState.carrball.version)} Carball
              </Typography>
            </div>
            <div>
              <Typography>
                {renderCheckListIcon(settingsState.validReplayPath)} Replay Path
              </Typography>
            </div>
            <div>
              <Typography>
                {renderCheckListIcon(!!settingsState.playerId)} Player Id
              </Typography>
              <FormControl>
                <InputLabel htmlFor="playerIdSelect">Who are you?</InputLabel>
                <Select
                  native
                  value={settingsState.playerId}
                  onChange={onPlayerSelectChange}
                  inputProps={{
                    id: "playerIdSelect",
                  }}
                >
                  <option aria-label="Select one" value="" />
                  {players.map((player) => {
                    const { name, id } = player;
                    return (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  return <div>{props.children}</div>;
}
