class ScoutApp {
    constructor() {
        this.state = {
            activePage: 'dashboard',
            isSidebarCollapsed: false,
            data: DB, // data.js dosyasından geliyor
            searchTerm: '',
            newReport: this.resetReport(),
            tempData: {}
        };
    }

    init() {
        // Sadece ESC tuşu dinleyicisi
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }
    
    // --- MERKEZİ KAYIT FONKSİYONU ---
    saveData() {
        if (typeof auth !== 'undefined') {
            auth.saveUserData();
        }
    }

    // --- YENİ: FAVORİ EKLEME/ÇIKARMA ---
    toggleFavorite(id, type) {
        // type: 'player' (Raporlu) veya 'watchlist' (Aday)
        let list = type === 'player' ? this.state.data.players : this.state.data.watchlist;
        const item = list.find(x => x.id === id);
        
        if (item) {
            // Durumu tersine çevir (True <-> False)
            item.isFavorite = !item.isFavorite;
            this.saveData();

            // Sadece ilgili sayfadaysak o sayfayı yenile
            // (Böylece sayfa titremez, sadece ikon değişir)
            if (this.state.activePage === 'players' && type === 'player') {
                this.renderPlayers(document.getElementById('content-area'));
            } else if (this.state.activePage === 'watchlist' && type === 'watchlist') {
                this.renderWatchlist(document.getElementById('content-area'));
            } else if (this.state.activePage === 'dashboard') {
                // Dashboard'da favori listesi olursa orayı da yenilemek gerekir (İlerde)
                this.renderDashboard(document.getElementById('content-area'));
            }
            
            // Kullanıcıya küçük bir geri bildirim (Opsiyonel)
            // if(item.isFavorite) this.notify("Favorilere eklendi");
        }
    }

    resetReport() {
        return { name: '', teamId: '', position: '', age: '', height: '', foot: 'Sağ', marketValue: '', image: '', source: '', tmUrl: '', sofaUrl: '', potential: 'Düşük', stats: {} };
    }

    navigate(page, params = null) {
        this.state.activePage = page;
        this.updateSidebarUI();
        const c = document.getElementById('content-area');
        c.innerHTML = '';

        const titles = {
            'dashboard': ['Dashboard', 'Genel Bakış'],
            'new-report': ['Yeni Rapor', 'Oyuncu Ekle'],
            'database': ['Veritabanı', 'Takım Yönetimi'],
            'players': ['Oyuncu Havuzu', 'Raporlanmışlar'],
            'watchlist': ['Aday Havuzu', 'Takip Listesi'],
            'matches': ['Maç İzleme', 'Fikstür Planlama'],
            'settings': ['Ayarlar', 'Sistem'],
            'team-detail': ['Takım Detayı', 'Analiz']
        };
        if(titles[page]) {
            document.getElementById('page-title').innerText = titles[page][0];
            document.getElementById('page-subtitle').innerText = titles[page][1];
        }

        switch(page) {
            case 'dashboard': this.renderDashboard(c); break;
            case 'database': this.renderDatabase(c); break; 
            case 'team-detail': this.renderTeamDetail(c, params); break;
            case 'matches': this.renderMatches(c); break;
            case 'settings': this.renderSettings(c); break;
            case 'new-report': this.renderNewReport(c); break;
            case 'players': this.renderPlayers(c); break; // players-list.js
            case 'watchlist': this.renderWatchlist(c); break; // matches.js
        }
        lucide.createIcons();
    }

    renderDashboard(c) {
        const playerCount = this.state.data.players.length;
        const watchlistCount = this.state.data.watchlist.length;
        const matchCount = this.state.data.matches.length;
        const countryCount = this.state.data.countries.length;
        const leagueCount = this.state.data.leagues.length;
        const teamCount = this.state.data.teams.length;

        const now = new Date();
        const upcomingMatches = this.state.data.matches
            .filter(m => new Date(m.date) >= now)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        const nextMatch = upcomingMatches.length > 0 ? upcomingMatches[0] : null;
        const getTeam = (id) => { const t = this.state.data.teams.find(x => x.id == id); return t ? t.name : '???'; };

        c.innerHTML = `
            <div class="space-y-8 fade-in max-w-7xl mx-auto">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div onclick="app.navigate('players')" class="bg-gradient-to-br from-dark-900 to-dark-950 border border-dark-800 p-6 rounded-2xl relative group cursor-pointer hover:border-scout-500/30 transition-all shadow-lg">
                        <div class="flex justify-between items-start"><div><p class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Raporlanan</p><h3 class="text-3xl font-black text-white group-hover:text-scout-400 transition-colors">${playerCount}</h3></div><div class="p-3 rounded-xl bg-scout-500/10 text-scout-500 group-hover:bg-scout-500 group-hover:text-white transition-all"><i data-lucide="users" class="w-6 h-6"></i></div></div><p class="text-[10px] text-slate-500 mt-4">Detaylı analiz edilen oyuncular</p>
                    </div>
                    <div onclick="app.navigate('watchlist')" class="bg-gradient-to-br from-dark-900 to-dark-950 border border-dark-800 p-6 rounded-2xl relative group cursor-pointer hover:border-blue-500/30 transition-all shadow-lg">
                        <div class="flex justify-between items-start"><div><p class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Aday Havuzu</p><h3 class="text-3xl font-black text-white group-hover:text-blue-400 transition-colors">${watchlistCount}</h3></div><div class="p-3 rounded-xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all"><i data-lucide="eye" class="w-6 h-6"></i></div></div><p class="text-[10px] text-slate-500 mt-4">Takip listesindeki potansiyeller</p>
                    </div>
                    <div onclick="app.navigate('matches')" class="bg-gradient-to-br from-dark-900 to-dark-950 border border-dark-800 p-6 rounded-2xl relative group cursor-pointer hover:border-purple-500/30 transition-all shadow-lg">
                        <div class="flex justify-between items-start"><div><p class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Maç Programı</p><h3 class="text-3xl font-black text-white group-hover:text-purple-400 transition-colors">${matchCount}</h3></div><div class="p-3 rounded-xl bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all"><i data-lucide="tv-2" class="w-6 h-6"></i></div></div><p class="text-[10px] text-slate-500 mt-4">Planlanan izleme görevleri</p>
                    </div>
                </div>
                <!-- ... Dashboard'un geri kalanı aynı ... -->
            </div>
        `;
    }
    
