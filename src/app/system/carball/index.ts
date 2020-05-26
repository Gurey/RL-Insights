import { PythonShell } from "python-shell";
import path from "path";
import moment from "moment";
import * as fileService from "../file/readFiles";
import * as arrayUtil from "../../util/arrayUtils";
import { App } from "electron";
import axios from "axios";
import { writeFileSync, existsSync } from "fs";
const app: App = window.require("electron").remote.app;

const JSON_PATH = "jsons/";

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
    const res = await runPythonFile(filePath, [moduleName]);
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

export async function installPip() {
  const pythonPath = path.resolve(app.getPath("userData"), "python");
  const pythonPathFile = path.resolve(pythonPath, "python37._pth");
  const pythonPathData = `
python37.zip
.

# Uncomment to run site.main() automatically
import site

${pythonPath}
${path.resolve(pythonPath, "DLLs")}
${path.resolve(pythonPath, "lib")}
${path.resolve(pythonPath, "lib/plat-win")}
${path.resolve(pythonPath, "lib/site-packages")}
  `;
  writeFileSync(pythonPathFile, pythonPathData);
  const response = await axios.get("https://bootstrap.pypa.io/get-pip.py");
  await runPythonCode(response.data, ["pip==19.1.1"]);
  // await pipInstall(["--upgrade", "pip"]);
}

export async function installCarball(
  listener: (currentPackage: string) => void,
) {
  const dependencies: string[] = [
    // "numpy==1.17.0",
    // "pandas==0.24.2",
    // "protobuf==3.6.1",
    // "xlrd==1.1.0",
  ];
  for (const dependency of dependencies) {
    try {
      console.log(dependency);
      listener(dependency);
      await pipInstall(dependency);
      console.log(dependency, "done");
    } catch (error) {
      console.error("Failed to install ", dependency, error);
    }
  }
  listener("carball");
  await pipInstall(["carball"]);
  listener("Packages installed!");
}

export async function pipInstall(args: string | string[]) {
  console.log("installing carball");
  const filePath = path.resolve("./src/app/system/carball/pipInstall.py");
  const installArguments = [];
  if (Array.isArray(args)) {
    installArguments.push(...args);
  } else {
    installArguments.push(args);
  }
  const res = await runPythonFile(filePath, installArguments);
  console.log("Done running file", res);
  return res;
}

export async function importReplay(replayFile: ReplayFile) {
  const outPath = fileService.resolvePath(`./${JSON_PATH}/${replayFile.name}`);
  const filePath = path.resolve("./src/app/system/carball/importReplay.py");
  const output = await runPythonFile(filePath, [replayFile.path, outPath]);
  return { output, lastLine: [...output].pop(), outPath };
}

export async function runPythonCode(
  code: string,
  args: string[] | undefined = undefined,
) {
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
          res(out);
        }
      },
    );
    shell.on("message", (message) => {
      console.log(message);
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
