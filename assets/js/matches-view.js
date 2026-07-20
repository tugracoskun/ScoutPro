// --- MAÇ İZLEME LİSTESİ MODÜLÜ ---

ScoutApp.prototype.renderMatches = function(c) {
    this.state.matchesViewMode = this.state.matchesViewMode || 'list';
    
    if (!this.state.matchesCalendarDate) {
        this.state.matchesCalendarDate = new Date();
    }
    
    if (!this.state.matchesSelectedDate) {
        this.state.matchesSelectedDate = null;
    }

    const allLeagues = this.state.data.leagues.map(l => ({val: l.name, txt: l.name, icon: l.logo}));
    const allTeams = this.state.data.teams.map(t=>({val:t.id, txt:t.name, icon: t.logo}));

    const reportedPlayers = this.state.data.players.map(p => ({val: p.id, txt: `★ ${p.name} (${t('reported')})`}));
    const watchlistPlayers = this.state.data.watchlist.map(w => ({val: w.id, txt: `○ ${w.name} (${t('candidate')})`}));
    const allTargetPlayers = [{val:'', txt:`- ${t('general_tracking')} -`}, ...reportedPlayers, ...watchlistPlayers];

    const headerHtml = `
        <div class="flex justify-between items-center mb-6 max-w-6xl mx-auto mt-4 px-4">
            <h2 class="text-3xl font-black text-white flex items-center gap-3">
                <i data-lucide="tv-2" class="w-8 h-8 text-scout-500"></i> ${t('menu_matches')}
            </h2>
            <div class="flex bg-dark-950 border border-dark-800 rounded-xl p-1.5 shadow-xl">
                <button onclick="app.setMatchesView('list')" class="px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${this.state.matchesViewMode === 'list' ? 'bg-scout-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-dark-800'}">
                    <i data-lucide="list" class="w-4 h-4"></i> Liste
                </button>
                <button onclick="app.setMatchesView('calendar')" class="px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${this.state.matchesViewMode === 'calendar' ? 'bg-scout-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-dark-800'}">
                    <i data-lucide="calendar" class="w-4 h-4"></i> Takvim
                </button>
            </div>
        </div>
    `;

    if (this.state.matchesViewMode === 'list') {
        this.renderMatchesList(c, headerHtml, allTeams, allTargetPlayers);
    } else {
        this.renderMatchesCalendar(c, headerHtml, allTeams, allTargetPlayers);
    }
    
    // Timer'ı tetikle
    setTimeout(() => {
        if(this.updateMatchCountdowns) this.updateMatchCountdowns();
        lucide.createIcons();
    }, 100);
};

ScoutApp.prototype.setMatchesView = function(mode) {
    this.state.matchesViewMode = mode;
    this.navigate('matches');
};

ScoutApp.prototype.toggleStadiumFields = function(prefix) {
    const isChecked = document.getElementById(prefix + '-is-stadium').checked;
    const fields = document.getElementById(prefix + '-stadium-fields');
    if (isChecked) {
        fields.classList.remove('hidden');
        fields.classList.add('grid');
    } else {
        fields.classList.add('hidden');
        fields.classList.remove('grid');
    }
};

