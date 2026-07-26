// --- OYUNCU LİSTELEME MODÜLÜ (FAVORİ FİLTRESİ EKLENDİ) ---

ScoutApp.prototype.renderPlayers = function(c, skipAnimation = false) {
    this.state.activePage = 'players';

    // Filtre state kontrolü
    if (!this.state.playerFilter) {
        this.state.playerFilter = { favoritesOnly: false, sort: 'newest', category: 'All', potential: 'all' };
    }

    let filtered = this.state.data.players;

    // 1. Arama Filtresi
    if (this.state.searchTerm) {
        const term = this.state.searchTerm.toLowerCase();
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(term) || 
            (p.teamId && this.getTeamName(p.teamId).toLowerCase().includes(term)) ||
            (p.nationalTeamId && this.getTeamName(p.nationalTeamId).toLowerCase().includes(term))
        );
    }

    // 2. Favori Filtresi
    if (this.state.playerFilter.favoritesOnly) {
        filtered = filtered.filter(p => p.isFavorite);
    }

    // 3. Kategori Filtresi
    if (this.state.playerFilter.category && this.state.playerFilter.category !== 'All') {
        filtered = filtered.filter(p => {
            const pos = p.position;
            if (this.state.playerFilter.category === 'Kaleci') return pos === 'Kaleci';
            if (this.state.playerFilter.category === 'Defans') return ['Stoper', 'Sağ Bek', 'Sol Bek'].includes(pos);
            if (this.state.playerFilter.category === 'OrtaSaha') return ['Defansif Orta Saha', 'Orta Saha', 'Ofansif Orta Saha', 'Sağ Kanat', 'Sol Kanat'].includes(pos);
            if (this.state.playerFilter.category === 'Forvet') return pos === 'Santrafor';
            return true;
        });
    }

    // 4. Potansiyel Filtresi
    if (this.state.playerFilter.potential && this.state.playerFilter.potential !== 'all') {
        filtered = filtered.filter(p => p.potential === this.state.playerFilter.potential);
    }

    // Sıralama
    if (this.state.playerFilter.sort === 'newest') {
        filtered.sort((a, b) => b.id - a.id);
    } else if (this.state.playerFilter.sort === 'oldest') {
        filtered.sort((a, b) => a.id - b.id);
    } else if (this.state.playerFilter.sort === 'rating_desc') {
        filtered.sort((a, b) => b.rating - a.rating);
    } else if (this.state.playerFilter.sort === 'rating_asc') {
        filtered.sort((a, b) => a.rating - b.rating);
    }

    // Buton Stili
    const favBtnClass = this.state.playerFilter.favoritesOnly 
        ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20" 
        : "bg-dark-900 text-slate-400 border-dark-700 hover:text-white";

    c.innerHTML = `
        <div class="space-y-6 fade-in">
            
            <!-- FİLTRELEME & SIRALAMA BAR (STICKY) -->
            <div class="sticky top-0 z-30 bg-dark-950/80 backdrop-blur-xl border-b border-dark-800 py-4 -mx-8 px-8 flex flex-col xl:flex-row gap-4 justify-between items-center">
                <div class="flex items-center gap-3 w-full xl:w-auto">
                    <!-- Arama -->
                    <div class="relative w-full xl:w-56 group">
                        <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-scout-500 transition-colors"></i>
                        <input type="text" id="player-pool-search" oninput="app.updatePlayerSearch(this)" value="${this.state.searchTerm || ''}" placeholder="${window.getLang && window.getLang() === 'en' ? 'Search players...' : 'Oyuncular içinde ara...'}" class="w-full bg-dark-900 border border-dark-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:border-scout-500 outline-none transition-all">
                    </div>
                    
                    <!-- Favori Filtresi -->
                    <button onclick="app.togglePlayerFilter()" class="w-10 h-10 flex items-center justify-center rounded-xl border transition-all shrink-0 ${favBtnClass}" title="${t('region_favorites')}">
                        <i data-lucide="heart" class="w-4 h-4 ${this.state.playerFilter.favoritesOnly ? 'fill-white' : ''}"></i>
                    </button>
                </div>

                <!-- Mevki Kategorileri -->
                <div class="flex gap-2 overflow-x-auto pb-1 max-w-full custom-scrollbar">
                    <button onclick="app.updatePlayerFilter('category', 'All')" class="px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${this.state.playerFilter.category === 'All' ? 'bg-scout-600 text-white border-scout-600' : 'bg-dark-900 text-slate-400 border-dark-700 hover:text-white'}">${t('all')} (${this.state.data.players.length})</button>
                    <button onclick="app.updatePlayerFilter('category', 'Kaleci')" class="px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${this.state.playerFilter.category === 'Kaleci' ? 'bg-scout-600 text-white border-scout-600' : 'bg-dark-900 text-slate-400 border-dark-700 hover:text-white'}">${t('pos_gk')}</button>
                    <button onclick="app.updatePlayerFilter('category', 'Defans')" class="px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${this.state.playerFilter.category === 'Defans' ? 'bg-scout-600 text-white border-scout-600' : 'bg-dark-900 text-slate-400 border-dark-700 hover:text-white'}">${t('cat_def')}</button>
                    <button onclick="app.updatePlayerFilter('category', 'OrtaSaha')" class="px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${this.state.playerFilter.category === 'OrtaSaha' ? 'bg-scout-600 text-white border-scout-600' : 'bg-dark-900 text-slate-400 border-dark-700 hover:text-white'}">${t('cat_mid')}</button>
                    <button onclick="app.updatePlayerFilter('category', 'Forvet')" class="px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${this.state.playerFilter.category === 'Forvet' ? 'bg-scout-600 text-white border-scout-600' : 'bg-dark-900 text-slate-400 border-dark-700 hover:text-white'}">${t('pos_st')}</button>
                </div>

                <div class="flex gap-2">
                    <select onchange="app.updatePlayerFilter('potential', this.value)" class="bg-dark-900 border border-dark-700 text-slate-300 text-xs rounded-lg px-3 py-2 outline-none focus:border-scout-500 cursor-pointer">
                        <option value="all">${window.getLang && window.getLang() === 'en' ? 'All Potentials' : 'Tüm Potansiyeller'}</option>
                        <option value="Yüksek" ${this.state.playerFilter.potential === 'Yüksek' ? 'selected' : ''}>${window.getLang && window.getLang() === 'en' ? 'High Pot.' : 'Yüksek Pot.'}</option>
                        <option value="Düşük" ${this.state.playerFilter.potential === 'Düşük' ? 'selected' : ''}>${window.getLang && window.getLang() === 'en' ? 'Low Pot.' : 'Düşük Pot.'}</option>
                    </select>

                    <select onchange="app.updatePlayerFilter('sort', this.value)" class="bg-dark-900 border border-dark-700 text-slate-300 text-xs rounded-lg px-3 py-2 outline-none focus:border-scout-500 cursor-pointer">
                        <option value="newest" ${this.state.playerFilter.sort === 'newest' ? 'selected' : ''}>${window.getLang && window.getLang() === 'en' ? 'Newest' : 'Yeni'}</option>
                        <option value="oldest" ${this.state.playerFilter.sort === 'oldest' ? 'selected' : ''}>${window.getLang && window.getLang() === 'en' ? 'Oldest' : 'Eski'}</option>
                        <option value="rating_desc" ${this.state.playerFilter.sort === 'rating_desc' ? 'selected' : ''}>${window.getLang && window.getLang() === 'en' ? 'Highest Rating' : 'En Yüksek Puan'}</option>
                        <option value="rating_asc" ${this.state.playerFilter.sort === 'rating_asc' ? 'selected' : ''}>${window.getLang && window.getLang() === 'en' ? 'Lowest Rating' : 'En Düşük Puan'}</option>
                    </select>
                </div>
            </div>

            <!-- LİSTE -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                ${filtered.map(p => this.getPlayerCardHTML(p)).join('')}
            </div>
            
            ${filtered.length === 0 ? `<div class="text-center p-10 text-slate-500 border-2 border-dashed border-dark-800 rounded-2xl">${t('no_players')}</div>` : ''}
        </div>
    `;
    lucide.createIcons();
};

