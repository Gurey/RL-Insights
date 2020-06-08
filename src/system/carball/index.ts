import { PythonShell } from "python-shell";
import path from "path";
import moment from "moment";
import * as fileService from "../file/readFiles";
import * as arrayUtil from "../../app/util/arrayUtils";
import { App } from "electron";
import { existsSync } from "fs";
// @ts-ignore
import importReplayScript from "!!raw-loader!./importReplay.py";
// @ts-ignore
import pipShowScript from "!!raw-loader!./pipShow.py";

import { app } from "electron";

const JSON_PATH = path.resolve(app.getPath("userData"), "jsons/");

console.log(Object.keys(app));
console.log("User Data", app.getPath("userData"));

PythonShell.defaultPythonPath = path.resolve(
  app.getPath("userData"),
  "python/python.exe",
);

export async function getPythonVersion() {
  PythonShell.runString("import os; print(os.path)", {}, (err, output) => {
    console.log(err, output);
  });

  const ver = await PythonShell.getVersion();
  if (ver.stderr) {
    console.error(ver.stderr);
    return "Not installed";
  }
  console.log(ver);
  return ver.stdout.trim();
}

export async function getCarballInstalled() {
  try {
    return await pipShow("carball");
  } catch (error) {
    return null;
  }
}

export async function pipShow(moduleName: string) {
  try {
    const filePath = path.resolve("./src/app/system/carball/pipShow.py");
    const res = await runPythonCode(pipShowScript, [moduleName]);
    let response: any = {};
    res.forEach((kv) => {
      const [key, value] = kv.split(": ");
      response[key.toLowerCase()] = value;
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function importReplay(replayFile: ReplayFile) {
  const outPath = fileService.resolvePath(`${JSON_PATH}/${replayFile.name}`);
  const output = await runPythonCode(importReplayScript, [
    replayFile.path,
    outPath,
  ]);
  return { output, lastLine: [...output].pop(), outPath };
}

export async function runPythonCode(
  code: string,
  args: string[] | undefined = undefined,
): Promise<string[]> {
  if (!existsSync(PythonShell.defaultPythonPath)) {
    throw new Error("Python do not exist");
  }
  return new Promise((res, rej) => {
    const shell = PythonShell.runString(
      code,
      { args, shell: false },
      (err, out) => {
        if (err) rej(err);
        else {
          res(out as string[]);
        }
      },
    );
    shell.on("message", (message) => {
      console.log(message);
    });
    shell.on("error", (err) => {
      console.error(err);
    });
  });
}

export async function runPythonFile(
  filePath: string,
  args?: string[],
): Promise<string[]> {
  if (!existsSync(PythonShell.defaultPythonPath)) {
    throw new Error("Python do not exist");
  }
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
  if (!fileService.fileExists(JSON_PATH)) {
    fileService.makeDir(JSON_PATH);
  }
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
      path: fileService.resolvePath(JSON_PATH, r),
    };
  });
  formatedReplays.sort((r1, r2) => r2.time - r1.time);
  return formatedReplays;
}