ScoutApp.prototype.renderMatchesList = function(c, headerHtml, allTeams, allTargetPlayers) {
    const allLeagues = this.state.data.leagues.map(l => ({val: l.name, txt: l.name, icon: l.logo}));
    c.innerHTML = `
        ${headerHtml}
        <div class="space-y-6 fade-in max-w-6xl mx-auto px-4">
            <!-- Maç Ekleme Formu -->
            <div class="bg-dark-900 border border-dark-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div class="absolute top-0 right-0 w-64 h-64 bg-scout-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <h3 class="text-lg font-bold text-white mb-6 flex items-center gap-2"><i data-lucide="plus-circle" class="w-5 h-5 text-scout-500"></i> ${t('match_plan')}</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <div class="grid grid-cols-1 gap-4">
                        <div class="flex items-end gap-2">
                            <div class="flex-1">${this.createCustomSearchSelect('m-home', t('home_team'), t('home_team')+'...', allTeams)}</div>
                            <button onclick="app.openQuickAddTeamModal()" class="h-[46px] w-[46px] bg-dark-950 hover:bg-dark-800 rounded-xl border border-dark-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors shrink-0" title="${t('add_team')}"><i data-lucide="plus"></i></button>
                        </div>
                        <div class="flex items-end gap-2">
                            <div class="flex-1">${this.createCustomSearchSelect('m-away', t('away_team'), t('away_team')+'...', allTeams)}</div>
                            <button onclick="app.openQuickAddTeamModal()" class="h-[46px] w-[46px] bg-dark-950 hover:bg-dark-800 rounded-xl border border-dark-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors shrink-0" title="${t('add_team')}"><i data-lucide="plus"></i></button>
                        </div>
                        <div class="flex items-end gap-2">
                            <div class="flex-1">${this.createCustomSearchSelect('m-league', 'Lig / Turnuva', 'Lig Seçin...', allLeagues)}</div>
                            <button onclick="app.navigate('database')" class="h-[46px] w-[46px] bg-dark-950 hover:bg-dark-800 rounded-xl border border-dark-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors shrink-0" title="Yeni Lig Ekle (Veritabanına Git)"><i data-lucide="plus-square"></i></button>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 gap-4">
                        ${this.createInput('m-date', t('match_date'), '', 'datetime-local')}
                        ${this.createInput('m-sofa', t('match_link'), 'https://...')}
                    </div>
                    
                    <!-- Stadyum Alanı -->
                    <div class="md:col-span-2 bg-dark-950/50 p-4 rounded-2xl border border-dark-800 transition-all">
                        <div class="flex items-center gap-3">
                            <input type="checkbox" id="m-is-stadium" class="w-5 h-5 accent-scout-500 cursor-pointer" onchange="app.toggleStadiumFields('m')">
                            <label for="m-is-stadium" class="text-white font-bold cursor-pointer select-none">Stadyumda (Canlı) İzleyeceğim</label>
                        </div>
                        <div id="m-stadium-fields" class="hidden grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-dark-800">
                            ${this.createInput('m-stadium-name', 'Stadyum Adı', 'Örn: Vodafone Park')}
                            ${this.createInput('m-stadium-link', 'Maps Linki', 'https://maps.app.goo.gl/...')}
                        </div>
                    </div>
                    
                    <div class="md:col-span-2 flex flex-col md:flex-row gap-4 items-end pt-4 border-t border-dark-800/50">
                        <div class="flex-1 w-full">
                            <div class="flex items-end gap-2">
                                <div class="flex-1">
                                    ${this.createSelect('m-target', t('target_player'), allTargetPlayers)}
                                </div>
                                <button onclick="app.navigate('watchlist')" class="h-[46px] w-[46px] bg-dark-950 hover:bg-dark-800 rounded-xl border border-dark-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors shrink-0" title="${t('go_to_watchlist')}">
                                    <i data-lucide="user-plus" class="w-5 h-5"></i>
                                </button>
                            </div>
                        </div>
                        <button onclick="app.addMatch()" class="h-[46px] w-full md:w-auto px-8 bg-scout-600 hover:bg-scout-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-scout-600/20 transition-all hover:scale-105 active:scale-95">
                            <i data-lucide="save" class="w-4 h-4"></i> ${t('add_to_list')}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Maç Listesi -->
            <div class="flex justify-between items-center mt-10 mb-4">
                <h3 class="text-2xl font-bold text-white flex items-center gap-2"><i data-lucide="calendar-check" class="text-scout-400 w-6 h-6"></i> ${t('watchlist_title')}</h3>
                <span class="text-xs font-bold text-slate-400 bg-dark-900 px-3 py-1.5 rounded-lg border border-dark-800">${this.state.data.matches.length} Maç</span>
            </div>
            
            <div class="space-y-4 pb-12">
                ${this.state.data.matches.length === 0 ? `<div class="text-center text-slate-500 py-12 bg-dark-900/30 rounded-3xl border border-dark-800/30 border-dashed">${t('no_matches')}</div>` : ''}
                ${this.state.data.matches.sort((a,b)=>new Date(a.date)-new Date(b.date)).map(m => this.generateMatchCardHTML(m)).join('')}
            </div>
        </div>
    `;
};

