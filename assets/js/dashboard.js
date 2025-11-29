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
    
    const nextMatch = upcomingMatches.length > 0 ? upcomingMatches[0] : null;
    const getTeam = (id) => { const t = this.state.data.teams.find(x => x.id == id); return t ? t.name : '???'; };

    c.innerHTML = `
        <div class="space-y-8 fade-in max-w-7xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div onclick="app.navigate('players')" class="bg-gradient-to-br from-dark-900 to-dark-950 border border-dark-800 p-6 rounded-2xl relative group cursor-pointer hover:border-scout-500/30 transition-all shadow-lg">
                    <div class="flex justify-between items-start"><div><p class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Raporlanan</p><h3 class="text-3xl font-black text-white group-hover:text-scout-400 transition-colors">${playerCount}</h3></div><div class="p-3 rounded-xl bg-scout-500/10 text-scout-500 group-hover:bg-scout-500 group-hover:text-white transition-all"><i data-lucide="users" class="w-6 h-6"></i></div></div><p class="text-[10px] text-slate-500 mt-4">Detaylı analiz edilen oyuncular</p>
                </div>
                <div onclick="app.navigate('watchlist')" class="bg-gradient-to-br from-dark-900 to-dark-950 border border-dark-800 p-6 rounded-2xl relative group cursor-pointer hover:border-blue-500/30 transition-all shadow-lg">
                    <div class="flex justify-between items-start"><div><p class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Aday Havuzu</p><h3 class="text-3xl font-black text-white group-hover:text-blue-400 transition-colors">${watchlistCount}</h3></div><div class="p-3 rounded-xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all"><i data-lucide="eye" class="w-6 h-6"></i></div></div><p class="text-[10px] text-slate-500 mt-4">Takip listesindeki potansiyeller</p>
                </div>
                <div onclick="app.navigate('matches')" class="bg-gradient-to-br from-dark-900 to-dark-950 border border-dark-800 p-6 rounded-2xl relative group cursor-pointer hover:border-purple-500/30 transition-all shadow-lg">
                    <div class="flex justify-between items-start"><div><p class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Maç Programı</p><h3 class="text-3xl font-black text-white group-hover:text-purple-400 transition-colors">${matchCount}</h3></div><div class="p-3 rounded-xl bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all"><i data-lucide="tv-2" class="w-6 h-6"></i></div></div><p class="text-[10px] text-slate-500 mt-4">Planlanan izleme görevleri</p>
                </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2 bg-dark-900 border border-dark-800 rounded-2xl p-6 shadow-lg">
                    <div class="flex justify-between items-center mb-6"><h3 class="text-lg font-bold text-white flex items-center gap-2"><i data-lucide="database" class="text-slate-400 w-5 h-5"></i> Veritabanı Durumu</h3><button onclick="app.navigate('database')" class="text-xs bg-dark-800 hover:bg-dark-700 border border-dark-700 text-slate-300 px-3 py-1.5 rounded-lg transition-colors">Yönet</button></div>
                    <div class="grid grid-cols-3 gap-4">
                        <div class="bg-dark-950/50 border border-dark-800 p-4 rounded-xl text-center hover:border-dark-600 transition-colors"><div class="text-2xl font-bold text-white mb-1">${countryCount}</div><div class="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center justify-center gap-1"><i data-lucide="globe" class="w-3 h-3"></i> Ülke</div></div>
                        <div class="bg-dark-950/50 border border-dark-800 p-4 rounded-xl text-center hover:border-dark-600 transition-colors"><div class="text-2xl font-bold text-white mb-1">${leagueCount}</div><div class="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center justify-center gap-1"><i data-lucide="trophy" class="w-3 h-3"></i> Lig</div></div>
                        <div class="bg-dark-950/50 border border-dark-800 p-4 rounded-xl text-center hover:border-dark-600 transition-colors"><div class="text-2xl font-bold text-white mb-1">${teamCount}</div><div class="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center justify-center gap-1"><i data-lucide="shield" class="w-3 h-3"></i> Takım</div></div>
                    </div>
                </div>
                <div class="bg-dark-900 border border-dark-800 rounded-2xl p-1 relative overflow-hidden shadow-lg flex flex-col">
                    ${nextMatch ? `<div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-scout-500 to-blue-500"></div><div class="p-5 flex flex-col h-full"><h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><i data-lucide="calendar-clock" class="w-4 h-4"></i> Sıradaki Maç</h3><div class="flex-1 flex flex-col items-center justify-center text-center gap-3"><div class="text-xl font-black text-white leading-tight">${getTeam(nextMatch.homeId)} <span class="text-slate-600 text-sm font-medium mx-1">vs</span> ${getTeam(nextMatch.awayId)}</div><div class="bg-dark-950 px-4 py-2 rounded-lg border border-dark-800 text-scout-400 font-mono text-sm font-bold">${new Date(nextMatch.date).toLocaleString('tr-TR', {weekday: 'short', hour: '2-digit', minute:'2-digit'})}</div></div><button onclick="app.navigate('matches')" class="w-full mt-4 py-2 bg-dark-800 hover:bg-dark-700 text-white text-xs font-bold rounded-lg transition-colors">Listeye Git</button></div>` : `<div class="flex flex-col items-center justify-center h-full p-6 text-center"><div class="w-12 h-12 bg-dark-950 rounded-full flex items-center justify-center mb-3 text-slate-600"><i data-lucide="calendar-off" class="w-6 h-6"></i></div><p class="text-slate-500 text-sm">Yaklaşan maç bulunmuyor.</p><button onclick="app.navigate('matches')" class="mt-3 text-scout-400 text-xs font-bold hover:underline">Maç Planla</button></div>`}
                </div>
            </div>
            <div class="bg-gradient-to-r from-scout-900/20 to-dark-900 border border-dark-800/50 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div><h4 class="text-lg font-bold text-white">Hızlı İşlemler</h4><p class="text-xs text-slate-400">Sık kullanılan özelliklere buradan ulaşın.</p></div>
                <div class="flex gap-3"><button onclick="app.navigate('new-report')" class="px-5 py-2.5 bg-scout-600 hover:bg-scout-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-scout-900/20 transition-transform hover:scale-105"><i data-lucide="file-plus" class="w-4 h-4"></i> Rapor Oluştur</button><button onclick="app.openQuickAddTeamModal()" class="px-5 py-2.5 bg-dark-800 hover:bg-dark-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 border border-dark-700 transition-transform hover:scale-105"><i data-lucide="plus" class="w-4 h-4"></i> Hızlı Takım Ekle</button></div>
            </div>
        </div>
    `;
};