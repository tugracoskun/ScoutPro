const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    saveData: (data) => ipcRenderer.invoke('save-data', data),
    loadData: () => ipcRenderer.invoke('load-data'),

    // Yeni Özellikler:
    exportBackup: (data) => ipcRenderer.invoke('export-backup', data),
    importBackup: () => ipcRenderer.invoke('import-backup'),
    openExternal: (url) => ipcRenderer.invoke('open-external', url),
    
    // Mouse navigasyon tuşları dinleyicisi
    onMouseNavigation: (callback) => ipcRenderer.on('mouse-navigation', (event, cmd) => callback(cmd))
});