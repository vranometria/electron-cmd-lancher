import { app, BrowserWindow, ipcMain, globalShortcut } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import open from "open";
import fs from "fs";

const DATA_FILE = "data.json";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const DEVELOP = false;
const windowConfig = DEVELOP ? { width: 800, height: 600 } : { width: 300, height: 200 };

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
  const s = JSON.stringify(data, null, 2);
  try {
    fs.writeFileSync(DATA_FILE, s);
  } catch (err) {
    console.error("書き込み失敗", err);
  }
});

ipcMain.handle("load-shortcut", async (e) => {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  try {
    const s = fs.readFileSync(DATA_FILE, "utf8");
    const obj = JSON.parse(s);
    return obj.data;
  } catch (err) {
    console.error("同期読み込み失敗", err);
  }
});

ipcMain.handle("register-hotkey", async (e, hotkey) => {
  const ctrl = hotkey.ctrl ? "Control" : "";
  const alt = hotkey.alt ? "Alt" : "";
  const shift = hotkey.shift ? "Shift" : "";
  const key = hotkey.key.toUpperCase();
  const s = [ctrl, alt, shift, key].filter((v) => v).join("+");

  if (globalShortcut.isRegistered(s)) {
    return false;
  }

  globalShortcut.register(s, () => {
    mainWindow.show();
    mainWindow.focus();
  });
  return true;
});
