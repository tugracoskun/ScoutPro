ScoutApp.prototype.renderDashboard = function(c) {
    const playerCount = this.state.data.players.length;
    const watchlistCount = this.state.data.watchlist.length;
    const matchCount = this.state.data.matches.length;
    const countryCount = this.state.data.countries.length;
    const leagueCount = this.state.data.leagues.length;
    const teamCount = this.state.data.teams.length;

    const now = new Date();
    const upcomingMatches = this.state.data.matches
        .filter(m => new Date(m.date) >= now)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const watchedMatches = this.state.data.matches.filter(m => m.watchedStatus === 'watched');
    const watchedCount = watchedMatches.length;

    const nextMatch = upcomingMatches.length > 0 ? upcomingMatches[0] : null;
    const getTeam = (id) => { const t = this.state.data.teams.find(x => x.id == id); return t ? t.name : '???'; };
    const getTeamLogo = (id) => { const t = this.state.data.teams.find(x => x.id == id); return t ? t.logo : null; };

    const lang = window.getLang ? window.getLang() : 'tr';
    const l_days = lang === 'en' ? 'DAYS' : 'GÜN';
    const l_hours = lang === 'en' ? 'HRS' : 'SAAT';
    const l_mins = lang === 'en' ? 'MIN' : 'DAK';
    const l_secs = lang === 'en' ? 'SEC' : 'SAN';

    if (window.dashboardCountdownInterval) {
        clearInterval(window.dashboardCountdownInterval);
    }

    c.innerHTML = `
        <div class="space-y-8 fade-in max-w-7xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div onclick="app.navigate('players')" class="bg-gradient-to-br from-dark-900 to-dark-950 border border-dark-800 p-6 rounded-2xl relative group cursor-pointer hover:border-scout-500/30 transition-all shadow-lg">
                    <div class="flex justify-between items-start"><div><p class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">${t('dash_reported')}</p><h3 class="text-3xl font-black text-white group-hover:text-scout-400 transition-colors">${playerCount}</h3></div><div class="p-3 rounded-xl bg-scout-500/10 text-scout-500 group-hover:bg-scout-500 group-hover:text-white transition-all"><i data-lucide="users" class="w-6 h-6"></i></div></div><p class="text-[10px] text-slate-500 mt-4">${t('dash_reported_desc')}</p>
                </div>
                <div onclick="app.navigate('watchlist')" class="bg-gradient-to-br from-dark-900 to-dark-950 border border-dark-800 p-6 rounded-2xl relative group cursor-pointer hover:border-blue-500/30 transition-all shadow-lg">
                    <div class="flex justify-between items-start"><div><p class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">${t('dash_pool')}</p><h3 class="text-3xl font-black text-white group-hover:text-blue-400 transition-colors">${watchlistCount}</h3></div><div class="p-3 rounded-xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all"><i data-lucide="eye" class="w-6 h-6"></i></div></div><p class="text-[10px] text-slate-500 mt-4">${t('dash_pool_desc')}</p>
                </div>
                <div onclick="app.navigate('matches')" class="bg-gradient-to-br from-dark-900 to-dark-950 border border-dark-800 p-6 rounded-2xl relative group cursor-pointer hover:border-purple-500/30 transition-all shadow-lg">
                    <div class="flex justify-between items-start"><div><p class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">${t('dash_schedule')}</p><h3 class="text-3xl font-black text-white group-hover:text-purple-400 transition-colors">${matchCount}</h3></div><div class="p-3 rounded-xl bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all"><i data-lucide="tv-2" class="w-6 h-6"></i></div></div><p class="text-[10px] text-slate-500 mt-4">${t('dash_schedule_desc')}</p>
                </div>
            </div>
            
            <!-- YENİ: Scout İstatistikleri Bölümü -->
            <div class="mb-6 flex flex-col md:flex-row gap-4 items-center fade-in">
                <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest shrink-0"><i data-lucide="bar-chart-2" class="inline w-4 h-4 mb-0.5 mr-1"></i> ${t('stats_title')}</h3>
                <div class="h-[1px] w-full bg-dark-800 hidden md:block"></div>
                <div onclick="app.openActivityHistoryModal()" class="shrink-0 bg-dark-900 border border-dark-800 hover:border-scout-500/30 px-5 py-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-4 group shadow-sm">
                    <div class="p-2 bg-scout-500/10 rounded-lg text-scout-500 group-hover:bg-scout-500 group-hover:text-white transition-colors">
                        <i data-lucide="activity" class="w-4 h-4"></i>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">${t('watched_matches')}</span>
                        <span class="text-lg font-black text-white leading-none">${watchedCount}</span>
                    </div>
                </div>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <!-- Team Templates Status (Kompakt ve Yeni Tasarım) -->
                <div class="lg:col-span-2 bg-gradient-to-br from-dark-900 via-dark-900 to-blue-900/20 border border-dark-800 rounded-2xl p-1 relative overflow-hidden shadow-xl flex flex-col group transition-all hover:border-blue-500/30 hover:shadow-blue-500/10">
                    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-scout-400 z-20"></div>
                    <div class="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500 pointer-events-none"></div>
                    
                    <div class="p-5 flex flex-col h-full relative z-10">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 drop-shadow-md">
                                <i data-lucide="database" class="w-4 h-4 text-blue-400"></i> ${t('dash_db_status')}
                            </h3>
                        </div>
                        
                        <div class="flex-1 flex items-center justify-center gap-3 py-2">
                            <div class="flex flex-col items-center bg-dark-950/80 backdrop-blur-md border border-dark-800/50 rounded-xl p-3 shadow-inner w-full">
                                <span class="text-2xl font-black text-white font-mono tracking-tighter">${countryCount}</span>
                                <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-1"><i data-lucide="globe" class="w-3 h-3"></i> ${t('dash_country')}</span>
                            </div>
                            <div class="flex flex-col items-center bg-dark-950/80 backdrop-blur-md border border-dark-800/50 rounded-xl p-3 shadow-inner w-full">
                                <span class="text-2xl font-black text-white font-mono tracking-tighter">${leagueCount}</span>
                                <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-1"><i data-lucide="trophy" class="w-3 h-3"></i> ${t('dash_league')}</span>
                            </div>
                            <div class="flex flex-col items-center bg-dark-950/80 backdrop-blur-md border border-dark-800/50 rounded-xl p-3 shadow-inner w-full">
                                <span class="text-2xl font-black text-white font-mono tracking-tighter">${teamCount}</span>
                                <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-1"><i data-lucide="shield" class="w-3 h-3"></i> ${t('dash_team')}</span>
                            </div>
                        </div>
                        
                        <button onclick="app.navigate('database')" class="w-full mt-5 py-2.5 bg-dark-800/50 hover:bg-dark-700 border border-dark-700/50 text-white text-xs font-bold rounded-xl transition-all duration-300 backdrop-blur-sm group-hover:border-dark-600 flex items-center justify-center gap-2">
                            ${t('dash_manage')} <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>
                </div>
                <div class="bg-gradient-to-br from-dark-900 via-dark-900 to-scout-900/20 border border-dark-800 rounded-2xl p-1 relative overflow-hidden shadow-xl flex flex-col group transition-all hover:border-scout-500/30 hover:shadow-scout-500/10">
                    ${nextMatch ? `
                        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-scout-400 via-blue-500 to-purple-500 z-20"></div>
                        <div class="absolute -top-20 -right-20 w-40 h-40 bg-scout-500/10 rounded-full blur-3xl group-hover:bg-scout-500/20 transition-all duration-500 pointer-events-none"></div>
                        <div class="absolute -left-12 -bottom-10 w-48 h-48 opacity-[0.04] pointer-events-none transform -rotate-12 blur-[1px] grayscale group-hover:grayscale-0 group-hover:opacity-[0.08] transition-all duration-500">${this.getLogoDisplayHTML(getTeamLogo(nextMatch.homeId))}</div>
                        <div class="absolute -right-12 -bottom-10 w-48 h-48 opacity-[0.04] pointer-events-none transform rotate-12 blur-[1px] grayscale group-hover:grayscale-0 group-hover:opacity-[0.08] transition-all duration-500">${this.getLogoDisplayHTML(getTeamLogo(nextMatch.awayId))}</div>
                        <div class="p-5 flex flex-col h-full relative z-10">
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 drop-shadow-md"><i data-lucide="calendar-days" class="w-4 h-4 text-scout-400"></i> ${t('dash_next_match')}</h3>
                                <span class="px-2.5 py-1 bg-dark-800/50 rounded-md text-[10px] font-bold text-slate-300 font-mono">${new Date(nextMatch.date).toLocaleString(window.getLang()==='en'?'en-US':'tr-TR', {month:'short', day:'numeric'})}</span>
                            </div>
                            <div class="flex-1 flex flex-col items-center justify-center gap-5">
                                <div class="flex items-center justify-center w-full gap-3 px-2">
                                    <div class="flex-1 text-right text-base font-black text-white truncate drop-shadow-sm">${getTeam(nextMatch.homeId)}</div>
                                    <div class="px-2.5 py-0.5 bg-dark-950/80 rounded text-[10px] font-black text-slate-500 shadow-inner shrink-0 tracking-wider">VS</div>
                                    <div class="flex-1 text-left text-base font-black text-white truncate drop-shadow-sm">${getTeam(nextMatch.awayId)}</div>
                                </div>
                                <div class="grid grid-cols-4 gap-2 w-full max-w-[220px]" id="dashboard-countdown">
                                    <div class="flex flex-col items-center bg-dark-950/80 backdrop-blur-md border border-dark-800/50 rounded-xl p-2 shadow-inner"><span class="text-lg font-black text-scout-400 font-mono tracking-tighter" id="cd-days">00</span><span class="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">${l_days}</span></div>
                                    <div class="flex flex-col items-center bg-dark-950/80 backdrop-blur-md border border-dark-800/50 rounded-xl p-2 shadow-inner"><span class="text-lg font-black text-white font-mono tracking-tighter" id="cd-hours">00</span><span class="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">${l_hours}</span></div>
                                    <div class="flex flex-col items-center bg-dark-950/80 backdrop-blur-md border border-dark-800/50 rounded-xl p-2 shadow-inner"><span class="text-lg font-black text-white font-mono tracking-tighter" id="cd-mins">00</span><span class="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">${l_mins}</span></div>
                                    <div class="flex flex-col items-center bg-dark-950/80 backdrop-blur-md border border-dark-800/50 rounded-xl p-2 shadow-inner"><span class="text-lg font-black text-red-400 font-mono tracking-tighter animate-pulse" id="cd-secs">00</span><span class="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">${l_secs}</span></div>
                                </div>
                            </div>
                            <button onclick="app.navigate('matches')" class="w-full mt-5 py-2.5 bg-dark-800/50 hover:bg-dark-700 border border-dark-700/50 text-white text-xs font-bold rounded-xl transition-all duration-300 backdrop-blur-sm group-hover:border-dark-600 flex items-center justify-center gap-2">${t('dash_go_to_list')} <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></button>
                        </div>
                    ` : `<div class="flex flex-col items-center justify-center h-full p-6 text-center"><div class="w-12 h-12 bg-dark-950 rounded-full flex items-center justify-center mb-3 text-slate-600"><i data-lucide="calendar-off" class="w-6 h-6"></i></div><p class="text-slate-500 text-sm">${t('dash_no_matches')}</p><button onclick="app.navigate('matches')" class="mt-3 text-scout-400 text-xs font-bold hover:underline">${t('dash_plan_match')}</button></div>`}
                </div>
            </div>
            <div class="bg-gradient-to-r from-scout-900/20 to-dark-900 border border-dark-800/50 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div><h4 class="text-lg font-bold text-white">${t('dash_quick')}</h4><p class="text-xs text-slate-400">${t('dash_quick_desc')}</p></div>
                <div class="flex gap-3"><button onclick="app.navigate('new-report')" class="px-5 py-2.5 bg-scout-600 hover:bg-scout-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-scout-900/20 transition-transform hover:scale-105"><i data-lucide="file-plus" class="w-4 h-4"></i> ${t('dash_create_report')}</button><button onclick="app.openQuickAddTeamModal()" class="px-5 py-2.5 bg-dark-800 hover:bg-dark-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 border border-dark-700 transition-transform hover:scale-105"><i data-lucide="plus" class="w-4 h-4"></i> ${t('dash_quick_team')}</button></div>
            </div>

            <!-- EĞİTİM BANNER -->
            <div onclick="app.navigate('academy')" class="mt-2 bg-gradient-to-r from-blue-900/20 to-dark-900 border border-dark-800/50 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer hover:border-blue-500/30 transition-all group">
                <div>
                    <h4 class="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">${t('dash_academy_title')}</h4>
                    <p class="text-xs text-slate-400">${t('dash_academy_desc')}</p>
                </div>
                <div class="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0 justify-end">
                    <div class="w-32 hidden md:block mr-2">
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">${t('dash_academy_progress')}</span>
                            <span class="text-[10px] font-black text-blue-400">1/9</span>
                        </div>
                        <div class="w-full bg-dark-950 rounded-full h-1.5 overflow-hidden border border-dark-800">
                            <div class="bg-blue-500 h-1.5 rounded-full w-[11.1%] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                        </div>
                    </div>
                    <button class="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 transition-transform hover:scale-105 whitespace-nowrap">
                        ${t('dash_academy_btn')} <i data-lucide="arrow-right" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>

            ${this.generateActivityGraphHTML()}
        </div>
    `;

    if (nextMatch) {
        setTimeout(() => {
            const elDays = document.getElementById('cd-days');
            const elHours = document.getElementById('cd-hours');
            const elMins = document.getElementById('cd-mins');
            const elSecs = document.getElementById('cd-secs');
            
            if (!elDays) return;

            const targetDate = new Date(nextMatch.date).getTime();
            
            const updateCountdown = () => {
                if (!document.getElementById('cd-days')) {
                    clearInterval(window.dashboardCountdownInterval);
                    return;
                }
                
                const now = new Date().getTime();
                const distance = targetDate - now;
                
                if (distance < 0) {
                    clearInterval(window.dashboardCountdownInterval);
                    document.getElementById('cd-days').innerText = "00";
                    document.getElementById('cd-hours').innerText = "00";
                    document.getElementById('cd-mins').innerText = "00";
                    document.getElementById('cd-secs').innerText = "00";
                    return;
                }
                
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                document.getElementById('cd-days').innerText = days.toString().padStart(2, '0');
                document.getElementById('cd-hours').innerText = hours.toString().padStart(2, '0');
                document.getElementById('cd-mins').innerText = minutes.toString().padStart(2, '0');
                document.getElementById('cd-secs').innerText = seconds.toString().padStart(2, '0');
            };
            
            updateCountdown();
            window.dashboardCountdownInterval = setInterval(updateCountdown, 1000);
        }, 50);
    }
    
    // Lucide ikonlarını yeniden oluştur
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        setTimeout(() => {
            window.lucide.createIcons();
        }, 10);
    }
};

