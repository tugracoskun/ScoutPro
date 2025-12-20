// --- OYUNCU LİSTELEME MODÜLÜ (FAVORİ FİLTRESİ EKLENDİ) ---

ScoutApp.prototype.renderPlayers = function(c) {
    // Filtre state kontrolü
    if (!this.state.playerFilter) {
        this.state.playerFilter = { favoritesOnly: false };
    }

    let filtered = this.state.data.players;

    // 1. Arama Filtresi
    if (this.state.searchTerm) {
        const term = this.state.searchTerm.toLowerCase();
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(term) || 
            this.getTeamName(p.teamId).toLowerCase().includes(term)
        );
    }

    // 2. Favori Filtresi
    if (this.state.playerFilter.favoritesOnly) {
        filtered = filtered.filter(p => p.isFavorite);
    }

    // Sıralama (Yeniden eskiye)
    filtered.sort((a, b) => b.id - a.id);

    // Buton Stili
    const favBtnClass = this.state.playerFilter.favoritesOnly 
        ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20" 
        : "bg-dark-900 text-slate-400 border-dark-700 hover:text-white";

    c.innerHTML = `
        <div class="space-y-6 fade-in">
            
            <!-- FİLTRE BAR (YENİ) -->
            <div class="sticky top-0 z-30 bg-dark-950/80 backdrop-blur-xl border-b border-dark-800 py-4 -mx-8 px-8 flex justify-between items-center">
                <div class="text-sm font-bold text-slate-400">
                    Toplam: <span class="text-white">${filtered.length}</span> Oyuncu
                </div>
                
                <button onclick="app.togglePlayerFilter()" class="flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-bold text-xs ${favBtnClass}">
                    <i data-lucide="heart" class="w-4 h-4 ${this.state.playerFilter.favoritesOnly ? 'fill-white' : ''}"></i>
                    Sadece Favoriler
                </button>
            </div>

            <!-- LİSTE -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                ${filtered.map(p => this.getPlayerCardHTML(p)).join('')}
            </div>
            
            ${filtered.length === 0 ? '<div class="text-center p-10 text-slate-500 border-2 border-dashed border-dark-800 rounded-2xl">Kriterlere uygun oyuncu bulunamadı.</div>' : ''}
        </div>
    `;
    lucide.createIcons();
};

ScoutApp.prototype.togglePlayerFilter = function() {
    this.state.playerFilter.favoritesOnly = !this.state.playerFilter.favoritesOnly;
    this.renderPlayers(document.getElementById('content-area'));
};

ScoutApp.prototype.getPlayerCardHTML = function(p) {
    const grade = this.getGrade(p.rating);
    const potColor = p.potential === 'Yüksek' ? 'text-scout-400' : 'text-slate-500';
    const currentAge = p.birthDate ? this.calculateAge(p.birthDate) : p.age;

    return `
        <div class="scout-card bg-dark-900 rounded-2xl p-5 relative group overflow-hidden border border-dark-800 hover:border-scout-500/30 transition-all">
            
            <!-- Favori Butonu -->
            <button onclick="app.toggleFavorite(${p.id}, 'player')" class="absolute top-3 right-3 z-20 p-2 rounded-lg transition-all ${p.isFavorite ? 'text-red-500 bg-red-500/10' : 'text-slate-500 hover:text-white bg-dark-950/50'}" title="${p.isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}">
                <i data-lucide="heart" class="w-4 h-4 ${p.isFavorite ? 'fill-red-500' : ''}"></i>
            </button>

            <!-- Tıklanabilir Alan -->
            <div onclick="app.openPlayerModal(${p.id})" class="cursor-pointer">
                <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-scout-500 to-transparent opacity-50"></div>
                
                <div class="flex items-start gap-4 mb-4">
                    <img src="${p.image || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop'}" class="w-14 h-14 rounded-xl object-cover bg-dark-950 border border-dark-700">
                    <div class="flex-1 min-w-0 pr-8">
                        <h4 class="font-bold text-white text-lg leading-tight truncate">${p.name}</h4>
                        <div class="text-xs text-scout-400 font-medium mt-1">${p.position}</div>
                        <div class="text-xs text-slate-500 mt-0.5 truncate">${this.getTeamName(p.teamId)}</div>
                    </div>
                </div>
                
                <div class="grid grid-cols-3 gap-2 bg-dark-950/50 rounded-lg p-2 border border-dark-800/50">
                    <div class="text-center"><div class="text-[10px] text-slate-500">Yaş</div><div class="font-medium text-white">${currentAge}</div></div>
                    <div class="text-center"><div class="text-[10px] text-slate-500">Puan</div><div class="font-bold text-xs ${grade.color}">${grade.letter}</div></div>
                    <div class="text-center"><div class="text-[10px] text-slate-500">Detay</div><i data-lucide="search" class="w-4 h-4 mx-auto text-slate-400 hover:text-white transition-colors"></i></div>
                </div>
            </div>
        </div>
    `;
};