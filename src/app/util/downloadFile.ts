import { IpcRenderer } from "electron";

const ipcRenderer: IpcRenderer = require("electron").ipcRenderer;

export const downloadFile = (
  url: string,
  path: string,
  onProgress: (progress: string) => void,
) => {
  console.log(Object.keys(ipcRenderer));
  return new Promise((resolve, reject) => {
    const progressChannel = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
    ipcRenderer.on(progressChannel, (event, args) => {
      if (args === "done" || args === "error") {
        ipcRenderer.removeAllListeners(progressChannel);
        args === "done" ? resolve() : reject();
        return;
      }
      console.log("DL Response progress", args);
      onProgress(args);
    });
    ipcRenderer.invoke("downloadFile", [url, path, progressChannel]);
  });
};