ScoutApp.prototype.openActivityHistoryModal = function() {
    const watchedMatches = this.state.data.matches
        .filter(m => m.watchedStatus === 'watched')
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // En yeni en üstte

    const getTeamName = (id) => { const t = this.state.data.teams.find(x => x.id == id); return t ? t.name : '???'; };
    const getTeamLogo = (id) => { const t = this.state.data.teams.find(x => x.id == id); return t ? t.logo : null; };
    
    let htmlContent = '';
    
    if (watchedMatches.length === 0) {
        htmlContent = `<div class="text-center text-slate-500 py-12 flex flex-col items-center gap-4"><i data-lucide="history" class="w-12 h-12 opacity-50"></i><span>Henüz izlenmiş maç kaydı yok.</span></div>`;
    } else {
        htmlContent = watchedMatches.map(m => {
            let p = this.state.data.players.find(pl => pl.id == m.targetPlayerId) || this.state.data.watchlist.find(wl => wl.id == m.targetPlayerId);
            const dateObj = new Date(m.date);
            const dateStr = !isNaN(dateObj) ? dateObj.toLocaleDateString(window.getLang()==='en'?'en-US':'tr-TR', {year:'numeric', month:'short', day:'numeric'}) : t('no_date');
            
            return `
                <div class="bg-dark-950 border border-dark-800 rounded-xl p-4 flex flex-col gap-3 relative group hover:border-scout-500/30 transition-all">
                    <div class="flex justify-between items-center pb-3 border-b border-dark-800/50">
                        <span class="text-xs font-bold text-slate-400 bg-dark-900 px-2 py-1 rounded-md"><i data-lucide="calendar" class="w-3 h-3 inline-block mb-0.5"></i> ${dateStr}</span>
                        <span class="text-[10px] uppercase font-black text-scout-500 flex items-center gap-1"><i data-lucide="check-circle-2" class="w-3 h-3"></i> ${t('mark_watched')}</span>
                    </div>
                    
                    <div class="flex items-center justify-between px-2">
                        <div class="flex flex-col items-center w-[40%] text-center gap-1">
                            <div class="w-8 h-8 shrink-0">${this.getLogoDisplayHTML(getTeamLogo(m.homeId))}</div>
                            <span class="text-xs font-bold text-white truncate w-full">${getTeamName(m.homeId)}</span>
                        </div>
                        <div class="text-[10px] font-black text-slate-600 bg-dark-900 px-1.5 py-0.5 rounded">VS</div>
                        <div class="flex flex-col items-center w-[40%] text-center gap-1">
                            <div class="w-8 h-8 shrink-0">${this.getLogoDisplayHTML(getTeamLogo(m.awayId))}</div>
                            <span class="text-xs font-bold text-white truncate w-full">${getTeamName(m.awayId)}</span>
                        </div>
                    </div>
                    
                    <div class="bg-dark-900/50 rounded-lg p-2.5 mt-1 border border-dark-800/50 flex items-center gap-3">
                        ${p ? `
                            <img src="${p.image || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop'}" class="w-6 h-6 rounded-full object-cover border border-dark-700">
                            <span class="text-xs font-bold text-slate-300 truncate">${p.name}</span>
                        ` : `
                            <div class="w-6 h-6 rounded-full bg-dark-900 border border-dark-800 flex items-center justify-center"><i data-lucide="eye" class="w-3 h-3 text-slate-600"></i></div>
                            <span class="text-xs font-medium text-slate-500 italic w-full">${t('general_tracking')}</span>
                        `}
                    </div>
                </div>
            `;
        }).join('');
    }

    this.showModal(`
        <div class="p-8 max-w-xl w-full">
            <div class="flex justify-between items-center mb-6 border-b border-dark-800 pb-4">
                <h3 class="text-xl font-bold text-white flex items-center gap-2"><i data-lucide="history" class="text-scout-500 w-6 h-6"></i> ${t('activity_history')}</h3>
                <button onclick="app.closeModal()"><i data-lucide="x" class="text-slate-400 hover:text-white transition-colors"></i></button>
            </div>
            <div class="space-y-4 relative z-10 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                ${htmlContent}
            </div>
        </div>
    `);
    lucide.createIcons();
};

