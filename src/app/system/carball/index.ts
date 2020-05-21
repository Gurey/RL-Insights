import { PythonShell } from "python-shell";
import path from "path";
import moment from "moment";
import * as fileService from "../file/readFiles";
import * as arrayUtil from "../../util/arrayUtils";

const JSON_PATH = "jsons/";

export async function getPythonVersion() {
  const ver = await PythonShell.getVersion();
  if (ver.stderr) {
    console.error(ver.stderr);
    return "Not installed";
  }
  return ver.stdout.trim();
}

export function getCarballInstalled() {
  return pipShow("carball");
}

export async function pipShow(moduleName: string) {
  const filePath = path.resolve("./src/app/system/carball/pipShow.py");
  const res = await runPythonFile(filePath, [moduleName]);
  let response: any = {};
  res.forEach((kv) => {
    const [key, value] = kv.split(": ");
    response[key.toLowerCase()] = value;
  });
  return response;
}

export async function importReplay(replayFile: ReplayFile) {
  const outPath = fileService.resolvePath(`./${JSON_PATH}/${replayFile.name}`);
  const filePath = path.resolve("./src/app/system/carball/importReplay.py");
  const output = await runPythonFile(filePath, [replayFile.path, outPath]);
  return { output, lastLine: [...output].pop(), outPath };
}

export async function runPythonCode(code: string) {
  return new Promise((res, rej) =>
    PythonShell.runString(code, undefined, (err, out) => {
      if (err) rej(err);
      else {
        res(out);
      }
    }),
  );
}

export async function runPythonFile(
  filePath: string,
  args?: string[],
): Promise<string[]> {
  return new Promise((res, rej) =>
    PythonShell.run(path.resolve(filePath), { args }, (err, out) => {
      if (err) rej(err);
      else {
        res(out);
      }
    }),
  );
}

export async function loadReplays(replayPath: string) {
  const files = fileService.getFiles(replayPath);
  const jsons = fileService.getFiles(JSON_PATH);
  const replays: ReplayFile[] = await Promise.all(
    files.map(async (f) => {
      const path = fileService.resolvePath(`${replayPath}/${f}`);
      const stats = fileService.getFileStats(path);
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
  console.log(replays.length);
  replays.sort((r1, r2) => r2.date.localeCompare(r1.date));
  return replays;
}

export async function loadReplayJsons() {
  const replays = fileService.getFiles(JSON_PATH);
  const formatedReplays = replays.map((r) => {
    const [_, time] = r.replace(".json", "").split("-");
    return {
      file: r,
      time: parseInt(time),
      path: fileService.resolvePath(JSON_PATH + r),
    };
  });
  formatedReplays.sort((r1, r2) => r2.time - r1.time);
  return formatedReplays;
}