ScoutApp.prototype.renderMatchesCalendar = function(c, headerHtml, allTeams, allTargetPlayers) {
    const d = this.state.matchesCalendarDate;
    const year = d.getFullYear();
    const month = d.getMonth();
    
    // Setup days
    const firstDay = new Date(year, month, 1).getDay(); 
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; // Mon=0
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const matchMap = {};
    this.state.data.matches.forEach(m => {
        if (!m.date) return;
        const md = new Date(m.date);
        if (isNaN(md)) return;
        
        const dateKey = `${md.getFullYear()}-${String(md.getMonth()+1).padStart(2, '0')}-${String(md.getDate()).padStart(2, '0')}`;
        if (!matchMap[dateKey]) matchMap[dateKey] = [];
        matchMap[dateKey].push(m);
    });

    const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    const dayNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

    let selectedDateStr = null;
    let selectedMatchesHtml = `<div class="flex flex-col items-center justify-center py-24 text-slate-500 gap-4"><i data-lucide="calendar-days" class="w-16 h-16 text-dark-700/50"></i><span class="font-medium text-slate-400">Takvimden bir gün seçin</span></div>`;
    
    if (this.state.matchesSelectedDate) {
        const sdParts = this.state.matchesSelectedDate.split('-');
        const sYear = parseInt(sdParts[0]);
        const sMonth = parseInt(sdParts[1]) - 1;
        const sDay = parseInt(sdParts[2]);
        
        selectedDateStr = `${sDay} ${monthNames[sMonth]} ${sYear}`;
        
        const dayMatches = matchMap[this.state.matchesSelectedDate] || [];
        dayMatches.sort((a,b)=>new Date(a.date)-new Date(b.date));
        
        if (dayMatches.length > 0) {
            selectedMatchesHtml = `<div class="space-y-4 fade-in mt-6">` + 
                dayMatches.map(m => this.generateMatchCardHTML(m, true)).join('') 
                + `</div>`;
        } else {
            selectedMatchesHtml = `<div class="flex flex-col items-center justify-center py-20 text-slate-500 gap-4 fade-in mt-6 bg-dark-950 rounded-2xl border border-dark-800 border-dashed"><i data-lucide="inbox" class="w-12 h-12 text-dark-700"></i><span class="text-sm font-medium">Bu güne planlanmış maç yok.</span></div>`;
        }
    }

    let daysHtml = '';
    for(let i=0; i<adjustedFirstDay; i++) {
        daysHtml += `<div class="p-2 border border-dark-800/10 bg-transparent rounded-xl"></div>`;
    }
    
    for(let day=1; day<=daysInMonth; day++) {
        const currentKey = `${year}-${String(month+1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const hasMatch = matchMap[currentKey] && matchMap[currentKey].length > 0;
        const isSelected = this.state.matchesSelectedDate === currentKey;
        
        const today = new Date();
        const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
        
        const indicators = hasMatch ? `<div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">${matchMap[currentKey].map((_, idx) => idx<3 ? `<div class="w-1.5 h-1.5 rounded-full bg-scout-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>` : (idx===3 ? `<div class="w-1 h-1 rounded-full bg-scout-500 opacity-50"></div>` : '')).join('')}</div>` : '';
        
        daysHtml += `
            <div onclick="app.selectCalendarDate('${currentKey}')" class="relative min-h-[90px] p-2 border ${isSelected ? 'border-scout-500 bg-scout-500/10 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : (isToday ? 'border-slate-500 bg-dark-800' : 'border-dark-800 bg-dark-900')} hover:bg-dark-800 rounded-xl cursor-pointer transition-all flex flex-col hover:border-scout-500/50 group ${isSelected?'z-10 scale-[1.03]':''}">
                <span class="text-sm font-black ${isToday ? 'text-white' : 'text-slate-400'} group-hover:text-white transition-colors ${isSelected?'text-scout-400':''} ml-1">${day}</span>
                ${indicators}
            </div>
        `;
    }

    c.innerHTML = `
        ${headerHtml}
        <div class="fade-in max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 items-start">
            
            <!-- MAÇLAR (SOL TARAFA ALINDI) -->
            <div class="lg:col-span-5 order-2 lg:order-1 slide-in-left sticky top-6">
                <div class="bg-dark-900 border border-dark-800 rounded-3xl p-6 shadow-2xl min-h-[500px] relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-64 h-64 bg-scout-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                    ${selectedDateStr ? `
                        <div class="flex justify-between items-center mb-6 pb-5 border-b border-dark-800 relative z-10">
                            <h3 class="text-xl font-bold text-white flex items-center gap-2">
                                <i data-lucide="calendar-check" class="text-scout-400 w-6 h-6"></i> 
                                ${selectedDateStr}
                            </h3>
                            <button onclick="app.openCalendarAddMatchModal()" class="w-10 h-10 rounded-xl bg-scout-600 hover:bg-scout-500 text-white flex items-center justify-center shadow-lg shadow-scout-600/20 transition-all hover:scale-105 active:scale-95" title="Bu Güne Maç Ekle">
                                <i data-lucide="plus" class="w-5 h-5"></i>
                            </button>
                        </div>
                        <div class="relative z-10 max-h-[600px] overflow-y-auto custom-scrollbar pr-2 pb-10">
                            ${selectedMatchesHtml}
                        </div>
                    ` : `
                        ${selectedMatchesHtml}
                    `}
                </div>
            </div>

            <!-- TAKVİM (SAĞ TARAFA ALINDI) -->
            <div class="lg:col-span-7 order-1 lg:order-2 slide-in-right">
                <div class="bg-dark-900 border border-dark-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                    
                    <!-- Takvim Başlığı -->
                    <div class="flex justify-between items-center mb-8 relative z-10">
                        <h3 class="text-3xl font-black text-white capitalize">${monthNames[month]} ${year}</h3>
                        <div class="flex gap-2 bg-dark-950 p-1 rounded-xl border border-dark-800">
                            <button onclick="app.changeCalendarMonth(-1)" class="w-12 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"><i data-lucide="chevron-left" class="w-6 h-6"></i></button>
                            <button onclick="app.changeCalendarMonth(1)" class="w-12 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"><i data-lucide="chevron-right" class="w-6 h-6"></i></button>
                        </div>
                    </div>
                    
                    <!-- Takvim Grid -->
                    <div class="grid grid-cols-7 gap-3 relative z-10">
                        ${dayNames.map(d => `<div class="text-center text-sm font-bold text-slate-500 mb-2 uppercase">${d}</div>`).join('')}
                        ${daysHtml}
                    </div>
                </div>
            </div>
            
        </div>
    `;
};

