import { PythonShell } from "python-shell";
import path from "path";

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
  const filePath = path.resolve("./src/app/carball/pipShow.py");
  const res = await runPythonFile(filePath, [moduleName]);
  let response: any = {};
  res.forEach((kv) => {
    const [key, value] = kv.split(": ");
    response[key.toLowerCase()] = value;
  });
  return response;
}

export async function importReplay(replayPath: string, outputFile: string) {
  const filePath = path.resolve("./src/app/carball/importReplay.py");
  return runPythonFile(filePath, [replayPath, outputFile]);
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
