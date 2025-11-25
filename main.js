const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Verilerin kaydedileceği dosya yolu (Belgelerim/ScoutProData.json)
const dataPath = path.join(app.getPath('userData'), 'scout_data.json');

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        icon: path.join(__dirname, 'assets/icon.png'), // İkon varsa
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false, // Güvenlik için kapalı
            contextIsolation: true  // Güvenlik için açık
        }
    });

    win.loadFile('index.html');
    // win.webContents.openDevTools(); // Geliştirici konsolunu açmak için (isteğe bağlı)
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

// --- DOSYA İŞLEMLERİ (Front-End ile Haberleşme) ---

// Veriyi Kaydet
ipcMain.handle('save-data', async (event, data) => {
    try {
        fs.writeFileSync(dataPath, JSON.stringify(data));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Veriyi Oku
ipcMain.handle('load-data', async () => {
    try {
        if (fs.existsSync(dataPath)) {
            const data = fs.readFileSync(dataPath, 'utf8');
            return JSON.parse(data);
        }
        return null; // Dosya yoksa null dön
    } catch (error) {
        return null;
    }
});