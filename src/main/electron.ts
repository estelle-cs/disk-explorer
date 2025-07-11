import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import { getFolderTree, countFiles } from '../backend/scanner'; // ⚠️ adapte le chemin si besoin

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

ipcMain.handle('start-scan', async (event, folderPath: string) => {
  const win = BrowserWindow.getFocusedWindow();
  const errors: { path: string; message: string }[] = [];
  try {
    const total = await countFiles(folderPath);
    const state = { current: 0 };

    const sendProgress = (count: number) => {
      win?.webContents.send('scan-progress', { current: count, total });
    };

    const sendError = (error: { path: string; message: string }) => {
      win?.webContents.send('scan-error', error);
      errors.push(error);
    };

    const tree = await getFolderTree(folderPath, sendProgress, state, sendError);

    return { tree, errors };
  } catch (error: any) {
    return {
      tree: null,
      errors: [...errors, { path: folderPath, message: error.message ?? "Erreur inconnue" }],
    };
  }
});