ScoutApp.prototype.changeCalendarMonth = function(delta) {
    const d = this.state.matchesCalendarDate;
    d.setMonth(d.getMonth() + delta);
    this.renderMatches(document.getElementById('content-area'));
};

ScoutApp.prototype.selectCalendarDate = function(dateStr) {
    this.state.matchesSelectedDate = dateStr;
    this.renderMatches(document.getElementById('content-area'));
};

ScoutApp.prototype.generateMatchCardHTML = function(m, isCompact = false) {
    const h = this.state.data.teams.find(t => t.id == m.homeId);
    const a = this.state.data.teams.find(t => t.id == m.awayId);
    
    let p = this.state.data.players.find(pl => pl.id == m.targetPlayerId);
    let targetIsWatchlist = false;
    
    if (!p) {
        p = this.state.data.watchlist.find(wl => wl.id == m.targetPlayerId);
        if(p) targetIsWatchlist = true;
    }
    
    let dateStr = t('no_date');
    let timeStr = "--:--";
    if(m.date) {
        const dateObj = new Date(m.date);
        if(!isNaN(dateObj)) {
            dateStr = dateObj.toLocaleDateString(window.getLang()==='en'?'en-US':'tr-TR', {month:'short', day:'numeric'});
            timeStr = dateObj.toLocaleTimeString(window.getLang()==='en'?'en-US':'tr-TR', {hour:'2-digit', minute:'2-digit'});
        }
    }

    let clickAction = '';
    let iconHtml = '';
    if (p) {
        if (targetIsWatchlist) {
            clickAction = `onclick="app.goToWatchlistAndHighlight(${p.id})" title="${t('go_to_watchlist')}"`;
            iconHtml = `<i data-lucide="eye" class="w-3 h-3"></i> ${t('candidate')}`;
        } else {
            clickAction = `onclick="app.openPlayerModal(${p.id})" title="${t('go_to_player')}"`;
            iconHtml = `<i data-lucide="check-circle" class="w-3 h-3"></i> ${t('target')}`;
        }
    }

    let leagueBadge = m.league ? `<span class="px-2 py-0.5 bg-scout-900/30 border border-scout-500/20 rounded-md text-[10px] font-bold text-scout-400 mt-1 uppercase tracking-wider">${m.league}</span>` : '';
    let stadiumBadge = m.isStadium ? `<div class="mt-3 bg-dark-900 border border-dark-800 px-3 py-1.5 rounded-lg flex items-center justify-between gap-2 shadow-inner"><div class="flex items-center gap-2"><i data-lucide="map-pin" class="w-3.5 h-3.5 text-blue-400"></i><span class="text-xs font-bold text-slate-300 truncate">${m.stadiumName || 'Stadyum'}</span></div> ${m.stadiumLink ? `<button onclick="app.openExternal('${m.stadiumLink}')" class="text-blue-400 hover:text-white transition-colors"><i data-lucide="external-link" class="w-3 h-3"></i></button>`:''}</div>` : '';
    let countdownBadge = `<div class="match-countdown flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border shadow-sm transition-all bg-dark-900 border-dark-800 text-slate-400" data-date="${m.date}"><i data-lucide="timer" class="w-3.5 h-3.5"></i> <span>Hesaplanıyor...</span></div>`;

    if (isCompact) {
        // Compact Görünüm (Calendar Side Panel için)
        return `
            <div class="bg-dark-950 border border-dark-800 rounded-2xl p-4 flex flex-col relative group hover:border-scout-500/50 transition-all shadow-md">
                <div class="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="app.openEditMatchModal(${m.id})" class="p-1 hover:text-white rounded bg-dark-900 text-slate-400" title="${t('edit')}"><i data-lucide="pencil" class="w-3.5 h-3.5"></i></button>
                    <button onclick="app.deleteMatch(${m.id})" class="p-1 hover:text-red-400 rounded bg-dark-900 text-slate-400" title="${t('delete')}"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
                </div>

                <!-- Saat ve Geri Sayım -->
                <div class="flex justify-between items-center mb-3">
                    <div class="flex items-center gap-2">
                        <div class="bg-dark-900 px-2 py-1 rounded-md border border-dark-800 flex items-center gap-1.5">
                            <i data-lucide="clock" class="w-3 h-3 text-scout-500"></i>
                            <span class="text-xs font-bold text-white">${timeStr}</span>
                        </div>
                        ${countdownBadge}
                    </div>
                </div>

                <!-- Takımlar -->
                <div class="flex items-center justify-between w-full mb-2 mt-1">
                    <div class="flex flex-col items-center gap-2 w-[40%]">
                        <div class="w-10 h-10 rounded-full bg-dark-900 flex items-center justify-center border border-dark-800 overflow-hidden">${this.getLogoDisplayHTML(h?.logo)}</div>
                        <span class="font-bold text-white text-center text-xs w-full truncate" title="${h?.name}">${h?.name || '?'}</span>
                    </div>
                    <div class="flex flex-col items-center justify-center">
                        <div class="text-[10px] font-black text-slate-600 bg-dark-900 px-2 py-0.5 rounded">VS</div>
                        ${leagueBadge}
                    </div>
                    <div class="flex flex-col items-center gap-2 w-[40%]">
                        <div class="w-10 h-10 rounded-full bg-dark-900 flex items-center justify-center border border-dark-800 overflow-hidden">${this.getLogoDisplayHTML(a?.logo)}</div>
                        <span class="font-bold text-white text-center text-xs w-full truncate" title="${a?.name}">${a?.name || '?'}</span>
                    </div>
                </div>
                
                ${stadiumBadge}
                
                <!-- Hedef Oyuncu -->
                <div class="w-full bg-dark-900/50 rounded-xl p-2.5 mt-3 border border-dark-800 flex items-center gap-3 ${p ? 'cursor-pointer hover:bg-dark-800 transition-colors' : ''}" ${clickAction}>
                    ${p ? `
                        <img src="${p.image || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop'}" class="w-7 h-7 rounded-full object-cover border border-dark-700">
                        <div class="flex flex-col min-w-0">
                            <span class="text-[9px] ${targetIsWatchlist ? 'text-blue-400' : 'text-scout-400'} font-bold uppercase flex items-center gap-1">${iconHtml}</span>
                            <span class="text-xs font-bold text-white truncate">${p.name}</span>
                        </div>
                        <i data-lucide="chevron-right" class="w-3 h-3 text-slate-600 ml-auto group-hover:text-scout-400 transition-colors"></i>
                    ` : `
                        <div class="w-7 h-7 rounded-full bg-dark-900 border border-dark-800 flex items-center justify-center"><i data-lucide="eye" class="w-3.5 h-3.5 text-slate-600"></i></div>
                        <span class="text-xs font-medium text-slate-500 italic w-full">${t('general_tracking')}</span>
                    `}
                    ${m.sofaUrl ? `<button onclick="app.openExternal('${m.sofaUrl}'); event.stopPropagation();" class="text-blue-400 hover:text-blue-300 transition-colors text-xs flex items-center gap-1 bg-dark-950 px-2 py-1 rounded-md border border-dark-800"><i data-lucide="external-link" class="w-3 h-3"></i> ${t('match_link')}</button>` : ''}
                </div>
            </div>
        `;
    }

    return `
        <div class="bg-dark-900 border border-dark-800 rounded-2xl p-5 flex flex-col xl:flex-row items-center gap-6 relative group hover:border-scout-500/50 hover:bg-dark-800/30 transition-all shadow-lg hover:shadow-scout-900/10">
            <div class="absolute top-3 right-3 hidden group-hover:flex gap-2 bg-dark-950 p-1.5 rounded-xl border border-dark-700 z-10 shadow-xl">
                <button onclick="app.openEditMatchModal(${m.id})" class="p-1.5 hover:bg-dark-800 hover:text-white rounded-lg text-slate-400 transition-colors" title="${t('edit')}"><i data-lucide="pencil" class="w-4 h-4"></i></button>
                <button onclick="app.deleteMatch(${m.id})" class="p-1.5 hover:bg-red-900/30 hover:text-red-400 rounded-lg text-slate-400 transition-colors" title="${t('delete')}"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
            </div>

            <div class="flex flex-col items-center justify-center shrink-0 w-32 gap-2">
                <div class="flex flex-col items-center justify-center bg-dark-950 rounded-xl w-full py-2 border border-dark-800 shadow-inner">
                    <span class="text-xs text-scout-500 font-bold uppercase tracking-wider">${dateStr}</span>
                    <span class="text-xl font-black text-white mt-1">${timeStr}</span>
                </div>
                ${countdownBadge}
            </div>

            <div class="flex-1 flex flex-col justify-center gap-2 w-full xl:w-auto">
                <div class="flex items-center justify-center gap-4 w-full">
                    <div class="flex items-center gap-3 w-[40%] justify-end">
                        <span class="font-bold text-white text-right hidden sm:block truncate text-lg">${h?.name || '?'}</span>
                        <div class="w-10 h-10 rounded-full bg-dark-950 flex items-center justify-center border-2 border-dark-700 overflow-hidden shrink-0 shadow-sm">${this.getLogoDisplayHTML(h?.logo)}</div>
                    </div>
                    <div class="flex flex-col items-center justify-center shrink-0">
                        <div class="px-3 py-1 bg-dark-950 border border-dark-800 rounded-lg text-xs font-bold text-slate-500 mb-1">VS</div>
                        ${leagueBadge}
                    </div>
                    <div class="flex items-center gap-3 w-[40%] justify-start">
                        <div class="w-10 h-10 rounded-full bg-dark-950 flex items-center justify-center border-2 border-dark-700 overflow-hidden shrink-0 shadow-sm">${this.getLogoDisplayHTML(a?.logo)}</div>
                        <span class="font-bold text-white hidden sm:block truncate text-lg">${a?.name || '?'}</span>
                    </div>
                </div>
                ${stadiumBadge}
            </div>
            
            <div class="w-full xl:w-64 flex flex-col gap-2 shrink-0">
                <div class="w-full bg-dark-950/80 rounded-xl p-3 border border-dark-800 flex items-center gap-3 ${p ? 'cursor-pointer hover:bg-dark-800 hover:border-scout-500/50 transition-colors' : ''}" 
                     ${clickAction}>
                    ${p ? `
                        <img src="${p.image || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop'}" class="w-10 h-10 rounded-full object-cover border-2 border-dark-700">
                        <div class="flex flex-col min-w-0">
                            <span class="text-[10px] ${targetIsWatchlist ? 'text-blue-400' : 'text-scout-400'} font-bold uppercase flex items-center gap-1">
                                ${iconHtml}
                            </span>
                            <span class="text-sm font-bold text-white truncate">${p.name}</span>
                        </div>
                        <i data-lucide="chevron-right" class="w-4 h-4 text-slate-600 ml-auto group-hover:text-scout-400 transition-colors"></i>
                    ` : `
                        <div class="w-10 h-10 rounded-full bg-dark-900 border border-dark-800 flex items-center justify-center"><i data-lucide="eye" class="w-5 h-5 text-slate-600"></i></div>
                        <span class="text-sm font-medium text-slate-500 italic w-full">${t('general_tracking')}</span>
                    `}
                </div>
                ${m.sofaUrl ? `<button onclick="app.openExternal('${m.sofaUrl}')" class="w-full py-2 flex items-center justify-center gap-2 bg-blue-900/20 hover:bg-blue-600 border border-blue-900/50 rounded-xl text-blue-400 hover:text-white transition-colors" title="Linke Git"><i data-lucide="external-link" class="w-4 h-4"></i> ${t('match_link')}</button>` : ''}
            </div>
        </div>
    `;
};

