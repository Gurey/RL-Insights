import fs from "fs";
import paths from "path";

export function getFiles(path: string): Promise<string[]> {
  return new Promise((res, rej) => {
    fs.readdir(paths.resolve(path), (err, files) => {
      if (err) return rej(err);
      return res(files);
    });
  });
}

export function readFileAsObject<T>(path: string): Promise<T> {
  return new Promise(async (res, rej) => {
    console.log("Reading file...");
    const absolutePath = paths.resolve(path);
    const exists = await fileExists(absolutePath);
    console.log(exists, absolutePath);
    const file = fs.readFileSync(absolutePath);
    console.log("File read!");
    res(JSON.parse(file.toString("utf-8")));
  });
}

export function resolvePath(path: string) {
  return paths.resolve(path);
}

export function getFileStats(path: string): Promise<fs.Stats> {
  return new Promise((res, rej) => {
    fs.stat(path, (err, stats) => {
      if (err) rej(err);
      res(stats);
    });
  });
}

export function fileExists(path: string): Promise<boolean> {
  return new Promise((res, rej) => {
    return fs.exists(paths.resolve(path), (exists) => {
      res(exists);
    });
  });
}
