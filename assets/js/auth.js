class AuthManager {
    constructor(app) {
        this.app = app;
    }

    async init() {
        try {
            const savedData = await window.electronAPI.loadData();
            
            if (savedData) {
                this.app.state.data = savedData;
                
                // MIGRATION: Eğer ülkeler tam liste değilse veya region yoksa veya bayraklar resim formatında değilse DB'yi güncelle
                if (!this.app.state.data.countries || this.app.state.data.countries.length < 200 || (this.app.state.data.countries[0] && (!this.app.state.data.countries[0].region || !this.app.state.data.countries[0].flag.startsWith('http')))) {
                    const favorites = this.app.state.data.countries ? this.app.state.data.countries.filter(c => c.isFavorite).map(c => c.id) : [];
                    this.app.state.data.countries = DB.countries;
                    favorites.forEach(id => {
                        const c = this.app.state.data.countries.find(x => x.id === id);
                        if(c) c.isFavorite = true;
                    });
                    this.saveUserData(); // Güncellenmiş listeyi kaydet
                }

                // MIGRATION: Takımlara type ekle (varsayılan: club)
                let teamsUpdated = false;
                if (this.app.state.data.teams) {
                    this.app.state.data.teams.forEach(t => {
                        if (!t.type) {
                            t.type = 'club';
                            teamsUpdated = true;
                        }
                    });
                }
                if (teamsUpdated) {
                    this.saveUserData();
                }
                
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