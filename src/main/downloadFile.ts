import * as progressStream from "progress-stream";
import fs from "fs";
import Path from "path";
import axios from "axios";
import { IpcMainInvokeEvent } from "electron";

export const downloadFile = async (
  event: IpcMainInvokeEvent,
  url: string,
  savePath: string,
  progressChannel: string,
): Promise<boolean> => {
  const path = Path.resolve(savePath);
  const writer = fs.createWriteStream(path);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  const streamLength = response.headers["content-length"];

  const prog = progressStream({
    length: streamLength,
    time: 100,
  });
  prog.on("progress", (progress) => {
    if (progressChannel) {
      console.log(progress);
      event.sender.send(progressChannel, progress.percentage);
    }
  });

  response.data.pipe(prog).pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => {
      event.sender.send(progressChannel, "done");
      resolve();
    });
    writer.on("error", () => {
      event.sender.send(progressChannel, "error");
      reject();
    });
  });
};
