// --- OYUNCU DETAY MODALI: İÇERİK (TABLI YAPI & 4 KÖŞE MODELİ) ---

ScoutApp.prototype.getPlayerContentHTML = function(p, currentReport, prevReport, id, selectedHistoryIndex, activeTab) {
    const socialNotes = p.socialNotes || [];
    const videos = p.videos || [];
    
    // Tab Buton Stilleri
    const tabBtnBase = "pb-2 text-sm font-bold transition-all border-b-2 cursor-pointer px-1";
    const tabActive = "text-white border-scout-500";
    const tabInactive = "text-slate-500 border-transparent hover:text-slate-300";

    // --- 1. ÖZELLİK KATEGORİLERİNİ HAZIRLA (ORTA KOLON) ---
    const mapping = POSITION_MAPPING[p.position] || { group: 'Default' };
    const attributeGroup = ATTRIBUTE_GROUPS[mapping.group];
    let categoriesHTML = '';
    let contentHTML = '';
    let firstCategory = null;

    if (mapping.group !== 'Default') {
        const categories = Object.keys(attributeGroup); // Teknik, Taktik, Fiziksel...
        firstCategory = categories[0];

        // Kategori Başlıkları (Tablar)
        categoriesHTML = `<div class="flex gap-4 border-b border-dark-800 mb-4 overflow-x-auto custom-scrollbar">`;
        categories.forEach((cat, index) => {
            const isActive = index === 0;
            categoriesHTML += `
                <button 
                    onclick="app.switchAttrTab('${cat}')" 
                    id="btn-cat-${cat}"
                    class="attr-tab-btn ${tabBtnBase} ${isActive ? tabActive : tabInactive} whitespace-nowrap">
                    ${cat}
                </button>`;
        });
        categoriesHTML += `</div>`;

        // Kategori İçerikleri
        categories.forEach((cat, index) => {
            const isHidden = index !== 0 ? 'hidden' : '';
            contentHTML += `<div id="content-cat-${cat}" class="attr-content ${isHidden} grid grid-cols-1 sm:grid-cols-2 gap-3 fade-in">`;
            
            attributeGroup[cat].forEach(attr => {
                const val = currentReport.stats[attr.name] || 50;
                let diffHtml = '';
                
                // Gelişim Karşılaştırması
                if (prevReport && prevReport.stats[attr.name]) {
                    const diff = val - prevReport.stats[attr.name];
                    if (diff > 0) diffHtml = `<span class="text-[10px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded ml-auto">+${diff}</span>`;
                    else if (diff < 0) diffHtml = `<span class="text-[10px] font-bold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded ml-auto">${diff}</span>`;
                    else diffHtml = `<span class="text-[10px] font-bold text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded ml-auto">-</span>`;
                }

                contentHTML += `
                    <div class="bg-dark-950/60 px-4 py-3 rounded-xl border border-dark-800 hover:border-scout-500/30 transition-all group flex flex-col justify-center">
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-xs text-slate-300 font-bold uppercase tracking-wide truncate mr-2" title="${attr.name}">${attr.name}</span>
                            ${diffHtml}
                        </div>
                        <div class="flex justify-between items-end">
                             <span class="text-[10px] text-slate-500 truncate max-w-[70%]">${attr.sub}</span>
                             <span class="font-mono font-black text-lg ${val >= 85 ? 'text-green-400' : (val >= 70 ? 'text-green-600' : (val >= 50 ? 'text-yellow-500' : 'text-red-500'))}">${val}</span>
                        </div>
                    </div>
                `;
            });
            contentHTML += `</div>`;
        });
    } else {
        // Varsayılan (Eski usul hepsi bir arada) - Yedek plan
        contentHTML = `<div class="text-slate-500 text-sm">Bu mevki için detaylı matris bulunamadı.</div>`;
    }

    return `
        <!-- 2. ORTA KOLON: 4 KÖŞE MODELİ (Özellikler) -->
        <div class="lg:col-span-5 flex flex-col h-full">
            <div class="bg-dark-900/50 backdrop-blur rounded-3xl border border-dark-800 p-6 shadow-xl h-full flex flex-col">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-bold text-white flex items-center gap-2">
                        <i data-lucide="layout-grid" class="text-scout-400 w-5 h-5"></i> Özellik Detayları
                    </h3>
                    ${prevReport ? `<span class="text-[10px] text-slate-500 bg-dark-950 px-2 py-1 rounded border border-dark-700 flex items-center gap-1"><i data-lucide="arrow-left-right" class="w-3 h-3"></i> Karşılaştırma: ${prevReport.date}</span>` : ''}
                </div>
                
                <!-- TAB BUTONLARI -->
                ${categoriesHTML}
                
                <!-- TAB İÇERİKLERİ -->
                <div class="overflow-y-auto custom-scrollbar pr-2 flex-1 relative">
                    ${contentHTML}
                </div>
            </div>
        </div>

        <!-- 3. SAĞ KOLON: RADAR VE MEDYA (4 Birim) -->
        <div class="lg:col-span-4 flex flex-col gap-6 h-full overflow-hidden">
            
            <!-- Radar (Üst Kısım) -->
            <div class="bg-dark-900/50 backdrop-blur rounded-3xl border border-dark-800 p-4 shadow-xl flex flex-col items-center justify-center relative h-[320px] shrink-0">
                <h3 class="absolute top-5 left-5 text-sm font-bold text-slate-400 flex items-center gap-2 uppercase tracking-wider">
                    <i data-lucide="radar" class="w-4 h-4 text-scout-500"></i> Analiz Grafiği
                </h3>
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-scout-900/10 to-transparent pointer-events-none"></div>
                <!-- Grafik Konteynerı -->
                <div id="modal-radar" class="w-full h-full mt-4"></div>
            </div>

            <!-- Medya & Notlar (Alt Kısım - Tablı) -->
            <div class="bg-dark-900/50 backdrop-blur rounded-3xl border border-dark-800 p-5 shadow-xl flex-1 flex flex-col min-h-0 overflow-hidden">
                
                <!-- Medya Tabları (Sadece Class Değişimi Yapacak) -->
                <div class="flex gap-6 border-b border-dark-800 mb-4 shrink-0">
                    <button onclick="app.switchMediaTab('notes')" id="btn-media-notes" class="media-tab-btn ${tabBtnBase} ${activeTab === 'notes' ? tabActive : tabInactive} flex items-center gap-2">
                        <i data-lucide="message-square-quote" class="w-4 h-4"></i> Notlar
                    </button>
                    <button onclick="app.switchMediaTab('videos')" id="btn-media-videos" class="media-tab-btn ${tabBtnBase} ${activeTab === 'videos' ? tabActive : tabInactive} flex items-center gap-2">
                        <i data-lucide="video" class="w-4 h-4"></i> Videolar
                    </button>
                </div>

                <!-- NOTLAR İÇERİĞİ -->
                <div id="content-media-notes" class="media-content ${activeTab === 'notes' ? 'flex' : 'hidden'} flex-col flex-1 h-full min-h-0">
                    <div id="social-list-${p.id}" class="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2 mb-3">
                        ${socialNotes.length === 0 ? '<div class="text-slate-600 text-xs italic text-center py-8">Henüz not yok.</div>' : socialNotes.map(n => `
                            <div class="bg-dark-950 p-3 rounded-xl border border-dark-800 text-sm group">
                                <div class="text-slate-200 break-words leading-relaxed">${this.formatLinks(n.text)}</div>
                                <div class="text-[10px] text-slate-600 mt-2 text-right font-mono pt-1 border-t border-dark-800/50">${n.date}</div>
                            </div>`).join('')}
                    </div>
                    <div class="flex gap-2 mt-auto pt-2 border-t border-dark-800/50 shrink-0">
                        <input type="text" id="social-input-${p.id}" placeholder="Not ekle..." class="flex-1 bg-dark-950 border border-dark-700 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-blue-500">
                        <button onclick="app.addSocialNote(${p.id})" class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold"><i data-lucide="send" class="w-4 h-4"></i></button>
                    </div>
                </div>

                <!-- VİDEOLAR İÇERİĞİ -->
                <div id="content-media-videos" class="media-content ${activeTab === 'videos' ? 'flex' : 'hidden'} flex-col flex-1 h-full min-h-0">
                    <div id="video-list-${p.id}" class="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2 mb-3">
                        ${videos.length === 0 ? '<div class="text-slate-600 text-xs italic text-center py-8">Henüz video yok.</div>' : videos.map((v, i) => `
                            <div class="bg-dark-950 rounded-xl border border-dark-800 overflow-hidden shrink-0">
                                ${this.getVideoEmbedHTML(v.url)}
                                <div class="p-2 flex justify-between items-center">
                                    <div class="text-xs font-bold text-white truncate">${v.title}</div>
                                    <button onclick="app.deletePlayerVideo(${id}, ${i})" class="text-slate-600 hover:text-red-400"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
                                </div>
                            </div>`).join('')}
                    </div>
                    <div class="flex flex-col gap-2 mt-auto pt-2 border-t border-dark-800/50 shrink-0">
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