import { createStore, createHook } from "react-sweet-state";
import { PlayerStats, TeamStats } from "./ReplayJson";
import { GameSession, PlaylistTeam } from "../../../system/db/types";

import { actions } from "./actions";
// import { ImportReplayActions } from "../../../main/importReplay/importReplay";

export type PlayerReplayAnalysisData = {
  stats: AnalysisData<PlayerStats, AnalysisDataNode>;
  winLossCorr: PlayerStats;
  goalDiffCorr: AnalysisData<PlayerStats, PearsonCorrelationNode>;
};

export type TeamReplayAnalysisData = {
  stats: AnalysisData<TeamStats, AnalysisDataNode>;
  goalDiffCorr: AnalysisData<TeamStats, PearsonCorrelationNode>;
};

export type PlayersAnalysisData = {
  [key: string]: PlayerReplayAnalysisData;
};

export type ReplaysState = typeof initialState;

const initialState = {
  loadingReplays: false,
  replays: new Array<ReplayFile>(0),
  replayJsons: [] as { file: string; time: number; path: string }[],
  playersAnalysisData: {} as PlayersAnalysisData,
  teamAnalysisData: {} as TeamReplayAnalysisData,
  sessions: [] as GameSession[],
  lastImportTime: 0,
  listenersInitiated: false,
  myTeams: [] as PlaylistTeam[],
};

const Store = createStore({
  name: "replays",
  initialState,
  actions: actions,
});

export const useReplays = createHook(Store);