ScoutApp.prototype.openCalendarAddMatchModal = function() {
    const allLeagues = this.state.data.leagues.map(l => ({val: l.name, txt: l.name, icon: l.logo}));
    const allTeams = this.state.data.teams.map(t=>({val:t.id, txt:t.name, icon:t.logo}));
    const reportedPlayers = this.state.data.players.map(p => ({val: p.id, txt: `★ ${p.name}`}));
    const watchlistPlayers = this.state.data.watchlist.map(w => ({val: w.id, txt: `○ ${w.name}`}));
    const allTargetPlayers = [{val:'', txt:`- ${t('general_tracking')} -`}, ...reportedPlayers, ...watchlistPlayers];
    
    let defaultDateTime = this.state.matchesSelectedDate ? `${this.state.matchesSelectedDate}T19:00` : '';

    this.showModal(`
        <div class="p-8 max-w-lg w-full">
            <div class="flex justify-between items-center mb-6 border-b border-dark-800 pb-4">
                <h3 class="text-xl font-bold text-white flex items-center gap-2"><i data-lucide="calendar-plus" class="text-scout-500 w-6 h-6"></i> Yeni Maç Planla</h3>
                <button onclick="app.closeModal()" class="text-slate-400 hover:text-white transition-colors"><i data-lucide="x"></i></button>
            </div>
            
            <div class="space-y-5 relative z-10 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
                <div class="grid grid-cols-2 gap-4">
                    ${this.createCustomSearchSelect('modal-m-home', t('home_team'), t('home_team')+'...', allTeams)}
                    ${this.createCustomSearchSelect('modal-m-away', t('away_team'), t('away_team')+'...', allTeams)}
                </div>
                
                <div class="flex items-end gap-2">
                    <div class="flex-1">${this.createCustomSearchSelect('modal-m-league', 'Lig / Turnuva', 'Lig Seçin...', allLeagues)}</div>
                    <button onclick="app.closeModal(); app.navigate('database');" class="h-[46px] w-[46px] bg-dark-950 hover:bg-dark-800 rounded-xl border border-dark-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors shrink-0" title="Yeni Lig Ekle (Veritabanına Git)"><i data-lucide="plus-square"></i></button>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    ${this.createInput('modal-m-date', t('match_date'), '', 'datetime-local', defaultDateTime)}
                    ${this.createSelect('modal-m-target', t('target_player'), allTargetPlayers)}
                </div>

                ${this.createInput('modal-m-sofa', t('match_link'), 'https://...', 'text')}
                
                <div class="bg-dark-950 p-4 rounded-xl border border-dark-800 transition-all">
                    <div class="flex items-center gap-3">
                        <input type="checkbox" id="modal-m-is-stadium" class="w-5 h-5 accent-scout-500 cursor-pointer" onchange="app.toggleStadiumFields('modal-m')">
                        <label for="modal-m-is-stadium" class="text-white font-bold cursor-pointer select-none">Stadyumda (Canlı) İzleyeceğim</label>
                    </div>
                    <div id="modal-m-stadium-fields" class="hidden grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-dark-800">
                        ${this.createInput('modal-m-stadium-name', 'Stadyum Adı', 'Örn: Vodafone Park')}
                        ${this.createInput('modal-m-stadium-link', 'Maps Linki', 'https://maps.app.goo.gl/...')}
                    </div>
                </div>

                <button onclick="app.saveModalAddMatch()" class="w-full mt-4 bg-scout-600 hover:bg-scout-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-scout-600/20 flex items-center justify-center gap-2 text-lg sticky bottom-0">
                    <i data-lucide="save" class="w-5 h-5"></i> ${t('add_to_list')}
                </button>
            </div>
        </div>
    `);
    lucide.createIcons();
};

