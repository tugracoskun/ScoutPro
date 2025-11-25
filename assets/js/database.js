// --- VERİTABANI GÖRÜNTÜLEME MODÜLÜ ---

ScoutApp.prototype.renderDatabase = function(c) {
    c.innerHTML = `
        <div class="space-y-6 fade-in max-w-5xl mx-auto">
            <div class="flex justify-between items-center bg-dark-900 p-4 rounded-xl border border-dark-800">
                <div>
                    <h2 class="text-lg font-bold text-white">Veritabanı Yapısı</h2>
                    <p class="text-xs text-slate-500">Ülke > Lig > Takım > Oyuncu</p>
                </div>
                <button onclick="app.openAddCountryModal()" class="px-4 py-2 bg-scout-600 hover:bg-scout-500 text-white rounded-lg text-sm flex items-center gap-2"><i data-lucide="globe"></i> Ülke Ekle</button>
            </div>
            
            ${this.state.data.countries.length === 0 ? 
                `<div class="text-center py-12 border-2 border-dashed border-dark-800 rounded-2xl text-slate-500">Veritabanı boş. Ülke ekleyerek başlayınız.</div>` : ''}
            
            ${this.state.data.countries.map(country => {
                const leagues = this.state.data.leagues.filter(l => l.countryId === country.id);
                return `
                    <div class="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden hover-trigger relative">
                        <div class="bg-dark-950/50 p-4 border-b border-dark-800 flex items-center justify-between group">
                            <div class="flex items-center gap-3">
                                <!-- Ülke Bayrağı -->
                                <div class="w-8 h-6 overflow-hidden rounded shadow-sm flex items-center justify-center text-lg bg-dark-800">
                                    ${this.getLogoDisplayHTML(country.flag)}
                                </div>
                                <h3 class="text-lg font-bold text-white">${country.name}</h3>
                                <div class="edit-actions flex gap-1 ml-2">
                                    <button onclick="app.openEditCountryModal(${country.id})" class="p-1 hover:bg-dark-700 rounded text-slate-400 hover:text-white" title="Düzenle"><i data-lucide="pencil" class="w-3 h-3"></i></button>
                                    <button onclick="app.deleteCountry(${country.id})" class="p-1 hover:bg-red-900/30 rounded text-slate-400 hover:text-red-400" title="Sil"><i data-lucide="trash-2" class="w-3 h-3"></i></button>
                                </div>
                            </div>
                            <button onclick="app.openAddLeagueModal(${country.id})" class="text-xs bg-dark-800 hover:bg-dark-700 text-slate-300 px-3 py-1.5 rounded-lg border border-dark-700 flex items-center gap-1"><i data-lucide="plus"></i> Lig Ekle</button>
                        </div>
                        <div class="p-4 grid grid-cols-1 gap-4">
                            ${leagues.map(league => {
                                const teams = this.state.data.teams.filter(t => t.leagueId === league.id);
                                return `
                                    <div class="border border-dark-800 rounded-xl bg-dark-800/20 p-4 hover-trigger">
                                        <div class="flex items-center justify-between mb-3">
                                            <div class="flex items-center gap-2 text-scout-400 font-semibold text-sm uppercase tracking-wider">
                                                <!-- Lig Logosu -->
                                                <div class="w-6 h-6 flex items-center justify-center">
                                                    ${this.getLogoDisplayHTML(league.logo)}
                                                </div> 
                                                ${league.name}
                                                <div class="edit-actions flex gap-1 ml-2">
                                                    <button onclick="app.openEditLeagueModal(${league.id})" class="p-1 hover:bg-dark-700 rounded text-slate-500 hover:text-white" title="Düzenle"><i data-lucide="pencil" class="w-3 h-3"></i></button>
                                                    <button onclick="app.deleteLeague(${league.id})" class="p-1 hover:bg-red-900/30 rounded text-slate-500 hover:text-red-400" title="Sil"><i data-lucide="trash-2" class="w-3 h-3"></i></button>
                                                </div>
                                            </div>
                                            <button onclick="app.openAddTeamModal(${league.id})" class="text-[10px] bg-scout-500/10 hover:bg-scout-500/20 text-scout-400 px-2 py-1 rounded border border-scout-500/20 transition-colors flex items-center gap-1"><i data-lucide="plus" class="w-3 h-3"></i> Takım Ekle</button>
                                        </div>
                                        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                            ${teams.map(team => {
                                                const playerCount = this.state.data.players.filter(p => p.teamId === team.id).length;
                                                return `
                                                    <div class="relative group/team">
                                                        <div onclick="app.navigate('team-detail', ${team.id})" class="flex items-center gap-3 p-2 rounded-lg bg-dark-900 hover:bg-dark-800 cursor-pointer transition-colors border border-dark-800 hover:border-scout-500/30">
                                                            <!-- Takım Logosu -->
                                                            <div class="w-8 h-8 rounded-full bg-dark-950 flex items-center justify-center text-lg shadow-sm border border-dark-700 relative overflow-hidden">
                                                                ${this.getLogoDisplayHTML(team.logo, "w-full h-full object-cover")}
                                                                ${playerCount > 0 ? `<span class="absolute -top-1 -right-1 w-3 h-3 bg-scout-500 rounded-full border border-dark-900"></span>` : ''}
                                                            </div>
                                                            <div class="flex flex-col min-w-0">
                                                                <span class="text-sm text-slate-300 group-hover:text-white truncate font-medium">${team.name}</span>
                                                                <span class="text-[10px] text-slate-500">${playerCount} Oyuncu</span>
                                                            </div>
                                                        </div>
                                                        <div class="absolute top-1 right-1 hidden group-hover/team:flex gap-1 bg-dark-950 rounded-lg p-1 border border-dark-700 z-10">
                                                                <button onclick="app.openEditTeamModal(${team.id})" class="p-1 hover:text-white text-slate-400"><i data-lucide="pencil" class="w-3 h-3"></i></button>
                                                                <button onclick="app.deleteTeam(${team.id})" class="p-1 hover:text-red-400 text-slate-400"><i data-lucide="trash-2" class="w-3 h-3"></i></button>
                                                        </div>
                                                    </div>
                                                `;
                                            }).join('')}
                                            ${teams.length === 0 ? '<span class="text-xs text-slate-600 p-2">Takım yok</span>' : ''}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                            ${leagues.length === 0 ? '<span class="text-xs text-slate-600">Lig bulunamadı.</span>' : ''}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
};

ScoutApp.prototype.renderTeamDetail = function(c, teamId) {
    const team = this.state.data.teams.find(t => t.id === teamId);
    if(!team) { this.navigate('database'); return; }
    
    const league = this.state.data.leagues.find(l => l.id === team.leagueId);
    const country = this.state.data.countries.find(co => co.id === league.countryId);
    const teamPlayers = this.state.data.players.filter(p => p.teamId === teamId);

    c.innerHTML = `
        <div class="space-y-8 fade-in max-w-6xl mx-auto">
            <button onclick="app.navigate('database')" class="text-slate-400 hover:text-white flex items-center gap-2 text-sm mb-4"><i data-lucide="arrow-left" class="w-4 h-4"></i> Veritabanına Dön</button>
            <div class="bg-dark-900 border border-dark-800 rounded-3xl p-8 relative overflow-hidden">
                <div class="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                    <div class="w-32 h-32 rounded-2xl bg-dark-950 flex items-center justify-center text-6xl shadow-2xl border border-dark-800 overflow-hidden">
                        ${this.getLogoDisplayHTML(team.logo, "w-full h-full object-cover")}
                    </div>
                    <div class="flex-1 text-center md:text-left space-y-4">
                        <div>
                            <h2 class="text-4xl font-bold text-white mb-1">${team.name}</h2>
                            <div class="flex items-center justify-center md:justify-start gap-2 text-slate-400">
                                <div class="w-5 h-4 flex items-center justify-center overflow-hidden">${this.getLogoDisplayHTML(country.flag)}</div> <span>${country.name}</span>
                                <span class="w-1 h-1 bg-slate-600 rounded-full"></span>
                                <span>${league.name}</span>
                            </div>
                        </div>
                        <div class="flex flex-wrap justify-center md:justify-start gap-3">
                            ${team.tmUrl && team.tmUrl !== '#' ? `<a href="${team.tmUrl}" target="_blank" class="px-4 py-2 bg-[#1a3150] text-white rounded-lg text-sm flex items-center gap-2"><i data-lucide="globe" class="w-4 h-4"></i> TM</a>` : ''}
                            ${team.sofaUrl && team.sofaUrl !== '#' ? `<a href="${team.sofaUrl}" target="_blank" class="px-4 py-2 bg-[#2c3e50] text-white rounded-lg text-sm flex items-center gap-2"><i data-lucide="activity" class="w-4 h-4"></i> Sofa</a>` : ''}
                        </div>
                    </div>
                    <div class="bg-dark-800/50 p-4 rounded-2xl border border-dark-700 min-w-[160px] text-center">
                        <div class="text-xs text-slate-500 uppercase font-bold mb-2">Raporlu Oyuncu</div>
                        <div class="text-3xl font-bold text-white">${teamPlayers.length}</div>
                    </div>
                </div>
            </div>
            <div>
                <h3 class="text-xl font-bold text-white mb-4">Raporlanan Oyuncular</h3>
                ${teamPlayers.length > 0 
                    ? `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">${teamPlayers.map(p => this.getPlayerCardHTML(p)).join('')}</div>`
                    : `<div class="text-center text-slate-500 py-10 border border-dashed border-dark-800 rounded-xl">Henüz raporlanan oyuncu yok.</div>`
                }
            </div>
        </div>
    `;
};

// --- MODAL AÇMA FONKSİYONLARI (EKLEME) ---

ScoutApp.prototype.openAddCountryModal = function() { 
    this.showModal(`
        <div class="p-6">
            <div class="flex justify-between items-center mb-4"><h3 class="text-lg font-bold text-white">Ülke Ekle</h3><button onclick="app.closeModal()"><i data-lucide="x" class="text-slate-400"></i></button></div>
            <div class="space-y-4">
                ${this.createInput('modal-country-name', 'Ülke Adı', 'Örn: İtalya')}
                ${this.createImageUploadControl('modal-country-flag', 'Bayrak (URL veya Dosya)')}
                <button onclick="app.saveCountry()" class="w-full bg-scout-600 hover:bg-scout-500 text-white py-3 rounded-xl font-bold mt-2">Kaydet</button>
            </div>
        </div>
    `); 
};

ScoutApp.prototype.openAddLeagueModal = function(cId) { 
    this.state.tempData.countryId = cId; 
    this.showModal(`
        <div class="p-6">
            <div class="flex justify-between items-center mb-4"><h3 class="text-lg font-bold text-white">Lig Ekle</h3><button onclick="app.closeModal()"><i data-lucide="x" class="text-slate-400"></i></button></div>
            <div class="space-y-4">
                ${this.createInput('modal-league-name', 'Lig Adı', 'Örn: Serie A')}
                ${this.createImageUploadControl('modal-league-logo', 'Lig Logosu (URL veya Dosya)')}
                <button onclick="app.saveLeague()" class="w-full bg-scout-600 hover:bg-scout-500 text-white py-3 rounded-xl font-bold mt-2">Kaydet</button>
            </div>
        </div>
    `); 
};

ScoutApp.prototype.openAddTeamModal = function(lId) { 
    if(!lId) return this.openQuickAddTeamModal(); 
    this.state.tempData.leagueId = lId; 
    this.showModal(`
        <div class="p-6">
            <div class="flex justify-between items-center mb-4"><h3 class="text-lg font-bold text-white">Takım Ekle</h3><button onclick="app.closeModal()"><i data-lucide="x" class="text-slate-400"></i></button></div>
            <div class="space-y-4">
                ${this.createInput('modal-team-name', 'Takım Adı', 'Örn: Napoli')}
                ${this.createImageUploadControl('modal-team-logo', 'Takım Logosu (URL veya Dosya)')}
                ${this.createInput('modal-team-tm', 'Transfermarkt Link', 'https://...')}
                ${this.createInput('modal-team-sofa', 'Sofascore Link', 'https://...')}
                <button onclick="app.saveTeam()" class="w-full bg-scout-600 hover:bg-scout-500 text-white py-3 rounded-xl font-bold mt-2">Kaydet</button>
            </div>
        </div>
    `); 
};

ScoutApp.prototype.openQuickAddTeamModal = function() { 
    const lgs = this.state.data.leagues.map(l => ({val: l.id, txt: l.name})); 
    if(lgs.length===0) return alert("Önce veritabanından Ülke ve Lig ekleyiniz."); 
    this.showModal(`
        <div class="p-6">
            <div class="flex justify-between items-center mb-4"><h3 class="text-lg font-bold text-white">Hızlı Takım Ekle</h3><button onclick="app.closeModal()"><i data-lucide="x" class="text-slate-400"></i></button></div>
            <div class="space-y-4">
                ${this.createSelect('modal-quick-league', 'Lig Seçiniz', lgs)}
                ${this.createInput('modal-team-name', 'Takım Adı', 'Örn: Napoli')}
                ${this.createImageUploadControl('modal-team-logo', 'Takım Logosu (URL veya Dosya)')}
                ${this.createInput('modal-team-tm', 'Transfermarkt Link', 'https://...')}
                ${this.createInput('modal-team-sofa', 'Sofascore Link', 'https://...')}
                <button onclick="app.saveQuickTeam()" class="w-full bg-scout-600 hover:bg-scout-500 text-white py-3 rounded-xl font-bold mt-2">Kaydet</button>
            </div>
        </div>
    `); 
};

// --- MODAL AÇMA VE CRUD (DÜZENLEME) ---

ScoutApp.prototype.openEditCountryModal = function(id) { 
    const c = this.state.data.countries.find(x=>x.id===id); 
    if(!c) return; 
    this.showModal(`
        <div class="p-6">
            <div class="flex justify-between items-center mb-4"><h3 class="text-lg font-bold text-white">Ülke Düzenle</h3><button onclick="app.closeModal()"><i data-lucide="x" class="text-slate-400"></i></button></div>
            <div class="space-y-4">
                ${this.createInput('edit-country-name', 'Ülke Adı', '', 'text', c.name)}
                ${this.createImageUploadControl('edit-country-flag', 'Bayrak', c.flag)}
                <button onclick="app.updateCountry(${id})" class="w-full bg-scout-600 hover:bg-scout-500 text-white py-3 rounded-xl font-bold mt-2">Güncelle</button>
            </div>
        </div>
    `); 
};

ScoutApp.prototype.openEditLeagueModal = function(id) { 
    const l = this.state.data.leagues.find(x=>x.id===id); 
    if(!l) return; 
    this.showModal(`
        <div class="p-6">
            <div class="flex justify-between items-center mb-4"><h3 class="text-lg font-bold text-white">Lig Düzenle</h3><button onclick="app.closeModal()"><i data-lucide="x" class="text-slate-400"></i></button></div>
            <div class="space-y-4">
                ${this.createInput('edit-league-name', 'Lig Adı', '', 'text', l.name)}
                ${this.createImageUploadControl('edit-league-logo', 'Logo', l.logo)}
                <button onclick="app.updateLeague(${id})" class="w-full bg-scout-600 hover:bg-scout-500 text-white py-3 rounded-xl font-bold mt-2">Güncelle</button>
            </div>
        </div>
    `); 
};

ScoutApp.prototype.openEditTeamModal = function(id) { 
    const t = this.state.data.teams.find(x=>x.id===id); 
    if(!t) return; 
    this.showModal(`
        <div class="p-6">
            <div class="flex justify-between items-center mb-4"><h3 class="text-lg font-bold text-white">Takım Düzenle</h3><button onclick="app.closeModal()"><i data-lucide="x" class="text-slate-400"></i></button></div>
            <div class="space-y-4">
                ${this.createInput('edit-team-name', 'Takım Adı', '', 'text', t.name)}
                ${this.createImageUploadControl('edit-team-logo', 'Logo', t.logo)}
                ${this.createInput('edit-team-tm', 'Transfermarkt Link', '', 'text', t.tmUrl)}
                ${this.createInput('edit-team-sofa', 'Sofascore Link', '', 'text', t.sofaUrl)}
                <button onclick="app.updateTeam(${id})" class="w-full bg-scout-600 hover:bg-scout-500 text-white py-3 rounded-xl font-bold mt-2">Güncelle</button>
            </div>
        </div>
    `); 
};

// --- KAYDETME VE GÜNCELLEME MANTIĞI ---

ScoutApp.prototype.saveCountry = function() { 
    const n=document.getElementById('modal-country-name').value; 
    const f=document.getElementById('modal-country-flag').value; 
    if(!n) return alert("Ad girin."); 
    this.state.data.countries.push({id:Date.now(), name:n, flag:f}); 
    this.saveData(); 
    this.closeModal(); 
    this.renderDatabase(document.getElementById('content-area')); 
    this.notify("Ülke eklendi.");
};

ScoutApp.prototype.saveLeague = function() { 
    const n=document.getElementById('modal-league-name').value; 
    const l=document.getElementById('modal-league-logo').value; 
    if(!n) return alert("Ad girin."); 
    this.state.data.leagues.push({id:Date.now(), countryId:this.state.tempData.countryId, name:n, logo:l}); 
    this.saveData();
    this.closeModal(); 
    this.renderDatabase(document.getElementById('content-area')); 
    this.notify("Lig eklendi.");
};

ScoutApp.prototype.saveQuickTeam = function() {
    const lgSelect = document.getElementById('modal-quick-league');
    if (lgSelect && !lgSelect.value) return alert("Lütfen bir lig seçiniz.");
    if (lgSelect) this.state.tempData.leagueId = parseInt(lgSelect.value);
    this.saveTeam();
};

ScoutApp.prototype.saveTeam = function() {
    const name = document.getElementById('modal-team-name').value.trim();
    const logo = document.getElementById('modal-team-logo').value;
    const tmUrl = document.getElementById('modal-team-tm').value;
    const sofaUrl = document.getElementById('modal-team-sofa').value;

    if (!name) return alert("Takım adı zorunludur.");
    if (!this.state.tempData.leagueId) return alert("Lig bilgisi bulunamadı.");
    
    this.state.data.teams.push({
        id: Date.now(), 
        leagueId: this.state.tempData.leagueId, 
        name: name, 
        logo: logo,
        tmUrl: tmUrl, 
        sofaUrl: sofaUrl
    });

    this.saveData();
    this.closeModal();
    
    // Navigasyona göre render
    if(this.state.activePage === 'watchlist') this.renderWatchlist(document.getElementById('content-area'));
    else if(this.state.activePage === 'matches') this.renderMatches(document.getElementById('content-area'));
    else this.renderDatabase(document.getElementById('content-area'));
    
    this.notify("Takım başarıyla eklendi.");
};

ScoutApp.prototype.updateCountry = function(id) { 
    const c=this.state.data.countries.find(x=>x.id===id); 
    if(c) { 
        c.name=document.getElementById('edit-country-name').value; 
        c.flag=document.getElementById('edit-country-flag').value; 
        this.saveData();
        this.closeModal(); 
        this.renderDatabase(document.getElementById('content-area')); 
        this.notify("Ülke güncellendi.");
    } 
};

ScoutApp.prototype.updateLeague = function(id) { 
    const l=this.state.data.leagues.find(x=>x.id===id); 
    if(l) { 
        l.name=document.getElementById('edit-league-name').value; 
        l.logo=document.getElementById('edit-league-logo').value; 
        this.saveData();
        this.closeModal(); 
        this.renderDatabase(document.getElementById('content-area')); 
        this.notify("Lig güncellendi.");
    } 
};

ScoutApp.prototype.updateTeam = function(id) { 
    const t=this.state.data.teams.find(x=>x.id===id); 
    if(t) { 
        t.name=document.getElementById('edit-team-name').value; 
        t.logo=document.getElementById('edit-team-logo').value; 
        t.tmUrl=document.getElementById('edit-team-tm').value; 
        t.sofaUrl=document.getElementById('edit-team-sofa').value; 
        this.saveData();
        this.closeModal(); 
        this.renderDatabase(document.getElementById('content-area')); 
        this.notify("Takım güncellendi.");
    } 
};

// --- SİLME İŞLEMLERİ (CUSTOM CONFIRM İLE) ---

ScoutApp.prototype.deleteCountry = function(id) { 
    this.confirmAction("Bu ülkeyi ve bağlı tüm verileri silmek istediğinize emin misiniz?", () => {
        this.state.data.countries = this.state.data.countries.filter(x => x.id !== id);
        const leaguesToDelete = this.state.data.leagues.filter(l => l.countryId === id).map(l => l.id);
        this.state.data.leagues = this.state.data.leagues.filter(l => l.countryId !== id);
        this.state.data.teams = this.state.data.teams.filter(t => !leaguesToDelete.includes(t.leagueId));
        
        this.saveData(); 
        this.renderDatabase(document.getElementById('content-area')); 
        this.notify("Ülke ve bağlı veriler silindi.");
    });
};

ScoutApp.prototype.deleteLeague = function(id) { 
    this.confirmAction("Bu ligi ve takımlarını silmek istediğinize emin misiniz?", () => {
        this.state.data.leagues = this.state.data.leagues.filter(x => x.id !== id);
        this.state.data.teams = this.state.data.teams.filter(t => t.leagueId !== id);
        
        this.saveData(); 
        this.renderDatabase(document.getElementById('content-area')); 
        this.notify("Lig ve takımları silindi.");
    });
};

ScoutApp.prototype.deleteTeam = function(id) { 
    this.confirmAction("Bu takımı silmek istediğinize emin misiniz?", () => {
        this.state.data.teams = this.state.data.teams.filter(x => x.id !== id);
        this.saveData(); 
        this.renderDatabase(document.getElementById('content-area')); 
        this.notify("Takım silindi.");
    });
};