    // ... Diğer fonksiyonlar (renderSettings, showModal vb.) ...
    renderSettings(c) { /* ... (Eski kodun aynısı) ... */ c.innerHTML = `<div class="max-w-3xl mx-auto fade-in space-y-6"><div class="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden"><div class="p-6 border-b border-dark-800"><h3 class="text-lg font-bold text-white">Ayarlar</h3></div><div class="p-6 space-y-6"><div class="flex items-center justify-between p-4 bg-dark-950 rounded-xl border border-dark-800"><div class="flex items-center gap-4"><div class="p-3 bg-dark-800 rounded-lg"><i data-lucide="moon" class="w-5 h-5 text-slate-300"></i></div><div><div class="text-white font-medium">Karanlık Mod</div><div class="text-slate-500 text-xs">Varsayılan tema</div></div></div></div></div></div><div class="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden"><div class="p-6 border-b border-dark-800"><h3 class="text-lg font-bold text-white flex items-center gap-2"><i data-lucide="hard-drive" class="text-scout-500"></i> Veri Yönetimi</h3></div><div class="p-6 space-y-4"><p class="text-sm text-slate-400 mb-4">Verilerinizi yedekleyebilir veya başka bir cihazdan aldığınız yedeği yükleyebilirsiniz.</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><button onclick="app.backupData()" class="p-4 bg-dark-950 border border-dark-800 hover:border-scout-500/50 rounded-xl flex items-center gap-4 transition-all group"><div class="w-12 h-12 rounded-lg bg-scout-500/10 flex items-center justify-center text-scout-500 group-hover:bg-scout-500 group-hover:text-white transition-colors"><i data-lucide="download" class="w-6 h-6"></i></div><div class="text-left"><div class="text-white font-bold">Yedek Al (Export)</div><div class="text-xs text-slate-500">Verileri JSON dosyası olarak kaydet.</div></div></button><button onclick="app.restoreData()" class="p-4 bg-dark-950 border border-dark-800 hover:border-blue-500/50 rounded-xl flex items-center gap-4 transition-all group"><div class="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors"><i data-lucide="upload" class="w-6 h-6"></i></div><div class="text-left"><div class="text-white font-bold">Yedek Yükle (Import)</div><div class="text-xs text-slate-500">JSON dosyasından verileri geri yükle.</div></div></button></div></div></div><button onclick="window.location.reload()" class="w-full p-4 bg-red-900/10 border border-red-900/30 rounded-xl hover:bg-red-900/20 text-red-400 transition-colors flex items-center justify-center gap-2"><i data-lucide="refresh-cw" class="w-5 h-5"></i> Uygulamayı Yeniden Başlat</button></div>`; }
    async backupData() { const result = await window.electronAPI.exportBackup(this.state.data); if (result.success) { this.notify("Yedekleme başarıyla kaydedildi."); } else if (!result.cancelled) { this.notify("Yedekleme hatası: " + result.error); } }
    async restoreData() { this.confirmAction("DİKKAT: Yedek dosyasını yüklediğinizde mevcut tüm veriler silinecek ve yedeğin üzerine yazılacaktır. Devam etmek istiyor musunuz?", async () => { const result = await window.electronAPI.importBackup(); if (result.success && result.data) { this.state.data = result.data; this.saveData(); this.notify("Veriler başarıyla yüklendi!"); setTimeout(() => window.location.reload(), 1500); } else if (!result.cancelled) { this.notify("Yükleme hatası: " + result.error); } }); }
    showModal(html) { const content = document.getElementById('modal-content'); content.innerHTML = html; document.getElementById('modal-overlay').classList.remove('hidden'); lucide.createIcons(); }
    closeModal() { document.getElementById('modal-overlay').classList.add('hidden'); }
    toggleSidebar() { this.state.isSidebarCollapsed = !this.state.isSidebarCollapsed; this.updateSidebarUI(); }
    updateSidebarUI() { const sidebar = document.getElementById('sidebar'); const icon = document.getElementById('sidebar-toggle-icon'); if (this.state.isSidebarCollapsed) { sidebar.classList.add('w-20', 'sidebar-collapsed'); sidebar.classList.remove('w-72'); if(icon) icon.style.transform = 'rotate(180deg)'; } else { sidebar.classList.remove('w-20', 'sidebar-collapsed'); sidebar.classList.add('w-72'); if(icon) icon.style.transform = 'rotate(0deg)'; } document.querySelectorAll('.nav-item').forEach(item => item.className = 'nav-item w-full flex items-center p-3 rounded-xl text-slate-400 hover:bg-dark-800 hover:text-white transition-all group'); const activeItem = document.getElementById(`nav-${this.state.activePage}`); if (activeItem) activeItem.className = 'nav-item w-full flex items-center p-3 rounded-xl bg-scout-500/10 text-scout-400 border border-scout-500/20 transition-all group'; }
    handleSearch(val) { this.state.searchTerm = val.toLowerCase(); if(this.state.activePage === 'players' || this.state.activePage === 'watchlist') this.navigate(this.state.activePage); else this.navigate('players'); }
}