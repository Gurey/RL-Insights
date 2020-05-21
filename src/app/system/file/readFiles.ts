import fs from "fs";
import paths from "path";

export function getFiles(path: string): string[] {
  const files = fs.readdirSync(path);
  return files;
}

export function readFileAsObject<T>(path: string): T {
  const absolutePath = paths.resolve(path);
  const exists = fs.existsSync(absolutePath);
  const file = fs.readFileSync(absolutePath);
  const content = file.toString("utf-8");
  return JSON.parse(content);
}

export function resolvePath(path: string) {
  return paths.resolve(path);
}

export function getFileStats(path: string): fs.Stats {
  return fs.statSync(path);
}

export function fileExists(path: string) {
  return fs.existsSync(paths.resolve(path));
}
