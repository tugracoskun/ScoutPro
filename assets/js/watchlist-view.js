// --- ADAY HAVUZU (WATCHLIST) MODÜLÜ ---

ScoutApp.prototype.renderWatchlist = function(c, skipAnimation = false) {
    // Filtre state kontrolü
    if (!this.state.wlFilter) {
        this.state.wlFilter = { search: '', category: 'All', sort: 'newest', favoritesOnly: false };
    }

    let filtered = this.state.data.watchlist;
    const filter = this.state.wlFilter;

    // 1. Arama Filtresi
    if (filter.search) {
        filtered = filtered.filter(w => 
            w.name.toLowerCase().includes(filter.search.toLowerCase()) || 
            (w.notes && w.notes.toLowerCase().includes(filter.search.toLowerCase()))
        );
    }
    
    // 2. Kategori Filtresi
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

    // 3. Favori Filtresi (YENİ)
    if (filter.favoritesOnly) {
        filtered = filtered.filter(w => w.isFavorite);
    }

    // 4. Sıralama
    if (filter.sort === 'newest') filtered.sort((a, b) => b.id - a.id);
    else if (filter.sort === 'oldest') filtered.sort((a, b) => a.id - b.id);
    else if (filter.sort === 'az') filtered.sort((a, b) => a.name.localeCompare(b.name));
    else if (filter.sort === 'za') filtered.sort((a, b) => b.name.localeCompare(a.name));

    const allTeamsRaw = this.state.data.teams.map(t=>({val:t.id, txt:this.getTeamName(t.id)}));
    const countryNames = (this.state.data.countries || []).map(c=>c.name.toLowerCase());
    
    const isNationalTeam = (name) => {
        const n = name.toLowerCase();
        if (n.match(/\\bu(15|16|17|18|19|20|21|23)\\b/)) return true;
        if (n.includes(' milli') || n.includes(' national')) return true;
        return countryNames.some(c => n === c || n.startsWith(c + ' '));
    };

    const clubTeams = allTeamsRaw.filter(t => !isNationalTeam(t.txt));
    const nationalTeams = allTeamsRaw.filter(t => isNationalTeam(t.txt)).sort((a,b) => a.txt.localeCompare(b.txt));
    
    const allTeams = clubTeams;
    const totalCount = this.state.data.watchlist.length;
    const favBtnClass = filter.favoritesOnly ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20" : "bg-dark-900 text-slate-400 border-dark-700 hover:text-white";

    c.innerHTML = `
        <div class="max-w-6xl mx-auto space-y-8 ${skipAnimation ? '' : 'fade-in'} pb-20">
            
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
                            ${this.createInput('wl-source', t('source'), 'Örn: U19 Maçı', 'text', '', '')}
                        </div>
                        <div class="space-y-4 flex flex-col h-full">
                            <div class="flex flex-col gap-1.5"><label class="text-xs font-bold text-slate-400 ml-1">${t('notes')}</label><textarea id="wl-notes" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-scout-500 outline-none h-24 resize-none text-sm placeholder:text-slate-600" placeholder="..."></textarea></div>
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
                    
                    <!-- Favori Filtresi (YENİ) -->
                    <button onclick="app.filterWatchlist('favoritesOnly', null)" class="w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${favBtnClass}" title="${t('region_favorites')}">
                        <i data-lucide="heart" class="w-4 h-4 ${filter.favoritesOnly ? 'fill-white' : ''}"></i>
                    </button>
                </div>

                <div class="flex gap-2 overflow-x-auto pb-1 max-w-full custom-scrollbar">
                    <button onclick="app.filterWatchlist('category', 'All')" class="wl-filter-btn px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${filter.category === 'All' ? 'bg-scout-600 text-white border-scout-600' : 'bg-dark-900 text-slate-400 border-dark-700 hover:text-white'}">${t('all')} (${totalCount})</button>
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
                ${filtered.map(w => `
                    <div id="wl-card-${w.id}" class="bg-dark-900 border border-dark-800 rounded-2xl p-5 relative group hover:border-scout-500/30 transition-all flex flex-col fade-in">
                        
                        <!-- AKSİYON BUTONLARI -->
                        <div class="absolute top-4 right-4 flex gap-2 z-20">
                            <!-- Favori -->
                            <button onclick="app.toggleFavorite(${w.id}, 'watchlist')" class="p-2 rounded-lg transition-all ${w.isFavorite ? 'text-red-500 bg-red-500/10' : 'text-slate-500 hover:bg-dark-800 hover:text-white'}" title="${t('region_favorites')}">
                                <i data-lucide="heart" class="w-4 h-4 ${w.isFavorite ? 'fill-red-500' : ''}"></i>
                            </button>
                            <!-- Raporla -->
                            <button onclick="app.transferToReport(${w.id})" class="p-2 bg-scout-500/10 text-scout-400 hover:bg-scout-500 hover:text-white rounded-lg transition-all" title="${t('dash_create_report')}">
                                <i data-lucide="clipboard-list" class="w-4 h-4"></i>
                            </button>
                            <!-- Sil -->
                            <button onclick="app.deleteWatchlistPlayer(${w.id})" class="p-2 hover:bg-red-500/10 hover:text-red-400 text-slate-500 rounded-lg transition-all" title="${t('delete')}">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                        </div>
                        
                        <div class="flex items-center gap-4 mb-4 pr-24">
                            <img src="${w.image || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop'}" class="w-14 h-14 rounded-xl object-cover bg-dark-950 border border-dark-700">
                            <div class="overflow-hidden min-w-0">
                                <div class="flex items-center gap-2"><h4 class="font-bold text-white text-lg truncate">${w.name}</h4></div>
                                <div class="text-xs text-slate-400 mt-0.5 truncate flex items-center gap-1"><i data-lucide="shield" class="w-3 h-3"></i> ${this.getTeamName(w.teamId)}${w.nationalTeam ? ` <span class="mx-1">•</span> <i data-lucide="flag" class="w-3 h-3 text-scout-400"></i> ${w.nationalTeam}` : ''}</div>
                                <div class="text-xs text-scout-400 font-medium mt-0.5 truncate">${tPos(w.position) || '-'} • ${w.age || '-'} ${t('age')}</div>
                            </div>
                        </div>
                        <div class="bg-dark-950/50 p-3 rounded-xl border border-dark-800/50 text-sm text-slate-300 line-clamp-3 mb-4 text-xs flex-1">${w.notes || ''}</div>
                        <div class="flex items-center justify-between text-xs text-slate-500 mt-auto pt-2 border-t border-dark-800/50">
                            <div class="flex items-center gap-1"><i data-lucide="info" class="w-3 h-3"></i> ${w.source || t('unknown')}</div>
                            <div>${new Date(w.dateAdded).toLocaleDateString(window.getLang()==='en'?'en-US':'tr-TR')}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            ${filtered.length === 0 ? `<div class="text-center p-10 text-slate-500 border-2 border-dashed border-dark-800 rounded-2xl">${t('no_candidates')}</div>` : ''}
        </div>
    `;
    lucide.createIcons();
};

// --- FİLTRELEME & SİLME FONKSİYONLARI ---

ScoutApp.prototype.filterWatchlist = function(type, value) {
    if (!this.state.wlFilter) this.state.wlFilter = { search: '', category: 'All', sort: 'newest', favoritesOnly: false };
    
    if (type === 'favoritesOnly') {
        this.state.wlFilter.favoritesOnly = !this.state.wlFilter.favoritesOnly; // Toggle
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

    if(!name) return alert("Oyuncu adı zorunludur.");
    if(!teamId) return alert("Lütfen arama çubuğundan bir takım seçiniz.");
    if(age && parseInt(age) > 40) return alert("Oyuncu yaşı 40'tan büyük olamaz!");

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
        isFavorite: false
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
    this.state.newReport = {
        ...this.resetReport(),
        name: w.name,
        teamId: w.teamId,
        position: w.position,
        age: w.age,
        source: w.source,
        image: w.image,
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