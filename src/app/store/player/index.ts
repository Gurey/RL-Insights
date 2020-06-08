import { createStore, createHook } from "react-sweet-state";
import { PlayerStats, ReplayJSON } from "../replays/ReplayJson";
import * as fileService from "../../../system/file/readFiles";
import * as gameService from "../../../main/game/games";
import { getStats } from "../../objectMath/objectMath";
import { CarballAnalysisHandler } from "../../../system/carball/carball-json";

const loadPlayerStats = (path: string, playerId: string) => {
  const file = fileService.readFileAsObject<ReplayJSON>(path);
  const fileHandler = new CarballAnalysisHandler(file, playerId);
  return fileHandler.getPlayer(playerId);
};

const Store = createStore({
  name: "player",
  initialState: {
    calculatingStats: false,
    loadingStats: false,
    totalPathsToLoad: 0,
    totalPathsLoaded: 0,
    totalStats: {} as AnalysisData<PlayerStats>,
    winStats: {} as AnalysisData<PlayerStats>,
    lossStats: {} as AnalysisData<PlayerStats>,
  },
  actions: {
    loadTotalStats: (paths: string[]) => ({ setState, getState }) => {
      setState({
        loadingStats: true,
        totalPathsToLoad: paths.length,
        totalPathsLoaded: 0,
      });
      const playerStatsData: PlayerStats[] = [];
      for (const path of paths) {
        playerStatsData.push(loadPlayerStats(path, "").stats);
        const { totalPathsLoaded } = getState();
        setState({ totalPathsLoaded: totalPathsLoaded + 1 });
      }
      setState({ calculatingStats: true });
      const totalStats = getStats(playerStatsData);
      setState({ totalStats, loadingStats: false, calculatingStats: false });
    },
  },
});

export const usePlayers = createHook(Store);
