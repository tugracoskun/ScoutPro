class ScoutApp {
    constructor() {
        this.state = {
            activePage: 'dashboard',
            isSidebarCollapsed: false,
            data: DB, // data.js dosyasından geliyor
            searchTerm: '',
            newReport: this.resetReport(),
            tempData: {}
        };
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.navigate('dashboard');
            lucide.createIcons();
        });

        // ESC Tuşu ile Modalı Kapatma
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    resetReport() { 
        return { 
            name: '', teamId: '', position: '', age: '', height: '', 
            foot: 'Sağ', marketValue: '', image: '', source: '', 
            tmUrl: '', sofaUrl: '', 
            potential: 'Düşük',
            stats: {} 
        }; 
    }
    
    navigate(page, params = null) {
        this.state.activePage = page;
        this.updateSidebarUI();
        const c = document.getElementById('content-area');
        c.innerHTML = '';

        const titles = {
            'dashboard': ['Dashboard', 'Genel Bakış'],
            'new-report': ['Yeni Rapor', 'Oyuncu Ekle'],
            'database': ['Veritabanı', 'Takım Yönetimi'],
            'players': ['Oyuncu Havuzu', 'Raporlanmışlar'],
            'watchlist': ['Aday Havuzu', 'Takip Listesi'],
            'matches': ['Maç İzleme', 'Fikstür Planlama'],
            'settings': ['Ayarlar', 'Sistem'],
            'team-detail': ['Takım Detayı', 'Analiz']
        };
        if(titles[page]) {
            document.getElementById('page-title').innerText = titles[page][0];
            document.getElementById('page-subtitle').innerText = titles[page][1];
        }

        switch(page) {
            case 'dashboard': this.renderDashboard(c); break;
            case 'database': this.renderDatabase(c); break;
            case 'team-detail': this.renderTeamDetail(c, params); break;
            case 'matches': this.renderMatches(c); break;
            case 'settings': this.renderSettings(c); break;
            case 'new-report': this.renderNewReport(c); break;
            case 'players': this.renderPlayers(c); break;
            case 'watchlist': this.renderWatchlist(c); break;
        }
        lucide.createIcons();
    }

    // --- YARDIMCI: HARF NOTU ---
    getGrade(score) {
        if (score >= 90) return { letter: 'A+', color: 'text-green-400', border: 'border-green-500', shadow: 'shadow-green-500/50', bg: 'bg-green-500/10' };
        if (score >= 85) return { letter: 'A',  color: 'text-green-500', border: 'border-green-600', shadow: 'shadow-green-600/50', bg: 'bg-green-600/10' };
        if (score >= 80) return { letter: 'B+', color: 'text-lime-400',  border: 'border-lime-500',  shadow: 'shadow-lime-500/50', bg: 'bg-lime-500/10' };
        if (score >= 75) return { letter: 'B',  color: 'text-lime-500',  border: 'border-lime-600',  shadow: 'shadow-lime-600/50', bg: 'bg-lime-600/10' };
        if (score >= 70) return { letter: 'B-', color: 'text-lime-600',  border: 'border-lime-700',  shadow: 'shadow-lime-700/50', bg: 'bg-lime-700/10' };
        if (score >= 65) return { letter: 'C+', color: 'text-yellow-400', border: 'border-yellow-500', shadow: 'shadow-yellow-500/50', bg: 'bg-yellow-500/10' };
        if (score >= 60) return { letter: 'C',  color: 'text-yellow-500', border: 'border-yellow-600', shadow: 'shadow-yellow-600/50', bg: 'bg-yellow-600/10' };
        if (score >= 55) return { letter: 'C-', color: 'text-orange-400', border: 'border-orange-500', shadow: 'shadow-orange-500/50', bg: 'bg-orange-500/10' };
        return { letter: 'D', color: 'text-red-500', border: 'border-red-600', shadow: 'shadow-red-600/50', bg: 'bg-red-600/10' };
    }

    // --- OYUNCU MODAL (DETAY EKRANI) - TAM EKRAN DASHBOARD TASARIM ---
    openPlayerModal(id) {
        const p = this.state.data.players.find(x => x.id === id);
        if(!p) return;
        
        const grade = this.getGrade(p.rating);
        const potClass = p.potential === 'Yüksek' 
            ? 'bg-scout-500/10 text-scout-400 border-scout-500/30' 
            : 'bg-slate-800/50 text-slate-400 border-slate-700';

        const reportDate = p.dateAdded ? p.dateAdded : new Date().toLocaleDateString('tr-TR');
        const socialNotes = p.socialNotes || [];

        this.showModal(`
            <div class="fixed inset-0 w-full h-full bg-dark-950 z-50 overflow-hidden flex flex-col animate-fade-in">
                
                <!-- ÜST HEADER (NAVBAR GİBİ) -->
                <div class="h-20 border-b border-dark-800 bg-dark-900/80 backdrop-blur flex items-center justify-between px-8 shrink-0">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center text-slate-400">
                            <i data-lucide="user" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h2 class="text-lg font-bold text-white leading-none">${p.name}</h2>
                            <span class="text-xs text-slate-500 font-mono">ID: ${p.id}</span>
                        </div>
                        <div class="h-8 w-[1px] bg-dark-800 mx-2"></div>
                        <div class="flex items-center gap-2">
                            <span class="px-3 py-1 rounded-full bg-dark-800 border border-dark-700 text-xs text-white font-bold uppercase">${p.position}</span>
                            <span class="px-3 py-1 rounded-full bg-dark-800 border border-dark-700 text-xs text-slate-400 font-medium flex items-center gap-1"><i data-lucide="shield" class="w-3 h-3"></i> ${this.getTeamName(p.teamId)}</span>
                        </div>
                    </div>

                    <div class="flex items-center gap-4">
                        <div class="text-right mr-2">
                            <div class="text-[10px] text-slate-500 uppercase font-bold">Genel Puan</div>
                            <div class="text-lg font-black ${grade.color}">${grade.letter} (${p.rating})</div>
                        </div>
                        <button onclick="app.closeModal()" class="w-10 h-10 rounded-xl bg-dark-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 flex items-center justify-center transition-colors border border-dark-700 group">
                            <i data-lucide="x" class="w-5 h-5 group-hover:scale-110 transition-transform"></i>
                        </button>
                    </div>
                </div>

                <!-- ANA İÇERİK (3 KOLONLU GRİD) -->
                <div class="flex-1 overflow-y-auto custom-scrollbar p-8">
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1920px] mx-auto">
                        
                        <!-- KOLON 1: KİMLİK KARTI (Sol - 3 Birim) -->
                        <div class="lg:col-span-3 space-y-6">
                            <!-- Foto & Grade -->
                            <div class="bg-dark-900 rounded-3xl border border-dark-800 p-6 flex flex-col items-center text-center shadow-lg relative overflow-hidden">
                                <div class="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-dark-800 to-transparent"></div>
                                <div class="relative z-10 mb-4">
                                    <img src="${p.image || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop'}" class="w-40 h-40 rounded-2xl object-cover border-4 border-dark-800 shadow-2xl">
                                    <div class="absolute -bottom-3 -right-3 bg-dark-900 rounded-full p-1">
                                        <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-2 border-dark-800 bg-dark-950 ${grade.color} shadow-lg">
                                            ${grade.letter}
                                        </div>
                                    </div>
                                </div>
                                <div class="w-full py-3 px-4 rounded-xl border border-dashed flex justify-between items-center ${potClass} mt-2">
                                    <span class="text-xs font-bold opacity-70">POTANSİYEL</span>
                                    <span class="text-sm font-black tracking-wider uppercase">${p.potential || 'DÜŞÜK'}</span>
                                </div>
                            </div>

                            <!-- Bilgiler -->
                            <div class="bg-dark-900 rounded-3xl border border-dark-800 p-6 shadow-lg">
                                <h3 class="text-sm font-bold text-white mb-4 flex items-center gap-2"><i data-lucide="info" class="w-4 h-4 text-scout-400"></i> Oyuncu Künyesi</h3>
                                <div class="space-y-3 text-sm">
                                    <div class="flex justify-between py-2 border-b border-dark-800/50">
                                        <span class="text-slate-500">Yaş</span>
                                        <span class="text-white font-mono font-bold">${p.age}</span>
                                    </div>
                                    <div class="flex justify-between py-2 border-b border-dark-800/50">
                                        <span class="text-slate-500">Boy</span>
                                        <span class="text-white font-mono font-bold">${p.height || '-'}</span>
                                    </div>
                                    <div class="flex justify-between py-2 border-b border-dark-800/50">
                                        <span class="text-slate-500">Ayak</span>
                                        <span class="text-white font-bold">${p.foot || '-'}</span>
                                    </div>
                                    <div class="flex justify-between py-2 border-b border-dark-800/50">
                                        <span class="text-slate-500">Kaynak</span>
                                        <span class="text-white text-right truncate max-w-[150px]">${p.source || '-'}</span>
                                    </div>
                                    <div class="flex justify-between py-2">
                                        <span class="text-slate-500">Tarih</span>
                                        <span class="text-white font-mono opacity-70">${reportDate}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Linkler -->
                            <div class="grid grid-cols-2 gap-3">
                                ${p.tmUrl ? `<a href="${p.tmUrl}" target="_blank" class="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#1a3150] hover:bg-[#25426a] text-white text-xs font-bold transition-all border border-[#304e76] hover:shadow-lg"><i data-lucide="globe" class="w-4 h-4"></i> Transfermarkt</a>` : `<button disabled class="py-4 rounded-2xl bg-dark-900 text-slate-600 text-xs font-bold border border-dark-800 cursor-not-allowed">TM Yok</button>`}
                                ${p.sofaUrl ? `<a href="${p.sofaUrl}" target="_blank" class="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#2c3e50] hover:bg-[#3c5267] text-white text-xs font-bold transition-all border border-[#48637d] hover:shadow-lg"><i data-lucide="activity" class="w-4 h-4"></i> Sofascore</a>` : `<button disabled class="py-4 rounded-2xl bg-dark-900 text-slate-600 text-xs font-bold border border-dark-800 cursor-not-allowed">Sofa Yok</button>`}
                            </div>
                        </div>

                        <!-- KOLON 2: ÖZELLİKLER (Orta - 5 Birim) -->
                        <div class="lg:col-span-5 flex flex-col h-full">
                            <div class="bg-dark-900 rounded-3xl border border-dark-800 p-8 shadow-lg h-full flex flex-col">
                                <div class="flex justify-between items-center mb-6">
                                    <h3 class="text-lg font-bold text-white flex items-center gap-2"><i data-lucide="layout-grid" class="text-scout-400 w-5 h-5"></i> Özellik Detayları</h3>
                                </div>
                                <div class="overflow-y-auto custom-scrollbar pr-2 flex-1">
                                    <div class="grid grid-cols-2 gap-3">
                                        ${Object.entries(p.stats).map(([key, val]) => `
                                            <div class="bg-dark-950/50 px-4 py-3 rounded-xl border border-dark-800 flex justify-between items-center hover:bg-dark-950 hover:border-dark-700 transition-all group">
                                                <span class="text-xs text-slate-400 font-bold uppercase tracking-wide truncate pr-2 group-hover:text-slate-300" title="${key}">${key}</span>
                                                <span class="font-mono font-black text-base ${val >= 85 ? 'text-green-400' : (val >= 70 ? 'text-green-600' : (val >= 50 ? 'text-yellow-500' : 'text-red-500'))}">${val}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- KOLON 3: RADAR & NOTLAR (Sağ - 4 Birim) -->
                        <div class="lg:col-span-4 flex flex-col gap-6">
                            
                            <!-- Radar -->
                            <div class="bg-dark-900 rounded-3xl border border-dark-800 p-6 shadow-lg flex flex-col items-center justify-center relative min-h-[350px]">
                                <h3 class="absolute top-6 left-6 text-sm font-bold text-slate-400 flex items-center gap-2 uppercase tracking-wider"><i data-lucide="radar" class="w-4 h-4 text-scout-500"></i> Analiz Grafiği</h3>
                                <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-scout-900/5 to-transparent pointer-events-none"></div>
                                <div id="modal-radar" class="w-full h-[300px] mt-4"></div>
                            </div>

                            <!-- Notlar -->
                            <div class="bg-dark-900 rounded-3xl border border-dark-800 p-6 shadow-lg flex-1 flex flex-col min-h-[300px]">
                                <h3 class="text-sm font-bold text-white flex items-center gap-2 mb-4"><i data-lucide="message-square-quote" class="text-blue-400 w-4 h-4"></i> Gözlem Notları</h3>
                                
                                <div id="social-list-${p.id}" class="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2 bg-dark-950/50 rounded-2xl border border-dark-800/50 p-4 mb-4">
                                    ${socialNotes.length === 0 ? 
                                        '<div class="h-full flex flex-col items-center justify-center text-slate-600 text-xs italic gap-2 opacity-60"><i data-lucide="sticky-note" class="w-8 h-8 mb-1"></i>Henüz not eklenmedi.</div>' : 
                                        socialNotes.map(n => `
                                            <div class="bg-dark-900 p-3 rounded-xl border border-dark-800 hover:border-dark-600 transition-colors group">
                                                <div class="text-slate-200 text-xs leading-relaxed break-words">${this.formatLinks(n.text)}</div>
                                                <div class="text-[10px] text-slate-600 mt-2 text-right font-mono border-t border-dark-800/50 pt-1">${n.date}</div>
                                            </div>
                                        `).join('')}
                                </div>

                                <div class="flex gap-2 mt-auto">
                                    <input type="text" id="social-input-${p.id}" placeholder="Not veya link ekle..." class="flex-1 bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-xs text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600">
                                    <button onclick="app.addSocialNote(${p.id})" class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center"><i data-lucide="send" class="w-4 h-4"></i></button>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        `);
        
        // Radar Grafik
        let labels = [];
        let data = [];
        
        if (p.position === 'Kaleci' && ATTRIBUTE_SETS['Kaleci']) {
            const set = ATTRIBUTE_SETS['Kaleci'];
            labels = Object.keys(set);
            data = labels.map(cat => {
                const attrs = set[cat];
                let sum = 0;
                attrs.forEach(a => sum += (p.stats[a] || 50));
                return Math.round(sum / attrs.length);
            });
        } else {
             const set = ATTRIBUTE_SETS['Default']['Genel'];
             labels = set;
             data = set.map(s => p.stats[s] || 50);
        }

        new ApexCharts(document.querySelector("#modal-radar"), {
            series: [{ name: 'Puan', data: data }],
            chart: { 
                height: '100%', 
                type: 'radar', 
                toolbar: { show: false }, 
                background: 'transparent', 
                fontFamily: 'Inter' 
            },
            labels: labels,
            stroke: { width: 3, colors: ['#22c55e'] },
            fill: { opacity: 0.4, colors: ['#22c55e'] },
            markers: { size: 4, colors: ['#fff'], strokeColors: '#22c55e', strokeWidth: 2, hover: { size: 6 } },
            yaxis: { show: false, max: 100, min: 0 },
            xaxis: { 
                labels: { 
                    style: { 
                        colors: ['#94a3b8','#94a3b8','#94a3b8','#94a3b8','#94a3b8','#94a3b8'], 
                        fontSize: '12px', 
                        fontWeight: 600,
                        fontFamily: 'Inter'
                    } 
                } 
            },
            plotOptions: {
                radar: {
                    size: 110,
                    polygons: {
                        strokeColors: '#334155',
                        connectorColors: '#334155',
                        fill: { colors: ['transparent', 'transparent'] }
                    }
                }
            },
            theme: { mode: 'dark' },
            tooltip: { theme: 'dark' },
            grid: { show: false, padding: { top: 0, bottom: 0 } }
        }).render();
    }

    // --- SOSYAL MEDYA / NOT EKLEME ---
    addSocialNote(playerId) {
        const input = document.getElementById(`social-input-${playerId}`);
        const text = input.value.trim();
        
        if (!text) return;
        
        const player = this.state.data.players.find(p => p.id === playerId);
        if (!player) return;

        if (!player.socialNotes) player.socialNotes = [];

        player.socialNotes.unshift({
            id: Date.now(),
            text: text,
            date: new Date().toLocaleString('tr-TR')
        });

        input.value = '';
        this.openPlayerModal(playerId); // Listeyi güncellemek için modalı yenile
    }

    formatLinks(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, url => `<a href="${url}" target="_blank" class="text-blue-400 hover:text-blue-300 hover:underline break-all font-medium transition-colors">${url}</a>`);
    }

    // --- WATCHLIST (ADAY HAVUZU) ---

    addToWatchlist() {
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
        
        this.state.searchTerm = '';
        const searchInput = document.getElementById('global-search');
        if(searchInput) searchInput.value = '';

        this.renderWatchlist(document.getElementById('content-area'));
    }

    renderWatchlist(c) {
        let filtered = this.state.data.watchlist;
        if (this.state.searchTerm) {
            filtered = filtered.filter(w => w.name.toLowerCase().includes(this.state.searchTerm));
        }
        filtered = filtered.sort((a, b) => b.id - a.id);

        const allTeams = this.state.data.teams.map(t=>({val:t.id, txt:t.name}));

        c.innerHTML = `
            <div class="max-w-6xl mx-auto space-y-8 fade-in">
                <!-- Ekleme Formu -->
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

                <!-- Liste -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${filtered.map(w => `
                        <div class="bg-dark-900 border border-dark-800 rounded-2xl p-5 relative group hover:border-scout-500/30 transition-all flex flex-col">
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
    }

    // --- VERİTABANI GÖRÜNTÜLEME ---

    renderDatabase(c) {
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
                                    <span class="text-2xl">${country.flag}</span>
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
                                                    <span>${league.logo}</span> ${league.name}
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
                                                                <div class="w-8 h-8 rounded-full bg-dark-950 flex items-center justify-center text-lg shadow-sm border border-dark-700 relative">
                                                                    ${team.logo}
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
    }

    // --- MAÇ PLANLAMA ---

    renderMatches(c) {
        const allTeams = this.state.data.teams.map(t=>({val:t.id, txt:t.name}));

        c.innerHTML = `
            <div class="space-y-6 fade-in max-w-5xl mx-auto">
                <!-- Yeni Maç Ekle -->
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
                                        ${this.createSelect('m-target', 'İzlenecek Oyuncu (Opsiyonel)', [{val:'', txt:'- Genel Takip / Yeni Oyuncu -'}, ...this.state.data.players.map(p=>({val:p.id, txt:p.name}))])}
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
                        const p = this.state.data.players.find(pl => pl.id == m.targetPlayerId);
                        
                        let dateStr = "Tarih Yok";
                        let timeStr = "--:--";
                        if(m.date) {
                            const dateObj = new Date(m.date);
                            if(!isNaN(dateObj)) {
                                dateStr = dateObj.toLocaleDateString('tr-TR', {month:'short', day:'numeric'});
                                timeStr = dateObj.toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'});
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
                                        <div class="w-8 h-8 rounded-full bg-dark-950 flex items-center justify-center border border-dark-700">${h?.logo || '?'}</div>
                                    </div>
                                    <div class="px-2 text-xs text-slate-500">VS</div>
                                    <div class="flex items-center gap-3 w-1/3 justify-start">
                                        <div class="w-8 h-8 rounded-full bg-dark-950 flex items-center justify-center border border-dark-700">${a?.logo || '?'}</div>
                                        <span class="font-bold text-white hidden md:block truncate">${a?.name || '?'}</span>
                                    </div>
                                </div>
                                <div class="w-full md:w-64 bg-dark-950/50 rounded-lg p-3 border border-dark-800/50 flex items-center gap-3">
                                    ${p ? `<img src="${p.image}" class="w-8 h-8 rounded-full object-cover"><div class="flex flex-col min-w-0"><span class="text-xs text-scout-400 font-bold uppercase">Hedef</span><span class="text-sm text-white truncate">${p.name}</span></div>` : `<div class="w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center"><i data-lucide="eye" class="w-4 h-4 text-slate-500"></i></div><span class="text-sm text-slate-500 italic w-full">Genel Takip</span>`}
                                </div>
                                <a href="${m.sofaUrl}" target="_blank" class="p-2 hover:bg-dark-700 rounded-lg text-slate-400 transition-colors"><i data-lucide="external-link" class="w-5 h-5"></i></a>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    openEditMatchModal(id) {
        const m = this.state.data.matches.find(x => x.id === id);
        if(!m) return;
        
        const allTeams = this.state.data.teams.map(t=>({val:t.id, txt:t.name}));
        const allPlayers = [{val:'', txt:'- Genel Takip / Yeni Oyuncu -'}, ...this.state.data.players.map(p=>({val:p.id, txt:p.name}))];

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
                    ${this.createSelect('edit-m-target', 'İzlenecek Oyuncu', allPlayers, m.targetPlayerId)}
                    <button onclick="app.updateMatch(${id})" class="w-full bg-scout-600 hover:bg-scout-500 text-white py-3 rounded-xl font-bold mt-2">Güncelle</button>
                </div>
            </div>
        `);
    }

    updateMatch(id) {
        const m = this.state.data.matches.find(x => x.id === id);
        if(m) {
            m.homeId = document.getElementById('edit-m-home').value;
            m.awayId = document.getElementById('edit-m-away').value;
            m.date = document.getElementById('edit-m-date').value;
            m.sofaUrl = document.getElementById('edit-m-sofa').value;
            m.targetPlayerId = document.getElementById('edit-m-target').value;
            this.closeModal();
            this.renderMatches(document.getElementById('content-area'));
        }
    }

    deleteMatch(id) {
        if(!confirm("Bu maçı silmek istediğinize emin misiniz?")) return;
        this.state.data.matches = this.state.data.matches.filter(x => x.id !== id);
        this.renderMatches(document.getElementById('content-area'));
    }

    // --- MODALS (TEAM/LEAGUE/COUNTRY) ---

    openQuickAddTeamModal() {
        const leagues = this.state.data.leagues.map(l => {
            const c = this.state.data.countries.find(x=>x.id===l.countryId);
            return {val: l.id, txt: `${l.name} (${c ? c.name : '?'})`};
        });
        if(leagues.length===0) return alert("Önce veritabanından Ülke ve Lig ekleyiniz.");
        this.showModal(`
            <div class="p-6">
                <div class="flex justify-between items-center mb-4"><h3 class="text-lg font-bold text-white">Hızlı Takım Ekle</h3><button onclick="app.closeModal()"><i data-lucide="x" class="text-slate-400"></i></button></div>
                <div class="space-y-4">
                    ${this.createSelect('modal-quick-league', 'Lig Seçiniz', leagues)}
                    ${this.createInput('modal-team-name', 'Takım Adı', 'Örn: Napoli')}
                    ${this.createInput('modal-team-logo', 'Logo (Emoji)', '⚽')}
                    ${this.createInput('modal-team-tm', 'Transfermarkt Link', 'https://...')}
                    ${this.createInput('modal-team-sofa', 'Sofascore Link', 'https://...')}
                    <button onclick="app.saveQuickTeam()" class="w-full bg-scout-600 hover:bg-scout-500 text-white py-3 rounded-xl font-bold mt-2">Kaydet</button>
                </div>
            </div>
        `);
    }

    saveQuickTeam() {
        const lg = document.getElementById('modal-quick-league').value;
        if(!lg) return alert("Lig seçiniz.");
        this.state.tempData.leagueId = parseInt(lg);
        this.saveTeam();
    }

    saveTeam() {
        const name = document.getElementById('modal-team-name').value;
        const logo = document.getElementById('modal-team-logo').value || '🛡️';
        const tm = document.getElementById('modal-team-tm').value || '#';
        const sofa = document.getElementById('modal-team-sofa').value || '#';
        if(!name) return alert("İsim giriniz.");
        
        const newTeamId = Date.now();
        this.state.data.teams.push({
            id: newTeamId, 
            leagueId: this.state.tempData.leagueId, 
            name, logo, tmUrl:tm, sofaUrl:sofa
        });
        this.closeModal();
        
        if(this.state.activePage === 'watchlist') {
            this.renderWatchlist(document.getElementById('content-area'));
        } else if(this.state.activePage === 'matches') {
            this.renderMatches(document.getElementById('content-area'));
        } else {
            this.renderDatabase(document.getElementById('content-area'));
        }
    }

    // --- HELPERS ---

    createSelect(id, label, options, val='', evt='', isFull=false) {
        return `
            <div class="flex flex-col gap-1.5 w-full">
                ${label ? `<label class="text-xs font-bold text-slate-400 ml-1">${label}</label>` : ''}
                <div class="relative">
                    <select id="${id}" onchange="${evt}" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-scout-500 outline-none appearance-none text-sm">
                        <option value="" disabled ${!val?'selected':''}>Seçiniz</option>
                        ${options.map(o => `<option value="${o.val}" ${val==o.val?'selected':''}>${o.txt}</option>`).join('')}
                    </select>
                    <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"><i data-lucide="chevron-down" class="w-4 h-4"></i></div>
                </div>
            </div>
        `;
    }
    
    // --- DİĞER FONKSİYONLAR ---
    
    renderDashboard(c) {
        const highPot = this.state.data.players.filter(p => p.potential >= 85).length;
        c.innerHTML = `
            <div class="space-y-8 fade-in">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    ${this.createStatCard('Raporlanan', this.state.data.players.length, 'Oyuncu', 'users', 'text-scout-400', 'bg-scout-500/10')}
                    ${this.createStatCard('Aday Havuzu', this.state.data.watchlist.length, 'Not', 'eye', 'text-blue-400', 'bg-blue-500/10')}
                    ${this.createStatCard('Veritabanı', this.state.data.teams.length, 'Takım', 'database', 'text-amber-400', 'bg-amber-500/10')}
                    ${this.createStatCard('Maç Takibi', this.state.data.matches.length, 'Maç', 'tv-2', 'text-purple-400', 'bg-purple-500/10')}
                </div>
                <div class="bg-dark-900 border border-dark-800 rounded-2xl p-8 text-center">
                    <h3 class="text-xl font-bold text-white mb-2">Hoş Geldiniz</h3>
                    <p class="text-slate-400 max-w-2xl mx-auto mb-6">Sistem şu an boş bir veritabanı ile çalışıyor. Takımları ve oyuncuları ekleyerek başlayın.</p>
                    <div class="flex justify-center gap-4">
                        <button onclick="app.navigate('database')" class="px-6 py-3 bg-dark-800 hover:bg-dark-700 text-white rounded-xl font-medium transition-colors">Veritabanı Oluştur</button>
                        <button onclick="app.navigate('matches')" class="px-6 py-3 bg-scout-600 hover:bg-scout-500 text-white rounded-xl font-medium transition-colors">Maç Planla</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderTeamDetail(c, teamId) {
        const team = this.state.data.teams.find(t => t.id === teamId);
        if(!team) { app.navigate('database'); return; }
        
        const league = this.state.data.leagues.find(l => l.id === team.leagueId);
        const country = this.state.data.countries.find(co => co.id === league.countryId);
        const teamPlayers = this.state.data.players.filter(p => p.teamId === teamId);

        c.innerHTML = `
            <div class="space-y-8 fade-in max-w-6xl mx-auto">
                <button onclick="app.navigate('database')" class="text-slate-400 hover:text-white flex items-center gap-2 text-sm mb-4"><i data-lucide="arrow-left" class="w-4 h-4"></i> Veritabanına Dön</button>
                <div class="bg-dark-900 border border-dark-800 rounded-3xl p-8 relative overflow-hidden">
                    <div class="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                        <div class="w-32 h-32 rounded-2xl bg-dark-950 flex items-center justify-center text-6xl shadow-2xl border border-dark-800">${team.logo}</div>
                        <div class="flex-1 text-center md:text-left space-y-4">
                            <div>
                                <h2 class="text-4xl font-bold text-white mb-1">${team.name}</h2>
                                <div class="flex items-center justify-center md:justify-start gap-2 text-slate-400">
                                    <span>${country.flag} ${country.name}</span><span class="w-1 h-1 bg-slate-600 rounded-full"></span><span>${league.name}</span>
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
    }

    renderNewReport(c) {
        const teams = this.state.data.teams.map(t=>({val:t.id, txt:t.name}));
        
        // Varsayılan mevki veya seçili mevki
        const currentPos = this.state.newReport.position;

        c.innerHTML = `
            <div class="max-w-6xl mx-auto fade-in grid grid-cols-1 lg:grid-cols-12 gap-8">
                <!-- SOL KOLON: Oyuncu Bilgileri -->
                <div class="lg:col-span-4 space-y-6">
                    <div class="bg-dark-900 p-6 rounded-2xl border border-dark-800 space-y-4">
                        <h3 class="text-lg font-bold text-white mb-4 flex gap-2"><i data-lucide="user" class="text-scout-400 w-5 h-5"></i> Kimlik</h3>
                        ${this.createInput('rep-name', 'Adı Soyadı', 'Örn: Semih', 'text', this.state.newReport.name, "app.updateRep('name', this.value)")}
                        ${teams.length > 0 
                            ? this.createSelect('rep-team', 'Takım', teams, this.state.newReport.teamId, "app.updateRep('teamId', this.value)") 
                            : '<div class="p-3 bg-red-900/20 border border-red-900/50 rounded text-red-400 text-xs">Önce Veritabanından Takım Ekleyiniz!</div>'}
                        <div class="grid grid-cols-2 gap-4">
                            <!-- Mevki Seçimi: Değişince Sliderlar Yenilenecek -->
                            ${this.createSelect('rep-pos', 'Mevki', POSITIONS.map(p=>({val:p, txt:p})), currentPos, 'app.handlePositionChange(this.value)')}
                            ${this.createInput('rep-age', 'Yaş', '19', 'number', this.state.newReport.age, "app.updateRep('age', this.value)", 40)}
                        </div>

                         <!-- YENİ: POTANSİYEL SEÇİMİ -->
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-bold text-slate-400 ml-1">Potansiyel Durumu</label>
                            <div class="relative">
                                <select onchange="app.updateRep('potential', this.value)" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-scout-500 outline-none appearance-none text-sm">
                                    <option value="Düşük" ${this.state.newReport.potential === 'Düşük' ? 'selected' : ''}>Düşük (Standart)</option>
                                    <option value="Yüksek" ${this.state.newReport.potential === 'Yüksek' ? 'selected' : ''}>Yüksek (Gelişime Açık)</option>
                                </select>
                                <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"><i data-lucide="chevron-down" class="w-4 h-4"></i></div>
                            </div>
                        </div>

                        ${this.createInput('rep-source', 'Keşif Kaynağı', 'Örn: Altyapı', 'text', this.state.newReport.source, "app.updateRep('source', this.value)")}
                    </div>
                    <div class="bg-dark-900 p-6 rounded-2xl border border-dark-800 space-y-4">
                        <h3 class="text-lg font-bold text-white mb-4 flex gap-2"><i data-lucide="link" class="text-scout-400 w-5 h-5"></i> Bağlantılar</h3>
                        ${this.createInput('rep-tm', 'Transfermarkt URL', 'https://...', 'text', this.state.newReport.tmUrl, "app.updateRep('tmUrl', this.value)")}
                        ${this.createInput('rep-sofa', 'Sofascore URL', 'https://...', 'text', this.state.newReport.sofaUrl, "app.updateRep('sofaUrl', this.value)")}
                    </div>
                    <div class="bg-dark-900 p-6 rounded-2xl border border-dark-800">
                        <h3 class="text-lg font-bold text-white mb-4 flex gap-2"><i data-lucide="image" class="text-scout-400 w-5 h-5"></i> Medya</h3>
                        <div class="flex gap-2 items-end">
                            <div class="flex-1">${this.createInput('rep-img', 'Foto URL', 'https://...', 'text', this.state.newReport.image, "app.updateRep('image', this.value)")}</div>
                            <button onclick="document.getElementById('rep-file').click()" class="h-[42px] px-4 bg-dark-800 hover:bg-dark-700 rounded-xl border border-dark-700"><i data-lucide="upload" class="w-5 h-5 text-slate-300"></i></button>
                            <input type="file" id="rep-file" class="hidden" onchange="app.handleFileUpload(this, 'rep-img', 'image')">
                        </div>
                    </div>
                </div>

                <!-- SAĞ KOLON: Yetenek Analizi ve Grafik -->
                <div class="lg:col-span-8 bg-dark-900 p-8 rounded-2xl border border-dark-800 flex flex-col h-full">
                    <div class="flex justify-between items-center mb-6 sticky top-0 bg-dark-900 z-10 py-2 border-b border-dark-800/50">
                        <h3 class="text-xl font-bold text-white">Yetenek Analizi</h3>
                        <div class="bg-dark-950 px-4 py-2 rounded-lg border border-dark-800 flex items-center gap-3">
                            <span class="text-slate-400 text-sm">Genel Puan:</span>
                            <!-- HARF NOTU BURADA GÖSTERİLECEK -->
                            <div id="rep-avg-badge" class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 bg-dark-900 text-slate-500 border-slate-700">-</div>
                        </div>
                    </div>
                    
                    <!-- Dinamik Özellik Sliderları -->
                    <div id="attribute-container" class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-8 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                        <div class="text-slate-500 text-sm text-center col-span-2 py-10 italic">Lütfen sol taraftan bir mevki seçiniz...</div>
                    </div>

                    <div class="mt-auto border-t border-dark-800 pt-6">
                         <div id="report-radar" class="w-full h-72 flex justify-center"></div>
                         <button onclick="app.submitReport()" class="w-full mt-6 py-4 bg-scout-600 hover:bg-scout-500 text-white font-bold rounded-xl shadow-lg shadow-scout-500/20 flex items-center justify-center gap-2 transition-all"><i data-lucide="save" class="w-5 h-5"></i> Oyuncuyu Havuza Ekle</button>
                    </div>
                </div>
            </div>
        `;
        
        // Eğer state'de zaten bir mevki seçiliyse (örn: sayfalar arası gezinirken), onu yükle
        if (currentPos) {
            this.handlePositionChange(currentPos, false); 
        } else {
            // Grafik boş başlasın
            this.initReportRadar([], []);
        }
    }

    // --- YENİ EKLENEN FONKSİYONLAR ---

    handlePositionChange(pos, resetStats = true) {
        this.state.newReport.position = pos;
        
        // Hangi özellik setini kullanacağız?
        const attributeSet = (pos === 'Kaleci') ? ATTRIBUTE_SETS['Kaleci'] : ATTRIBUTE_SETS['Default'];
        
        // Eğer yeni mevki seçildiyse stats'ı sıfırla, yoksa (sayfa yenileme vs) koru
        if (resetStats) {
            this.state.newReport.stats = {};
            // Objeyi düzleştirip varsayılan 50 değeri atayalım
            if (pos === 'Kaleci') {
                Object.keys(attributeSet).forEach(category => {
                    attributeSet[category].forEach(attr => this.state.newReport.stats[attr] = 50);
                });
            } else {
                attributeSet['Genel'].forEach(attr => this.state.newReport.stats[attr] = 50);
            }
        }

        this.renderAttributeInputs(attributeSet);
        this.updateRadarChart();
        this.calculateAverage();
    }

    renderAttributeInputs(attributeSet) {
        const container = document.getElementById('attribute-container');
        if (!container) return;

        let html = '';
        
        // Kategorili yapı (Kaleci gibi)
        if (Object.keys(attributeSet).length > 1 && !attributeSet['Genel']) {
            Object.keys(attributeSet).forEach(category => {
                const colors = { 'Teknik': 'text-red-400', 'Fiziksel': 'text-yellow-400', 'Psikolojik': 'text-green-400', 'Sosyolojik': 'text-blue-400' };
                const colorClass = colors[category] || 'text-white';
                
                html += `<div class="col-span-1 md:col-span-2 mt-4 mb-2 pb-1 border-b border-dark-800 font-bold text-sm uppercase tracking-wider ${colorClass}">${category}</div>`;
                
                attributeSet[category].forEach(attr => {
                    const val = this.state.newReport.stats[attr] || 50;
                    html += this.createSlider(attr, attr, val);
                });
            });
        } 
        // Düz yapı (Default)
        else {
            const list = attributeSet['Genel'] || [];
            list.forEach(attr => {
                const val = this.state.newReport.stats[attr] || 50;
                html += this.createSlider(attr, attr, val);
            });
        }

        container.innerHTML = html;
    }

    updateRepStat(key, val) {
        this.state.newReport.stats[key] = parseInt(val);
        // Slider yanındaki değeri güncelle
        const safeKey = key.replace(/\s+/g, '-').replace(/\//g, '-').toLowerCase();
        const el = document.getElementById(`val-${safeKey}`);
        if(el) el.innerText = val;

        this.updateRadarChart();
        this.calculateAverage();
    }

    calculateAverage() {
        const stats = Object.values(this.state.newReport.stats);
        if (stats.length === 0) return;
        const avg = Math.round(stats.reduce((a,b)=>a+b,0) / stats.length);
        
        const grade = this.getGrade(avg);
        const badge = document.getElementById('rep-avg-badge');
        
        if(badge) {
            badge.innerText = grade.letter;
            badge.className = `w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border-2 bg-dark-900 transition-all ${grade.color} ${grade.border} ${grade.shadow}`;
        }
    }

    updateRadarChart() {
        if (!this.reportRadarChart) return;

        let labels = [];
        let data = [];

        // Kaleci ise Kategorilerin Ortalamasını Göster (Yoksa 30 tane özellik grafiğe sığmaz)
        if (this.state.newReport.position === 'Kaleci') {
            const set = ATTRIBUTE_SETS['Kaleci'];
            labels = Object.keys(set); // Teknik, Fiziksel, Psikolojik, Sosyolojik
            
            data = labels.map(cat => {
                const attrs = set[cat];
                let sum = 0;
                attrs.forEach(a => sum += (this.state.newReport.stats[a] || 50));
                return Math.round(sum / attrs.length);
            });
        } else {
            // Diğer oyuncular için direkt özellikleri göster
            const set = ATTRIBUTE_SETS['Default']['Genel'];
            labels = set;
            data = set.map(s => this.state.newReport.stats[s] || 50);
        }

        this.reportRadarChart.updateOptions({
            xaxis: { categories: labels }
        });
        this.reportRadarChart.updateSeries([{
            data: data
        }]);
    }

    renderPlayers(c) {
        const filtered = this.state.data.players.filter(p => 
            p.name.toLowerCase().includes(this.state.searchTerm) || 
            this.getTeamName(p.teamId).toLowerCase().includes(this.state.searchTerm)
        );
        c.innerHTML = `
            <div class="space-y-6 fade-in">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    ${filtered.map(p => this.getPlayerCardHTML(p)).join('')}
                </div>
                ${filtered.length === 0 ? '<div class="text-center p-10 text-slate-500">Oyuncu bulunamadı.</div>' : ''}
            </div>
        `;
    }

    renderSettings(c) {
        c.innerHTML = `
            <div class="max-w-3xl mx-auto fade-in bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
                <div class="p-6 border-b border-dark-800"><h3 class="text-lg font-bold text-white">Ayarlar</h3></div>
                <div class="p-6 space-y-6">
                    <div class="flex items-center justify-between p-4 bg-dark-950 rounded-xl border border-dark-800">
                        <div class="flex items-center gap-4"><div class="p-3 bg-dark-800 rounded-lg"><i data-lucide="moon" class="w-5 h-5 text-slate-300"></i></div><div><div class="text-white font-medium">Karanlık Mod</div><div class="text-slate-500 text-xs">Varsayılan tema</div></div></div>
                        <div class="w-12 h-6 bg-scout-600 rounded-full relative cursor-pointer"><div class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div></div>
                    </div>
                    <button onclick="window.location.reload()" class="w-full p-4 bg-red-900/10 border border-red-900/30 rounded-xl hover:bg-red-900/20 text-red-400 transition-colors flex items-center justify-center gap-2"><i data-lucide="trash" class="w-5 h-5"></i> Verileri Sıfırla</button>
                </div>
            </div>
        `;
    }

    showModal(html) {
        const content = document.getElementById('modal-content');
        content.innerHTML = html;
        document.getElementById('modal-overlay').classList.remove('hidden');
        lucide.createIcons();
    }

    closeModal() { document.getElementById('modal-overlay').classList.add('hidden'); }

    openAddCountryModal() {
        this.showModal(`
            <div class="p-6">
                <div class="flex justify-between items-center mb-4"><h3 class="text-lg font-bold text-white">Ülke Ekle</h3><button onclick="app.closeModal()"><i data-lucide="x" class="text-slate-400"></i></button></div>
                <div class="space-y-4">
                    ${this.createInput('modal-country-name', 'Ülke Adı', 'Örn: İtalya')}
                    ${this.createInput('modal-country-flag', 'Bayrak (Emoji)', '🇮🇹')}
                    <button onclick="app.saveCountry()" class="w-full bg-scout-600 hover:bg-scout-500 text-white py-3 rounded-xl font-bold mt-2">Kaydet</button>
                </div>
            </div>
        `);
    }

    openAddLeagueModal(countryId) {
        this.state.tempData.countryId = countryId;
        this.showModal(`
            <div class="p-6">
                <div class="flex justify-between items-center mb-4"><h3 class="text-lg font-bold text-white">Lig Ekle</h3><button onclick="app.closeModal()"><i data-lucide="x" class="text-slate-400"></i></button></div>
                <div class="space-y-4">
                    ${this.createInput('modal-league-name', 'Lig Adı', 'Örn: Serie A')}
                    ${this.createInput('modal-league-logo', 'Logo (Emoji)', '🏆')}
                    <button onclick="app.saveLeague()" class="w-full bg-scout-600 hover:bg-scout-500 text-white py-3 rounded-xl font-bold mt-2">Kaydet</button>
                </div>
            </div>
        `);
    }

    openAddTeamModal(leagueId) {
        if(!leagueId) {
            const leagues = this.state.data.leagues.map(l => ({val: l.id, txt: `${l.name}`}));
            if(leagues.length===0) return alert("Önce Ülke ve Lig ekleyiniz.");
            this.openQuickAddTeamModal();
            return;
        }
        this.state.tempData.leagueId = leagueId;
        this.showModal(`
            <div class="p-6">
                <div class="flex justify-between items-center mb-4"><h3 class="text-lg font-bold text-white">Takım Ekle</h3><button onclick="app.closeModal()"><i data-lucide="x" class="text-slate-400"></i></button></div>
                <div class="space-y-4">
                    ${this.createInput('modal-team-name', 'Takım Adı', 'Örn: Napoli')}
                    ${this.createInput('modal-team-logo', 'Logo (Emoji)', '⚽')}
                    ${this.createInput('modal-team-tm', 'Transfermarkt Link', 'https://...')}
                    ${this.createInput('modal-team-sofa', 'Sofascore Link', 'https://...')}
                    <button onclick="app.saveTeam()" class="w-full bg-scout-600 hover:bg-scout-500 text-white py-3 rounded-xl font-bold mt-2">Kaydet</button>
                </div>
            </div>
        `);
    }

    openEditCountryModal(id) {
        const c = this.state.data.countries.find(x => x.id === id);
        if(!c) return;
        this.showModal(`
            <div class="p-6">
                <div class="flex justify-between items-center mb-4"><h3 class="text-lg font-bold text-white">Ülke Düzenle</h3><button onclick="app.closeModal()"><i data-lucide="x" class="text-slate-400"></i></button></div>
                <div class="space-y-4">
                    ${this.createInput('edit-country-name', 'Ülke Adı', '', 'text', c.name)}
                    ${this.createInput('edit-country-flag', 'Bayrak (Emoji)', '', 'text', c.flag)}
                    <button onclick="app.updateCountry(${id})" class="w-full bg-scout-600 hover:bg-scout-500 text-white py-3 rounded-xl font-bold mt-2">Güncelle</button>
                </div>
            </div>
        `);
    }

    openEditLeagueModal(id) {
        const l = this.state.data.leagues.find(x => x.id === id);
        if(!l) return;
        this.showModal(`
            <div class="p-6">
                <div class="flex justify-between items-center mb-4"><h3 class="text-lg font-bold text-white">Lig Düzenle</h3><button onclick="app.closeModal()"><i data-lucide="x" class="text-slate-400"></i></button></div>
                <div class="space-y-4">
                    ${this.createInput('edit-league-name', 'Lig Adı', '', 'text', l.name)}
                    ${this.createInput('edit-league-logo', 'Logo (Emoji)', '', 'text', l.logo)}
                    <button onclick="app.updateLeague(${id})" class="w-full bg-scout-600 hover:bg-scout-500 text-white py-3 rounded-xl font-bold mt-2">Güncelle</button>
                </div>
            </div>
        `);
    }

    openEditTeamModal(id) {
        const t = this.state.data.teams.find(x => x.id === id);
        if(!t) return;
        this.showModal(`
            <div class="p-6">
                <div class="flex justify-between items-center mb-4"><h3 class="text-lg font-bold text-white">Takım Düzenle</h3><button onclick="app.closeModal()"><i data-lucide="x" class="text-slate-400"></i></button></div>
                <div class="space-y-4">
                    ${this.createInput('edit-team-name', 'Takım Adı', '', 'text', t.name)}
                    ${this.createInput('edit-team-logo', 'Logo (Emoji)', '', 'text', t.logo)}
                    ${this.createInput('edit-team-tm', 'Transfermarkt Link', '', 'text', t.tmUrl)}
                    ${this.createInput('edit-team-sofa', 'Sofascore Link', '', 'text', t.sofaUrl)}
                    <button onclick="app.updateTeam(${id})" class="w-full bg-scout-600 hover:bg-scout-500 text-white py-3 rounded-xl font-bold mt-2">Güncelle</button>
                </div>
            </div>
        `);
    }

    saveCountry() {
        const name = document.getElementById('modal-country-name').value;
        const flag = document.getElementById('modal-country-flag').value;
        if(!name) return alert("İsim giriniz.");
        this.state.data.countries.push({id:Date.now(), name, flag});
        this.closeModal();
        this.renderDatabase(document.getElementById('content-area'));
    }
    updateCountry(id) {
        const c = this.state.data.countries.find(x => x.id === id);
        if(c) {
            c.name = document.getElementById('edit-country-name').value;
            c.flag = document.getElementById('edit-country-flag').value;
            this.closeModal();
            this.renderDatabase(document.getElementById('content-area'));
        }
    }
    deleteCountry(id) {
        if(!confirm("Bu ülkeyi ve altındaki tüm lig/takımları silmek istediğinize emin misiniz?")) return;
        this.state.data.countries = this.state.data.countries.filter(x => x.id !== id);
        const leaguesToDelete = this.state.data.leagues.filter(l => l.countryId === id).map(l => l.id);
        this.state.data.leagues = this.state.data.leagues.filter(l => l.countryId !== id);
        this.state.data.teams = this.state.data.teams.filter(t => !leaguesToDelete.includes(t.leagueId));
        this.renderDatabase(document.getElementById('content-area'));
    }

    saveLeague() {
        const name = document.getElementById('modal-league-name').value;
        const logo = document.getElementById('modal-league-logo').value;
        if(!name) return alert("İsim giriniz.");
        this.state.data.leagues.push({id:Date.now(), countryId:this.state.tempData.countryId, name, logo});
        this.closeModal();
        this.renderDatabase(document.getElementById('content-area'));
    }
    updateLeague(id) {
        const l = this.state.data.leagues.find(x => x.id === id);
        if(l) {
            l.name = document.getElementById('edit-league-name').value;
            l.logo = document.getElementById('edit-league-logo').value;
            this.closeModal();
            this.renderDatabase(document.getElementById('content-area'));
        }
    }
    deleteLeague(id) {
        if(!confirm("Bu ligi ve altındaki takımları silmek istediğinize emin misiniz?")) return;
        this.state.data.leagues = this.state.data.leagues.filter(x => x.id !== id);
        this.state.data.teams = this.state.data.teams.filter(t => t.leagueId !== id);
        this.renderDatabase(document.getElementById('content-area'));
    }
    
    updateTeam(id) {
        const t = this.state.data.teams.find(x => x.id === id);
        if(t) {
            t.name = document.getElementById('edit-team-name').value;
            t.logo = document.getElementById('edit-team-logo').value;
            t.tmUrl = document.getElementById('edit-team-tm').value;
            t.sofaUrl = document.getElementById('edit-team-sofa').value;
            this.closeModal();
            this.renderDatabase(document.getElementById('content-area'));
        }
    }
    deleteTeam(id) {
        if(!confirm("Bu takımı silmek istediğinize emin misiniz?")) return;
        this.state.data.teams = this.state.data.teams.filter(x => x.id !== id);
        this.renderDatabase(document.getElementById('content-area'));
    }

    handleSearch(val) {
        this.state.searchTerm = val.toLowerCase();
        if(this.state.activePage === 'players' || this.state.activePage === 'watchlist') {
            this.navigate(this.state.activePage);
        } else {
            this.navigate('players');
        }
    }

    updateRep(k, v) { 
        this.state.newReport[k] = v;
        if(k.startsWith('stats')) this.updateStatsUI();
    }
    
    updateWatch(k, v) { this.state.watchForm[k] = v; }

    handleFileUpload(input, targetId, type) {
        const file = input.files[0];
        if(file) {
            const reader = new FileReader();
            reader.onload = e => {
                document.getElementById(targetId).value = e.target.result;
                if(type === 'image') this.state.newReport.image = e.target.result;
                if(type === 'watchForm') this.state.watchForm.image = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    submitReport() {
        const r = this.state.newReport;
        if(!r.name || !r.teamId) return alert("İsim ve Takım zorunludur.");
        
        // YAŞ KONTROLÜ
        if(r.age && parseInt(r.age) > 40) return alert("Oyuncu yaşı 40'tan büyük olamaz!");
        
        // Ortalama hesaplama
        const stats = Object.values(r.stats);
        const avg = stats.length > 0 ? Math.round(stats.reduce((a,b)=>a+b,0)/stats.length) : 50;

        this.state.data.players.push({
            id: Date.now(),
            ...r,
            rating: avg, 
            status: 'Scouted',
            dateAdded: new Date().toLocaleDateString('tr-TR')
        });
        this.state.newReport = this.resetReport();
        this.navigate('players');
    }
    
    addMatch() {
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
        this.navigate('matches');
    }

    transferToReport(id) {
        const w = this.state.data.watchlist.find(x => x.id === id);
        if(!w) return;
        const team = this.state.data.teams.find(t => t.id === w.teamId);
        
        this.state.newReport = {
            ...this.resetReport(),
            name: w.name,
            teamId: team ? team.id : '',
            position: w.position,
            age: w.age,
            source: w.source,
            image: w.image,
            tmUrl: '',
            sofaUrl: ''
        };
        this.navigate('new-report');
    }

    createStatCard(title, val, sub, icon, color, bg) {
        return `
            <div class="bg-dark-900 border border-dark-800 p-6 rounded-2xl">
                <div class="flex justify-between items-start mb-4"><div class="p-3 rounded-lg ${bg}"><i data-lucide="${icon}" class="w-6 h-6 ${color}"></i></div></div>
                <div class="text-slate-400 text-sm font-medium mb-1">${title}</div>
                <div class="flex items-end gap-2"><p class="text-2xl font-bold text-white">${val}</p><span class="text-xs text-slate-500 mb-1 font-medium">${sub}</span></div>
            </div>
        `;
    }

    createInput(id, label, ph, type='text', val='', evt='', max=null) {
        return `
            <div class="flex flex-col gap-1.5">
                <label class="text-xs font-bold text-slate-400 ml-1">${label}</label>
                <input type="${type}" id="${id}" value="${val}" oninput="${evt}" ${max ? `max="${max}"` : ''} placeholder="${ph}" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-scout-500 focus:ring-1 focus:ring-scout-500 outline-none transition-all placeholder:text-slate-600 text-sm">
            </div>
        `;
    }

    createSlider(label, key, val) {
        const safeKey = key.replace(/\s+/g, '-').replace(/\//g, '-').toLowerCase();
        return `
            <div class="bg-dark-950 px-4 py-3 rounded-xl border border-dark-800">
                <div class="flex justify-between mb-2">
                    <span class="text-xs font-medium text-slate-300 truncate pr-2" title="${label}">${label}</span>
                    <span id="val-${safeKey}" class="text-xs font-bold text-scout-400">${val}</span>
                </div>
                <input type="range" min="0" max="100" value="${val}" oninput="app.updateRepStat('${key}', this.value)" class="w-full h-1.5 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-scout-500">
            </div>
        `;
    }

    getPlayerCardHTML(p) {
        const grade = this.getGrade(p.rating);
        const potColor = p.potential === 'Yüksek' ? 'text-scout-400' : 'text-slate-500';
        return `
            <div onclick="app.openPlayerModal(${p.id})" class="scout-card bg-dark-900 rounded-2xl p-5 relative group overflow-hidden cursor-pointer">
                <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-scout-500 to-transparent opacity-50"></div>
                <div class="flex items-start gap-4 mb-4">
                    <img src="${p.image || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop'}" class="w-14 h-14 rounded-xl object-cover bg-dark-950 border border-dark-800">
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
                    <div class="text-center"><div class="text-[10px] text-slate-500">Yaş</div><div class="font-medium text-white">${p.age}</div></div>
                    <div class="text-center"><div class="text-[10px] text-slate-500">Potansiyel</div><div class="font-bold text-xs ${potColor}">${p.potential || 'Düşük'}</div></div>
                    <div class="text-center"><div class="text-[10px] text-slate-500">Detay</div><i data-lucide="search" class="w-4 h-4 mx-auto text-slate-400 hover:text-white"></i></div>
                </div>
            </div>
        `;
    }

    getTeamName(id) {
        const t = this.state.data.teams.find(team => team.id == id);
        return t ? t.name : 'Bilinmiyor';
    }

    createInput(id, label, ph, type='text', val='', evt='', max=null) {
        return `
            <div class="flex flex-col gap-1.5">
                <label class="text-xs font-bold text-slate-400 ml-1">${label}</label>
                <input type="${type}" id="${id}" value="${val}" oninput="${evt}" ${max ? `max="${max}"` : ''} placeholder="${ph}" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-scout-500 focus:ring-1 focus:ring-scout-500 outline-none transition-all placeholder:text-slate-600 text-sm">
            </div>
        `;
    }

    initReportRadar(labels = [], data = []) {
        if(this.reportRadarChart) this.reportRadarChart.destroy();

        const options = {
            series: [{ name: 'Analiz', data: data }],
            chart: { height: 300, type: 'radar', toolbar: { show: false }, background: 'transparent', animations: { enabled: true } },
            labels: labels,
            stroke: { width: 2, colors: ['#22c55e'] },
            fill: { opacity: 0.2, colors: ['#22c55e'] },
            markers: { size: 3, colors: ['#22c55e'], hover: { size: 5 } },
            yaxis: { show: false, min: 0, max: 100 },
            xaxis: { 
                categories: labels,
                labels: { 
                    style: { colors: ['#94a3b8', '#94a3b8', '#94a3b8', '#94a3b8', '#94a3b8', '#94a3b8'], fontSize: '11px', fontFamily: 'Inter' } 
                } 
            },
            theme: { mode: 'dark' },
            grid: { show: true, borderColor: '#334155', strokeDashArray: 4 }
        };

        this.reportRadarChart = new ApexCharts(document.querySelector("#report-radar"), options);
        this.reportRadarChart.render();
    }

    toggleSidebar() {
        this.state.isSidebarCollapsed = !this.state.isSidebarCollapsed;
        this.updateSidebarUI();
    }

    updateSidebarUI() {
        const sidebar = document.getElementById('sidebar');
        const icon = document.getElementById('sidebar-toggle-icon');
        
        if (this.state.isSidebarCollapsed) {
            sidebar.classList.add('w-20', 'sidebar-collapsed');
            sidebar.classList.remove('w-72');
            if(icon) icon.style.transform = 'rotate(180deg)';
        } else {
            sidebar.classList.remove('w-20', 'sidebar-collapsed');
            sidebar.classList.add('w-72');
            if(icon) icon.style.transform = 'rotate(0deg)';
        }

        document.querySelectorAll('.nav-item').forEach(item => {
            item.className = 'nav-item w-full flex items-center p-3 rounded-xl text-slate-400 hover:bg-dark-800 hover:text-white transition-all group';
        });

        const activeItem = document.getElementById(`nav-${this.state.activePage}`);
        if (activeItem) {
            activeItem.className = 'nav-item w-full flex items-center p-3 rounded-xl bg-scout-500/10 text-scout-400 border border-scout-500/20 transition-all group';
        }
    }
}

// Uygulamayı Başlat
const app = new ScoutApp();