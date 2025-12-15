// --- OYUNCU DETAY MODALI: GÖRÜNÜM (ANA İSKELET & SOL KOLON) ---

ScoutApp.prototype.openPlayerModal = function(id, selectedHistoryIndex = 0, activeTab = 'notes') {
    const p = this.state.data.players.find(x => x.id === id);
    if(!p) return;

    // Veri bütünlüğü ve Sıralama
    if (!p.history || p.history.length === 0) {
        p.history = [{ date: p.dateAdded, rating: p.rating, stats: {...p.stats}, potential: p.potential }];
    }
    if (!p.videos) p.videos = [];

    // Tarihe göre sırala (En yeni en üstte)
    p.history.sort((a, b) => new Date(b.date.split('.').reverse().join('-')) - new Date(a.date.split('.').reverse().join('-')));

    const currentReport = p.history[selectedHistoryIndex];
    // Bir önceki rapor (Karşılaştırma için)
    const prevReport = (selectedHistoryIndex < p.history.length - 1) ? p.history[selectedHistoryIndex + 1] : null;

    const grade = this.getGrade(currentReport.rating);
    const potClass = currentReport.potential === 'Yüksek' 
        ? 'bg-scout-500/10 text-scout-400 border-scout-500/30' 
        : 'bg-slate-800/50 text-slate-400 border-slate-700';
    
    // Yaş ve Tarih Hesaplama (Güvenli)
    let currentAge = '-';
    let birthDatePretty = '-';
    
    if (typeof this.calculateAge === 'function') {
        currentAge = p.birthDate ? this.calculateAge(p.birthDate) : p.age;
        birthDatePretty = p.birthDate ? this.formatDatePretty(p.birthDate) : '-';
    } else {
        currentAge = p.age || '?';
    }

    // Diğer kolonların içeriğini al (players-modal-content.js dosyasından gelir)
    // Bu sayede dosya boyutu yönetilebilir kalır.
    const mainContentHTML = this.getPlayerContentHTML(p, currentReport, prevReport, id, selectedHistoryIndex, activeTab);

    this.showModal(`
        <div class="fixed inset-0 w-full h-full bg-dark-950 z-50 overflow-hidden flex flex-col animate-fade-in">
            
            <!-- HEADER -->
            <div class="h-20 border-b border-dark-800 bg-dark-900/80 backdrop-blur flex items-center justify-between px-8 shrink-0">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center text-slate-400 border border-dark-700"><i data-lucide="user" class="w-5 h-5"></i></div>
                    <div>
                        <h2 class="text-xl font-bold text-white leading-none tracking-tight">${p.name}</h2>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="text-xs text-scout-400 font-bold uppercase tracking-wider">${p.position}</span>
                            <span class="text-xs text-slate-600">•</span>
                            <span class="text-xs text-slate-400 flex items-center gap-1"><i data-lucide="shield" class="w-3 h-3"></i> ${this.getTeamName(p.teamId)}</span>
                        </div>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <!-- Tarih Seçimi (Geçmiş Raporlar) -->
                    <div class="relative group mr-2">
                        <div class="flex items-center gap-2 bg-dark-800 border border-dark-700 px-2 py-2 rounded-lg cursor-pointer">
                            <i data-lucide="calendar-days" class="w-4 h-4 text-slate-400 ml-1"></i>
                            <select onchange="app.openPlayerModal(${id}, this.value, '${activeTab}')" class="bg-transparent text-white text-sm font-bold outline-none cursor-pointer appearance-none pr-6 pl-1">
                                ${p.history.map((h, idx) => `
                                    <option value="${idx}" class="bg-dark-900 text-slate-300" ${idx == selectedHistoryIndex ? 'selected' : ''}>
                                        ${h.date} (Puan: ${h.rating})
                                    </option>
                                `).join('')}
                            </select>
                            <i data-lucide="chevron-down" class="w-3 h-3 text-slate-500 absolute right-3 pointer-events-none"></i>
                        </div>
                    </div>

                    <!-- Düzenle ve Sil Butonları -->
                    <button onclick="app.openEditPlayerModal(${id})" class="w-9 h-9 rounded-lg bg-dark-800 hover:bg-blue-500/20 hover:text-blue-400 text-slate-400 flex items-center justify-center transition-all border border-dark-700" title="Bilgileri Düzenle">
                        <i data-lucide="pencil" class="w-4 h-4"></i>
                    </button>
                    
                    <button onclick="app.deletePlayer(${id})" class="w-9 h-9 rounded-lg bg-dark-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 flex items-center justify-center transition-all border border-dark-700 mr-2" title="Oyuncuyu Sil">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>

                    <div class="h-8 w-[1px] bg-dark-800"></div>

                    <button onclick="app.openNewReportMode(${id})" class="flex items-center gap-2 bg-scout-600 hover:bg-scout-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-scout-900/20">
                        <i data-lucide="file-plus" class="w-4 h-4"></i> Yeni Rapor
                    </button>

                    <div class="h-8 w-[1px] bg-dark-800 mx-2"></div>
                    
                    <div class="text-right mr-2">
                        <div class="text-[10px] text-slate-500 uppercase font-bold">Puan</div>
                        <div class="text-lg font-black ${grade.color}">${grade.letter} <span class="text-sm text-slate-600 font-medium">(${currentReport.rating})</span></div>
                    </div>
                    
                    <button onclick="app.closeModal()" class="w-10 h-10 rounded-xl bg-dark-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 flex items-center justify-center transition-all border border-dark-700 group">
                        <i data-lucide="x" class="w-6 h-6 group-hover:scale-110 transition-transform"></i>
                    </button>
                </div>
            </div>

            <!-- CONTENT BODY (3 KOLONLU YAPI) -->
            <div id="modal-content-body" class="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-dark-900 via-dark-950 to-dark-950">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1920px] mx-auto h-full">
                    
                    <!-- 1. SOL KOLON: KİMLİK KARTI (Sabit) -->
                    <div class="lg:col-span-3 flex flex-col gap-6">
                        <div class="bg-dark-900/50 backdrop-blur rounded-3xl border border-dark-800 p-6 flex flex-col items-center text-center shadow-xl">
                            <div class="relative mb-6 group">
                                <img src="${p.image || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop'}" class="w-48 h-48 rounded-2xl object-cover border-4 border-dark-800 shadow-2xl">
                                <div class="absolute -bottom-4 -right-4 bg-dark-900 rounded-full p-1.5 shadow-xl"><div class="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-dark-800 bg-dark-950 ${grade.color}">${grade.letter}</div></div>
                            </div>
                            <div class="w-full py-4 px-5 rounded-xl border border-dashed flex justify-between items-center ${potClass} mb-6"><span class="text-xs font-bold opacity-70">POTANSİYEL</span><span class="text-sm font-black tracking-wider uppercase">${currentReport.potential || 'DÜŞÜK'}</span></div>
                            <div class="w-full space-y-3 text-sm">
                                <div class="flex justify-between py-2 border-b border-dark-800/50"><span class="text-slate-500 font-medium">Yaş</span><span class="text-white font-mono font-bold">${currentAge}</span></div>
                                <div class="flex justify-between py-2 border-b border-dark-800/50"><span class="text-slate-500 font-medium">D. Tarihi</span><span class="text-white text-xs">${birthDatePretty}</span></div>
                                <div class="flex justify-between py-2 border-b border-dark-800/50"><span class="text-slate-500 font-medium">Boy</span><span class="text-white font-mono font-bold">${p.height || '-'}</span></div>
                                <div class="flex justify-between py-2 border-b border-dark-800/50"><span class="text-slate-500 font-medium">Ayak</span><span class="text-white font-bold">${p.foot || '-'}</span></div>
                                <div class="flex justify-between py-2 border-b border-dark-800/50"><span class="text-slate-500 font-medium">Rapor Tarihi</span><span class="text-white font-mono text-xs opacity-70">${currentReport.date}</span></div>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            ${p.tmUrl ? `<a href="${p.tmUrl}" target="_blank" class="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#1a3150]/80 hover:bg-[#1a3150] text-white text-xs font-bold transition-all border border-[#304e76] hover:scale-[1.02]"><i data-lucide="globe" class="w-4 h-4"></i> TM</a>` : `<button disabled class="py-4 rounded-2xl bg-dark-900 text-slate-600 text-xs font-bold border border-dark-800 cursor-not-allowed opacity-50">TM Yok</button>`}
                            ${p.sofaUrl ? `<a href="${p.sofaUrl}" target="_blank" class="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#2c3e50]/80 hover:bg-[#2c3e50] text-white text-xs font-bold transition-all border border-[#48637d] hover:scale-[1.02]"><i data-lucide="activity" class="w-4 h-4"></i> Sofascore</a>` : `<button disabled class="py-4 rounded-2xl bg-dark-900 text-slate-600 text-xs font-bold border border-dark-800 cursor-not-allowed opacity-50">Sofa Yok</button>`}
                        </div>
                    </div>

                    <!-- ORTA VE SAĞ KOLON (DIŞARIDAN GELİYOR) -->
                    ${mainContentHTML}

                </div>
            </div>
        </div>
    `);
    
    // BUG FIX: Grafik çizimi için süreyi artır ve pencere boyutunu kontrol et
    setTimeout(() => {
        this.initComparisonRadar(p, currentReport, prevReport);
        
        // Pencere boyutuna göre yeniden çizimi tetikle (Garanti olsun)
        window.dispatchEvent(new Event('resize'));
    }, 300); // 300ms gecikme (Animasyon bitişini bekler)
};

