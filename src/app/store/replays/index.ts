import { createStore, createHook, StoreActionApi } from "react-sweet-state";
import * as fileService from "../../../system/file/readFiles";
import * as carballService from "../../system/carball";
import * as arrayUtil from "../../util/arrayUtils";
import * as gameService from "../../../main/game/games";
import { ReplayJSON, PlayerStats } from "./ReplayJson";
import { CarballAnalysisHandler } from "../../../system/carball/carball-json";
import * as db from "../../../system/db";
import { ReplaysAnalysis } from "../../analysis/Analysis";
import { GameSession } from "../../../system/db/types";
import { ipcRenderer } from "electron";
import { Socket, Event } from "electron-ipc-socket";
// import { ImportReplayActions } from "../../../main/importReplay/importReplay";

const socket = new Socket(ipcRenderer);
socket.open("replay");

export type ReplayAnalysisData = {
  stats: AnalysisData<PlayerStats, AnalysisDataNode>;
  winLossCorr: PlayerStats;
  goalDiffCorr: AnalysisData<PlayerStats, PearsonCorrelationNode>;
};
export type PlayersAnalysisData = {
  [key: string]: ReplayAnalysisData;
};

type UseReplays = ReturnType<typeof useReplays>;
export type ReplaysState = UseReplays[0];
export type ReplaysActions = UseReplays[1];

const Store = createStore({
  name: "replays",
  initialState: {
    loadingReplays: false,
    replays: new Array<ReplayFile>(0),
    replayJsons: [] as { file: string; time: number; path: string }[],
    playersAnalysisData: {} as PlayersAnalysisData,
    sessions: [] as GameSession[],
    lastImportTime: 0,
    listenersInitiated: false,
  },
  actions: {
    findReplays: (replayPath: string) => async ({ setState, getState }) => {
      setState({ loadingReplays: true });
      const replays = await carballService.loadReplays(replayPath);
      setState({ replays, loadingReplays: false });
    },
    importReplay: (replay: ReplayFile) => async ({ setState, getState }) => {
      const allReplays = getState().replays;
      const index = allReplays.indexOf(replay);
      allReplays[index].importing = true;
      setState({ replays: allReplays });
      try {
        socket.send("IMPORT_REPLAY", replay);
      } catch (error) {
        console.error(error);
        allReplays[index].imported = false;
        allReplays[index].importing = false;
      }
    },
    replayImported: (replayName: string, error?: string) => ({
      getState,
      setState,
    }) => {
      console.log("Replay imported in action");
      const replays = getState().replays;
      const index = replays.findIndex((r) => r.name === replayName);
      replays[index].imported = error ? false : true;
      replays[index].importing = false;
      setState({
        replays,
        lastImportTime: Date.now(),
        playersAnalysisData: {},
      });
    },
    loadReplayJsons: () => async ({ setState }) => {
      const formatedReplays = await carballService.loadReplayJsons();
      setState({ replayJsons: formatedReplays });
    },
    loadPlayerStats: (playerId: string, playlist: string) => ({
      getState,
      setState,
    }) => {
      const { playersAnalysisData } = getState();
      if (playersAnalysisData[playerId]) {
        return;
      }
      const files = db.replayIndex().getReplays(playlist);
      const replays = Object.keys(files);
      const replayFiles: string[] = [];
      for (const replayIndexKey of replays) {
        const replayIndex = files[replayIndexKey];
        if (replayIndex.players.some((p) => p.playerId === playerId)) {
          replayFiles.push(replayIndex.jsonPath);
        }
      }
      const analysis = new ReplaysAnalysis(replayFiles, playerId);
      const playerStats = analysis.playerStats();
      const winLossCorr = analysis.getWinLossPValue();
      const goalDiffCorr = analysis.getGoalDiffCorrelation();
      setState({
        playersAnalysisData: {
          ...playersAnalysisData,
          [playerId]: { stats: playerStats, winLossCorr, goalDiffCorr },
        },
      });
    },
    loadGameSessions: (playlist: string) => ({ setState }) => {
      setState({
        sessions: db.replayIndex().getSessions(playlist),
      });
    },
    initListeners: () => (store) => {
      if (!store.getState().listenersInitiated) {
        initListeners(store);
        store.setState({ listenersInitiated: true });
      }
    },
  },
});

function initListeners(store: StoreActionApi<any>) {
  socket.onEvent("REPLAY_IMPORTED", (event: Event) => {
    console.log("Import response", event);
    console.log("Store", Store);
    const msg = event.data as ImportReplayResult;
    Store.actions.replayImported(msg.replayName, msg.error)(store);
  });
}

export const useReplays = createHook(Store);
