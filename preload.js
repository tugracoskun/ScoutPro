const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    saveData: (data) => ipcRenderer.invoke('save-data', data),
    loadData: () => ipcRenderer.invoke('load-data'),
    
    // Yeni Özellikler:
    exportBackup: (data) => ipcRenderer.invoke('export-backup', data),
    importBackup: () => ipcRenderer.invoke('import-backup')
});