// --- OYUNCU LİSTELEME MODÜLÜ (V3.6 - Dynamic Age) ---

ScoutApp.prototype.renderPlayers = function(c) {
    const filtered = this.state.data.players.filter(p => 
        p.name.toLowerCase().includes(this.state.searchTerm) || 
        this.getTeamName(p.teamId).toLowerCase().includes(this.state.searchTerm)
    );
    c.innerHTML = `
        <div class="space-y-6 fade-in">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                ${filtered.map(p => this.getPlayerCardHTML(p)).join('')}
            </div>
            ${filtered.length === 0 ? '<div class="text-center p-10 text-slate-500 border-2 border-dashed border-dark-800 rounded-2xl">Henüz raporlanmış oyuncu bulunamadı.</div>' : ''}
        </div>
    `;
};

ScoutApp.prototype.getPlayerCardHTML = function(p) {
    const grade = this.getGrade(p.rating);
    const potColor = p.potential === 'Yüksek' ? 'text-scout-400' : 'text-slate-500';
    
    // YAŞ HESAPLAMA:
    // Eğer doğum tarihi varsa hesapla, yoksa (eski kayıt) düz yaşı göster
    const currentAge = p.birthDate ? this.calculateAge(p.birthDate) : p.age;

    return `
        <div onclick="app.openPlayerModal(${p.id})" class="scout-card bg-dark-900 rounded-2xl p-5 relative group overflow-hidden cursor-pointer border border-dark-800 hover:border-scout-500/30 transition-all">
            <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-scout-500 to-transparent opacity-50"></div>
            <div class="flex items-start gap-4 mb-4">
                <img src="${p.image || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop'}" class="w-14 h-14 rounded-xl object-cover bg-dark-950 border border-dark-700">
                <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-white text-lg leading-tight truncate">${p.name}</h4>
                    <div class="text-xs text-scout-400 font-medium mt-1">${p.position}</div>
                    <div class="text-xs text-slate-500 mt-0.5 truncate">${this.getTeamName(p.teamId)}</div>
                </div>
                <div class="ml-auto text-right">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border-2 bg-dark-950 ${grade.color} ${grade.border} ${grade.shadow}">
                        ${grade.letter}
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-3 gap-2 bg-dark-950/50 rounded-lg p-2 border border-dark-800/50">
                <div class="text-center">
                    <div class="text-[10px] text-slate-500">Yaş</div>
                    <div class="font-medium text-white">${currentAge}</div>
                </div>
                <div class="text-center"><div class="text-[10px] text-slate-500">Potansiyel</div><div class="font-bold text-xs ${potColor}">${p.potential || 'Düşük'}</div></div>
                <div class="text-center"><div class="text-[10px] text-slate-500">Detay</div><i data-lucide="search" class="w-4 h-4 mx-auto text-slate-400 hover:text-white transition-colors"></i></div>
            </div>
        </div>
    `;
};