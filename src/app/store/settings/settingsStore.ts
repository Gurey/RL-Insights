import { createStore, createHook } from "react-sweet-state";
const { dialog }: typeof Electron.remote = window.require("electron").remote;
import { getPythonVersion, getCarballInstalled } from "../../system/carball";
import * as db from "../../system/db";
import fs from "fs";
import os from "os";
import paths from "path";

const INITIAL_REPLAY_FOLDER = paths.resolve(
  `${os.homedir()}/Documents/My Games/Rocket League/TAGame/Demos`,
);

const Store = createStore({
  name: "settings",
  initialState: {
    restored: false,
    storeId: "settings",
    replaysFolder: INITIAL_REPLAY_FOLDER,
    validReplayPath: false,
    replayPaths: [] as string[],
    python: {
      version: (null as unknown) as string,
    },
    carrball: {
      version: (null as unknown) as string,
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
      const pythonVer = await getPythonVersion();
      const carball = await getCarballInstalled();
      const { replaysFolder, playerId } = getState();
      let validReplayPath = false;
      if (replaysFolder) {
        const files = fs.readdirSync(replaysFolder);
        validReplayPath = files.some((file) => file.includes(".replay"));
      }
      setState({
        carrball: { version: carball.version },
        python: { version: pythonVer.replace("Python ", "") },
        validReplayPath,
        settingsOk: !!(pythonVer && carball && validReplayPath && playerId),
      });
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
  },
});

export const useSettings = createHook(Store);
