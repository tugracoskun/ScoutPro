const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const crypto = require('crypto');
const { pathToFileURL } = require('url');

// Verilerin kaydedileceği varsayılan dosya yolu (AppData içinde)
const dataPath = path.join(app.getPath('userData'), 'scout_data.json');
const imageCacheDir = path.join(app.getPath('userData'), 'image_cache');

if (!fs.existsSync(imageCacheDir)) {
    try { fs.mkdirSync(imageCacheDir, { recursive: true }); } catch(e) {}
}

function getUrlHash(url) {
    return crypto.createHash('md5').update(url).digest('hex');
}

function downloadAndCacheImage(url, maxRedirects = 3) {
    return new Promise((resolve) => {
        if (!url || typeof url !== 'string' || (!url.startsWith('http://') && !url.startsWith('https://'))) {
            return resolve(null);
        }

        const extMatch = url.split('?')[0].match(/\.(png|jpg|jpeg|svg|webp|gif|ico)$/i);
        const ext = extMatch ? extMatch[1].toLowerCase() : 'png';
        const hash = getUrlHash(url);
        const filename = `${hash}.${ext}`;
        const filePath = path.join(imageCacheDir, filename);

        if (fs.existsSync(filePath)) {
            try {
                return resolve(pathToFileURL(filePath).href);
            } catch (err) {
                // Read error, fallback to re-downloading
            }
        }

        const client = url.startsWith('https') ? https : http;
        const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ScoutPro/1.0' } }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && maxRedirects > 0) {
                let redirectUrl = res.headers.location;
                if (redirectUrl.startsWith('/')) {
                    const parsed = new URL(url);
                    redirectUrl = `${parsed.protocol}//${parsed.host}${redirectUrl}`;
                }
                return downloadAndCacheImage(redirectUrl, maxRedirects - 1).then(resolve);
            }

            if (res.statusCode !== 200) {
                return resolve(null);
            }

            const chunks = [];
            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => {
                const buffer = Buffer.concat(chunks);
                try {
                    fs.writeFileSync(filePath, buffer);
                    resolve(pathToFileURL(filePath).href);
                } catch (e) {
                    resolve(null);
                }
            });
        });

        req.on('error', () => resolve(null));
        req.setTimeout(10000, () => {
            req.destroy();
            resolve(null);
        });
    });
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        icon: path.join(__dirname, 'assets/logo.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            webviewTag: true // <-- BU ÇOK ÖNEMLİ (Uygulama içi tarayıcı için şart)
        }
    });

    win.loadFile('index.html');
    win.setMenuBarVisibility(false); // Menü çubuğunu gizle

    // Mouse Geri/İleri tuşlarını yakala ve frontend'e ilet
    win.on('app-command', (e, cmd) => {
        if (cmd === 'browser-backward' || cmd === 'browser-forward') {
            win.webContents.send('mouse-navigation', cmd);
        }
    });

    // Yeni pencere açılmasını engelle (Popup'lar uygulamanın dışına taşmasın)
    win.webContents.setWindowOpenHandler(({ url }) => {
        return { action: 'deny' };
    });
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

// --- ARKA PLAN İŞLEMLERİ (IPC HANDLERS) ---

// 1. Otomatik Kayıt (Save Data)
ipcMain.handle('save-data', async (event, data) => {
    try {
        fs.writeFileSync(dataPath, JSON.stringify(data));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// 2. Otomatik Yükleme (Load Data)
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

// 3. YEDEK ALMA (Export Backup)
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

// 4. YEDEK YÜKLEME (Import Backup)
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

// 5. Harici Tarayıcıda Link Açma
ipcMain.handle('open-external', async (event, url) => {
    shell.openExternal(url);
});

// 6. GÖRSEL ÖNBELLEKLEME HİZMETLERİ (Offline Media & Logo Caching)
ipcMain.handle('cache-images', async (event, urls) => {
    if (!Array.isArray(urls) || urls.length === 0) return {};
    
    const results = {};
    const batchSize = 5; // Concurrency limit
    for (let i = 0; i < urls.length; i += batchSize) {
        const chunk = urls.slice(i, i + batchSize);
        await Promise.all(chunk.map(async (url) => {
            const cachedData = await downloadAndCacheImage(url);
            if (cachedData) {
                results[url] = cachedData;
            }
        }));
    }
    return results;
});

ipcMain.handle('get-cache-info', async () => {
    try {
        if (!fs.existsSync(imageCacheDir)) {
            return { count: 0, sizeBytes: 0 };
        }
        const files = fs.readdirSync(imageCacheDir);
        let totalSize = 0;
        files.forEach((file) => {
            try {
                const stat = fs.statSync(path.join(imageCacheDir, file));
                totalSize += stat.size;
            } catch (e) {}
        });
        return { count: files.length, sizeBytes: totalSize };
    } catch (e) {
        return { count: 0, sizeBytes: 0 };
    }
});

ipcMain.handle('clear-image-cache', async () => {
    try {
        if (fs.existsSync(imageCacheDir)) {
            const files = fs.readdirSync(imageCacheDir);
            files.forEach((file) => {
                try { fs.unlinkSync(path.join(imageCacheDir, file)); } catch (e) {}
            });
        }
        return { success: true };
    } catch (e) {
        return { success: false, error: e.message };
    }
});

ipcMain.handle('restart-app', async () => {
    app.relaunch();
    app.exit(0);
});