ScoutApp.prototype.generateActivityGraphHTML = function() {
    const year = new Date().getFullYear();
    const activityMap = {};
    const ensureMap = (key) => {
        if (!activityMap[key]) activityMap[key] = { total: 0, matchesWatched: 0, matchesPlanned: 0, players: 0, watchlist: 0 };
        return activityMap[key];
    };

    this.state.data.matches.forEach(m => {
        if (m.watchedStatusDate) {
            const d = new Date(m.watchedStatusDate);
            if (!isNaN(d) && d.getFullYear() === year) {
                const dateKey = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                ensureMap(dateKey).matchesWatched++;
                ensureMap(dateKey).total++;
            }
        }
        if (m.id && m.id > 1000000000000) {
            const d = new Date(m.id);
            if (!isNaN(d) && d.getFullYear() === year) {
                const dateKey = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                ensureMap(dateKey).matchesPlanned++;
                ensureMap(dateKey).total++;
            }
        }
    });

    this.state.data.players.forEach(p => {
        if (p.id && p.id > 1000000000000) { 
            const d = new Date(p.id);
            if (!isNaN(d) && d.getFullYear() === year) {
                const dateKey = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                ensureMap(dateKey).players++;
                ensureMap(dateKey).total++;
            }
        }
    });

    this.state.data.watchlist.forEach(w => {
        if (w.id && w.id > 1000000000000) {
            const d = new Date(w.id);
            if (!isNaN(d) && d.getFullYear() === year) {
                const dateKey = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                ensureMap(dateKey).watchlist++;
                ensureMap(dateKey).total++;
            }
        }
    });

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    const firstDayOfWeek = startDate.getDay();
    const totalDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const totalCols = Math.ceil((firstDayOfWeek + totalDays) / 7);

    let gridHtml = '';
    
    for (let i = 0; i < firstDayOfWeek; i++) {
        gridHtml += `<div class="w-full h-full rounded-[2px] bg-transparent pointer-events-none"></div>`;
    }

    let currentDate = new Date(startDate);
    const monthLabels = [];
    const isEn = window.getLang && window.getLang() === 'en';
    
    const monthNames = isEn 
        ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        : ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
    
    let currentMonth = -1;
    let weekCount = 0;

    while (currentDate <= endDate) {
        if (currentDate.getDay() === 0 && currentDate.getTime() !== startDate.getTime()) weekCount++;
        
        if (currentDate.getMonth() !== currentMonth) {
            currentMonth = currentDate.getMonth();
            monthLabels.push({ month: monthNames[currentMonth], week: weekCount });
        }

        const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        const act = activityMap[dateKey] || { total: 0 };
        const count = act.total;
        
        let colorClass = "bg-dark-800"; 
        if (count === 1) colorClass = "bg-scout-900";
        else if (count > 1 && count <= 3) colorClass = "bg-scout-600";
        else if (count > 3 && count <= 5) colorClass = "bg-scout-500";
        else if (count > 5) colorClass = "bg-scout-400";
        
        const dateObj = new Date(currentDate);
        const dateStr = dateObj.toLocaleDateString(isEn ? 'en-US' : 'tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
        
        let tooltip = isEn ? `No activity on ${dateStr}` : `${dateStr} tarihinde işlem yok`;
        if (count > 0) {
            let parts = [];
            if (act.matchesWatched) parts.push(isEn ? `${act.matchesWatched} match(es) watched` : `${act.matchesWatched} maç izlendi/işaretlendi`);
            if (act.matchesPlanned) parts.push(isEn ? `${act.matchesPlanned} match(es) planned` : `${act.matchesPlanned} maç planlandı`);
            if (act.players) parts.push(isEn ? `${act.players} player report(s) added` : `${act.players} oyuncu raporu eklendi`);
            if (act.watchlist) parts.push(isEn ? `${act.watchlist} watchlist addition(s)` : `${act.watchlist} aday havuza eklendi`);
            tooltip = `[ ${dateStr} ]\n` + parts.join('\n');
        }
        
        gridHtml += `<div class="w-full h-full min-h-[6px] rounded-[2px] ${colorClass} hover:ring-1 hover:ring-white transition-all cursor-pointer" title="${tooltip}"></div>`;
        
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    let monthsHtml = '';
    monthLabels.forEach((m, index) => {
        const startCol = m.week + 1;
        const nextWeek = (index + 1 < monthLabels.length) ? monthLabels[index + 1].week : totalCols;
        const span = nextWeek - m.week;
        monthsHtml += `<div style="grid-column: ${startCol} / span ${span};" class="text-[10px] text-slate-500 font-bold truncate pr-1">${m.month}</div>`;
    });

    return `
        <div class="bg-dark-900 border border-dark-800 rounded-2xl p-5 shadow-lg mt-6 fade-in overflow-hidden relative group transition-all flex flex-col w-full">
            <h3 class="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2 shrink-0">
                <i data-lucide="git-commit" class="w-4 h-4 text-scout-500"></i> ${isEn ? 'Activity History' : 'Yıllık Aktivite Geçmişi'} (${year})
            </h3>
            
            <div class="flex flex-col w-full flex-1">
                <div class="flex w-full mb-1">
                    <div class="w-6 shrink-0 mr-2"></div>
                    <div class="grid flex-1 gap-1" style="grid-template-columns: repeat(${totalCols}, 1fr);">
                        ${monthsHtml}
                    </div>
                </div>
                
                <div class="flex w-full gap-2 h-[88px]">
                    <div class="flex flex-col justify-between text-[9px] text-slate-500 font-bold leading-none h-[88px] pb-1 w-6 shrink-0 text-right">
                        <div>${isEn ? 'Sun' : 'Paz'}</div>
                        <div>${isEn ? 'Tue' : 'Sal'}</div>
                        <div>${isEn ? 'Thu' : 'Per'}</div>
                        <div>${isEn ? 'Sat' : 'Cmt'}</div>
                    </div>
                    
                    <div class="grid flex-1 grid-rows-7 gap-1 h-[88px]" style="grid-auto-flow: column; grid-template-columns: repeat(${totalCols}, 1fr);">
                        ${gridHtml}
                    </div>
                </div>
                
                <div class="flex items-center gap-1.5 mt-3 text-[9px] font-bold text-slate-400 justify-end">
                    <span>${isEn ? 'Less' : 'Az'}</span>
                    <div class="w-2.5 h-2.5 rounded-[2px] bg-dark-800"></div>
                    <div class="w-2.5 h-2.5 rounded-[2px] bg-scout-900"></div>
                    <div class="w-2.5 h-2.5 rounded-[2px] bg-scout-600"></div>
                    <div class="w-2.5 h-2.5 rounded-[2px] bg-scout-500"></div>
                    <div class="w-2.5 h-2.5 rounded-[2px] bg-scout-400"></div>
                    <span>${isEn ? 'More' : 'Çok'}</span>
                </div>
            </div>
        </div>
    `;
};