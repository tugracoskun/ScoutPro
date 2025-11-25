// --- MAÇ PLANLAMA VE ADAY HAVUZU ---

ScoutApp.prototype.renderMatches = function(c) {
    const allTeams = this.state.data.teams.map(t=>({val:t.id, txt:t.name}));

    const reportedPlayers = this.state.data.players.map(p => ({val: p.id, txt: `★ ${p.name} (Raporlu)`}));
    const watchlistPlayers = this.state.data.watchlist.map(w => ({val: w.id, txt: `○ ${w.name} (Aday)`}));
    
    const allTargetPlayers = [{val:'', txt:'- Genel Takip -'}, ...reportedPlayers, ...watchlistPlayers];

    c.innerHTML = `
        <div class="space-y-6 fade-in max-w-5xl mx-auto">
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

            <h3 class="text-lg font-bold text-white mt-8">İzleme Listesi</h3>
            <div class="space-y-4">
                ${this.state.data.matches.length === 0 ? '<div class="text-center text-slate-500 py-8">İzlenecek maç yok.</div>' : ''}
                ${this.state.data.matches.sort((a,b)=>new Date(a.date)-new Date(b.date)).map(m => {
                    const h = this.state.data.teams.find(t => t.id == m.homeId);
                    const a = this.state.data.teams.find(t => t.id == m.awayId);
                    
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

                            <a href="${m.sofaUrl}" target="_blank" class="p-2 hover:bg-dark-700 rounded-lg text-slate-400 transition-colors"><i data-lucide="external-link" class="w-5 h-5"></i></a>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
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

ScoutApp.prototype.openEditMatchModal = function(id) {
    const m = this.state.data.matches.find(x => x.id === id);
    if(!m) return;
    
    const allTeams = this.state.data.teams.map(t=>({val:t.id, txt:t.name}));
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
        
        this.saveData(); // KAYIT

        this.closeModal();
        this.renderMatches(document.getElementById('content-area'));
    }
}

ScoutApp.prototype.deleteMatch = function(id) {
    this.confirmAction("Bu maçı izleme listesinden kaldırmak istiyor musunuz?", () => {
        this.state.data.matches = this.state.data.matches.filter(x => x.id !== id);
        this.saveData();
        this.renderMatches(document.getElementById('content-area'));
        this.notify("Maç silindi.");
    });
}

ScoutApp.prototype.addToWatchlist = function() {
    const name = document.getElementById('wl-name').value;
    const teamId = document.getElementById('wl-team').value;
    const age = document.getElementById('wl-age').value;
    const pos = document.getElementById('wl-pos').value;
    const source = document.getElementById('wl-source').value;
    const notes = document.getElementById('wl-notes').value;
    const img = document.getElementById('wl-img').value;

    if(!name) return alert("Oyuncu adı zorunludur.");
    if(!teamId) return alert("Lütfen bir takım seçiniz. Takım yoksa (+) butonu ile ekleyiniz.");
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
        dateAdded: new Date().toLocaleDateString('tr-TR')
    });
    
    this.saveData(); // KAYIT
    
    this.state.searchTerm = '';
    const searchInput = document.getElementById('global-search');
    if(searchInput) searchInput.value = '';

    this.renderWatchlist(document.getElementById('content-area'));
};

ScoutApp.prototype.renderWatchlist = function(c) {
    let filtered = this.state.data.watchlist;
    if (this.state.searchTerm) {
        filtered = filtered.filter(w => w.name.toLowerCase().includes(this.state.searchTerm));
    }
    filtered = filtered.sort((a, b) => b.id - a.id);

    const allTeams = this.state.data.teams.map(t=>({val:t.id, txt:t.name}));

    c.innerHTML = `
        <div class="max-w-6xl mx-auto space-y-8 fade-in">
            <div class="bg-dark-900 border border-dark-800 p-6 rounded-2xl shadow-lg">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2"><i data-lucide="plus-circle" class="text-scout-400 w-5 h-5"></i> Hızlı Aday Ekle</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        ${this.createInput('wl-name', 'Oyuncu Adı', 'Örn: Can', 'text', '', '')}
                        <div class="grid grid-cols-1 gap-4">
                            <div class="flex flex-col gap-1.5">
                                <label class="text-xs font-bold text-slate-400 ml-1">Takım</label>
                                <div class="flex gap-2">
                                    <div class="flex-1">
                                        ${this.createSelect('wl-team', '', allTeams, '', '', true)}
                                    </div>
                                    <button onclick="app.navigate('database')" class="h-[46px] w-[46px] bg-dark-800 hover:bg-dark-700 rounded-xl border border-dark-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors" title="Listede yoksa Veritabanına Git">
                                        <i data-lucide="database" class="w-5 h-5"></i>
                                    </button>
                                </div>
                                <p class="text-[10px] text-slate-500 ml-1">* Takım listede yoksa yandaki butona tıklayıp veritabanına ekleyiniz.</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            ${this.createInput('wl-age', 'Yaş', '18', 'number', '', '', 40)}
                            ${this.createSelect('wl-pos', 'Mevki', POSITIONS.map(p=>({val:p, txt:p})), '', '')}
                        </div>
                        ${this.createInput('wl-source', 'Kaynak', 'Örn: U19 Maçı', 'text', '', '')}
                    </div>
                    <div class="space-y-4 flex flex-col h-full">
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-bold text-slate-400 ml-1">Notlar</label>
                            <textarea id="wl-notes" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-scout-500 outline-none h-24 resize-none text-sm placeholder:text-slate-600" placeholder="Gözlemler..."></textarea>
                        </div>
                        <div class="flex gap-2 items-end">
                            <div class="flex-1">${this.createInput('wl-img', 'Foto URL', 'https://...', 'text', '', '')}</div>
                        </div>
                        <button onclick="app.addToWatchlist()" class="mt-auto w-full py-3 bg-scout-600 hover:bg-scout-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"><i data-lucide="save" class="w-4 h-4"></i> Listeye Ekle</button>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${filtered.map(w => `
                    <div id="wl-card-${w.id}" class="bg-dark-900 border border-dark-800 rounded-2xl p-5 relative group hover:border-scout-500/30 transition-all flex flex-col">
                        <button onclick="app.transferToReport(${w.id})" class="absolute top-4 right-4 p-2 bg-scout-500/10 text-scout-400 hover:bg-scout-500 hover:text-white rounded-lg transition-all" title="Raporla"><i data-lucide="clipboard-list" class="w-4 h-4"></i></button>
                        
                        <div class="flex items-center gap-4 mb-4 pr-10">
                            <img src="${w.image || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop'}" class="w-14 h-14 rounded-xl object-cover bg-dark-950 border border-dark-700">
                            <div class="overflow-hidden min-w-0">
                                <div class="flex items-center gap-2"><h4 class="font-bold text-white text-lg truncate">${w.name}</h4><span class="text-[10px] bg-dark-800 px-1.5 py-0.5 rounded text-slate-300 border border-dark-700">${w.age || '-'} Yaş</span></div>
                                <div class="text-xs text-slate-400 mt-0.5 truncate flex items-center gap-1"><i data-lucide="shield" class="w-3 h-3"></i> ${this.getTeamName(w.teamId)}</div>
                                <div class="text-xs text-scout-400 font-medium mt-0.5 truncate">${w.position || '-'}</div>
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
            
            ${filtered.length === 0 ? '<div class="text-center py-10 text-slate-500 border border-dashed border-dark-800 rounded-2xl">Henüz aday oyuncu eklenmemiş.</div>' : ''}
        </div>
    `;
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

ScoutApp.prototype.addMatch = function() {
    const h = document.getElementById('m-home').value;
    const a = document.getElementById('m-away').value;
    const d = document.getElementById('m-date').value;
    if(!h || !a || !d) return alert("Maç bilgileri eksik.");
    if(h === a) return alert("Aynı takımı seçemezsiniz.");
    
    this.state.data.matches.unshift({
        id: Date.now(),
        homeId: h, awayId: a, date: d,
        targetPlayerId: document.getElementById('m-target').value,
        sofaUrl: document.getElementById('m-sofa').value || '#'
    });
    
    this.saveData(); // KAYIT

    this.navigate('matches');
};