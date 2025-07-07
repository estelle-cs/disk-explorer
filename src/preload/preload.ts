import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  send: (channel: string, data: any) => ipcRenderer.send(channel, data),
  on: (channel: string, callback: any) => ipcRenderer.on(channel, (_event, args) => callback(args)),
});
