import { contextBridge, ipcRenderer, webUtils } from 'electron';

contextBridge.exposeInMainWorld('electronApi', {
    log: (s) => ipcRenderer.invoke('log', s),
    execute: (filepath) => ipcRenderer.invoke('execute', filepath),
    fullpath: (e) => ipcRenderer.invoke('fullpath', e),

    fullpath: (f) => {
        return webUtils.getPathForFile(f);
    },
});