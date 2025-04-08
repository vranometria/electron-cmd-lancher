import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronApi', {
    log: (s) => ipcRenderer.invoke('log', s),
});