ScoutApp.prototype.saveModalAddMatch = function() {
    const h = document.getElementById('modal-m-home').value;
    const a = document.getElementById('modal-m-away').value;
    const d = document.getElementById('modal-m-date').value;
    const sofaUrl = document.getElementById('modal-m-sofa').value;
    const targetPlayerId = document.getElementById('modal-m-target').value;
    const league = document.getElementById('modal-m-league').value;
    const isStadium = document.getElementById('modal-m-is-stadium').checked;
    const stadiumName = document.getElementById('modal-m-stadium-name').value;
    const stadiumLink = document.getElementById('modal-m-stadium-link').value;

    if(!h || !a || !d) return alert(t('err_incomplete'));
    if(h === a) return alert(t('err_same_team'));
    
    this.state.data.matches.unshift({
        id: Date.now(),
        homeId: h, 
        awayId: a, 
        date: d,
        targetPlayerId: targetPlayerId,
        sofaUrl: sofaUrl || '#',
        league: league || '',
        isStadium: isStadium,
        stadiumName: isStadium ? stadiumName : '',
        stadiumLink: isStadium ? stadiumLink : ''
    });
    
    this.saveData();
    this.closeModal();
    this.renderMatches(document.getElementById('content-area'));
    this.notify("Maç eklendi!");
};