ScoutApp.prototype.togglePlayerFilter = function() {
    this.state.playerFilter.favoritesOnly = !this.state.playerFilter.favoritesOnly;
    this.renderPlayers(document.getElementById('content-area'), true);
};

ScoutApp.prototype.updatePlayerSearch = function(inputEl) {
    const val = inputEl.value;
    const cursor = inputEl.selectionStart;
    
    this.state.searchTerm = val.toLowerCase();
    const globalSearch = document.getElementById('global-search');
    if (globalSearch) globalSearch.value = val;

    this.renderPlayers(document.getElementById('content-area'), true);

    const newEl = document.getElementById('player-pool-search');
    if (newEl) {
        newEl.focus();
        newEl.setSelectionRange(cursor, cursor);
    }
};

ScoutApp.prototype.updatePlayerFilter = function(key, value) {
    if (!this.state.playerFilter) {
        this.state.playerFilter = { favoritesOnly: false, sort: 'newest', category: 'All', potential: 'all' };
    }
    this.state.playerFilter[key] = value;
    this.renderPlayers(document.getElementById('content-area'), true);
};

ScoutApp.prototype.getPlayerCardHTML = function(p) {
    const grade = this.getGrade(p.rating);
    const potColor = p.potential === 'Yüksek' ? 'text-scout-400' : 'text-slate-500';
    const currentAge = p.birthDate ? this.calculateAge(p.birthDate) : p.age;

    return `
        <div class="scout-card bg-dark-900 rounded-2xl p-5 relative group overflow-hidden border border-dark-800 hover:border-scout-500/30 transition-all">
            
            <!-- Favori Butonu -->
            <button onclick="app.toggleFavorite(${p.id}, 'player')" class="absolute top-3 right-3 z-20 p-2 rounded-lg transition-all ${p.isFavorite ? 'text-red-500 bg-red-500/10' : 'text-slate-500 hover:text-white bg-dark-950/50'}" title="Favori">
                <i data-lucide="heart" class="w-4 h-4 ${p.isFavorite ? 'fill-red-500' : ''}"></i>
            </button>

            <!-- Tıklanabilir Alan -->
            <div onclick="app.openPlayerModal(${p.id})" class="cursor-pointer">
                <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-scout-500 to-transparent opacity-50"></div>
                
                <div class="flex items-start gap-4 mb-4">
                    <img src="${p.image || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop'}" class="w-14 h-14 rounded-xl object-cover bg-dark-950 border border-dark-700">
                    <div class="flex-1 min-w-0 pr-8">
                        <h4 class="font-bold text-white text-lg leading-tight truncate">${p.name}</h4>
                        <div class="text-xs text-scout-400 font-medium mt-1">${window.tPos ? window.tPos(p.position) : p.position}</div>
                        <div class="text-xs text-slate-500 mt-0.5 truncate">${p.teamId ? this.getTeamName(p.teamId) : ''}${p.teamId && p.nationalTeamId ? ' - ' : ''}${p.nationalTeamId ? this.getTeamName(p.nationalTeamId) : ''}</div>
                    </div>
                </div>
                
                <div class="grid grid-cols-3 gap-2 bg-dark-950/50 rounded-lg p-2 border border-dark-800/50">
                    <div class="text-center"><div class="text-[10px] text-slate-500">${t('age')}</div><div class="font-medium text-white">${currentAge}</div></div>
                    <div class="text-center"><div class="text-[10px] text-slate-500">${t('grade')}</div><div class="font-bold text-xs ${grade.color}">${grade.letter}</div></div>
                    <div class="text-center"><div class="text-[10px] text-slate-500">${t('detail')}</div><i data-lucide="search" class="w-4 h-4 mx-auto text-slate-400 hover:text-white transition-colors"></i></div>
                </div>
            </div>
        </div>
    `;
};