import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import { getFolderTree } from '../backend/scanner'; // ⚠️ adapte le chemin si besoin

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, '../../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL('http://localhost:5173');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  return result.filePaths[0];
});

ipcMain.handle('start-scan', async (_event, folderPath: string) => {
  try {
    const tree = await getFolderTree(folderPath);
    return tree;
  } catch (error) {
    throw error;
  }
});