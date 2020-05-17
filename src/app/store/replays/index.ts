import { createStore, createHook } from "react-sweet-state";
import * as fileService from "../../system/readFiles";
import moment from "moment";
import * as carballService from "../../carball";
import * as arrayUtil from "../../util/arrayUtils";
import { PanToolSharp } from "@material-ui/icons";

const JSON_PATH = "jsons/";

const Store = createStore({
  name: "replays",
  initialState: {
    replays: new Array<ReplayFile>(0),
    replayJsons: [] as { file: string; time: number; path: string }[],
  },
  actions: {
    findReplays: (replayPath: string) => async ({ setState, getState }) => {
      console.log(replayPath);
      const files = await fileService.getFiles(replayPath);
      const jsons = await fileService.getFiles(JSON_PATH);
      const replays: ReplayFile[] = await Promise.all(
        files.map(async (f) => {
          const path = fileService.resolvePath(`${replayPath}/${f}`);
          const stats = await fileService.getFileStats(path);
          const name = f.replace(".replay", "");
          const imported = arrayUtil.anyStringIncludes(name, jsons);
          return {
            path,
            name,
            importing: false,
            date: moment(stats.mtime).format("YYYY-MM-DD HH:mm"),
            imported,
          };
        }),
      );
      replays.sort((r1, r2) => r2.date.localeCompare(r1.date));
      setState({ replays });
    },
    importReplay: (replay: ReplayFile) => async ({ setState, getState }) => {
      const allReplays = getState().replays;
      const index = allReplays.indexOf(replay);
      allReplays[index].importing = true;
      setState({ replays: allReplays });
      console.log(getState());
      const outPath = fileService.resolvePath(`./${JSON_PATH}/${replay.name}`);
      const res = await carballService.importReplay(replay.path, outPath);
      console.log(res, outPath);
      allReplays[index].imported = true;
      allReplays[index].importing = false;
      setState({ replays: allReplays });
    },
    loadReplayJsons: () => async ({ setState, getState }) => {
      const replays = await fileService.getFiles(JSON_PATH);
      const formatedReplays = replays.map((r) => {
        const [_, time] = r.replace(".json", "").split("-");
        return {
          file: r,
          time: parseInt(time),
          path: fileService.resolvePath(JSON_PATH + r),
        };
      });
      formatedReplays.sort((r1, r2) => r2.time - r1.time);
      setState({ replayJsons: formatedReplays });
    },
  },
});

export const useReplays = createHook(Store);
