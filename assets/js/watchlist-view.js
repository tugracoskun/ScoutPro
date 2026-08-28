// --- ADAY HAVUZU (WATCHLIST) MODÜLÜ & ÖZEL LİSTELER ---

ScoutApp.prototype.getWatchlistLists = function() {
    if (!this.state.data.watchlistLists || !Array.isArray(this.state.data.watchlistLists) || this.state.data.watchlistLists.length === 0) {
        this.state.data.watchlistLists = [
            { id: 'milli', name: 'Milli Oyuncular', icon: 'flag', color: 'red', isBuiltin: true },
            { id: 'genc', name: 'Genç Yetenekler', icon: 'sparkles', color: 'emerald', isBuiltin: true },
            { id: 'transfer', name: 'Transfer Hedefleri', icon: 'target', color: 'blue', isBuiltin: true },
            { id: 'takip', name: 'Yakın Takip', icon: 'eye', color: 'amber', isBuiltin: true }
        ];
        this.saveData();
    }
    return this.state.data.watchlistLists;
};

ScoutApp.prototype.getListColorTheme = function(color) {
    const themes = {
        red: { dot: 'bg-red-500', text: 'text-red-400', badge: 'bg-red-500/10 border-red-500/20 text-red-400' },
        emerald: { dot: 'bg-emerald-500', text: 'text-emerald-400', badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
        blue: { dot: 'bg-blue-500', text: 'text-blue-400', badge: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
        amber: { dot: 'bg-amber-500', text: 'text-amber-400', badge: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
        purple: { dot: 'bg-purple-500', text: 'text-purple-400', badge: 'bg-purple-500/10 border-purple-500/20 text-purple-400' },
        cyan: { dot: 'bg-cyan-500', text: 'text-cyan-400', badge: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' },
        pink: { dot: 'bg-pink-500', text: 'text-pink-400', badge: 'bg-pink-500/10 border-pink-500/20 text-pink-400' }
    };
    return themes[color] || themes.blue;
};

ScoutApp.prototype.renderWatchlist = function(c, skipAnimation = false) {
    // Filtre state kontrolü
    if (!this.state.wlFilter) {
        this.state.wlFilter = { search: '', category: 'All', sort: 'newest', favoritesOnly: false, listId: 'all' };
    }

    const availableLists = this.getWatchlistLists();
    const filter = this.state.wlFilter;
    let allCandidates = this.state.data.watchlist || [];

    // Tarih Güvenli Biçimlendirici
    const formatDateSafe = (dStr) => {
        if (!dStr) return '-';
        if (typeof dStr === 'string' && dStr.includes('.')) return dStr;
        const d = new Date(dStr);
        return isNaN(d.getTime()) ? String(dStr) : d.toLocaleDateString(window.getLang() === 'en' ? 'en-US' : 'tr-TR');
    };

    // 1. Özel Liste Filtresi
    let filtered = allCandidates.filter(w => {
        if (!filter.listId || filter.listId === 'all') return true;
        const listIds = w.listIds || (w.listId ? [w.listId] : []);
        if (filter.listId === 'milli') {
            return listIds.includes('milli') || w.listId === 'milli' || Boolean(w.nationalTeam && w.nationalTeam.trim().length > 0);
        }
        return listIds.includes(filter.listId) || w.listId === filter.listId;
    });

    // 2. Arama Filtresi
    if (filter.search) {
        const q = filter.search.toLowerCase();
        filtered = filtered.filter(w => 
            w.name.toLowerCase().includes(q) || 
            (w.notes && w.notes.toLowerCase().includes(q)) ||
            (w.nationalTeam && w.nationalTeam.toLowerCase().includes(q)) ||
            (w.source && w.source.toLowerCase().includes(q))
        );
    }
    
    // 3. Mevki Kategori Filtresi
    if (filter.category !== 'All') {
        filtered = filtered.filter(w => {
            const pos = w.position;
            if (filter.category === 'Kaleci') return pos === 'Kaleci';
            if (filter.category === 'Defans') return ['Stoper', 'Sağ Bek', 'Sol Bek'].includes(pos);
            if (filter.category === 'OrtaSaha') return ['Defansif Orta Saha', 'Orta Saha', 'Ofansif Orta Saha', 'Sağ Kanat', 'Sol Kanat'].includes(pos);
            if (filter.category === 'Forvet') return pos === 'Santrafor';
            return true;
        });
    }

    // 4. Favori Filtresi
    if (filter.favoritesOnly) {
        filtered = filtered.filter(w => w.isFavorite);
    }

    // 5. Sıralama
    if (filter.sort === 'newest') filtered.sort((a, b) => b.id - a.id);
    else if (filter.sort === 'oldest') filtered.sort((a, b) => a.id - b.id);
    else if (filter.sort === 'az') filtered.sort((a, b) => a.name.localeCompare(b.name));
    else if (filter.sort === 'za') filtered.sort((a, b) => b.name.localeCompare(a.name));

    const allTeamsRaw = this.state.data.teams.map(t => ({ val: t.id, txt: this.getTeamName(t.id) }));
    const countryNames = (this.state.data.countries || []).map(c => c.name.toLowerCase());
    
    const isNationalTeam = (name) => {
        const n = name.toLowerCase();
        if (n.match(/\bu(15|16|17|18|19|20|21|23)\b/)) return true;
        if (n.includes(' milli') || n.includes(' national')) return true;
        return countryNames.some(c => n === c || n.startsWith(c + ' '));
    };

    const clubTeams = allTeamsRaw.filter(t => !isNationalTeam(t.txt));
    const nationalTeams = allTeamsRaw.filter(t => isNationalTeam(t.txt)).sort((a, b) => a.txt.localeCompare(b.txt));
    
    const allTeams = clubTeams;
    const totalCount = allCandidates.length;
    const favBtnClass = filter.favoritesOnly ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20" : "bg-dark-900 text-slate-400 border-dark-700 hover:text-white";

    // Her listenin sayı hesabını yapalım
    const getListCount = (listId) => {
        if (listId === 'all') return totalCount;
        if (listId === 'milli') {
            return allCandidates.filter(w => {
                const listIds = w.listIds || (w.listId ? [w.listId] : []);
                return listIds.includes('milli') || w.listId === 'milli' || Boolean(w.nationalTeam && w.nationalTeam.trim().length > 0);
            }).length;
        }
        return allCandidates.filter(w => {
            const listIds = w.listIds || (w.listId ? [w.listId] : []);
            return listIds.includes(listId) || w.listId === listId;
        }).length;
    };

    c.innerHTML = `
        <div class="max-w-6xl mx-auto space-y-6 ${skipAnimation ? '' : 'fade-in'} pb-20">
            
            <!-- LISTE SEKMELERİ BAR (SADE & MINIMALIST NAVIGASYON - SCROLLBARSIZ) -->
            <div class="bg-dark-900/60 border border-dark-800 p-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                <div class="flex flex-wrap items-center gap-1.5">
                    <!-- TÜM ADAYLAR -->
                    <button onclick="app.filterWatchlist('listId', 'all')" 
                        class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${(!filter.listId || filter.listId === 'all') ? 'bg-dark-800 border border-dark-700 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-dark-800/40'}">
                        <i data-lucide="layers" class="w-3.5 h-3.5 ${(!filter.listId || filter.listId === 'all') ? 'text-scout-400' : 'text-slate-500'}"></i>
                        <span>Tüm Adaylar</span>
                        <span class="px-1.5 py-0.2 rounded-md text-[10px] font-bold ${(!filter.listId || filter.listId === 'all') ? 'bg-scout-500/20 text-scout-400' : 'bg-dark-950 text-slate-500'}">${totalCount}</span>
                    </button>

                    <!-- ÖZEL LİSTELER -->
                    ${availableLists.map(list => {
                        const count = getListCount(list.id);
                        const isActive = filter.listId === list.id;
                        const theme = this.getListColorTheme(list.color);
                        return `
                            <div class="relative group flex items-center">
                                <button onclick="app.filterWatchlist('listId', '${list.id}')" 
                                    class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${isActive ? 'bg-dark-800 border border-dark-700 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-dark-800/40'}">
                                    <span class="w-2 h-2 rounded-full ${theme.dot}"></span>
                                    <span>${list.name}</span>
                                    <span class="px-1.5 py-0.2 rounded-md text-[10px] font-bold ${isActive ? 'bg-dark-950 text-slate-200' : 'bg-dark-950 text-slate-500'}">${count}</span>
                                </button>
                                ${!list.isBuiltin ? `
                                    <button onclick="event.stopPropagation(); app.deleteWatchlistList('${list.id}')" 
                                        class="ml-1 p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" title="Listeyi Sil">
                                        <i data-lucide="x" class="w-3 h-3"></i>
                                    </button>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>

                <!-- YENİ LİSTE EKLE BUTONU -->
                <button onclick="app.openAddWatchlistListModal()" 
                    class="px-3 py-1.5 bg-dark-800/60 hover:bg-dark-800 text-slate-300 hover:text-white rounded-xl text-xs font-medium border border-dark-700/60 transition-all flex items-center gap-1.5">
                    <i data-lucide="plus" class="w-3.5 h-3.5 text-scout-400"></i>
                    <span>Yeni Liste</span>
                </button>
            </div>

            <!-- EKLEME FORMU -->
            <div class="bg-dark-900 border border-dark-800 p-6 rounded-2xl shadow-lg">
                <details class="group">
                    <summary class="flex justify-between items-center cursor-pointer list-none">
                        <h3 class="text-lg font-bold text-white flex items-center gap-2"><i data-lucide="plus-circle" class="text-scout-400 w-5 h-5"></i> ${t('new_candidate')}</h3>
                        <span class="p-2 bg-dark-800 rounded-lg group-open:rotate-180 transition-transform"><i data-lucide="chevron-down" class="w-4 h-4 text-slate-400"></i></span>
                    </summary>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 border-t border-dark-800 pt-6 animate-fade-in">
                        <div class="space-y-4">
                            ${this.createInput('wl-name', t('player_name'), 'Örn: Can', 'text', '', '')}
                            <div class="grid grid-cols-1 gap-4">
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="flex flex-col gap-1.5"><label class="text-xs font-bold text-slate-400 ml-1">${t('team')}</label><div class="flex gap-2"><div class="flex-1 relative" id="wl-team-search-container"><input type="text" id="wl-team-search" placeholder="${t('team')} Ara..." class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-scout-500 outline-none h-[46px] placeholder:text-slate-600 transition-all text-sm" onkeyup="app.filterTeamsList('wl-team', this.value)" onclick="app.filterTeamsList('wl-team', this.value)" onblur="setTimeout(() => { const d = document.getElementById('wl-team-dropdown'); if(d) d.classList.add('hidden'); }, 200)"><input type="hidden" id="wl-team" value=""><div id="wl-team-dropdown" class="absolute top-full left-0 w-full mt-1 bg-dark-900 border border-dark-700 rounded-xl max-h-48 overflow-y-auto hidden z-50 shadow-xl custom-scrollbar">${allTeams.map(ta => `<div class="wl-team-option p-3 hover:bg-scout-600 cursor-pointer text-sm transition-colors text-white" onclick="app.selectTeamList('wl-team', ${ta.val}, '${ta.txt.replace(/'/g, "\\'")}')">${ta.txt}</div>`).join('')}</div></div></div></div>
                                    <div class="flex flex-col gap-1.5"><label class="text-xs font-bold text-slate-400 ml-1">${t('national_team')}</label><div class="flex-1 relative" id="wl-national-team-container"><input type="text" id="wl-national-team" placeholder="Örn: Türkiye U19" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-scout-500 outline-none h-[46px] placeholder:text-slate-600 transition-all text-sm" onkeyup="app.filterTeamsList('wl-national-team', this.value)" onclick="app.filterTeamsList('wl-national-team', this.value)" onblur="setTimeout(() => { const d = document.getElementById('wl-national-team-dropdown'); if(d) d.classList.add('hidden'); }, 200)"><div id="wl-national-team-dropdown" class="absolute top-full left-0 w-full mt-1 bg-dark-900 border border-dark-700 rounded-xl max-h-48 overflow-y-auto hidden z-50 shadow-xl custom-scrollbar">${nationalTeams.map(ta => `<div class="wl-national-team-option p-3 hover:bg-scout-600 cursor-pointer text-sm transition-colors text-white" onclick="app.selectTeamList('wl-national-team', '', '${ta.txt.replace(/'/g, "\\'")}')">${ta.txt}</div>`).join('')}</div></div></div>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                ${this.createInput('wl-age', t('age'), '18', 'number', '', '', 40)}
                                ${this.createSelect('wl-pos', t('position'), POSITIONS.map(p=>({val:p, txt:tPos(p)})), '', '')}
                            </div>
                            <!-- ÖZEL LİSTE SEÇİMİ -->
                            <div class="flex flex-col gap-1.5">
                                <label class="text-xs font-bold text-slate-400 ml-1">Eklenecek Liste / Etiket</label>
                                <select id="wl-target-list" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-scout-500 outline-none text-sm cursor-pointer">
                                    <option value="">Varsayılan (Etiketsiz)</option>
                                    ${availableLists.map(l => `<option value="${l.id}" ${(filter.listId === l.id) ? 'selected' : ''}>${l.name}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                        <div class="space-y-4 flex flex-col h-full">
                            ${this.createInput('wl-source', t('source'), 'Örn: U19 Maçı', 'text', '', '')}
                            <div class="flex flex-col gap-1.5"><label class="text-xs font-bold text-slate-400 ml-1">${t('notes')}</label><textarea id="wl-notes" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-scout-500 outline-none h-20 resize-none text-sm placeholder:text-slate-600" placeholder="..."></textarea></div>
                            <div class="flex gap-2 items-end"><div class="flex-1">${this.createInput('wl-img', t('photo_url'), 'https://...', 'text', '', '')}</div></div>
                            <button onclick="app.addToWatchlist()" class="mt-auto w-full py-3 bg-scout-600 hover:bg-scout-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"><i data-lucide="save" class="w-4 h-4"></i> ${t('add_to_list')}</button>
                        </div>
                    </div>
                </details>
            </div>

            <!-- FİLTRELEME & SIRALAMA BAR (STICKY) -->
            <div class="sticky top-0 z-40 bg-dark-950/80 backdrop-blur-xl border-b border-dark-800 py-4 -mx-8 px-8 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div class="flex items-center gap-3 w-full md:w-auto">
                    <!-- Arama -->
                    <div class="relative w-full md:w-56 group">
                        <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-scout-500 transition-colors"></i>
                        <input type="text" id="wl-search" onkeyup="app.filterWatchlist('search', this.value)" value="${filter.search}" placeholder="${t('search_candidates')}" class="w-full bg-dark-900 border border-dark-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:border-scout-500 outline-none transition-all">
                    </div>
                    
                    <!-- Favori Filtresi -->
                    <button onclick="app.filterWatchlist('favoritesOnly', null)" class="w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${favBtnClass}" title="${t('region_favorites')}">
                        <i data-lucide="heart" class="w-4 h-4 ${filter.favoritesOnly ? 'fill-white' : ''}"></i>
                    </button>
                </div>

                <div class="flex gap-2 overflow-x-auto pb-1 max-w-full custom-scrollbar">
                    <button onclick="app.filterWatchlist('category', 'All')" class="wl-filter-btn px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${filter.category === 'All' ? 'bg-scout-600 text-white border-scout-600' : 'bg-dark-900 text-slate-400 border-dark-700 hover:text-white'}">${t('all')}</button>
                    <button onclick="app.filterWatchlist('category', 'Kaleci')" class="wl-filter-btn px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${filter.category === 'Kaleci' ? 'bg-scout-600 text-white border-scout-600' : 'bg-dark-900 text-slate-400 border-dark-700 hover:text-white'}">${t('pos_gk')}</button>
                    <button onclick="app.filterWatchlist('category', 'Defans')" class="wl-filter-btn px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${filter.category === 'Defans' ? 'bg-scout-600 text-white border-scout-600' : 'bg-dark-900 text-slate-400 border-dark-700 hover:text-white'}">${t('cat_def')}</button>
                    <button onclick="app.filterWatchlist('category', 'OrtaSaha')" class="wl-filter-btn px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${filter.category === 'OrtaSaha' ? 'bg-scout-600 text-white border-scout-600' : 'bg-dark-900 text-slate-400 border-dark-700 hover:text-white'}">${t('cat_mid')}</button>
                    <button onclick="app.filterWatchlist('category', 'Forvet')" class="wl-filter-btn px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${filter.category === 'Forvet' ? 'bg-scout-600 text-white border-scout-600' : 'bg-dark-900 text-slate-400 border-dark-700 hover:text-white'}">${t('pos_st')}</button>
                </div>

                <select onchange="app.filterWatchlist('sort', this.value)" class="bg-dark-900 border border-dark-700 text-slate-300 text-xs rounded-lg px-3 py-2 outline-none focus:border-scout-500 cursor-pointer">
                    <option value="newest" ${filter.sort === 'newest' ? 'selected' : ''}>${t('sort_newest')}</option>
                    <option value="oldest" ${filter.sort === 'oldest' ? 'selected' : ''}>${t('sort_oldest')}</option>
                    <option value="az" ${filter.sort === 'az' ? 'selected' : ''}>${t('sort_az')}</option>
                    <option value="za" ${filter.sort === 'za' ? 'selected' : ''}>${t('sort_za')}</option>
                </select>
            </div>

            <!-- Liste Grid -->
            <div id="watchlist-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${filtered.map(w => {
                    // Oyuncunun dahil olduğu liste etiketleri
                    const listIds = w.listIds || (w.listId ? [w.listId] : []);
                    // Eğer milliTakım doluysa milli etiketini de ekleyelim
                    if (w.nationalTeam && w.nationalTeam.trim().length > 0 && !listIds.includes('milli')) {
                        listIds.push('milli');
                    }

                    const playerLists = availableLists.filter(l => listIds.includes(l.id));

                    return `
                        <div id="wl-card-${w.id}" class="bg-dark-900 border border-dark-800 rounded-2xl p-5 relative group hover:border-scout-500/40 transition-all flex flex-col fade-in">
                            
                            <!-- AKSİYON BUTONLARI (2x2 IZGARA NİZAMİ VE DÜZENLİ) -->
                            <div class="absolute top-3.5 right-3.5 grid grid-cols-2 gap-1.5 z-20">
                                <!-- 1. Listeleri Yönet -->
                                <button onclick="app.openManagePlayerListsModal(${w.id})" class="w-7 h-7 rounded-lg text-slate-400 hover:bg-dark-800 hover:text-amber-400 border border-dark-700/60 bg-dark-950/80 flex items-center justify-center transition-all shadow-sm" title="Listeleri Yönet">
                                    <i data-lucide="tag" class="w-3.5 h-3.5"></i>
                                </button>
                                <!-- 2. Favori -->
                                <button onclick="app.toggleFavorite(${w.id}, 'watchlist')" class="w-7 h-7 rounded-lg transition-all border border-dark-700/60 bg-dark-950/80 flex items-center justify-center shadow-sm ${w.isFavorite ? 'text-red-500 border-red-500/30 bg-red-500/10' : 'text-slate-400 hover:bg-dark-800 hover:text-white'}" title="${t('region_favorites')}">
                                    <i data-lucide="heart" class="w-3.5 h-3.5 ${w.isFavorite ? 'fill-red-500' : ''}"></i>
                                </button>
                                <!-- 3. Raporla -->
                                <button onclick="app.transferToReport(${w.id})" class="w-7 h-7 bg-dark-950/80 text-scout-400 border border-dark-700/60 hover:bg-scout-600 hover:text-white rounded-lg flex items-center justify-center transition-all shadow-sm" title="${t('dash_create_report')}">
                                    <i data-lucide="clipboard-list" class="w-3.5 h-3.5"></i>
                                </button>
                                <!-- 4. Sil -->
                                <button onclick="app.deleteWatchlistPlayer(${w.id})" class="w-7 h-7 bg-dark-950/80 text-slate-400 border border-dark-700/60 hover:bg-red-500/20 hover:text-red-400 rounded-lg flex items-center justify-center transition-all shadow-sm" title="${t('delete')}">
                                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                </button>
                            </div>
                            
                            <!-- OYUNCU KARTI ÜST KISIM -->
                            <div class="flex items-center gap-3.5 mb-3 pr-20">
                                <img src="${this.getImageUrl(w.image)}" class="w-14 h-14 rounded-xl object-cover bg-dark-950 border border-dark-700 shrink-0" onerror="this.onerror=null;this.src=window.DEFAULT_AVATAR_DATA_URL">
                                <div class="overflow-hidden min-w-0">
                                    <div class="flex items-center gap-1.5"><h4 class="font-bold text-white text-base truncate">${w.name}</h4></div>
                                    <div class="text-xs text-slate-400 mt-0.5 truncate flex items-center gap-1"><i data-lucide="shield" class="w-3 h-3"></i> ${this.getTeamName(w.teamId)}${w.nationalTeam ? ` <span class="mx-1">•</span> <i data-lucide="flag" class="w-3 h-3 text-scout-400"></i> ${w.nationalTeam}` : ''}</div>
                                    <div class="text-xs text-scout-400 font-medium mt-0.5 truncate">${tPos(w.position) || '-'} • ${w.age || '-'} ${t('age')}</div>
                                </div>
                            </div>

                            <!-- LİSTE ETİKETLERİ -->
                            ${playerLists.length > 0 ? `
                                <div class="flex flex-wrap gap-1.5 mb-3">
                                    ${playerLists.map(l => {
                                        const theme = this.getListColorTheme(l.color);
                                        return `
                                            <span class="px-2 py-0.5 rounded-lg text-[10px] font-extrabold border ${theme.badge} flex items-center gap-1">
                                                <i data-lucide="${l.icon || 'bookmark'}" class="w-3 h-3"></i>
                                                ${l.name}
                                            </span>
                                        `;
                                    }).join('')}
                                </div>
                            ` : ''}

                            <!-- NOTLAR VE DETAYLAR -->
                            <div class="bg-dark-950/50 p-3 rounded-xl border border-dark-800/50 text-sm text-slate-300 line-clamp-3 mb-4 text-xs flex-1">${w.notes || ''}</div>
                            <div class="flex items-center justify-between text-xs text-slate-500 mt-auto pt-2 border-t border-dark-800/50">
                                <div class="flex items-center gap-1"><i data-lucide="info" class="w-3 h-3"></i> ${w.source || t('unknown')}</div>
                                <div>${formatDateSafe(w.dateAdded)}</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            ${filtered.length === 0 ? `<div class="text-center p-12 text-slate-500 border-2 border-dashed border-dark-800 rounded-2xl flex flex-col items-center justify-center gap-2"><i data-lucide="search-x" class="w-8 h-8 opacity-40"></i><span>${t('no_candidates')}</span></div>` : ''}
        </div>
    `;
    lucide.createIcons();
};

// --- FİLTRELEME & SİLME FONKSİYONLARI ---

ScoutApp.prototype.filterWatchlist = function(type, value) {
    if (!this.state.wlFilter) this.state.wlFilter = { search: '', category: 'All', sort: 'newest', favoritesOnly: false, listId: 'all' };
    
    if (type === 'favoritesOnly') {
        this.state.wlFilter.favoritesOnly = !this.state.wlFilter.favoritesOnly;
    } else {
        this.state.wlFilter[type] = value;
    }
    
    this.renderWatchlist(document.getElementById('content-area'), true);
};

ScoutApp.prototype.addToWatchlist = function() {
    const name = document.getElementById('wl-name').value;
    const teamId = document.getElementById('wl-team').value;
    const nationalTeam = document.getElementById('wl-national-team') ? document.getElementById('wl-national-team').value : '';
    const age = document.getElementById('wl-age').value;
    const pos = document.getElementById('wl-pos').value;
    const source = document.getElementById('wl-source').value;
    const notes = document.getElementById('wl-notes').value;
    const img = document.getElementById('wl-img').value;
    const targetList = document.getElementById('wl-target-list') ? document.getElementById('wl-target-list').value : '';

    if(!name) return alert("Oyuncu adı zorunludur.");
    if(!teamId) return alert("Lütfen arama çubuğundan bir takım seçiniz.");
    if(age && parseInt(age) > 40) return alert("Oyuncu yaşı 40'tan büyük olamaz!");

    const listIds = [];
    if (targetList) listIds.push(targetList);
    if (nationalTeam && nationalTeam.trim().length > 0 && !listIds.includes('milli')) {
        listIds.push('milli');
    }

    this.state.data.watchlist.unshift({
        id: Date.now(),
        name, 
        teamId: parseInt(teamId), 
        nationalTeam,
        age, 
        position: pos, 
        source, 
        notes, 
        image: img,
        dateAdded: new Date().toLocaleDateString('tr-TR'),
        isFavorite: false,
        listIds: listIds
    });
    
    // Formu temizle
    document.getElementById('wl-team-search').value = '';
    
    this.saveData();
    this.renderWatchlist(document.getElementById('content-area'));
    this.notify("Oyuncu aday havuzuna eklendi.");
};

ScoutApp.prototype.deleteWatchlistPlayer = function(id) {
    this.confirmAction("Bu oyuncuyu aday havuzundan silmek istediğinize emin misiniz?", () => {
        this.state.data.watchlist = this.state.data.watchlist.filter(w => w.id !== id);
        this.saveData();
        this.renderWatchlist(document.getElementById('content-area'));
        this.notify("Aday silindi.");
    });
};

ScoutApp.prototype.transferToReport = function(id) {
    const w = this.state.data.watchlist.find(x => x.id === id);
    if(!w) return;
    const matchedMatch = (this.state.data.matches || []).find(m => m.targetPlayerId == w.id);
    this.state.newReport = {
        ...this.resetReport(),
        watchlistId: w.id,
        name: w.name,
        teamId: w.teamId,
        position: w.position,
        age: w.age,
        source: w.source,
        image: w.image,
        matchId: matchedMatch ? matchedMatch.id : '',
        tmUrl: '',
        sofaUrl: ''
    };
    this.navigate('new-report');
};

ScoutApp.prototype.goToWatchlistAndHighlight = function(id) {
    this.navigate('watchlist');
    setTimeout(() => {
        const element = document.getElementById(`wl-card-${id}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('highlight-pulse');
            setTimeout(() => element.classList.remove('highlight-pulse'), 3000);
        }
    }, 100);
};

// --- YENİ ADAY LİSTESİ OLUŞTURMA MODALI ---

ScoutApp.prototype.openAddWatchlistListModal = function() {
    const icons = [
        { val: 'flag', txt: '🚩 Bayrak (Milli)' },
        { val: 'sparkles', txt: '✨ Yıldız / Genç' },
        { val: 'target', txt: '🎯 Hedef' },
        { val: 'eye', txt: '👁️ Takip' },
        { val: 'award', txt: '🏆 Ödül / Kalite' },
        { val: 'shield', txt: '🛡️ Savunma' },
        { val: 'zap', txt: '⚡ Fırtına / Hız' },
        { val: 'bookmark', txt: '🔖 Yer İmi' }
    ];

    const colors = [
        { val: 'red', txt: 'Kırmızı' },
        { val: 'emerald', txt: 'Yeşil' },
        { val: 'blue', txt: 'Mavi' },
        { val: 'amber', txt: 'Sarı' },
        { val: 'purple', txt: 'Mor' },
        { val: 'cyan', txt: 'Siyan' },
        { val: 'pink', txt: 'Pembe' }
    ];

    const html = `
        <div class="p-6 space-y-5">
            <div class="flex items-center justify-between border-b border-dark-800 pb-4">
                <div class="flex items-center gap-2.5">
                    <div class="w-9 h-9 rounded-xl bg-scout-500/10 border border-scout-500/20 text-scout-400 flex items-center justify-center">
                        <i data-lucide="plus-circle" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h3 class="text-base font-bold text-white">Yeni Aday Listesi</h3>
                        <p class="text-xs text-slate-400">Kendi özel kategori veya etiketinizi tanımlayın</p>
                    </div>
                </div>
                <button onclick="app.closeModal()" class="w-8 h-8 rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-400 hover:text-white flex items-center justify-center transition-all">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>
            </div>
            
            <div class="space-y-4">
                ${this.createInput('new-list-name', 'Liste Adı', 'Örn: U21 Milli Takım Adayları', 'text', '')}
                <div class="grid grid-cols-2 gap-3">
                    ${this.createSelect('new-list-icon', 'İkon', icons.map(i => ({ val: i.val, txt: i.txt })), 'flag')}
                    ${this.createSelect('new-list-color', 'Tema Rengi', colors.map(c => ({ val: c.val, txt: c.txt })), 'blue')}
                </div>
            </div>

            <div class="flex justify-end gap-2.5 pt-2 border-t border-dark-800">
                <button onclick="app.closeModal()" class="px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 font-semibold text-xs transition-colors">Vazgeç</button>
                <button onclick="app.addWatchlistList()" class="px-5 py-2 rounded-xl bg-scout-600 hover:bg-scout-500 text-white font-bold text-xs transition-all shadow-lg shadow-scout-600/20">Listeyi Oluştur</button>
            </div>
        </div>
    `;
    this.showModal(html);
};

ScoutApp.prototype.addWatchlistList = function() {
    const nameEl = document.getElementById('new-list-name');
    const iconEl = document.getElementById('new-list-icon');
    const colorEl = document.getElementById('new-list-color');

    if (!nameEl || !nameEl.value.trim()) return alert("Lütfen liste adını yazın.");

    const lists = this.getWatchlistLists();
    const id = 'list_' + Date.now();
    
    lists.push({
        id: id,
        name: nameEl.value.trim(),
        icon: iconEl ? iconEl.value : 'bookmark',
        color: colorEl ? colorEl.value : 'blue',
        isBuiltin: false
    });

    this.saveData();
    this.closeModal();
    this.notify("Yeni aday listesi oluşturuldu.");
    this.renderWatchlist(document.getElementById('content-area'));
};

ScoutApp.prototype.deleteWatchlistList = function(listId) {
    const lists = this.getWatchlistLists();
    const list = lists.find(l => l.id === listId);
    if (!list) return;

    this.confirmAction(`"${list.name}" listesini silmek istediğinize emin misiniz? (Oyuncular silinmez)`, () => {
        this.state.data.watchlistLists = lists.filter(l => l.id !== listId);
        
        // Oyunculardaki bu etiket referanslarını da temizleyelim
        (this.state.data.watchlist || []).forEach(w => {
            if (w.listIds) {
                w.listIds = w.listIds.filter(id => id !== listId);
            }
            if (w.listId === listId) {
                w.listId = null;
            }
        });

        if (this.state.wlFilter && this.state.wlFilter.listId === listId) {
            this.state.wlFilter.listId = 'all';
        }

        this.saveData();
        this.notify("Liste silindi.");
        this.renderWatchlist(document.getElementById('content-area'));
    });
};

// --- OYUNCU LİSTELERİNİ YÖNETME MODALI (ULTRA MODERN DESIGN) ---

ScoutApp.prototype.openManagePlayerListsModal = function(playerId) {
    const p = (this.state.data.watchlist || []).find(w => w.id === playerId);
    if (!p) return;

    const availableLists = this.getWatchlistLists();
    const currentListIds = p.listIds || (p.listId ? [p.listId] : []);
    if (p.nationalTeam && p.nationalTeam.trim().length > 0 && !currentListIds.includes('milli')) {
        currentListIds.push('milli');
    }

    const html = `
        <div class="p-6 space-y-5">
            <!-- BAŞLIK & KAPATMA -->
            <div class="flex items-center justify-between border-b border-dark-800 pb-4">
                <div class="flex items-center gap-2.5">
                    <div class="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                        <i data-lucide="tag" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h3 class="text-base font-bold text-white">Oyuncu Listelerini Yönet</h3>
                        <p class="text-xs text-slate-400">Etiket ve kategorileri işaretleyin</p>
                    </div>
                </div>
                <button onclick="app.closeModal()" class="w-8 h-8 rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-400 hover:text-white flex items-center justify-center transition-all">
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
                        <div onclick="app.togglePlayerListAssignment(${p.id}, '${list.id}', !document.getElementById('chk-list-${p.id}-${list.id}').checked)" 
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
                                    <input type="checkbox" id="chk-list-${p.id}-${list.id}" ${isChecked ? 'checked' : ''} class="hidden">
                                    <i data-lucide="check" class="w-3.5 h-3.5"></i>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- FOOTER İŞLEMLERİ -->
            <div class="flex items-center justify-between pt-2 border-t border-dark-800">
                <button onclick="app.openAddWatchlistListModal()" class="text-xs font-semibold text-scout-400 hover:text-scout-300 flex items-center gap-1.5 transition-colors">
                    <i data-lucide="plus" class="w-3.5 h-3.5"></i> Yeni Liste Oluştur
                </button>
                <button onclick="app.closeModal()" class="px-5 py-2 rounded-xl bg-scout-600 hover:bg-scout-500 text-white font-bold text-xs transition-all shadow-lg shadow-scout-600/20">
                    Tamam
                </button>
            </div>
        </div>
    `;
    this.showModal(html);
};


ScoutApp.prototype.togglePlayerListAssignment = function(playerId, listId, isChecked) {
    const p = (this.state.data.watchlist || []).find(w => w.id === playerId);
    if (!p) return;

    if (!p.listIds) p.listIds = p.listId ? [p.listId] : [];

    if (isChecked) {
        if (!p.listIds.includes(listId)) p.listIds.push(listId);
    } else {
        p.listIds = p.listIds.filter(id => id !== listId);
    }

    this.saveData();
    // Grid'i güncelle ve modalı yenile
    this.renderWatchlist(document.getElementById('content-area'), true);
    this.openManagePlayerListsModal(playerId);
};

ScoutApp.prototype.filterTeamsList = function(prefix, val) {
    const dropdown = document.getElementById(`${prefix}-dropdown`);
    if (!dropdown) return;
    dropdown.classList.remove('hidden');
    const options = document.querySelectorAll(`.${prefix}-option`);
    options.forEach(opt => {
        if(opt.innerText.toLowerCase().includes(val.toLowerCase())) opt.style.display = 'block';
        else opt.style.display = 'none';
    });
};

ScoutApp.prototype.selectTeamList = function(prefix, id, name) {
    const idField = document.getElementById(prefix);
    if(idField) idField.value = id;
    const searchField = document.getElementById(`${prefix}-search`) || document.getElementById(prefix);
    if(searchField) searchField.value = name;
    document.getElementById(`${prefix}-dropdown`).classList.add('hidden');
};
