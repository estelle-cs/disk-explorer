import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  invoke: (channel: string, data?: any) => ipcRenderer.invoke(channel, data),
  send: (channel: string, data?: any) => ipcRenderer.send(channel, data),
  on: (channel: string, callback: (data: any) => void) =>
    ipcRenderer.on(channel, (_event, args) => callback(args)),
});