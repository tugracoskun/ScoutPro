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
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.closeModal(); });
    }
    
    saveData() {
        if (typeof auth !== 'undefined') auth.saveUserData();
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
            case 'dashboard': this.renderDashboard(c); break; // dashboard.js
            case 'database': this.renderDatabase(c); break; // database.js
            case 'team-detail': this.renderTeamDetail(c, params); break; // database.js
            case 'matches': this.renderMatches(c); break; // matches.js
            case 'settings': this.renderSettings(c); break; // settings.js
            case 'new-report': this.renderNewReport(c); break; // players-report.js
            case 'players': this.renderPlayers(c); break; // players-list.js
            case 'watchlist': this.renderWatchlist(c); break; // matches.js
        }
        lucide.createIcons();
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