// --- TAB DEĞİŞTİRME FONKSİYONLARI (RE-RENDER YOK) ---

// 1. Özellik Sekmeleri (Teknik, Taktik vs.)
ScoutApp.prototype.switchAttrTab = function(category) {
    // Tüm içerikleri gizle
    document.querySelectorAll('.attr-content').forEach(el => el.classList.add('hidden'));
    // Seçileni göster
    document.getElementById(`content-cat-${category}`).classList.remove('hidden');

    // Buton stillerini güncelle
    document.querySelectorAll('.attr-tab-btn').forEach(btn => {
        btn.classList.remove('text-white', 'border-scout-500');
        btn.classList.add('text-slate-500', 'border-transparent');
    });
    
    // Aktif butonu parlat
    const activeBtn = document.getElementById(`btn-cat-${category}`);
    if(activeBtn) {
        activeBtn.classList.remove('text-slate-500', 'border-transparent');
        activeBtn.classList.add('text-white', 'border-scout-500');
    }
};

// 2. Medya Sekmeleri (Notlar vs Videolar)
ScoutApp.prototype.switchMediaTab = function(tabName) {
    // Tüm medya içeriklerini gizle
    document.querySelectorAll('.media-content').forEach(el => {
        el.classList.remove('flex');
        el.classList.add('hidden');
    });

    // Seçileni göster
    const activeContent = document.getElementById(`content-media-${tabName}`);
    if (activeContent) {
        activeContent.classList.remove('hidden');
        activeContent.classList.add('flex');
    }

    // Buton stillerini güncelle
    document.querySelectorAll('.media-tab-btn').forEach(btn => {
        btn.classList.remove('text-white', 'border-scout-500');
        btn.classList.add('text-slate-500', 'border-transparent');
    });

    // Aktif butonu parlat
    const activeBtn = document.getElementById(`btn-media-${tabName}`);
    if(activeBtn) {
        activeBtn.classList.remove('text-slate-500', 'border-transparent');
        activeBtn.classList.add('text-white', 'border-scout-500');
    }
    
    // Grafik boyutunu korumak için küçük bir hack (ApexCharts bazen layout değişiminde sapıtabiliyor)
    window.dispatchEvent(new Event('resize'));
};