ScoutApp.prototype.addMatch = function() {
    const h = document.getElementById('m-home').value;
    const a = document.getElementById('m-away').value;
    const d = document.getElementById('m-date').value;
    const sofaUrl = document.getElementById('m-sofa').value;
    const targetPlayerId = document.getElementById('m-target').value;
    const league = document.getElementById('m-league').value;
    const isStadium = document.getElementById('m-is-stadium').checked;
    const stadiumName = document.getElementById('m-stadium-name').value;
    const stadiumLink = document.getElementById('m-stadium-link').value;

    if(!h || !a || !d) return alert(t('err_incomplete'));
    if(h === a) return alert(t('err_same_team'));
    
    this.state.data.matches.unshift({
        id: Date.now(),
        homeId: h, 
        awayId: a, 
        date: d,
        targetPlayerId: targetPlayerId,
        sofaUrl: sofaUrl || '#',
        league: league || '',
        isStadium: isStadium,
        stadiumName: isStadium ? stadiumName : '',
        stadiumLink: isStadium ? stadiumLink : ''
    });
    
    this.saveData();
    this.renderMatches(document.getElementById('content-area'));
    this.notify("Maç eklendi!"); 
};

ScoutApp.prototype.openEditMatchModal = function(id) {
    const m = this.state.data.matches.find(x => x.id === id);
    if(!m) return;
    
    const allLeagues = this.state.data.leagues.map(l => ({val: l.name, txt: l.name, icon: l.logo}));
    const allTeams = this.state.data.teams.map(t=>({val:t.id, txt:t.name, icon: t.logo}));
    
    const reportedPlayers = this.state.data.players.map(p => ({val: p.id, txt: `★ ${p.name} (${t('reported')})`}));
    const watchlistPlayers = this.state.data.watchlist.map(w => ({val: w.id, txt: `○ ${w.name} (${t('candidate')})`}));
    const allTargetPlayers = [{val:'', txt:`- ${t('general_tracking')} -`}, ...reportedPlayers, ...watchlistPlayers];

    this.showModal(`
        <div class="p-8 max-w-lg w-full">
            <div class="flex justify-between items-center mb-6 border-b border-dark-800 pb-4">
                <h3 class="text-xl font-bold text-white flex items-center gap-2"><i data-lucide="pencil" class="text-scout-500 w-5 h-5"></i> ${t('edit')}</h3>
                <button onclick="app.closeModal()"><i data-lucide="x" class="text-slate-400 hover:text-white transition-colors"></i></button>
            </div>
            <div class="space-y-5 relative z-10 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
                <div class="grid grid-cols-2 gap-4">
                    ${this.createCustomSearchSelect('edit-m-home', t('home_team'), '', allTeams, m.homeId)}
                    ${this.createCustomSearchSelect('edit-m-away', t('away_team'), '', allTeams, m.awayId)}
                </div>
                
                <div class="flex items-end gap-2">
                    <div class="flex-1">${this.createCustomSearchSelect('edit-m-league', 'Lig / Turnuva', 'Lig Seçin...', allLeagues, m.league || '')}</div>
                    <button onclick="app.closeModal(); app.navigate('database');" class="h-[46px] w-[46px] bg-dark-950 hover:bg-dark-800 rounded-xl border border-dark-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors shrink-0" title="Yeni Lig Ekle (Veritabanına Git)"><i data-lucide="plus-square"></i></button>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    ${this.createInput('edit-m-date', t('match_date'), '', 'datetime-local', m.date)}
                    ${this.createSelect('edit-m-target', t('target_player'), allTargetPlayers, m.targetPlayerId)}
                </div>
                ${this.createInput('edit-m-sofa', t('match_link'), '', 'text', m.sofaUrl)}
                
                <div class="bg-dark-950 p-4 rounded-xl border border-dark-800 transition-all">
                    <div class="flex items-center gap-3">
                        <input type="checkbox" id="edit-m-is-stadium" class="w-5 h-5 accent-scout-500 cursor-pointer" onchange="app.toggleStadiumFields('edit-m')" ${m.isStadium ? 'checked':''}>
                        <label for="edit-m-is-stadium" class="text-white font-bold cursor-pointer select-none">Stadyumda (Canlı) İzleyeceğim</label>
                    </div>
                    <div id="edit-m-stadium-fields" class="${m.isStadium ? 'grid' : 'hidden'} grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-dark-800">
                        ${this.createInput('edit-m-stadium-name', 'Stadyum Adı', 'Örn: Vodafone Park', 'text', m.stadiumName || '')}
                        ${this.createInput('edit-m-stadium-link', 'Maps Linki', 'https://maps.app.goo.gl/...', 'text', m.stadiumLink || '')}
                    </div>
                </div>
                
                <button onclick="app.updateMatch(${id})" class="w-full bg-scout-600 hover:bg-scout-500 text-white py-3.5 rounded-xl font-bold mt-4 shadow-lg shadow-scout-600/20 flex items-center justify-center gap-2 text-lg sticky bottom-0">
                    <i data-lucide="save" class="w-5 h-5"></i> ${t('save')}
                </button>
            </div>
        </div>
    `);
    lucide.createIcons();
};

