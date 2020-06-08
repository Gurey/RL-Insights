import { createStore, createHook } from "react-sweet-state";
const { dialog }: typeof Electron.remote = window.require("electron").remote;
import { getPythonVersion, getCarballInstalled } from "../../system/carball";
import * as db from "../../../system/db";
import fs from "fs";
import os from "os";
import paths from "path";

type UseSettings = ReturnType<typeof useSettings>;
export type SettingsState = UseSettings[0];
export type SettingsActions = UseSettings[1];

const INITIAL_REPLAY_FOLDER = paths.resolve(
  `${os.homedir()}/Documents/My Games/Rocket League/TAGame/Demos`,
);

const Store = createStore({
  name: "settings",
  initialState: {
    pythonPath: (null as unknown) as string,
    restored: false,
    storeId: "settings",
    replaysFolder: INITIAL_REPLAY_FOLDER,
    validReplayPath: false,
    replayPaths: [] as string[],
    python: {
      version: (null as unknown) as string | null,
    },
    carrball: {
      error: (null as unknown) as string | null,
      version: (null as unknown) as string | null,
    },
    playerId: (null as unknown) as string,
    playerName: (null as unknown) as string,
    settingsOk: false,
  },
  actions: {
    initState: () => async ({ setState, getState }) => {
      const state = db.getState(getState().storeId);
      console.log("Rehydrating with state", state);
      setState({ ...state, restored: true });
    },
    selectReplayFolder: () => async ({ setState, getState, dispatch }) => {
      const path = await dialog.showOpenDialog({
        properties: ["openDirectory"],
      });
      console.log("path", path);
      if (path) {
        setState({ replaysFolder: path.filePaths[0] });
        db.saveState(getState().storeId, getState());
      }
    },
    validateSettings: () => async ({ setState, getState }) => {
      try {
        console.log(1);
        try {
          const pythonVer = await getPythonVersion();
          setState({
            python: { version: pythonVer.replace("Python ", "") },
          });
        } catch (error) {
          console.log(error);
          setState({ python: { version: null as any } });
        }
        console.log(2);
        try {
          const carball = await getCarballInstalled();
          console.log(carball);
          setState({
            carrball: { version: carball.version, error: null },
          });
        } catch (error) {
          console.log(3);
          let message = `${error.message}`.split(os.EOL)[0];
          if (message.includes("WARNING: Package(s) not found: carball")) {
            message = "Not found";
          }
          console.log(4);
          setState({ carrball: { version: null as any, error: message } });
          console.log(5);
        }
        const { replaysFolder, playerId } = getState();
        let validReplayPath = false;
        if (replaysFolder) {
          const files = fs.readdirSync(replaysFolder);
          validReplayPath = files.some((file) => file.includes(".replay"));
        }
        const { python, carrball } = getState();
        console.log(
          "Validation",
          python.version,
          carrball,
          validReplayPath,
          playerId,
        );
        const settingsOk = !!(
          python.version !== null &&
          carrball.version !== null &&
          validReplayPath &&
          playerId
        );
        console.log("Settings OK", settingsOk);
        setState({
          validReplayPath,
          settingsOk,
        });
      } catch (error) {
        console.log(100);
        setState({ settingsOk: false });
      }
    },
    getKnownPlayers: () => async ({ getState, setState }) => {},
    setPlayerId: ({
      playerId,
      playerName,
    }: {
      playerId: string;
      playerName: string;
    }) => ({ setState }) => {
      setState({ playerId, playerName });
    },
    setPythonPath: (pythonPath: string) => ({ setState }) => {
      setState({ pythonPath });
    },
  },
});

export const useSettings = createHook(Store);
