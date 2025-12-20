// --- MAÇ İZLEME LİSTESİ MODÜLÜ ---

ScoutApp.prototype.renderMatches = function(c) {
    const allTeams = this.state.data.teams.map(t=>({val:t.id, txt:t.name}));

    // Hedef Oyuncu Listesini Hazırla (Raporlu + Aday)
    const reportedPlayers = this.state.data.players.map(p => ({val: p.id, txt: `★ ${p.name} (Raporlu)`}));
    const watchlistPlayers = this.state.data.watchlist.map(w => ({val: w.id, txt: `○ ${w.name} (Aday)`}));
    const allTargetPlayers = [{val:'', txt:'- Genel Takip -'}, ...reportedPlayers, ...watchlistPlayers];

    c.innerHTML = `
        <div class="space-y-6 fade-in max-w-5xl mx-auto">
            <!-- Maç Ekleme Formu -->
            <div class="bg-dark-900 border border-dark-800 rounded-2xl p-6 shadow-lg">
                <h3 class="font-bold text-white mb-4 flex items-center gap-2"><i data-lucide="tv-2" class="w-5 h-5 text-scout-500"></i> Maç İzleme Planı</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="grid grid-cols-1 gap-4">
                        <div class="flex items-end gap-2">
                            <div class="flex-1">${this.createSelect('m-home', 'Ev Sahibi', allTeams)}</div>
                            <button onclick="app.openQuickAddTeamModal()" class="h-[46px] w-[46px] bg-dark-800 hover:bg-dark-700 rounded-xl border border-dark-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors" title="Hızlı Takım Ekle"><i data-lucide="plus"></i></button>
                        </div>
                        <div class="flex items-end gap-2">
                            <div class="flex-1">${this.createSelect('m-away', 'Deplasman', allTeams)}</div>
                            <button onclick="app.openQuickAddTeamModal()" class="h-[46px] w-[46px] bg-dark-800 hover:bg-dark-700 rounded-xl border border-dark-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors" title="Hızlı Takım Ekle"><i data-lucide="plus"></i></button>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 gap-4">
                        ${this.createInput('m-date', 'Maç Tarihi', '', 'datetime-local')}
                        ${this.createInput('m-sofa', 'Maç Linki (Sofascore/Canlı)', 'https://...')}
                    </div>
                    
                    <div class="md:col-span-2 flex flex-col md:flex-row gap-4 items-end pt-2 border-t border-dark-800">
                        <div class="flex-1 w-full">
                            <div class="flex items-end gap-2">
                                <div class="flex-1">
                                    ${this.createSelect('m-target', 'İzlenecek Oyuncu (Opsiyonel)', allTargetPlayers)}
                                </div>
                                <button onclick="app.navigate('watchlist')" class="h-[46px] w-[46px] bg-dark-800 hover:bg-dark-700 rounded-xl border border-dark-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors" title="Listede yoksa Aday Havuzuna Git">
                                    <i data-lucide="user-plus" class="w-5 h-5"></i>
                                </button>
                            </div>
                        </div>
                        <button onclick="app.addMatch()" class="h-[46px] w-full md:w-auto px-6 bg-scout-600 hover:bg-scout-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-scout-600/20">
                            <i data-lucide="save" class="w-4 h-4"></i> Listeye Ekle
                        </button>
                    </div>
                </div>
            </div>

            <!-- Maç Listesi -->
            <h3 class="text-lg font-bold text-white mt-8">İzleme Listesi</h3>
            <div class="space-y-4">
                ${this.state.data.matches.length === 0 ? '<div class="text-center text-slate-500 py-8">İzlenecek maç yok.</div>' : ''}
                ${this.state.data.matches.sort((a,b)=>new Date(a.date)-new Date(b.date)).map(m => {
                    const h = this.state.data.teams.find(t => t.id == m.homeId);
                    const a = this.state.data.teams.find(t => t.id == m.awayId);
                    
                    // Hedef oyuncu kontrolü
                    let p = this.state.data.players.find(pl => pl.id == m.targetPlayerId);
                    let targetIsWatchlist = false;
                    
                    if (!p) {
                        p = this.state.data.watchlist.find(wl => wl.id == m.targetPlayerId);
                        if(p) targetIsWatchlist = true;
                    }
                    
                    let dateStr = "Tarih Yok";
                    let timeStr = "--:--";
                    if(m.date) {
                        const dateObj = new Date(m.date);
                        if(!isNaN(dateObj)) {
                            dateStr = dateObj.toLocaleDateString('tr-TR', {month:'short', day:'numeric'});
                            timeStr = dateObj.toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'});
                        }
                    }

                    let clickAction = '';
                    let iconHtml = '';
                    if (p) {
                        if (targetIsWatchlist) {
                            clickAction = `onclick="app.goToWatchlistAndHighlight(${p.id})" title="Aday Havuzuna Git"`;
                            iconHtml = '<i data-lucide="eye" class="w-3 h-3"></i> Aday';
                        } else {
                            clickAction = `onclick="app.openPlayerModal(${p.id})" title="Oyuncu Detayını Aç"`;
                            iconHtml = '<i data-lucide="check-circle" class="w-3 h-3"></i> Hedef';
                        }
                    }

                    return `
                        <div class="bg-dark-900 border border-dark-800 rounded-xl p-4 flex flex-col md:flex-row items-center gap-6 relative group hover:border-scout-500/30 transition-all">
                            <div class="absolute top-2 right-2 hidden group-hover:flex gap-2 bg-dark-950 p-1 rounded-lg border border-dark-700 z-10">
                                <button onclick="app.openEditMatchModal(${m.id})" class="p-1 hover:text-white text-slate-400"><i data-lucide="pencil" class="w-4 h-4"></i></button>
                                <button onclick="app.deleteMatch(${m.id})" class="p-1 hover:text-red-400 text-slate-400"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                            </div>

                            <div class="flex flex-col items-center justify-center bg-dark-950 rounded-lg w-20 h-16 border border-dark-800 shrink-0">
                                <span class="text-xs text-slate-500 font-bold uppercase">${dateStr}</span>
                                <span class="text-lg font-bold text-white">${timeStr}</span>
                            </div>
                            <div class="flex-1 flex items-center justify-center gap-4 w-full md:w-auto">
                                <div class="flex items-center gap-3 w-1/3 justify-end">
                                    <span class="font-bold text-white text-right hidden md:block truncate">${h?.name || '?'}</span>
                                    <div class="w-8 h-8 rounded-full bg-dark-950 flex items-center justify-center border border-dark-700 overflow-hidden">${this.getLogoDisplayHTML(h?.logo)}</div>
                                </div>
                                <div class="px-2 text-xs text-slate-500">VS</div>
                                <div class="flex items-center gap-3 w-1/3 justify-start">
                                    <div class="w-8 h-8 rounded-full bg-dark-950 flex items-center justify-center border border-dark-700 overflow-hidden">${this.getLogoDisplayHTML(a?.logo)}</div>
                                    <span class="font-bold text-white hidden md:block truncate">${a?.name || '?'}</span>
                                </div>
                            </div>
                            
                            <div class="w-full md:w-64 bg-dark-950/50 rounded-lg p-3 border border-dark-800/50 flex items-center gap-3 ${p ? 'cursor-pointer hover:bg-dark-950 hover:border-scout-500/50 transition-colors' : ''}" 
                                 ${clickAction}>
                                ${p ? `
                                    <img src="${p.image || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop'}" class="w-8 h-8 rounded-full object-cover border border-dark-700">
                                    <div class="flex flex-col min-w-0">
                                        <span class="text-[10px] ${targetIsWatchlist ? 'text-blue-400' : 'text-scout-400'} font-bold uppercase flex items-center gap-1">
                                            ${iconHtml}
                                        </span>
                                        <span class="text-sm text-white truncate">${p.name}</span>
                                    </div>
                                    <i data-lucide="chevron-right" class="w-4 h-4 text-slate-600 ml-auto"></i>
                                ` : `
                                    <div class="w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center"><i data-lucide="eye" class="w-4 h-4 text-slate-500"></i></div>
                                    <span class="text-sm text-slate-500 italic w-full">Genel Takip</span>
                                `}
                            </div>

                            ${m.sofaUrl ? `<button onclick="app.openWebBrowser('${m.sofaUrl}', 'Maç İzleme')" class="p-2 hover:bg-dark-700 rounded-lg text-slate-400 transition-colors"><i data-lucide="external-link" class="w-5 h-5"></i></button>` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
};

ScoutApp.prototype.addMatch = function() {
    const h = document.getElementById('m-home').value;
    const a = document.getElementById('m-away').value;
    const d = document.getElementById('m-date').value;
    const sofaUrl = document.getElementById('m-sofa').value;
    const targetPlayerId = document.getElementById('m-target').value;

    if(!h || !a || !d) return alert("Maç bilgileri eksik.");
    if(h === a) return alert("Aynı takımı seçemezsiniz.");
    
    this.state.data.matches.unshift({
        id: Date.now(),
        homeId: h, 
        awayId: a, 
        date: d,
        targetPlayerId: targetPlayerId,
        sofaUrl: sofaUrl || '#'
    });
    
    this.saveData();
    this.navigate('matches');
};

ScoutApp.prototype.openEditMatchModal = function(id) {
    const m = this.state.data.matches.find(x => x.id === id);
    if(!m) return;
    
    const allTeams = this.state.data.teams.map(t=>({val:t.id, txt:t.name}));
    
    // Hedef oyuncu listesini yeniden oluştur
    const reportedPlayers = this.state.data.players.map(p => ({val: p.id, txt: `★ ${p.name} (Raporlu)`}));
    const watchlistPlayers = this.state.data.watchlist.map(w => ({val: w.id, txt: `○ ${w.name} (Aday)`}));
    const allTargetPlayers = [{val:'', txt:'- Genel Takip -'}, ...reportedPlayers, ...watchlistPlayers];

    this.showModal(`
        <div class="p-6">
            <div class="flex justify-between items-center mb-4"><h3 class="text-lg font-bold text-white">Maç Düzenle</h3><button onclick="app.closeModal()"><i data-lucide="x" class="text-slate-400"></i></button></div>
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    ${this.createSelect('edit-m-home', 'Ev Sahibi', allTeams, m.homeId)}
                    ${this.createSelect('edit-m-away', 'Deplasman', allTeams, m.awayId)}
                </div>
                ${this.createInput('edit-m-date', 'Maç Tarihi', '', 'datetime-local', m.date)}
                ${this.createInput('edit-m-sofa', 'Maç Linki', '', 'text', m.sofaUrl)}
                ${this.createSelect('edit-m-target', 'İzlenecek Oyuncu', allTargetPlayers, m.targetPlayerId)}
                <button onclick="app.updateMatch(${id})" class="w-full bg-scout-600 hover:bg-scout-500 text-white py-3 rounded-xl font-bold mt-2">Güncelle</button>
            </div>
        </div>
    `);
};

ScoutApp.prototype.updateMatch = function(id) {
    const m = this.state.data.matches.find(x => x.id === id);
    if(m) {
        m.homeId = document.getElementById('edit-m-home').value;
        m.awayId = document.getElementById('edit-m-away').value;
        m.date = document.getElementById('edit-m-date').value;
        m.sofaUrl = document.getElementById('edit-m-sofa').value;
        m.targetPlayerId = document.getElementById('edit-m-target').value;
        
        this.saveData();
        this.closeModal();
        this.renderMatches(document.getElementById('content-area'));
    }
};

ScoutApp.prototype.deleteMatch = function(id) {
    this.confirmAction("Bu maçı silmek istediğinize emin misiniz?", () => {
        this.state.data.matches = this.state.data.matches.filter(x => x.id !== id);
        this.saveData();
        this.renderMatches(document.getElementById('content-area'));
        this.notify("Maç silindi.");
    });
};