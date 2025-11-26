const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// Verilerin kaydedileceği varsayılan dosya yolu (AppData içinde)
const dataPath = path.join(app.getPath('userData'), 'scout_data.json');

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        icon: path.join(__dirname, 'assets/icon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    win.loadFile('index.html');
    win.setMenuBarVisibility(false); // Menü çubuğunu gizle
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// --- IPC HANDLERS (Arka Plan İşlemleri) ---

// 1. Otomatik Kayıt
ipcMain.handle('save-data', async (event, data) => {
    try {
        fs.writeFileSync(dataPath, JSON.stringify(data));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// 2. Otomatik Yükleme
ipcMain.handle('load-data', async () => {
    try {
        if (fs.existsSync(dataPath)) {
            const data = fs.readFileSync(dataPath, 'utf8');
            return JSON.parse(data);
        }
        return null;
    } catch (error) {
        return null;
    }
});

// 3. YEDEK ALMA (Export) - EKSİK OLAN KISIM BUYDU
ipcMain.handle('export-backup', async (event, data) => {
    const { filePath } = await dialog.showSaveDialog({
        title: 'Yedek Dosyasını Kaydet',
        defaultPath: 'scoutpro-yedek.json',
        filters: [{ name: 'JSON Dosyası', extensions: ['json'] }]
    });

    if (filePath) {
        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            return { success: true };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }
    return { success: false, cancelled: true };
});

// 4. YEDEK YÜKLEME (Import) - EKSİK OLAN KISIM BUYDU
ipcMain.handle('import-backup', async () => {
    const { filePaths } = await dialog.showOpenDialog({
        title: 'Yedek Dosyası Seç',
        filters: [{ name: 'JSON Dosyası', extensions: ['json'] }],
        properties: ['openFile']
    });

    if (filePaths && filePaths.length > 0) {
        try {
            const content = fs.readFileSync(filePaths[0], 'utf8');
            return { success: true, data: JSON.parse(content) };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }
    return { success: false, cancelled: true };
});