import { createStore, createHook } from "react-sweet-state";
import * as fileService from "../../system/file/readFiles";
import * as carballService from "../../system/carball";
import * as arrayUtil from "../../util/arrayUtils";
import * as gameService from "../../game/games";
import { ReplayJSON } from "./ReplayJson";
import { CarballAnalysisHandler } from "../../system/carball/carball-json";
import * as db from "../../system/db";

const Store = createStore({
  name: "replays",
  initialState: {
    loadingReplays: false,
    replays: new Array<ReplayFile>(0),
    replayJsons: [] as { file: string; time: number; path: string }[],
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
      let outPath: string | null = null;
      try {
        const importRes = await carballService.importReplay(replay);
        outPath = importRes.lastLine!;
        console.log(outPath);
        allReplays[index].imported = true;
        allReplays[index].importing = false;
      } catch (error) {
        allReplays[index].imported = false;
        allReplays[index].importing = false;
      } finally {
        setState({ replays: allReplays });
      }
      return outPath;
    },
    loadReplayJsons: () => async ({ setState }) => {
      const formatedReplays = await carballService.loadReplayJsons();
      setState({ replayJsons: formatedReplays });
    },
    indexReplay: (replayJsonPath: string, playerId: string) => ({
      getState,
    }) => {
      const json = fileService.readFileAsObject<ReplayJSON>(replayJsonPath);
      const analysis = new CarballAnalysisHandler(json, playerId);
      const index = gameService.createReplayIndex(analysis);
      db.replayIndex().saveReplayIndex(json.gameMetadata.playlist, index);
    },
  },
});

export const useReplays = createHook(Store);
