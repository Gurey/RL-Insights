import * as carballService from "../../system/carball";
import * as fileService from "../../system/file/readFiles";
import { ReplayJSON } from "../../store/replays/ReplayJson";

export async function findPlayerId(replaysFolder: string) {
  console.log("Finding replays...", replaysFolder);
  const replays = await carballService.loadReplays(replaysFolder);
  console.log("importing one replay...");
  await carballService.importReplay(replays[0]);
  console.log("finding result...");
  const jsons = await carballService.loadReplayJsons();
  console.log("finding players...");
  const replayFile = await fileService.readFileAsObject<ReplayJSON>(
    jsons[0].path,
  );
  return replayFile;
}
