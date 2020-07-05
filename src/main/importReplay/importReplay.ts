import { ipcMain, BrowserWindow, App } from "electron";
import { Socket, Transport, InboundRequest, Event } from "electron-ipc-socket";
import fs from "fs";
import Path from "path";
import { importReplay } from "../../system/carball";
// @ts-ignore
import importReplayScript from "!!raw-loader!./importReplay.py";

import * as db from "../../system/db";
import * as fileService from "../../system/file/readFiles";
import { ReplayJSON } from "../../app/store/replays/ReplayJson";
import { CarballAnalysisHandler } from "../../system/carball/carball-json";
import * as gameService from "../game/games";
import Bottleneck from "bottleneck";
import os from "os";

export enum ImportReplayActions {
  REQ_IMPORT_REPLAY = "IMPORT_REPLAY",
  MSG_REPLAY_IMPORTED = "REPLAY_IMPORTED",
}

export class ImportReplay {
  private static socket: Socket;
  private static initiated = false;
  private static JSON_PATH: string;

  private static limiter = new Bottleneck({
    maxConcurrent: os.cpus().length,
  });

  static init(win: BrowserWindow, app: App) {
    if (this.initiated) return;
    // init
    this.socket = new Socket(new Transport(ipcMain, win.webContents));
    this.socket.open("replay");
    this.JSON_PATH = Path.resolve(app.getPath("userData"), "jsons/");
    // Start listeners
    this.startImportReplay();
    this.startLimiterListerners();
    this.initiated = true;
    console.log("Initiated ImportReplay listeners");
  }

  private static startImportReplay() {
    this.socket.onEvent(
      ImportReplayActions.REQ_IMPORT_REPLAY,
      async (req: Event) => {
        this.limiter.schedule(async () => {
          const replayFile = req.data as ReplayFile;
          console.log("Importing replay", replayFile.name);
          try {
            const { lastLine } = await importReplay(replayFile);
            const playerId = db.getPlayerId();
            const json = fileService.readFileAsObject<ReplayJSON>(lastLine!);
            const analysis = new CarballAnalysisHandler(json, playerId);
            const index = gameService.createReplayIndex(lastLine!, analysis);
            db.replayIndex().saveReplayIndex(json.gameMetadata.playlist, index);
            this.socket.send(ImportReplayActions.MSG_REPLAY_IMPORTED, {
              replayName: replayFile.name,
            } as ImportReplayResult);
          } catch (error) {
            console.error(error);
            this.socket.send(ImportReplayActions.MSG_REPLAY_IMPORTED, {
              replayName: replayFile.name,
              error: error.message,
            } as ImportReplayResult);
          }
        });
      },
    );
    console.log("Import event listener started");
  }

  private static startLimiterListerners() {
    this.limiter.on("idle", () => console.log("IDLE"));
    console.log("Import limiter listeners started!");
  }
}
