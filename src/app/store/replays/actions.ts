import * as carballService from "../../system/carball";
import { StoreActionApi } from "react-sweet-state";
import { ReplaysState } from "./index";
import * as db from "../../../system/db";
import { ReplaysAnalysis } from "../../analysis/Analysis";
import { ipcRenderer } from "electron";

import { Socket, Event } from "electron-ipc-socket";
import { PlaylistIndex } from "../../../system/db/types";

const socket = new Socket(ipcRenderer);
socket.open("replay");

export type ReplayActions = typeof actions;

export const actions = {
  findReplays: (replayPath: string) => async ({
    setState,
  }: StoreActionApi<ReplaysState>) => {
    setState({ loadingReplays: true });
    const replays = await carballService.loadReplays(replayPath);
    setState({ replays, loadingReplays: false });
  },
  importReplay: (replay: ReplayFile) => async ({
    setState,
    getState,
  }: StoreActionApi<ReplaysState>) => {
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
  }: StoreActionApi<ReplaysState>) => {
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
  loadReplayJsons: () => async ({ setState }: StoreActionApi<ReplaysState>) => {
    const formatedReplays = await carballService.loadReplayJsons();
    setState({ replayJsons: formatedReplays });
  },
  loadPlayerStats: (playerId: string, playlist: string) => ({
    getState,
    setState,
  }: StoreActionApi<ReplaysState>) => {
    const { playersAnalysisData } = getState();
    if (playersAnalysisData[playerId]) {
      return;
    }
    const replayFiles: PlaylistIndex[] = getPlaylistReplayPaths(
      playlist,
      playerId,
    );
    const analysis = new ReplaysAnalysis(
      replayFiles.map((p) => p.jsonPath),
      playerId,
    );
    const playerStats = analysis.playerStats();
    const winLossCorr = analysis.getWinLossPValue();
    const goalDiffCorr = analysis.getPlayerGoalDiffCorrelation();
    setState({
      playersAnalysisData: {
        ...playersAnalysisData,
        [playerId]: { stats: playerStats, winLossCorr, goalDiffCorr },
      },
    });
  },
  loadTeamStats: (playerId: string, playlist: string, teamId: string) => ({
    setState,
  }: StoreActionApi<ReplaysState>) => {
    const replayFiles = getTeamReplays(playlist, teamId);
    const analysis = new ReplaysAnalysis(
      replayFiles.map((p) => p.jsonPath),
      playerId,
    );
    const teamStats = analysis.teamStats();
    const goalDiffCorr = analysis.getTeamGoalDiffCorrelation();
    setState({ teamAnalysisData: { stats: teamStats, goalDiffCorr } });
  },
  loadGameSessions: (playlist: string, teamId: string | null = null) => ({
    setState,
  }: StoreActionApi<ReplaysState>) => {
    setState({
      sessions: db.replayIndex().getSessions(playlist),
    });
  },
  initListeners: () => (store: StoreActionApi<ReplaysState>) => {
    if (!store.getState().listenersInitiated) {
      initListeners(store);
      store.setState({ listenersInitiated: true });
    }
  },
  loadMyTeams: () => ({ setState }: StoreActionApi<ReplaysState>) => {
    setState({ myTeams: db.replayIndex().getTeams() });
  },
};

function getPlaylistReplayPaths(playlist: string, playerId?: string) {
  const files = db.replayIndex().getReplays(playlist);
  const replays = Object.keys(files);
  const replayFiles: PlaylistIndex[] = [];
  for (const replayIndexKey of replays) {
    const replayIndex = files[replayIndexKey];
    if (!playerId || replayIndex.myTeam.some((p) => p.playerId === playerId)) {
      replayFiles.push(replayIndex);
    }
  }
  return replayFiles;
}

function getTeamReplays(playlist: string, teamId: string) {
  return db.replayIndex().getTeamReplays(playlist, teamId);
}

function initListeners(store: StoreActionApi<any>) {
  socket.onEvent("REPLAY_IMPORTED", (event: Event) => {
    console.log("Import response", event);
    const msg = event.data as ImportReplayResult;
    actions.replayImported(msg.replayName, msg.error)(store);
  });
}
