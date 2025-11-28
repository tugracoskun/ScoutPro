// --- OYUNCU DETAY GÖRÜNTÜLEME ---

ScoutApp.prototype.openPlayerModal = function(id, selectedHistoryIndex = 0, activeTab = 'notes') {
    const p = this.state.data.players.find(x => x.id === id);
    if(!p) return;

    // Veri bütünlüğü
    if (!p.history || p.history.length === 0) {
        p.history = [{ date: p.dateAdded, rating: p.rating, stats: {...p.stats}, potential: p.potential }];
    }
    if (!p.videos) p.videos = [];

    // Tarih sıralama
    p.history.sort((a, b) => new Date(b.date.split('.').reverse().join('-')) - new Date(a.date.split('.').reverse().join('-')));

    const currentReport = p.history[selectedHistoryIndex];
    const prevReport = (selectedHistoryIndex < p.history.length - 1) ? p.history[selectedHistoryIndex + 1] : null;

    const grade = this.getGrade(currentReport.rating);
    const potClass = currentReport.potential === 'Yüksek' 
        ? 'bg-scout-500/10 text-scout-400 border-scout-500/30' 
        : 'bg-slate-800/50 text-slate-400 border-slate-700';
    
    const reportDate = currentReport.date;
    const socialNotes = p.socialNotes || [];
    const videos = p.videos || [];

    const tabActive = "text-white border-b-2 border-scout-500 pb-2";
    const tabInactive = "text-slate-500 hover:text-slate-300 pb-2 transition-colors";

    // OTOMATİK YAŞ HESAPLAMA
    // Eğer doğum tarihi varsa hesapla, yoksa eski veriyi göster
    const currentAge = p.birthDate ? this.calculateAge(p.birthDate) : p.age;
    const birthDatePretty = p.birthDate ? this.formatDatePretty(p.birthDate) : '-';

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
                    <!-- Tarih Seçimi -->
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

            <!-- CONTENT -->
            <div id="modal-content-body" class="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-dark-900 via-dark-950 to-dark-950">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1920px] mx-auto h-full">
                    
                    <!-- 1. KİMLİK KARTI -->
                    <div class="lg:col-span-3 flex flex-col gap-6">
                        <div class="bg-dark-900/50 backdrop-blur rounded-3xl border border-dark-800 p-6 flex flex-col items-center text-center shadow-xl">
                            <div class="relative mb-6 group">
                                <img src="${p.image || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop'}" class="w-48 h-48 rounded-2xl object-cover border-4 border-dark-800 shadow-2xl">
                                <div class="absolute -bottom-4 -right-4 bg-dark-900 rounded-full p-1.5 shadow-xl"><div class="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-dark-800 bg-dark-950 ${grade.color}">${grade.letter}</div></div>
                            </div>
                            <div class="w-full py-4 px-5 rounded-xl border border-dashed flex justify-between items-center ${potClass} mb-6"><span class="text-xs font-bold opacity-70">POTANSİYEL</span><span class="text-sm font-black tracking-wider uppercase">${currentReport.potential || 'DÜŞÜK'}</span></div>
                            <div class="w-full space-y-3 text-sm">
                                <div class="flex justify-between py-2 border-b border-dark-800/50">
                                    <span class="text-slate-500 font-medium">Yaş</span>
                                    <span class="text-white font-mono font-bold">${currentAge}</span>
                                </div>
                                <!-- DOĞUM TARİHİ GÖSTERİMİ -->
                                <div class="flex justify-between py-2 border-b border-dark-800/50">
                                    <span class="text-slate-500 font-medium">D. Tarihi</span>
                                    <span class="text-white text-xs font-medium">${birthDatePretty}</span>
                                </div>
                                <div class="flex justify-between py-2 border-b border-dark-800/50"><span class="text-slate-500 font-medium">Boy</span><span class="text-white font-mono font-bold">${p.height || '-'}</span></div>
                                <div class="flex justify-between py-2 border-b border-dark-800/50"><span class="text-slate-500 font-medium">Ayak</span><span class="text-white font-bold">${p.foot || '-'}</span></div>
                                <div class="flex justify-between py-2 border-b border-dark-800/50"><span class="text-slate-500 font-medium">Rapor Tarihi</span><span class="text-white font-mono text-xs opacity-70">${reportDate}</span></div>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            ${p.tmUrl ? `<a href="${p.tmUrl}" target="_blank" class="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#1a3150]/80 hover:bg-[#1a3150] text-white text-xs font-bold transition-all border border-[#304e76] hover:scale-[1.02]"><i data-lucide="globe" class="w-4 h-4"></i> TM</a>` : `<button disabled class="py-4 rounded-2xl bg-dark-900 text-slate-600 text-xs font-bold border border-dark-800 cursor-not-allowed opacity-50">TM Yok</button>`}
                            ${p.sofaUrl ? `<a href="${p.sofaUrl}" target="_blank" class="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#2c3e50]/80 hover:bg-[#2c3e50] text-white text-xs font-bold transition-all border border-[#48637d] hover:scale-[1.02]"><i data-lucide="activity" class="w-4 h-4"></i> Sofascore</a>` : `<button disabled class="py-4 rounded-2xl bg-dark-900 text-slate-600 text-xs font-bold border border-dark-800 cursor-not-allowed opacity-50">Sofa Yok</button>`}
                        </div>
                    </div>

                    <!-- 2. ÖZELLİKLER -->
                    <div class="lg:col-span-5 flex flex-col h-full">
                        <div class="bg-dark-900/50 backdrop-blur rounded-3xl border border-dark-800 p-8 shadow-xl h-full flex flex-col">
                            <div class="flex justify-between items-center mb-6">
                                <h3 class="text-lg font-bold text-white flex items-center gap-3"><div class="p-2 bg-scout-500/10 rounded-lg"><i data-lucide="layout-grid" class="text-scout-400 w-5 h-5"></i></div> Özellik Detayları</h3>
                                ${prevReport ? `<span class="text-xs text-slate-500 bg-dark-950 px-2 py-1 rounded border border-dark-700 flex items-center gap-1"><i data-lucide="arrow-left-right" class="w-3 h-3"></i> ${prevReport.date} ile karşılaştırılıyor</span>` : ''}
                            </div>
                            <div class="overflow-y-auto custom-scrollbar pr-2 flex-1">
                                <div class="grid grid-cols-2 gap-3">
                                    ${Object.entries(currentReport.stats).map(([key, val]) => {
                                        let diffHtml = '';
                                        if (prevReport && prevReport.stats[key]) {
                                            const diff = val - prevReport.stats[key];
                                            if (diff > 0) diffHtml = `<span class="text-[10px] font-bold text-green-500 flex items-center bg-green-500/10 px-1.5 rounded">+${diff}</span>`;
                                            else if (diff < 0) diffHtml = `<span class="text-[10px] font-bold text-red-500 flex items-center bg-red-500/10 px-1.5 rounded">${diff}</span>`;
                                            else diffHtml = `<span class="text-[10px] font-bold text-slate-600 bg-slate-800 px-1.5 rounded">-</span>`;
                                        }
                                        return `
                                            <div class="bg-dark-950/80 px-5 py-4 rounded-2xl border border-dark-800 flex justify-between items-center hover:bg-dark-950 hover:border-scout-500/30 transition-all group">
                                                <span class="text-xs text-slate-400 font-bold uppercase tracking-wide truncate pr-2 group-hover:text-white transition-colors" title="${key}">${key}</span>
                                                <div class="flex items-center gap-2">
                                                    ${diffHtml}
                                                    <span class="font-mono font-black text-lg ${val >= 85 ? 'text-green-400' : (val >= 70 ? 'text-green-600' : (val >= 50 ? 'text-yellow-500' : 'text-red-500'))}">${val}</span>
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 3. RADAR VE MEDYA -->
                    <div class="lg:col-span-4 flex flex-col gap-6">
                        <!-- Radar -->
                        <div class="bg-dark-900/50 backdrop-blur rounded-3xl border border-dark-800 p-6 shadow-xl flex flex-col items-center justify-center relative min-h-[380px]">
                            <h3 class="absolute top-6 left-6 text-sm font-bold text-slate-400 flex items-center gap-2 uppercase tracking-wider"><i data-lucide="radar" class="w-4 h-4 text-scout-500"></i> Analiz Grafiği</h3>
                            <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-scout-900/10 to-transparent pointer-events-none"></div>
                            <div id="modal-radar" class="w-full h-[320px] mt-6 relative z-10"></div>
                        </div>

                        <!-- Medya & Notlar (Tablı Yapı) -->
                        <div class="bg-dark-900/50 backdrop-blur rounded-3xl border border-dark-800 p-6 shadow-xl flex-1 flex flex-col min-h-[300px]">
                            <div class="flex gap-6 border-b border-dark-800 mb-4">
                                <button onclick="app.openPlayerModal(${id}, ${selectedHistoryIndex}, 'notes')" class="text-sm font-bold ${activeTab === 'notes' ? tabActive : tabInactive} flex items-center gap-2"><i data-lucide="message-square-quote" class="w-4 h-4"></i> Notlar</button>
                                <button onclick="app.openPlayerModal(${id}, ${selectedHistoryIndex}, 'videos')" class="text-sm font-bold ${activeTab === 'videos' ? tabActive : tabInactive} flex items-center gap-2"><i data-lucide="video" class="w-4 h-4"></i> Videolar</button>
                            </div>

                            <div class="${activeTab === 'notes' ? 'flex' : 'hidden'} flex-col flex-1 h-full">
                                <div id="social-list-${p.id}" class="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2 mb-4">
                                    ${socialNotes.length === 0 ? '<div class="text-slate-600 text-xs italic text-center py-8">Henüz not yok.</div>' : socialNotes.map(n => `
                                        <div class="bg-dark-950 p-3 rounded-xl border border-dark-800 text-sm group">
                                            <div class="text-slate-200 break-words leading-relaxed">${this.formatLinks(n.text)}</div>
                                            <div class="text-[10px] text-slate-600 mt-2 text-right font-mono pt-1 border-t border-dark-800/50">${n.date}</div>
                                        </div>`).join('')}
                                </div>
                                <div class="flex gap-2 mt-auto pt-2 border-t border-dark-800/50">
                                    <input type="text" id="social-input-${p.id}" placeholder="Not ekle..." class="flex-1 bg-dark-950 border border-dark-700 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-blue-500">
                                    <button onclick="app.addSocialNote(${p.id}, '${activeTab}')" class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold"><i data-lucide="send" class="w-4 h-4"></i></button>
                                </div>
                            </div>

                            <div class="${activeTab === 'videos' ? 'flex' : 'hidden'} flex-col flex-1 h-full">
                                <div class="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2 mb-4">
                                    ${videos.length === 0 ? '<div class="text-slate-600 text-xs italic text-center py-8">Henüz video yok.</div>' : videos.map((v, i) => `
                                        <div class="bg-dark-950 rounded-xl border border-dark-800 overflow-hidden">
                                            ${this.getVideoEmbedHTML(v.url)}
                                            <div class="p-2 flex justify-between items-center">
                                                <div class="text-xs font-bold text-white truncate">${v.title}</div>
                                                <button onclick="app.deletePlayerVideo(${id}, ${i})" class="text-slate-600 hover:text-red-400"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
                                            </div>
                                        </div>`).join('')}
                                </div>
                                <div class="flex flex-col gap-2 mt-auto pt-2 border-t border-dark-800/50">
                                    <input type="text" id="video-title-${p.id}" placeholder="Video Başlığı" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-blue-500">
                                    <div class="flex gap-2">
                                        <input type="text" id="video-url-${p.id}" placeholder="Link yapıştır..." class="flex-1 bg-dark-950 border border-dark-700 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-blue-500">
                                        <button onclick="app.addPlayerVideo(${p.id})" class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold"><i data-lucide="plus" class="w-4 h-4"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
    
    this.initComparisonRadar(p, currentReport, prevReport);
};