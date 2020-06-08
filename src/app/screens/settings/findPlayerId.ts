import * as carballService from "../../system/carball";
import * as fileService from "../../../system/file/readFiles";
import { ReplayJSON } from "../../store/replays/ReplayJson";

export async function findPlayerId(
  replaysFolder: string,
  statusCallback: (status: string) => void,
) {
  statusCallback("Finding replays...");
  const replays = await carballService.loadReplays(replaysFolder);
  statusCallback("importing one replay...");
  await carballService.importReplay(replays[0]);
  statusCallback("finding result...");
  const jsons = await carballService.loadReplayJsons();
  statusCallback("finding players...");
  const replayFile = fileService.readFileAsObject<ReplayJSON>(jsons[0].path);
  return replayFile;
}