ScoutApp.prototype.updateMatch = function(id) {
    const m = this.state.data.matches.find(x => x.id === id);
    if(m) {
        m.homeId = document.getElementById('edit-m-home').value;
        m.awayId = document.getElementById('edit-m-away').value;
        m.date = document.getElementById('edit-m-date').value;
        m.sofaUrl = document.getElementById('edit-m-sofa').value;
        m.targetPlayerId = document.getElementById('edit-m-target').value;
        m.league = document.getElementById('edit-m-league').value;
        m.isStadium = document.getElementById('edit-m-is-stadium').checked;
        m.stadiumName = m.isStadium ? document.getElementById('edit-m-stadium-name').value : '';
        m.stadiumLink = m.isStadium ? document.getElementById('edit-m-stadium-link').value : '';
        
        this.saveData();
        this.closeModal();
        this.renderMatches(document.getElementById('content-area'));
    }
};

ScoutApp.prototype.deleteMatch = function(id) {
    this.confirmAction(t('confirm_delete'), () => {
        this.state.data.matches = this.state.data.matches.filter(x => x.id !== id);
        this.saveData();
        this.renderMatches(document.getElementById('content-area'));
        this.notify(t('deleted_success'));
    });
};

ScoutApp.prototype.updateMatchCountdowns = function() {
    const timers = document.querySelectorAll('.match-countdown');
    const now = new Date().getTime();
    
    timers.forEach(el => {
        const matchDateStr = el.getAttribute('data-date');
        if(!matchDateStr) return;
        
        const matchTime = new Date(matchDateStr).getTime();
        const diff = matchTime - now;
        
        let txt = '';
        let classes = 'bg-dark-900 border-dark-800 text-slate-400';
        let icon = 'timer';

        if (diff > 0) {
            // Gelecekte
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            
            if (days > 0) txt = `${days}g ${hours}s`;
            else if (hours > 0) txt = `${hours}s ${mins}d`;
            else txt = `${mins} dk`;
            
            classes = 'bg-dark-800 border-slate-700 text-slate-300';
            icon = 'clock-3';
        } else {
            // Geçmişte veya Canlı
            // Eğer maç başlayalı 2 saatten az olduysa "Canlı" sayalım
            const twoHours = 2 * 60 * 60 * 1000;
            if (Math.abs(diff) <= twoHours) {
                txt = 'CANLI';
                classes = 'bg-red-900/20 border-red-500/50 text-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.2)]';
                icon = 'radio';
            } else {
                txt = 'Bitti';
                classes = 'bg-dark-950 border-dark-900 text-slate-600 opacity-70';
                icon = 'check-circle-2';
            }
        }
        
        el.className = `match-countdown flex items-center gap-1.5 text-[10px] uppercase font-black px-2 py-1 rounded-md border shadow-sm transition-all ${classes}`;
        el.innerHTML = `<i data-lucide="${icon}" class="w-3.5 h-3.5"></i> <span>${txt}</span>`;
    });
    lucide.createIcons();
    
    // Uygulama globalinde timer yoksa başlat (her dakika)
    if (!window.matchesTimerInterval) {
        window.matchesTimerInterval = setInterval(() => {
            if(window.app && window.app.updateMatchCountdowns) window.app.updateMatchCountdowns();
        }, 60000);
    }
};
