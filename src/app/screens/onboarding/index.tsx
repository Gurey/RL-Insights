import React, { useMemo, useState, useEffect } from "react";
const remote: Remote = window.require("electron").remote;
import * as carball from "../../system/carball";
import Zip from "adm-zip";
import { downloadFile } from "../../util/downloadFile";
import fs from "fs";

// Packages to look at
//www.npmjs.com/package/stream-length
import { useSettings } from "../../store/settings/settingsStore";
import { Settings } from "../settings";
import {
  makeStyles,
  Theme,
  createStyles,
  Card,
  CardContent,
  Typography,
} from "@material-ui/core";
import { renderCheckListIcon } from "../../components/check";
import { Remote } from "electron";

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
  validateSettings: () => void,
) => {
  const pythonZipPath = `./python.zip`;
  console.log(pythonZipPath);
  await downloadFile(
    "https://www.python.org/ftp/python/3.7.7/python-3.7.7-embed-amd64.zip",
    pythonZipPath,
    (progress) => {
      setStatus(`Downloading python ${Math.floor(+progress)}`);
    },
  );
  setStatus("Installing python...");

  new Zip(pythonZipPath).extractAllTo(`${userData}/python`, false);

  const embededZip = `${userData}/python/python36.zip`;
  const tmpFolder = `${embededZip}.tmp`;
  //new Zip(embededZip).extractAllTo(tmpFolder);
  fs.unlinkSync(pythonZipPath);
  //fs.renameSync(tmpFolder, embededZip);
  setStatus("Installing pip...");
  // await carball.installPip();
  await carball.installCarball((currentPackage) =>
    setStatus(`Installing ${currentPackage}`),
  );
  validateSettings();
};

const userData = remote.app.getPath("userData");
export default function Onboarding(props: React.PropsWithChildren<any>) {
  const [settingsState, settingsActions] = useSettings();
  const classes = useStyles();
  const [pythonZip, setPythonZip] = useState(false);
  const [deps, setDeps] = useState(false);
  const [status, setStatus] = useState("");
  const [settingsValidated, setSettingsValidated] = useState(false);
  useMemo(() => {
    settingsActions.validateSettings().then(() => setSettingsValidated(true));
  }, [settingsState.settingsOk]);
  useMemo(() => {
    if (settingsValidated && !settingsState.settingsOk) {
      setupApplication(setStatus, settingsActions.validateSettings);
    }
  }, [settingsValidated]);

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
                {renderCheckListIcon(pythonZip)} Dependencies
              </Typography>
            </div>
            <div>
              <Typography>
                {renderCheckListIcon(settingsState.validReplayPath)} Replay Path
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  return <div>{props.children}</div>;
}
