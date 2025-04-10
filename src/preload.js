import { contextBridge, ipcRenderer, webUtils } from 'electron';

contextBridge.exposeInMainWorld('electronApi', {
    log: (s) => ipcRenderer.invoke('log', s),
    execute: (filepath) => ipcRenderer.invoke('execute', filepath),
    fullpath: (f) => {
        return webUtils.getPathForFile(f);
    },
    save: (data) => ipcRenderer.invoke('save-file', {data}),
    loadShortcut: () => ipcRenderer.invoke('load-shortcut'),
});