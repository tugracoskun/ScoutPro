class AuthManager {
    constructor(app) {
        this.app = app;
    }

    async init() {
        // Uygulama açılır açılmaz dosyadan veriyi çekmeye çalış
        try {
            const savedData = await window.electronAPI.loadData();
            
            if (savedData) {
                this.app.state.data = savedData;
                console.log("Veriler dosyadan yüklendi.");
            } else {
                console.log("Kayıtlı veri bulunamadı, yeni dosya oluşturulacak.");
            }
            
            // Direkt başlat (Login ekranı yok artık, Obsidian gibi direkt açılır)
            this.app.navigate('dashboard');
            lucide.createIcons();
            
        } catch (error) {
            console.error("Veri yükleme hatası:", error);
            // Hata olsa bile boş veriyle başlat
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