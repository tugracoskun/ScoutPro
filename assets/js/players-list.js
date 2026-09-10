// --- OYUNCU LİSTELEME MODÜLÜ (FAVORİ FİLTRESİ EKLENDİ) ---

ScoutApp.prototype.getPlayerLists = function() {
    if (!this.state.data.playerLists || !Array.isArray(this.state.data.playerLists) || this.state.data.playerLists.length === 0) {
        this.state.data.playerLists = [
            { id: 'a_takim', name: 'A Takım', icon: 'shield', color: 'blue', isBuiltin: true },
            { id: 'genc_yetenek', name: 'Genç Yetenekler', icon: 'sparkles', color: 'emerald', isBuiltin: true },
            { id: 'transfer_liste', name: 'Transfer Listesi', icon: 'target', color: 'purple', isBuiltin: true },
            { id: 'oncelikli', name: 'Öncelikli Takip', icon: 'star', color: 'amber', isBuiltin: true }
        ];
        this.saveData();
    }
    return this.state.data.playerLists;
};

ScoutApp.prototype.renderPlayers = function(c, skipAnimation = false) {
    this.state.activePage = 'players';

    // Filtre state kontrolü
    if (!this.state.playerFilter) {
        this.state.playerFilter = { favoritesOnly: false, sort: 'newest', category: 'All', potential: 'all', listId: 'all' };
    }
    if (!this.state.playerFilter.listId) {
        this.state.playerFilter.listId = 'all';
    }

    const availableLists = this.getPlayerLists();
    const allPlayers = this.state.data.players || [];
    let filtered = allPlayers;

    // 0. Özel Liste Filtresi
    if (this.state.playerFilter.listId && this.state.playerFilter.listId !== 'all') {
        const targetListId = this.state.playerFilter.listId;
        filtered = filtered.filter(p => {
            const listIds = p.listIds || (p.listId ? [p.listId] : []);
            return listIds.includes(targetListId);
        });
    }

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

    const totalCount = allPlayers.length;
    const getListCount = (listId) => {
        if (listId === 'all') return totalCount;
        return allPlayers.filter(p => {
            const listIds = p.listIds || (p.listId ? [p.listId] : []);
            return listIds.includes(listId);
        }).length;
    };

    c.innerHTML = `
        <div class="space-y-6 fade-in">
            
            <!-- LISTE SEKMELERİ BAR (SADE & MINIMALIST NAVIGASYON) -->
            <div class="bg-dark-900/60 border border-dark-800 p-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                <div class="flex flex-wrap items-center gap-1.5">
                    <!-- TÜM OYUNCULAR -->
                    <button onclick="app.updatePlayerFilter('listId', 'all')" 
                        class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${(!this.state.playerFilter.listId || this.state.playerFilter.listId === 'all') ? 'bg-dark-800 border border-dark-700 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-dark-800/40'}">
                        <i data-lucide="layers" class="w-3.5 h-3.5 ${(!this.state.playerFilter.listId || this.state.playerFilter.listId === 'all') ? 'text-scout-400' : 'text-slate-500'}"></i>
                        <span>Tüm Oyuncular</span>
                        <span class="px-1.5 py-0.2 rounded-md text-[10px] font-bold ${(!this.state.playerFilter.listId || this.state.playerFilter.listId === 'all') ? 'bg-scout-500/20 text-scout-400' : 'bg-dark-950 text-slate-500'}">${totalCount}</span>
                    </button>

                    <!-- ÖZEL LİSTELER -->
                    ${availableLists.map(list => {
                        const count = getListCount(list.id);
                        const isActive = this.state.playerFilter.listId === list.id;
                        const theme = this.getListColorTheme(list.color);
                        return `
                            <button onclick="app.updatePlayerFilter('listId', '${list.id}')" 
                                class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${isActive ? 'bg-dark-800 border border-dark-700 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-dark-800/40'}">
                                <span class="w-2 h-2 rounded-full ${theme.dot}"></span>
                                <span>${list.name}</span>
                                <span class="px-1.5 py-0.2 rounded-md text-[10px] font-bold ${isActive ? 'bg-dark-950 text-slate-200' : 'bg-dark-950 text-slate-500'}">${count}</span>
                            </button>
                        `;
                    }).join('')}
                </div>

                <!-- YENİ LİSTE (+) VE DÜZENLE (KALEM) AKSİYONLARI -->
                <div class="flex items-center gap-1.5 shrink-0">
                    <button onclick="app.openAddPlayerListModal()" 
                        class="w-8 h-8 rounded-xl bg-dark-800/60 hover:bg-dark-800 text-slate-300 hover:text-white border border-dark-700/60 hover:border-scout-500/40 transition-all flex items-center justify-center group shadow-sm"
                        title="Yeni Liste Ekle">
                        <i data-lucide="plus" class="w-4 h-4 text-scout-400 group-hover:scale-110 transition-transform"></i>
                    </button>
                    <button onclick="app.openManagePlayerListsSettingModal()" 
                        class="w-8 h-8 rounded-xl bg-dark-800/60 hover:bg-dark-800 text-slate-400 hover:text-white border border-dark-700/60 hover:border-amber-500/40 transition-all flex items-center justify-center group shadow-sm"
                        title="Listeleri Düzenle">
                        <i data-lucide="pencil" class="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 group-hover:scale-110 transition-transform"></i>
                    </button>
                </div>
            </div>

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

                <div class="flex gap-2 items-center">
                    <button onclick="app.openCompareModal()" class="px-3 py-2 rounded-lg text-xs font-bold bg-dark-900 text-slate-300 border border-dark-700 hover:border-blue-500/50 hover:text-blue-400 transition-all flex items-center gap-2">
                        <i data-lucide="scale" class="w-4 h-4"></i>
                        ${window.getLang && window.getLang() === 'en' ? 'Compare' : 'Karşılaştır'}
                    </button>
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
                    <img src="${this.getImageUrl(p.image)}" class="w-14 h-14 rounded-xl object-cover bg-dark-950 border border-dark-700" onerror="this.onerror=null;this.src=window.DEFAULT_AVATAR_DATA_URL">
                    <div class="flex-1 min-w-0 pr-8">
                        <h4 class="font-bold text-white text-lg leading-tight truncate">${p.name}</h4>
                        <div class="text-xs text-scout-400 font-medium mt-1">${window.tPos ? window.tPos(p.position) : p.position}</div>
                        <div class="text-xs text-slate-500 mt-0.5 truncate">${p.teamId ? this.getTeamName(p.teamId) : ''}${p.teamId && p.nationalTeamId ? ' - ' : ''}${p.nationalTeamId ? this.getTeamName(p.nationalTeamId) : ''}</div>
                    </div>
                </div>
                
                <div class="grid grid-cols-3 gap-2 bg-dark-950/50 rounded-xl p-2.5 border border-dark-800/60 items-center">
                    <div class="text-center">
                        <div class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">${t('age')}</div>
                        <div class="font-bold text-sm text-white font-mono mt-0.5">${currentAge}</div>
                    </div>
                    <div class="text-center border-x border-dark-800/60">
                        <div class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">${t('grade')}</div>
                        <div class="font-black text-sm ${grade.color} mt-0.5">${grade.letter}</div>
                    </div>
                    <div class="text-center">
                        <div class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">${t('detail')}</div>
                        <div class="flex items-center justify-center mt-0.5"><i data-lucide="search" class="w-4 h-4 text-slate-400 group-hover:text-scout-400 transition-colors"></i></div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// --- OYUNCU LİSTELERİ YÖNETİMİ & MODALLARI ---

ScoutApp.prototype.openAddPlayerListModal = function() {
    const icons = this.getWatchlistAvailableIcons();
    const colors = this.getWatchlistAvailableColors();

    const html = `
        <div class="p-6 space-y-5">
            <div class="flex items-center justify-between border-b border-dark-800 pb-4">
                <div class="flex items-center gap-2.5">
                    <div class="w-9 h-9 rounded-xl bg-scout-500/10 border border-scout-500/20 text-scout-400 flex items-center justify-center">
                        <i data-lucide="plus-circle" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h3 class="text-base font-bold text-white">Yeni Oyuncu Listesi</h3>
                        <p class="text-xs text-slate-400">Raporlanan oyuncular için özel bir liste tanımlayın</p>
                    </div>
                </div>
                <button onclick="app.closeModal()" class="w-8 h-8 rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-400 hover:text-white flex items-center justify-center transition-all">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>
            </div>
            
            <div class="space-y-4">
                ${this.createInput('new-player-list-name', 'Liste Adı', 'Örn: İlk 11 Adayları', 'text', '')}
                
                <!-- İKON SEÇİCİ (LUCIDE ICONS GRID) -->
                <div class="space-y-1.5">
                    <label class="text-xs font-bold text-slate-400 ml-1">İkon Seçin</label>
                    <div id="container-new-player-list-icon" class="flex flex-wrap gap-2 p-2.5 bg-dark-950/60 rounded-xl border border-dark-800">
                        ${icons.map(i => `
                            <button type="button" onclick="app.selectWatchlistIcon('new-player-list-icon', '${i.val}')"
                                data-icon="${i.val}"
                                class="wl-icon-btn w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${i.val === 'shield' ? 'bg-scout-500/20 border-scout-500 text-scout-400 shadow-sm scale-105' : 'bg-dark-900 border-dark-800 text-slate-400 hover:text-white hover:border-dark-700'}"
                                title="${i.label}">
                                <i data-lucide="${i.val}" class="w-4 h-4"></i>
                            </button>
                        `).join('')}
                    </div>
                    <input type="hidden" id="new-player-list-icon" value="shield">
                </div>

                <!-- RENK SEÇİCİ -->
                <div class="space-y-1.5">
                    <label class="text-xs font-bold text-slate-400 ml-1">Tema Rengi</label>
                    <div id="container-new-player-list-color" class="flex flex-wrap items-center gap-3 p-2.5 bg-dark-950/60 rounded-xl border border-dark-800">
                        ${colors.map(c => `
                            <button type="button" onclick="app.selectWatchlistColor('new-player-list-color', '${c.val}')"
                                data-color="${c.val}"
                                class="wl-color-btn w-7 h-7 rounded-full transition-all flex items-center justify-center ${c.val === 'blue' ? 'ring-2 ring-offset-2 ring-offset-dark-950 ring-white scale-110 shadow-md' : 'opacity-70 hover:opacity-100 hover:scale-105'}"
                                title="${c.label}">
                                <span class="w-full h-full rounded-full ${this.getListColorTheme(c.val).dot}"></span>
                            </button>
                        `).join('')}
                    </div>
                    <input type="hidden" id="new-player-list-color" value="blue">
                </div>
            </div>

            <div class="flex justify-end gap-2.5 pt-2 border-t border-dark-800">
                <button onclick="app.closeModal()" class="px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 font-semibold text-xs transition-colors">Vazgeç</button>
                <button onclick="app.addPlayerList()" class="px-5 py-2 rounded-xl bg-scout-600 hover:bg-scout-500 text-white font-bold text-xs transition-all shadow-lg shadow-scout-600/20">Listeyi Oluştur</button>
            </div>
        </div>
    `;
    this.showModal(html);
};

ScoutApp.prototype.addPlayerList = function() {
    const nameEl = document.getElementById('new-player-list-name');
    const iconEl = document.getElementById('new-player-list-icon');
    const colorEl = document.getElementById('new-player-list-color');

    if (!nameEl || !nameEl.value.trim()) return alert("Lütfen liste adını yazın.");

    const lists = this.getPlayerLists();
    const id = 'plist_' + Date.now();
    
    lists.push({
        id: id,
        name: nameEl.value.trim(),
        icon: iconEl ? iconEl.value : 'bookmark',
        color: colorEl ? colorEl.value : 'blue',
        isBuiltin: false
    });

    this.saveData();
    this.closeModal();
    this.notify("Yeni oyuncu listesi oluşturuldu.");
    this.renderPlayers(document.getElementById('content-area'));
};

ScoutApp.prototype.openManagePlayerListsSettingModal = function(editingListId = null) {
    const lists = this.getPlayerLists();
    const allPlayers = this.state.data.players || [];
    const icons = this.getWatchlistAvailableIcons();
    const colors = this.getWatchlistAvailableColors();

    const getListCount = (listId) => {
        return allPlayers.filter(p => {
            const listIds = p.listIds || (p.listId ? [p.listId] : []);
            return listIds.includes(listId);
        }).length;
    };

    const html = `
        <div class="p-6 space-y-5">
            <!-- BAŞLIK & KAPATMA -->
            <div class="flex items-center justify-between border-b border-dark-800 pb-4">
                <div class="flex items-center gap-2.5">
                    <div class="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                        <i data-lucide="pencil" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h3 class="text-base font-bold text-white">Oyuncu Listelerini Düzenle</h3>
                        <p class="text-xs text-slate-400">Listelerin adını, simgesini veya rengini güncelleyin</p>
                    </div>
                </div>
                <button onclick="app.closeModal()" class="w-8 h-8 rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-400 hover:text-white flex items-center justify-center transition-all">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>
            </div>

            <!-- LİSTE SATIRLARI -->
            <div class="space-y-2.5 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                ${lists.map(list => {
                    const count = getListCount(list.id);
                    const theme = this.getListColorTheme(list.color);
                    const isEditing = editingListId === list.id;

                    if (isEditing) {
                        return `
                            <div class="p-4 bg-dark-950/90 rounded-xl border border-amber-500/40 shadow-lg space-y-3 animate-fade-in">
                                <div class="flex items-center justify-between pb-2 border-b border-dark-800">
                                    <span class="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                                        <i data-lucide="edit-3" class="w-3.5 h-3.5"></i> "${list.name}" Düzenleniyor
                                    </span>
                                    <button onclick="app.openManagePlayerListsSettingModal()" class="text-xs text-slate-400 hover:text-white transition-colors">
                                        Vazgeç
                                    </button>
                                </div>
                                <div class="space-y-3">
                                    <div>
                                        <label class="text-[11px] font-bold text-slate-400 mb-1 block">Liste Adı</label>
                                        <input type="text" id="edit-plist-name-${list.id}" value="${list.name.replace(/"/g, '&quot;')}" class="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 outline-none transition-all">
                                    </div>
                                    
                                    <!-- İKON SEÇİCİ -->
                                    <div>
                                        <label class="text-[11px] font-bold text-slate-400 mb-1 block">İkon Seçin</label>
                                        <div id="container-edit-plist-icon-${list.id}" class="flex flex-wrap gap-1.5 p-2 bg-dark-900/80 rounded-xl border border-dark-800">
                                            ${icons.map(i => `
                                                <button type="button" onclick="app.selectWatchlistIcon('edit-plist-icon-${list.id}', '${i.val}', 'amber')"
                                                    data-icon="${i.val}"
                                                    class="wl-icon-btn w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${i.val === (list.icon || 'bookmark') ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-sm scale-105' : 'bg-dark-950 border-dark-800 text-slate-400 hover:text-white hover:border-dark-700'}"
                                                    title="${i.label}">
                                                    <i data-lucide="${i.val}" class="w-3.5 h-3.5"></i>
                                                </button>
                                            `).join('')}
                                        </div>
                                        <input type="hidden" id="edit-plist-icon-${list.id}" value="${list.icon || 'bookmark'}">
                                    </div>

                                    <!-- RENK SEÇİCİ -->
                                    <div>
                                        <label class="text-[11px] font-bold text-slate-400 mb-1 block">Tema Rengi</label>
                                        <div id="container-edit-plist-color-${list.id}" class="flex flex-wrap items-center gap-2.5 p-2 bg-dark-900/80 rounded-xl border border-dark-800">
                                            ${colors.map(c => `
                                                <button type="button" onclick="app.selectWatchlistColor('edit-plist-color-${list.id}', '${c.val}')"
                                                    data-color="${c.val}"
                                                    class="wl-color-btn w-6 h-6 rounded-full transition-all flex items-center justify-center ${c.val === list.color ? 'ring-2 ring-offset-2 ring-offset-dark-950 ring-white scale-110 shadow-md' : 'opacity-70 hover:opacity-100 hover:scale-105'}"
                                                    title="${c.label}">
                                                    <span class="w-full h-full rounded-full ${this.getListColorTheme(c.val).dot}"></span>
                                                </button>
                                            `).join('')}
                                        </div>
                                        <input type="hidden" id="edit-plist-color-${list.id}" value="${list.color || 'blue'}">
                                    </div>

                                    <div class="flex items-center justify-end gap-2 pt-1 border-t border-dark-800/80">
                                        <button onclick="app.openManagePlayerListsSettingModal()" class="px-3.5 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 font-semibold text-xs transition-colors">
                                            İptal
                                        </button>
                                        <button onclick="app.savePlayerListEdit('${list.id}')" class="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20">
                                            <i data-lucide="check" class="w-3.5 h-3.5"></i> Kaydet
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                    }

                    return `
                        <div class="p-3 bg-dark-950/50 hover:bg-dark-950/80 rounded-xl border border-dark-800/80 hover:border-dark-700 transition-all flex items-center justify-between group">
                            <div class="flex items-center gap-3">
                                <span class="w-2.5 h-2.5 rounded-full ${theme.dot}"></span>
                                <div class="flex items-center gap-2">
                                    <i data-lucide="${list.icon || 'bookmark'}" class="w-4 h-4 ${theme.text}"></i>
                                    <span class="text-sm font-semibold text-white">${list.name}</span>
                                    ${list.isBuiltin ? `<span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-dark-800 border border-dark-700/60 text-slate-400">Sabit</span>` : ''}
                                </div>
                            </div>
                            
                            <div class="flex items-center gap-2">
                                <span class="text-xs text-slate-400 font-medium px-2 py-0.5 rounded-md bg-dark-900 border border-dark-800/80">${count} Oyuncu</span>
                                <button onclick="app.openManagePlayerListsSettingModal('${list.id}')" 
                                    class="p-1.5 rounded-lg bg-dark-800/80 hover:bg-amber-500/20 hover:text-amber-400 text-slate-400 transition-all" title="Düzenle">
                                    <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
                                </button>
                                ${!list.isBuiltin ? `
                                    <button onclick="app.deletePlayerList('${list.id}', true)" 
                                        class="p-1.5 rounded-lg bg-dark-800/80 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-all" title="Listeyi Sil">
                                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- FOOTER İŞLEMLERİ -->
            <div class="flex items-center justify-between pt-3 border-t border-dark-800">
                <button onclick="app.openAddPlayerListModal()" class="text-xs font-semibold text-scout-400 hover:text-scout-300 flex items-center gap-1.5 transition-colors">
                    <i data-lucide="plus" class="w-3.5 h-3.5"></i> Yeni Liste Ekle
                </button>
                <button onclick="app.closeModal()" class="px-5 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 font-bold text-xs transition-all">
                    Kapat
                </button>
            </div>
        </div>
    `;

    this.showModal(html);
};

ScoutApp.prototype.savePlayerListEdit = function(listId) {
    const nameEl = document.getElementById(`edit-plist-name-${listId}`);
    const iconEl = document.getElementById(`edit-plist-icon-${listId}`);
    const colorEl = document.getElementById(`edit-plist-color-${listId}`);

    if (!nameEl || !nameEl.value.trim()) {
        return alert("Lütfen liste adını yazın.");
    }

    const lists = this.getPlayerLists();
    const list = lists.find(l => l.id === listId);
    if (!list) return;

    list.name = nameEl.value.trim();
    if (iconEl) list.icon = iconEl.value;
    if (colorEl) list.color = colorEl.value;

    this.saveData();
    this.notify("Liste güncellendi.");
    this.openManagePlayerListsSettingModal();
    this.renderPlayers(document.getElementById('content-area'), true);
};

ScoutApp.prototype.deletePlayerList = function(listId, fromManageModal = false) {
    const lists = this.getPlayerLists();
    const list = lists.find(l => l.id === listId);
    if (!list) return;

    this.confirmAction(`"${list.name}" listesini silmek istediğinize emin misiniz? (Oyuncular silinmez)`, () => {
        this.state.data.playerLists = lists.filter(l => l.id !== listId);
        
        // Oyunculardaki bu liste referanslarını temizle
        (this.state.data.players || []).forEach(p => {
            if (p.listIds) {
                p.listIds = p.listIds.filter(id => id !== listId);
            }
            if (p.listId === listId) {
                p.listId = null;
            }
        });

        if (this.state.playerFilter && this.state.playerFilter.listId === listId) {
            this.state.playerFilter.listId = 'all';
        }

        this.saveData();
        this.notify("Liste silindi.");
        if (fromManageModal) {
            this.openManagePlayerListsSettingModal();
        }
        this.renderPlayers(document.getElementById('content-area'));
    });
};

ScoutApp.prototype.openAssignPlayerToListsModal = function(playerId) {
    const p = (this.state.data.players || []).find(x => x.id === playerId);
    if (!p) return;

    const availableLists = this.getPlayerLists();
    const currentListIds = p.listIds || (p.listId ? [p.listId] : []);

    const html = `
        <div class="p-6 space-y-5">
            <!-- BAŞLIK & KAPATMA -->
            <div class="flex items-center justify-between border-b border-dark-800 pb-4">
                <div class="flex items-center gap-2.5">
                    <div class="w-9 h-9 rounded-xl bg-scout-500/10 border border-scout-500/20 text-scout-400 flex items-center justify-center">
                        <i data-lucide="bookmark" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h3 class="text-base font-bold text-white">Oyuncu Listelerini Yönet</h3>
                        <p class="text-xs text-slate-400">Oyuncuyu dahil etmek istediğiniz listeleri işaretleyin</p>
                    </div>
                </div>
                <button onclick="app.openPlayerModal(${playerId})" class="w-8 h-8 rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-400 hover:text-white flex items-center justify-center transition-all">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>
            </div>

            <!-- OYUNCU ÖZET KARTI -->
            <div class="flex items-center gap-3.5 p-3 bg-dark-950/80 rounded-xl border border-dark-800/80">
                <img src="${this.getImageUrl(p.image)}" class="w-11 h-11 rounded-lg object-cover bg-dark-900 border border-dark-700 shrink-0" onerror="this.onerror=null;this.src=window.DEFAULT_AVATAR_DATA_URL">
                <div class="overflow-hidden">
                    <div class="font-bold text-white text-sm truncate">${p.name}</div>
                    <div class="text-xs text-slate-400 truncate flex items-center gap-1 mt-0.5">
                        <span>${this.getTeamName(p.teamId)}</span>
                        ${p.position ? `<span class="text-slate-600">•</span><span class="text-scout-400 font-medium">${tPos(p.position)}</span>` : ''}
                    </div>
                </div>
            </div>

            <!-- LİSTELER GEZİNTİSİ & İŞARETLEME -->
            <div class="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                ${availableLists.map(list => {
                    const isChecked = currentListIds.includes(list.id);
                    const theme = this.getListColorTheme(list.color);
                    return `
                        <div onclick="app.togglePlayerReportedListAssignment(${p.id}, '${list.id}', !document.getElementById('chk-plist-${p.id}-${list.id}').checked)" 
                            class="group p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${isChecked ? 'bg-dark-800/90 border-dark-700 shadow-md' : 'bg-dark-950/40 border-dark-800/60 hover:bg-dark-800/40 hover:border-dark-700/60'}">
                            
                            <div class="flex items-center gap-3">
                                <span class="w-2.5 h-2.5 rounded-full ${theme.dot}"></span>
                                <div class="flex items-center gap-2">
                                    <i data-lucide="${list.icon || 'bookmark'}" class="w-4 h-4 ${isChecked ? theme.text : 'text-slate-500'}"></i>
                                    <span class="text-sm font-semibold ${isChecked ? 'text-white' : 'text-slate-300 group-hover:text-white'}">${list.name}</span>
                                </div>
                            </div>

                            <div class="flex items-center gap-2">
                                ${isChecked ? `
                                    <span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${theme.badge}">Eklendi</span>
                                ` : ''}
                                <div class="w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isChecked ? 'bg-scout-600 border-scout-500 text-white' : 'bg-dark-900 border-dark-700 text-transparent'}">
                                    <input type="checkbox" id="chk-plist-${p.id}-${list.id}" ${isChecked ? 'checked' : ''} class="hidden">
                                    <i data-lucide="check" class="w-3.5 h-3.5"></i>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- FOOTER İŞLEMLERİ -->
            <div class="flex items-center justify-between pt-2 border-t border-dark-800">
                <button onclick="app.openAddPlayerListModal()" class="text-xs font-semibold text-scout-400 hover:text-scout-300 flex items-center gap-1.5 transition-colors">
                    <i data-lucide="plus" class="w-3.5 h-3.5"></i> Yeni Liste Oluştur
                </button>
                <button onclick="app.openPlayerModal(${playerId})" class="px-5 py-2 rounded-xl bg-scout-600 hover:bg-scout-500 text-white font-bold text-xs transition-all shadow-lg shadow-scout-600/20">
                    Tamam
                </button>
            </div>
        </div>
    `;
    this.showModal(html);
};

ScoutApp.prototype.togglePlayerReportedListAssignment = function(playerId, listId, isChecked) {
    const p = (this.state.data.players || []).find(w => w.id === playerId);
    if (!p) return;

    if (!p.listIds) p.listIds = p.listId ? [p.listId] : [];

    if (isChecked) {
        if (!p.listIds.includes(listId)) p.listIds.push(listId);
    } else {
        p.listIds = p.listIds.filter(id => id !== listId);
    }

    this.saveData();
    if (this.state.activePage === 'players') {
        this.renderPlayers(document.getElementById('content-area'), true);
    }
    this.openAssignPlayerToListsModal(playerId);
};