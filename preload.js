const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    saveData: (data) => ipcRenderer.invoke('save-data', data),
    loadData: () => ipcRenderer.invoke('load-data'),

    // Yedekleme & Harici İşlemler
    exportBackup: (data) => ipcRenderer.invoke('export-backup', data),
    importBackup: () => ipcRenderer.invoke('import-backup'),
    openExternal: (url) => ipcRenderer.invoke('open-external', url),

    // Görsel Önbellekleme (Offline Logolar ve Yüzler)
    cacheImages: (urls) => ipcRenderer.invoke('cache-images', urls),
    getCacheInfo: () => ipcRenderer.invoke('get-cache-info'),
    clearImageCache: () => ipcRenderer.invoke('clear-image-cache'),
    restartApp: () => ipcRenderer.invoke('restart-app'),
    
    // Mouse navigasyon tuşları dinleyicisi
    onMouseNavigation: (callback) => ipcRenderer.on('mouse-navigation', (event, cmd) => callback(cmd))
});