import fs from "fs";
import path from "path";
import { globalShortcut } from "electron";


/**
 * ファイルにデータを書き込む
 * @param {String} filepath 書き込み先ファイルパス
 * @param {Object} data 書き込むデータ
 * @returns 
 */
export const saveFile = (filepath, data) => {
  const dir = path.dirname(filepath);
  if(!fs.existsSync(dir)){
    fs.mkdirSync(dir, {recursive: true});
  }

  const s = JSON.stringify(data, null, 2);
    try {
      fs.writeFileSync(filepath, s);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
}

export const readFile = (filepath) => {
  const s = fs.readFileSync(filepath, "utf8");
  return JSON.parse(s);
}

export const registerHotkey = (hotkey, mainWindow) => {
  globalShortcut.unregisterAll();

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
}