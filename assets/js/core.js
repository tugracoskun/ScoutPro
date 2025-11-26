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
            case 'database': this.renderDatabase(c); break; // database.js
            case 'team-detail': this.renderTeamDetail(c, params); break; // database.js
            case 'matches': this.renderMatches(c); break; // matches.js
            case 'settings': this.renderSettings(c); break;
            case 'new-report': this.renderNewReport(c); break; // players-report.js
            case 'players': this.renderPlayers(c); break; // players-list.js
            case 'watchlist': this.renderWatchlist(c); break; // matches.js
        }
        lucide.createIcons();
    }

    // --- DASHBOARD (YENİLENMİŞ & DETAYLI TASARIM) ---
    renderDashboard(c) {
        // İstatistikleri Hesapla
        const playerCount = this.state.data.players.length;
        const watchlistCount = this.state.data.watchlist.length;
        const matchCount = this.state.data.matches.length;
        
        const countryCount = this.state.data.countries.length;
        const leagueCount = this.state.data.leagues.length;
        const teamCount = this.state.data.teams.length;

        // Sıradaki İlk Maçı Bul
        const now = new Date();
        const upcomingMatches = this.state.data.matches
            .filter(m => new Date(m.date) >= now)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        const nextMatch = upcomingMatches.length > 0 ? upcomingMatches[0] : null;
        
        // Helper: Takım ismini bulmak için
        const getTeam = (id) => { const t = this.state.data.teams.find(x => x.id == id); return t ? t.name : '???'; };

        c.innerHTML = `
            <div class="space-y-8 fade-in max-w-7xl mx-auto">
                
                <!-- 1. ÜST KISIM: ANA OPERASYON İSTATİSTİKLERİ -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Raporlanan -->
                    <div onclick="app.navigate('players')" class="bg-gradient-to-br from-dark-900 to-dark-950 border border-dark-800 p-6 rounded-2xl relative group cursor-pointer hover:border-scout-500/30 transition-all shadow-lg">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Raporlanan</p>
                                <h3 class="text-3xl font-black text-white group-hover:text-scout-400 transition-colors">${playerCount}</h3>
                            </div>
                            <div class="p-3 rounded-xl bg-scout-500/10 text-scout-500 group-hover:bg-scout-500 group-hover:text-white transition-all">
                                <i data-lucide="users" class="w-6 h-6"></i>
                            </div>
                        </div>
                        <p class="text-[10px] text-slate-500 mt-4">Detaylı analiz edilen oyuncular</p>
                    </div>

                    <!-- Aday Havuzu -->
                    <div onclick="app.navigate('watchlist')" class="bg-gradient-to-br from-dark-900 to-dark-950 border border-dark-800 p-6 rounded-2xl relative group cursor-pointer hover:border-blue-500/30 transition-all shadow-lg">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Aday Havuzu</p>
                                <h3 class="text-3xl font-black text-white group-hover:text-blue-400 transition-colors">${watchlistCount}</h3>
                            </div>
                            <div class="p-3 rounded-xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                <i data-lucide="eye" class="w-6 h-6"></i>
                            </div>
                        </div>
                        <p class="text-[10px] text-slate-500 mt-4">Takip listesindeki potansiyeller</p>
                    </div>

                    <!-- Maç Takibi -->
                    <div onclick="app.navigate('matches')" class="bg-gradient-to-br from-dark-900 to-dark-950 border border-dark-800 p-6 rounded-2xl relative group cursor-pointer hover:border-purple-500/30 transition-all shadow-lg">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Maç Programı</p>
                                <h3 class="text-3xl font-black text-white group-hover:text-purple-400 transition-colors">${matchCount}</h3>
                            </div>
                            <div class="p-3 rounded-xl bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all">
                                <i data-lucide="tv-2" class="w-6 h-6"></i>
                            </div>
                        </div>
                        <p class="text-[10px] text-slate-500 mt-4">Planlanan izleme görevleri</p>
                    </div>
                </div>

                <!-- 2. ORTA KISIM: VERİTABANI DETAYI VE SIRADAKİ MAÇ -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    <!-- Veritabanı Özeti (2 Kolon Genişliğinde) -->
                    <div class="lg:col-span-2 bg-dark-900 border border-dark-800 rounded-2xl p-6 shadow-lg">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="text-lg font-bold text-white flex items-center gap-2">
                                <i data-lucide="database" class="text-slate-400 w-5 h-5"></i> Veritabanı Durumu
                            </h3>
                            <button onclick="app.navigate('database')" class="text-xs bg-dark-800 hover:bg-dark-700 border border-dark-700 text-slate-300 px-3 py-1.5 rounded-lg transition-colors">Yönet</button>
                        </div>
                        
                        <div class="grid grid-cols-3 gap-4">
                            <!-- Ülke -->
                            <div class="bg-dark-950/50 border border-dark-800 p-4 rounded-xl text-center hover:border-dark-600 transition-colors">
                                <div class="text-2xl font-bold text-white mb-1">${countryCount}</div>
                                <div class="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center justify-center gap-1"><i data-lucide="globe" class="w-3 h-3"></i> Ülke</div>
                            </div>
                            <!-- Lig -->
                            <div class="bg-dark-950/50 border border-dark-800 p-4 rounded-xl text-center hover:border-dark-600 transition-colors">
                                <div class="text-2xl font-bold text-white mb-1">${leagueCount}</div>
                                <div class="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center justify-center gap-1"><i data-lucide="trophy" class="w-3 h-3"></i> Lig</div>
                            </div>
                            <!-- Takım -->
                            <div class="bg-dark-950/50 border border-dark-800 p-4 rounded-xl text-center hover:border-dark-600 transition-colors">
                                <div class="text-2xl font-bold text-white mb-1">${teamCount}</div>
                                <div class="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center justify-center gap-1"><i data-lucide="shield" class="w-3 h-3"></i> Takım</div>
                            </div>
                        </div>
                    </div>

                    <!-- Sıradaki Maç (1 Kolon Genişliğinde) -->
                    <div class="bg-dark-900 border border-dark-800 rounded-2xl p-1 relative overflow-hidden shadow-lg flex flex-col">
                        ${nextMatch ? `
                            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-scout-500 to-blue-500"></div>
                            <div class="p-5 flex flex-col h-full">
                                <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><i data-lucide="calendar-clock" class="w-4 h-4"></i> Sıradaki Maç</h3>
                                
                                <div class="flex-1 flex flex-col items-center justify-center text-center gap-3">
                                    <div class="text-xl font-black text-white leading-tight">
                                        ${getTeam(nextMatch.homeId)} <span class="text-slate-600 text-sm font-medium mx-1">vs</span> ${getTeam(nextMatch.awayId)}
                                    </div>
                                    <div class="bg-dark-950 px-4 py-2 rounded-lg border border-dark-800 text-scout-400 font-mono text-sm font-bold">
                                        ${new Date(nextMatch.date).toLocaleString('tr-TR', {weekday: 'short', hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                </div>

                                <button onclick="app.navigate('matches')" class="w-full mt-4 py-2 bg-dark-800 hover:bg-dark-700 text-white text-xs font-bold rounded-lg transition-colors">Listeye Git</button>
                            </div>
                        ` : `
                            <div class="flex flex-col items-center justify-center h-full p-6 text-center">
                                <div class="w-12 h-12 bg-dark-950 rounded-full flex items-center justify-center mb-3 text-slate-600">
                                    <i data-lucide="calendar-off" class="w-6 h-6"></i>
                                </div>
                                <p class="text-slate-500 text-sm">Yaklaşan maç bulunmuyor.</p>
                                <button onclick="app.navigate('matches')" class="mt-3 text-scout-400 text-xs font-bold hover:underline">Maç Planla</button>
                            </div>
                        `}
                    </div>

                </div>

                <!-- 3. ALT KISIM: HIZLI ERİŞİM -->
                <div class="bg-gradient-to-r from-scout-900/20 to-dark-900 border border-dark-800/50 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h4 class="text-lg font-bold text-white">Hızlı İşlemler</h4>
                        <p class="text-xs text-slate-400">Sık kullanılan özelliklere buradan ulaşın.</p>
                    </div>
                    <div class="flex gap-3">
                        <button onclick="app.navigate('new-report')" class="px-5 py-2.5 bg-scout-600 hover:bg-scout-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-scout-900/20 transition-transform hover:scale-105"><i data-lucide="file-plus" class="w-4 h-4"></i> Rapor Oluştur</button>
                        <button onclick="app.openQuickAddTeamModal()" class="px-5 py-2.5 bg-dark-800 hover:bg-dark-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 border border-dark-700 transition-transform hover:scale-105"><i data-lucide="plus" class="w-4 h-4"></i> Hızlı Takım Ekle</button>
                    </div>
                </div>

            </div>
        `;
    }

    renderSettings(c) {
        c.innerHTML = `
            <div class="max-w-3xl mx-auto fade-in space-y-6">
                <div class="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
                    <div class="p-6 border-b border-dark-800"><h3 class="text-lg font-bold text-white">Ayarlar</h3></div>
                    <div class="p-6 space-y-6">
                        <div class="flex items-center justify-between p-4 bg-dark-950 rounded-xl border border-dark-800">
                            <div class="flex items-center gap-4"><div class="p-3 bg-dark-800 rounded-lg"><i data-lucide="moon" class="w-5 h-5 text-slate-300"></i></div><div><div class="text-white font-medium">Karanlık Mod</div><div class="text-slate-500 text-xs">Varsayılan tema</div></div></div>
                        </div>
                    </div>
                </div>

                <!-- VERİ YÖNETİMİ & YEDEKLEME -->
                <div class="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
                    <div class="p-6 border-b border-dark-800"><h3 class="text-lg font-bold text-white flex items-center gap-2"><i data-lucide="hard-drive" class="text-scout-500"></i> Veri Yönetimi</h3></div>
                    <div class="p-6 space-y-4">
                        <p class="text-sm text-slate-400 mb-4">Verilerinizi yedekleyebilir veya başka bir cihazdan aldığınız yedeği yükleyebilirsiniz.</p>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button onclick="app.backupData()" class="p-4 bg-dark-950 border border-dark-800 hover:border-scout-500/50 rounded-xl flex items-center gap-4 transition-all group">
                                <div class="w-12 h-12 rounded-lg bg-scout-500/10 flex items-center justify-center text-scout-500 group-hover:bg-scout-500 group-hover:text-white transition-colors"><i data-lucide="download" class="w-6 h-6"></i></div>
                                <div class="text-left"><div class="text-white font-bold">Yedek Al (Export)</div><div class="text-xs text-slate-500">Verileri JSON dosyası olarak kaydet.</div></div>
                            </button>

                            <button onclick="app.restoreData()" class="p-4 bg-dark-950 border border-dark-800 hover:border-blue-500/50 rounded-xl flex items-center gap-4 transition-all group">
                                <div class="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors"><i data-lucide="upload" class="w-6 h-6"></i></div>
                                <div class="text-left"><div class="text-white font-bold">Yedek Yükle (Import)</div><div class="text-xs text-slate-500">JSON dosyasından verileri geri yükle.</div></div>
                            </button>
                        </div>
                    </div>
                </div>

                <button onclick="window.location.reload()" class="w-full p-4 bg-red-900/10 border border-red-900/30 rounded-xl hover:bg-red-900/20 text-red-400 transition-colors flex items-center justify-center gap-2"><i data-lucide="refresh-cw" class="w-5 h-5"></i> Uygulamayı Yeniden Başlat</button>
            </div>
        `;
    }

    // --- YEDEKLEME VE GERİ YÜKLEME FONKSİYONLARI ---
    
    async backupData() {
        const result = await window.electronAPI.exportBackup(this.state.data);
        if (result.success) {
            this.notify("Yedekleme başarıyla kaydedildi.");
        } else if (!result.cancelled) {
            this.notify("Yedekleme hatası: " + result.error);
        }
    }

    async restoreData() {
        this.confirmAction("DİKKAT: Yedek dosyasını yüklediğinizde mevcut tüm veriler silinecek ve yedeğin üzerine yazılacaktır. Devam etmek istiyor musunuz?", async () => {
            
            const result = await window.electronAPI.importBackup();
            
            if (result.success && result.data) {
                this.state.data = result.data;
                this.saveData(); // Yeni veriyi hemen kaydet
                this.notify("Veriler başarıyla yüklendi!");
                
                // Kullanıcı değişikliği fark etsin diye kısa bir süre sonra yenile
                setTimeout(() => window.location.reload(), 1500); 
            } else if (!result.cancelled) {
                this.notify("Yükleme hatası: " + result.error);
            }
        });
    }

    showModal(html) {
        const content = document.getElementById('modal-content');
        content.innerHTML = html;
        document.getElementById('modal-overlay').classList.remove('hidden');
        lucide.createIcons();
    }
    
    closeModal() { document.getElementById('modal-overlay').classList.add('hidden'); }

    toggleSidebar() {
        this.state.isSidebarCollapsed = !this.state.isSidebarCollapsed;
        this.updateSidebarUI();
    }

    updateSidebarUI() {
        const sidebar = document.getElementById('sidebar');
        const icon = document.getElementById('sidebar-toggle-icon');
        if (this.state.isSidebarCollapsed) {
            sidebar.classList.add('w-20', 'sidebar-collapsed'); sidebar.classList.remove('w-72'); if(icon) icon.style.transform = 'rotate(180deg)';
        } else {
            sidebar.classList.remove('w-20', 'sidebar-collapsed'); sidebar.classList.add('w-72'); if(icon) icon.style.transform = 'rotate(0deg)';
        }
        document.querySelectorAll('.nav-item').forEach(item => item.className = 'nav-item w-full flex items-center p-3 rounded-xl text-slate-400 hover:bg-dark-800 hover:text-white transition-all group');
        const activeItem = document.getElementById(`nav-${this.state.activePage}`);
        if (activeItem) activeItem.className = 'nav-item w-full flex items-center p-3 rounded-xl bg-scout-500/10 text-scout-400 border border-scout-500/20 transition-all group';
    }

    handleSearch(val) {
        this.state.searchTerm = val.toLowerCase();
        if(this.state.activePage === 'players' || this.state.activePage === 'watchlist') this.navigate(this.state.activePage);
        else this.navigate('players');
    }
}