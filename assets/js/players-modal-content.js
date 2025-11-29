// --- OYUNCU DETAY MODALI: İÇERİK (ORTA & SAĞ KOLON) ---

ScoutApp.prototype.getPlayerContentHTML = function(p, currentReport, prevReport, id, selectedHistoryIndex, activeTab) {
    const socialNotes = p.socialNotes || [];
    const videos = p.videos || [];
    
    const tabActive = "text-white border-b-2 border-scout-500 pb-2";
    const tabInactive = "text-slate-500 hover:text-slate-300 pb-2 transition-colors";

    return `
        <!-- 2. ORTA KOLON: ÖZELLİKLER (5 Birim) -->
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

        <!-- 3. SAĞ KOLON: RADAR VE MEDYA (4 Birim) -->
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
                    <button onclick="app.openPlayerModal(${id}, ${selectedHistoryIndex}, 'notes')" class="text-sm font-bold ${activeTab === 'notes' ? tabActive : tabInactive} flex items-center gap-2">
                        <i data-lucide="message-square-quote" class="w-4 h-4"></i> Notlar
                    </button>
                    <button onclick="app.openPlayerModal(${id}, ${selectedHistoryIndex}, 'videos')" class="text-sm font-bold ${activeTab === 'videos' ? tabActive : tabInactive} flex items-center gap-2">
                        <i data-lucide="video" class="w-4 h-4"></i> Videolar
                    </button>
                </div>

                <!-- NOTLAR TABI -->
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

                <!-- VİDEOLAR TABI -->
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
    `;
};