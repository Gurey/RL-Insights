import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { downloadFile } from "./downloadFile";
import { ImportReplay } from "./importReplay/importReplay";

ipcMain.handle("downloadFile", async (event, args) => {
  const [url, path, progressChannel] = args;
  downloadFile(event, url, path, progressChannel);
});

declare global {
  const MAIN_WINDOW_WEBPACK_ENTRY: string;
}

console.log(process.versions);

// It will change to be "true" in Electron 9.
// For more information please check https://github.com/electron/electron/issues/18397
app.allowRendererProcessReuse = true;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: null | BrowserWindow;

const createWindow = () => {
  /**add chrome dev tools */
  addReactDevTools();

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });
  ImportReplay.init(mainWindow, app);

  // and load the index.html of the app.

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  //setTimeout(() => {
  mainWindow!.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  //}, 1000);
  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

function addReactDevTools() {
  const devToolsModule = path.join(process.cwd(), "lib", "react-dev-tools");
  // session.addDevToolsExtension(devToolsModule);
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
