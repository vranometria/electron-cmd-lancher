import { app, BrowserWindow, ipcMain, globalShortcut  } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import open from 'open';
import fs from 'fs';

const DATA_FILE = 'data.json';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 300,
    height: 200,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  globalShortcut.register('CommandOrControl+Shift+Y', () => {
    if (mainWindow) {
      // 最小化されてたら戻す
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.handle('log', async (e, s) => {
  console.log(s);
});

ipcMain.handle('execute', async (e, filepath) => {
  open(filepath);
});

ipcMain.handle('save-file', async (e, data) => {
  const s = JSON.stringify(data, null, 2);
  try {
    fs.writeFileSync(DATA_FILE, s);
  } catch (err) {
    console.error('書き込み失敗', err);
  }
});

ipcMain.handle('load-shortcut', async (e) => {
  if (!fs.existsSync(DATA_FILE)) { return []; }
  try {
    const s = fs.readFileSync(DATA_FILE, 'utf8');
    const obj = JSON.parse(s);
    return obj.data;
  } catch (err) {
    console.error('同期読み込み失敗', err);
  }
});