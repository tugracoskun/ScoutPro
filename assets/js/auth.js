class AuthManager {
    constructor(app) {
        this.app = app;
    }

    async init() {
        try {
            const savedData = await window.electronAPI.loadData();
            
            if (savedData) {
                this.app.state.data = savedData;
                console.log("Veriler dosyadan yüklendi.");
            } else {
                console.log("Kayıtlı veri bulunamadı, yeni dosya oluşturulacak.");
            }
            
            // FIX: Önce Layout'u çiz (Sidebar ve Header gelsin)
            if (this.app.renderLayout) {
                this.app.renderLayout();
            }
            
            // SONRA Navigate et (Artık sidebar var, hata vermez)
            this.app.navigate('dashboard');
            lucide.createIcons();
            
        } catch (error) {
            console.error("Veri yükleme hatası:", error);
            
            // Hata olsa bile Layout'u çiz
            if (this.app.renderLayout) this.app.renderLayout();
            
            this.app.navigate('dashboard');
            lucide.createIcons();
        }
    }

    // Dosyaya kaydetme fonksiyonu
    async saveUserData() {
        const dataToSave = this.app.state.data;
        const result = await window.electronAPI.saveData(dataToSave);
        if(result.success) {
            console.log("Dosyaya kaydedildi.");
        } else {
            console.error("Kaydetme hatası:", result.error);
        }
    }
}