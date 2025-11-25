class ScoutApp {
    constructor() {
        this.state = {
            activePage: 'dashboard',
            isSidebarCollapsed: false,
            data: DB,
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
    
    // --- MERKEZİ KAYIT FONKSİYONU (ELECTRON) ---
    saveData() {
        if (typeof auth !== 'undefined') {
            auth.saveUserData(); // Artık dosyaya yazar
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

    renderDashboard(c) {
        c.innerHTML = `
            <div class="space-y-8 fade-in">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    ${this.createStatCard('Raporlanan', this.state.data.players.length, 'Oyuncu', 'users', 'text-scout-400', 'bg-scout-500/10')}
                    ${this.createStatCard('Aday Havuzu', this.state.data.watchlist.length, 'Not', 'eye', 'text-blue-400', 'bg-blue-500/10')}
                    ${this.createStatCard('Veritabanı', this.state.data.teams.length, 'Takım', 'database', 'text-amber-400', 'bg-amber-500/10')}
                    ${this.createStatCard('Maç Takibi', this.state.data.matches.length, 'Maç', 'tv-2', 'text-purple-400', 'bg-purple-500/10')}
                </div>
                <div class="bg-dark-900 border border-dark-800 rounded-2xl p-8 text-center">
                    <h3 class="text-xl font-bold text-white mb-2">Hoş Geldiniz</h3>
                    <p class="text-slate-400 max-w-2xl mx-auto mb-6">Sistem şu an boş bir veritabanı ile çalışıyor.</p>
                    <div class="flex justify-center gap-4">
                        <button onclick="app.navigate('database')" class="px-6 py-3 bg-dark-800 hover:bg-dark-700 text-white rounded-xl font-medium transition-colors">Veritabanı Oluştur</button>
                        <button onclick="app.navigate('matches')" class="px-6 py-3 bg-scout-600 hover:bg-scout-500 text-white rounded-xl font-medium transition-colors">Maç Planla</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderSettings(c) {
        c.innerHTML = `
            <div class="max-w-3xl mx-auto fade-in bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
                <div class="p-6 border-b border-dark-800"><h3 class="text-lg font-bold text-white">Ayarlar</h3></div>
                <div class="p-6 space-y-6">
                    <div class="flex items-center justify-between p-4 bg-dark-950 rounded-xl border border-dark-800">
                        <div class="flex items-center gap-4"><div class="p-3 bg-dark-800 rounded-lg"><i data-lucide="moon" class="w-5 h-5 text-slate-300"></i></div><div><div class="text-white font-medium">Karanlık Mod</div><div class="text-slate-500 text-xs">Varsayılan tema</div></div></div>
                    </div>
                    <button onclick="window.location.reload()" class="w-full p-4 bg-red-900/10 border border-red-900/30 rounded-xl hover:bg-red-900/20 text-red-400 transition-colors flex items-center justify-center gap-2"><i data-lucide="trash" class="w-5 h-5"></i> Verileri Sıfırla</button>
                </div>
            </div>
        `;
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