// --- OYUNCU LİSTELEME MODÜLÜ (FAVORİ FİLTRESİ EKLENDİ) ---

ScoutApp.prototype.renderPlayers = function(c, skipAnimation = false) {
    this.state.activePage = 'players';

    // Filtre state kontrolü
    if (!this.state.playerFilter) {
        this.state.playerFilter = { favoritesOnly: false, sort: 'newest', position: 'all', potential: 'all' };
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

    // 3. Mevki Filtresi
    if (this.state.playerFilter.position && this.state.playerFilter.position !== 'all') {
        filtered = filtered.filter(p => p.position === this.state.playerFilter.position);
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
            
            <!-- FİLTRE BAR (YENİ) -->
            <div class="sticky top-0 z-30 bg-dark-950/80 backdrop-blur-xl border-b border-dark-800 py-4 -mx-8 px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div class="text-sm font-bold text-slate-400">
                    ${t('total')}: <span class="text-white">${filtered.length}</span> ${t('players_count')}
                </div>
                
                <div class="flex flex-wrap items-center gap-3">
                    <select onchange="app.updatePlayerFilter('sort', this.value)" class="bg-dark-900 border border-dark-700 text-slate-300 text-xs font-bold rounded-xl px-3 py-2 outline-none cursor-pointer">
                        <option value="newest" ${this.state.playerFilter.sort === 'newest' ? 'selected' : ''}>${window.getLang && window.getLang() === 'en' ? 'Newest Added' : 'Yeni Eklenenler'}</option>
                        <option value="oldest" ${this.state.playerFilter.sort === 'oldest' ? 'selected' : ''}>${window.getLang && window.getLang() === 'en' ? 'Oldest Added' : 'Eskiden Yeniye'}</option>
                        <option value="rating_desc" ${this.state.playerFilter.sort === 'rating_desc' ? 'selected' : ''}>${window.getLang && window.getLang() === 'en' ? 'Highest Rating' : 'En Yüksek Puan'}</option>
                        <option value="rating_asc" ${this.state.playerFilter.sort === 'rating_asc' ? 'selected' : ''}>${window.getLang && window.getLang() === 'en' ? 'Lowest Rating' : 'En Düşük Puan'}</option>
                    </select>

                    <select onchange="app.updatePlayerFilter('position', this.value)" class="bg-dark-900 border border-dark-700 text-slate-300 text-xs font-bold rounded-xl px-3 py-2 outline-none cursor-pointer">
                        <option value="all">${window.getLang && window.getLang() === 'en' ? 'All Positions' : 'Tüm Mevkiler'}</option>
                        ${(typeof POSITIONS !== 'undefined' ? POSITIONS : []).map(pos => `<option value="${pos}" ${this.state.playerFilter.position === pos ? 'selected' : ''}>${window.tPos ? window.tPos(pos) : pos}</option>`).join('')}
                    </select>

                    <select onchange="app.updatePlayerFilter('potential', this.value)" class="bg-dark-900 border border-dark-700 text-slate-300 text-xs font-bold rounded-xl px-3 py-2 outline-none cursor-pointer">
                        <option value="all">${window.getLang && window.getLang() === 'en' ? 'All Potentials' : 'Tüm Potansiyeller'}</option>
                        <option value="Yüksek" ${this.state.playerFilter.potential === 'Yüksek' ? 'selected' : ''}>${window.getLang && window.getLang() === 'en' ? 'High' : 'Yüksek'}</option>
                        <option value="Düşük" ${this.state.playerFilter.potential === 'Düşük' ? 'selected' : ''}>${window.getLang && window.getLang() === 'en' ? 'Low' : 'Düşük'}</option>
                    </select>

                    <button onclick="app.togglePlayerFilter()" class="flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-bold text-xs ${favBtnClass}">
                        <i data-lucide="heart" class="w-4 h-4 ${this.state.playerFilter.favoritesOnly ? 'fill-white' : ''}"></i>
                        ${t('only_favorites')}
                    </button>
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

ScoutApp.prototype.updatePlayerFilter = function(key, value) {
    if (!this.state.playerFilter) {
        this.state.playerFilter = { favoritesOnly: false, sort: 'newest', position: 'all', potential: 'all' };
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