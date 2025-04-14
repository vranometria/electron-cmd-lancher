import { app, BrowserWindow, ipcMain, globalShortcut } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import open from "open";
import fs from "fs";

import { saveFile, readFile, registerHotkey } from "./utils";

const DEVELOP = false;
const windowConfig = DEVELOP ? { width: 800, height: 600 } : { width: 300, height: 200 };

const DATA_FILE = ".\\data\\data.json";
const HOTKEY_DATA_FILE = ".\\data\\hotkey.json";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    ...windowConfig,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools.
  if (DEVELOP) {
    mainWindow.webContents.openDevTools();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.handle("log", async (e, s) => {
  console.log(s);
});

ipcMain.handle("execute", async (e, filepath) => {
  open(filepath);
  mainWindow.hide();
});

ipcMain.handle("save-file", async (e, data) => {
  if(!saveFile(DATA_FILE, data)){
    console.error("file writing fail!");
  }
});

ipcMain.handle("load-shortcut", async (e) => {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  const obj = readFile(DATA_FILE);
  return obj.data;
});

ipcMain.handle("register-hotkey", async (e, hotkey) => {
  if(!registerHotkey(hotkey)){
    return false;
  }

  saveFile(HOTKEY_DATA_FILE, hotkey)
  return true;
});

ipcMain.handle("load-hotkey", async (e) => {
  console.info("hotkey init.");
  if (!fs.existsSync(HOTKEY_DATA_FILE)) {
    console.info("hotkey data not found");
    return {key: "", ctrl: false, alt: false, shift: false};
  }
  const hotkey = readFile(HOTKEY_DATA_FILE);
  if(!registerHotkey(hotkey, mainWindow)){
    console.error("hotkey registration error!");
  }
  console.info("hotkey registered", hotkey);
  return hotkey;
});