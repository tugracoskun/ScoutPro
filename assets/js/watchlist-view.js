// --- ADAY HAVUZU (WATCHLIST) MODÜLÜ ---

ScoutApp.prototype.renderWatchlist = function(c) {
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

    const allTeams = this.state.data.teams.map(t=>({val:t.id, txt:t.name}));
    const totalCount = this.state.data.watchlist.length;
    const favBtnClass = filter.favoritesOnly ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20" : "bg-dark-900 text-slate-400 border-dark-700 hover:text-white";

    c.innerHTML = `
        <div class="max-w-6xl mx-auto space-y-8 fade-in pb-20">
            
            <!-- EKLEME FORMU -->
            <div class="bg-dark-900 border border-dark-800 p-6 rounded-2xl shadow-lg">
                <details class="group">
                    <summary class="flex justify-between items-center cursor-pointer list-none">
                        <h3 class="text-lg font-bold text-white flex items-center gap-2"><i data-lucide="plus-circle" class="text-scout-400 w-5 h-5"></i> Yeni Aday Ekle</h3>
                        <span class="p-2 bg-dark-800 rounded-lg group-open:rotate-180 transition-transform"><i data-lucide="chevron-down" class="w-4 h-4 text-slate-400"></i></span>
                    </summary>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 border-t border-dark-800 pt-6 animate-fade-in">
                        <div class="space-y-4">
                            ${this.createInput('wl-name', 'Oyuncu Adı', 'Örn: Can', 'text', '', '')}
                            <div class="grid grid-cols-1 gap-4">
                                <div class="flex flex-col gap-1.5"><label class="text-xs font-bold text-slate-400 ml-1">Takım</label><div class="flex gap-2"><div class="flex-1">${this.createSelect('wl-team', '', allTeams, '', '', true)}</div><button onclick="app.navigate('database')" class="h-[46px] w-[46px] bg-dark-800 hover:bg-dark-700 rounded-xl border border-dark-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors" title="Listede yoksa Veritabanına Git"><i data-lucide="database" class="w-5 h-5"></i></button></div></div>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                ${this.createInput('wl-age', 'Yaş', '18', 'number', '', '', 40)}
                                ${this.createSelect('wl-pos', 'Mevki', POSITIONS.map(p=>({val:p, txt:p})), '', '')}
                            </div>
                            ${this.createInput('wl-source', 'Kaynak', 'Örn: U19 Maçı', 'text', '', '')}
                        </div>
                        <div class="space-y-4 flex flex-col h-full">
                            <div class="flex flex-col gap-1.5"><label class="text-xs font-bold text-slate-400 ml-1">Notlar</label><textarea id="wl-notes" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-scout-500 outline-none h-24 resize-none text-sm placeholder:text-slate-600" placeholder="Gözlemler..."></textarea></div>
                            <div class="flex gap-2 items-end"><div class="flex-1">${this.createInput('wl-img', 'Foto URL', 'https://...', 'text', '', '')}</div></div>
                            <button onclick="app.addToWatchlist()" class="mt-auto w-full py-3 bg-scout-600 hover:bg-scout-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"><i data-lucide="save" class="w-4 h-4"></i> Listeye Ekle</button>
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
                        <input type="text" id="wl-search" onkeyup="app.filterWatchlist('search', this.value)" value="${filter.search}" placeholder="Adaylarda ara..." class="w-full bg-dark-900 border border-dark-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:border-scout-500 outline-none transition-all">
                    </div>
                    
                    <!-- Favori Filtresi (YENİ) -->
                    <button onclick="app.filterWatchlist('favoritesOnly', null)" class="w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${favBtnClass}" title="Sadece Favoriler">
                        <i data-lucide="heart" class="w-4 h-4 ${filter.favoritesOnly ? 'fill-white' : ''}"></i>
                    </button>
                </div>

                <div class="flex gap-2 overflow-x-auto pb-1 max-w-full custom-scrollbar">
                    <button onclick="app.filterWatchlist('category', 'All')" class="wl-filter-btn px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${filter.category === 'All' ? 'bg-scout-600 text-white border-scout-600' : 'bg-dark-900 text-slate-400 border-dark-700 hover:text-white'}">Tümü (${totalCount})</button>
                    <button onclick="app.filterWatchlist('category', 'Kaleci')" class="wl-filter-btn px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${filter.category === 'Kaleci' ? 'bg-scout-600 text-white border-scout-600' : 'bg-dark-900 text-slate-400 border-dark-700 hover:text-white'}">Kaleci</button>
                    <button onclick="app.filterWatchlist('category', 'Defans')" class="wl-filter-btn px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${filter.category === 'Defans' ? 'bg-scout-600 text-white border-scout-600' : 'bg-dark-900 text-slate-400 border-dark-700 hover:text-white'}">Defans</button>
                    <button onclick="app.filterWatchlist('category', 'OrtaSaha')" class="wl-filter-btn px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${filter.category === 'OrtaSaha' ? 'bg-scout-600 text-white border-scout-600' : 'bg-dark-900 text-slate-400 border-dark-700 hover:text-white'}">Orta Saha</button>
                    <button onclick="app.filterWatchlist('category', 'Forvet')" class="wl-filter-btn px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${filter.category === 'Forvet' ? 'bg-scout-600 text-white border-scout-600' : 'bg-dark-900 text-slate-400 border-dark-700 hover:text-white'}">Forvet</button>
                </div>

                <select onchange="app.filterWatchlist('sort', this.value)" class="bg-dark-900 border border-dark-700 text-slate-300 text-xs rounded-lg px-3 py-2 outline-none focus:border-scout-500 cursor-pointer">
                    <option value="newest" ${filter.sort === 'newest' ? 'selected' : ''}>En Yeniler</option>
                    <option value="oldest" ${filter.sort === 'oldest' ? 'selected' : ''}>En Eskiler</option>
                    <option value="az" ${filter.sort === 'az' ? 'selected' : ''}>İsim (A-Z)</option>
                    <option value="za" ${filter.sort === 'za' ? 'selected' : ''}>İsim (Z-A)</option>
                </select>
            </div>

            <!-- Liste Grid -->
            <div id="watchlist-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${filtered.map(w => `
                    <div id="wl-card-${w.id}" class="bg-dark-900 border border-dark-800 rounded-2xl p-5 relative group hover:border-scout-500/30 transition-all flex flex-col fade-in">
                        
                        <!-- AKSİYON BUTONLARI -->
                        <div class="absolute top-4 right-4 flex gap-2 z-20">
                            <!-- Favori -->
                            <button onclick="app.toggleFavorite(${w.id}, 'watchlist')" class="p-2 rounded-lg transition-all ${w.isFavorite ? 'text-red-500 bg-red-500/10' : 'text-slate-500 hover:bg-dark-800 hover:text-white'}" title="${w.isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}">
                                <i data-lucide="heart" class="w-4 h-4 ${w.isFavorite ? 'fill-red-500' : ''}"></i>
                            </button>
                            <!-- Raporla -->
                            <button onclick="app.transferToReport(${w.id})" class="p-2 bg-scout-500/10 text-scout-400 hover:bg-scout-500 hover:text-white rounded-lg transition-all" title="Raporla">
                                <i data-lucide="clipboard-list" class="w-4 h-4"></i>
                            </button>
                            <!-- Sil -->
                            <button onclick="app.deleteWatchlistPlayer(${w.id})" class="p-2 hover:bg-red-500/10 hover:text-red-400 text-slate-500 rounded-lg transition-all" title="Adayı Sil">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                        </div>
                        
                        <div class="flex items-center gap-4 mb-4 pr-24">
                            <img src="${w.image || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop'}" class="w-14 h-14 rounded-xl object-cover bg-dark-950 border border-dark-700">
                            <div class="overflow-hidden min-w-0">
                                <div class="flex items-center gap-2"><h4 class="font-bold text-white text-lg truncate">${w.name}</h4></div>
                                <div class="text-xs text-slate-400 mt-0.5 truncate flex items-center gap-1"><i data-lucide="shield" class="w-3 h-3"></i> ${this.getTeamName(w.teamId)}</div>
                                <div class="text-xs text-scout-400 font-medium mt-0.5 truncate">${w.position || '-'} • ${w.age || '-'} Yaş</div>
                            </div>
                        </div>
                        <div class="bg-dark-950/50 p-3 rounded-xl border border-dark-800/50 text-sm text-slate-300 line-clamp-3 mb-4 text-xs flex-1">${w.notes || 'Not yok.'}</div>
                        <div class="flex items-center justify-between text-xs text-slate-500 mt-auto pt-2 border-t border-dark-800/50">
                            <div class="flex items-center gap-1"><i data-lucide="info" class="w-3 h-3"></i> ${w.source || 'Bilinmiyor'}</div>
                            <div class="flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3"></i> ${w.dateAdded}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            ${filtered.length === 0 ? '<div id="watchlist-empty" class="text-center py-10 text-slate-500 border-2 border-dashed border-dark-800 rounded-2xl">Kriterlere uygun aday bulunamadı.</div>' : ''}
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
    
    this.renderWatchlist(document.getElementById('content-area'));
};

ScoutApp.prototype.addToWatchlist = function() {
    const name = document.getElementById('wl-name').value;
    const teamId = document.getElementById('wl-team').value;
    const age = document.getElementById('wl-age').value;
    const pos = document.getElementById('wl-pos').value;
    const source = document.getElementById('wl-source').value;
    const notes = document.getElementById('wl-notes').value;
    const img = document.getElementById('wl-img').value;

    if(!name) return alert("Oyuncu adı zorunludur.");
    if(!teamId) return alert("Lütfen bir takım seçiniz.");
    if(age && parseInt(age) > 40) return alert("Oyuncu yaşı 40'tan büyük olamaz!");

    this.state.data.watchlist.unshift({
        id: Date.now(),
        name, 
        teamId: parseInt(teamId), 
        age, 
        position: pos, 
        source, 
        notes, 
        image: img,
        dateAdded: new Date().toLocaleDateString('tr-TR'),
        isFavorite: false
    });
    
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
            setTimeout(() => { element.classList.remove('highlight-pulse'); }, 2000);
        }
    }, 100);
};