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
        categoriesHTML = `<div class="flex gap-4 border-b border-dark-800 mb-2 overflow-x-auto custom-scrollbar">`;
        categories.forEach((cat, index) => {
            const isActive = index === 0;
            // Translating category names
            const displayCat = window.tAttr ? window.tAttr(cat) : cat;
            categoriesHTML += `
                <button 
                    onclick="app.switchAttrTab('${cat}')" 
                    id="btn-cat-${cat}"
                    class="attr-tab-btn ${tabBtnBase} ${isActive ? tabActive : tabInactive} whitespace-nowrap">
                    ${displayCat}
                </button>`;
        });
        categoriesHTML += `</div>`;

        // Kategori İçerikleri
        categories.forEach((cat, index) => {
            const isHidden = index !== 0 ? 'hidden' : '';
            contentHTML += `<div id="content-cat-${cat}" class="attr-content ${isHidden} flex flex-col gap-4 fade-in">`;
            
            // --- TÜM ÖZELLİKLER LİSTESİ ---
            contentHTML += `<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">`;
            
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
                    <div class="bg-dark-950/60 px-3 py-2 rounded-xl border border-dark-800 hover:border-scout-500/30 transition-all group flex flex-col justify-center">
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-xs text-slate-300 font-bold uppercase tracking-wide truncate mr-2" title="${attr.name}">${window.tAttr ? window.tAttr(attr.name) : attr.name}</span>
                            ${diffHtml}
                        </div>
                        <div class="flex justify-between items-end">
                             <span class="text-[10px] text-slate-500 truncate max-w-[70%]" title="${attr.sub}">${window.tSub ? window.tSub(attr.sub) : attr.sub}</span>
                             <span class="font-mono font-black text-lg ${val >= 85 ? 'text-green-400' : (val >= 70 ? 'text-green-600' : (val >= 50 ? 'text-yellow-500' : 'text-red-500'))}">${val}</span>
                        </div>
                    </div>
                `;
            });
            contentHTML += `</div>`;
            
            // --- GÜÇLÜ YÖNLER & GELİŞTİRME ALANLARI (ALT KISIM) ---
            const attrsWithScores = attributeGroup[cat].map(attr => ({
                name: attr.name,
                sub: attr.sub,
                val: currentReport.stats[attr.name] || 50
            }));
            
            // Büyükten küçüğe sırala
            attrsWithScores.sort((a, b) => b.val - a.val);
            
            const maxItems = Math.min(5, Math.ceil(attrsWithScores.length / 2));
            const topAttrs = attrsWithScores.slice(0, maxItems);
            // En düşükleri al ve ters çevir (en düşük en başta olsun)
            const bottomAttrs = attrsWithScores.slice(-maxItems).reverse();
            
            contentHTML += `
                <div class="bg-dark-950/60 p-4 rounded-2xl border border-dark-800">
                    <h4 class="text-xs font-black text-scout-400 uppercase tracking-widest mb-3 flex items-center gap-2 border-l-2 border-scout-500 pl-2">
                        ${t('strengths_weaknesses') || 'GÜÇLÜ YÖNLER & GELİŞTİRME ALANLARI'}
                    </h4>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- EN İYİ X -->
                        <div>
                            <div class="text-[10px] font-bold text-green-400 uppercase flex items-center gap-1.5 mb-3">
                                <i data-lucide="trophy" class="w-3.5 h-3.5"></i> ${t('top') || 'EN İYİ'} ${maxItems}
                            </div>
                            <div class="space-y-2">
                                ${topAttrs.map((attr, i) => `
                                    <div class="bg-dark-900 px-3 py-1.5 rounded-xl border border-dark-800 flex items-center gap-3">
                                        <div class="w-5 h-5 rounded-full bg-scout-500 text-dark-950 flex items-center justify-center text-[10px] font-black shrink-0">${i+1}</div>
                                        <div class="text-xs font-bold text-white truncate flex-1" title="${attr.name}">${window.tAttr ? window.tAttr(attr.name) : attr.name}</div>
                                        <div class="w-24 h-1.5 bg-dark-950 rounded-full overflow-hidden shrink-0">
                                            <div class="h-full bg-gradient-to-r from-blue-500 to-scout-400 rounded-full" style="width: ${attr.val}%"></div>
                                        </div>
                                        <div class="font-mono text-xs font-black text-scout-400 w-6 text-right">${attr.val}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- GELİŞTİRMELİ -->
                        <div>
                            <div class="text-[10px] font-bold text-red-400 uppercase flex items-center gap-1.5 mb-3">
                                <i data-lucide="trending-up" class="w-3.5 h-3.5"></i> ${t('needs_improvement') || 'GELİŞTİRMELİ'}
                            </div>
                            <div class="space-y-2">
                                ${bottomAttrs.map((attr, i) => `
                                    <div class="bg-dark-900 px-3 py-1.5 rounded-xl border border-dark-800 flex items-center gap-3">
                                        <div class="w-5 h-5 rounded-full bg-scout-500 text-dark-950 flex items-center justify-center text-[10px] font-black shrink-0">${i+1}</div>
                                        <div class="text-xs font-bold text-white truncate flex-1" title="${attr.name}">${window.tAttr ? window.tAttr(attr.name) : attr.name}</div>
                                        <div class="w-24 h-1.5 bg-dark-950 rounded-full overflow-hidden shrink-0">
                                            <div class="h-full bg-gradient-to-r from-red-600 to-orange-400 rounded-full" style="width: ${attr.val}%"></div>
                                        </div>
                                        <div class="font-mono text-xs font-black text-orange-400 w-6 text-right">${attr.val}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            contentHTML += `</div>`;
        });
    } else {
        // Varsayılan (Eski usul hepsi bir arada) - Yedek plan
        contentHTML = `<div class="text-slate-500 text-sm">${t('no_matrix')}</div>`;
    }

    const topSection = `
        <!-- 2. ORTA KOLON: 4 KÖŞE MODELİ (Özellikler) -->
        <div class="lg:col-span-5 flex flex-col gap-6">
            <div class="bg-dark-900/50 backdrop-blur rounded-3xl border border-dark-800 p-6 shadow-xl flex flex-col">
                <div class="flex justify-between items-center mb-3">
                    <h3 class="text-lg font-bold text-white flex items-center gap-2">
                        <i data-lucide="layout-grid" class="text-scout-400 w-5 h-5"></i> ${t('attr_details')}
                    </h3>
                    ${prevReport ? `<span class="text-[10px] text-slate-500 bg-dark-950 px-2.5 py-1 rounded-lg border border-dark-700 flex items-center gap-1"><i data-lucide="arrow-left-right" class="w-3 h-3"></i> ${t('comparison')}: ${prevReport.date}</span>` : ''}
                </div>
                
                <!-- TAB BUTONLARI -->
                ${categoriesHTML}
                
                <!-- TAB İÇERİKLERİ -->
                <div class="relative pt-2">
                    ${contentHTML}
                </div>
            </div>
        </div>

        <!-- 3. SAĞ KOLON: RADAR ANALİZ GRAFİĞİ -->
        <div class="lg:col-span-4 flex flex-col gap-6">
            <div class="bg-dark-900/50 backdrop-blur rounded-3xl border border-dark-800 p-6 shadow-xl flex flex-col items-center justify-center relative min-h-[420px]">
                <h3 class="absolute top-6 left-6 text-sm font-bold text-slate-400 flex items-center gap-2 uppercase tracking-wider">
                    <i data-lucide="radar" class="w-4 h-4 text-scout-500"></i> ${t('analysis_graph')}
                </h3>
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-scout-900/10 to-transparent pointer-events-none"></div>
                <!-- Grafik Konteynerı -->
                <div id="modal-radar" class="w-full h-[360px] mt-6"></div>
            </div>
        </div>
    `;

    const bottomSection = `
        <!-- ALT GENİŞ ALAN (TRANSFER GEÇMİŞİ & MEDYA / NOTLAR) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
            
            <!-- SOL GENİŞ PANEL: TRANSFER GEÇMİŞİ & KARİYER (7 Kolon) -->
            <div id="section-transfers" class="lg:col-span-7 bg-dark-900/50 backdrop-blur rounded-3xl border border-dark-800 p-6 shadow-xl flex flex-col">
                <div class="flex items-center justify-between pb-4 mb-4 border-b border-dark-800/80">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/5">
                            <i data-lucide="arrow-right-left" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h3 class="text-base font-bold text-white tracking-wide">Transfer Geçmişi & Kariyer</h3>
                            <p class="text-xs text-slate-400">Oyuncunun kulüp geçişleri ve mali detayları</p>
                        </div>
                    </div>
                    ${(p.transfers && p.transfers.length > 0) ? `
                        <span class="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl">
                            ${p.transfers.length} Transfer
                        </span>
                    ` : ''}
                </div>

                <div class="space-y-2.5">
                    ${(!p.transfers || p.transfers.length === 0) ? `
                        <div class="flex flex-col items-center justify-center text-center py-10 px-4 space-y-3 bg-dark-950/40 rounded-2xl border border-dashed border-dark-800">
                            <div class="w-10 h-10 rounded-2xl bg-dark-900 border border-dark-800 flex items-center justify-center text-slate-600">
                                <i data-lucide="arrow-right-left" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <p class="text-xs font-bold text-slate-300">Kayıtlı Transfer Bulunamadı</p>
                                <p class="text-[11px] text-slate-500 mt-0.5 max-w-sm">Oyuncu düzenleme ekranından kulübünü değiştirdiğinizde transferler burada listelenir.</p>
                            </div>
                        </div>
                    ` : `
                        <div class="space-y-2">
                            ${[...p.transfers].reverse().map((tr, index) => {
                                const trId = tr.id || index;
                                const fromTeam = tr.fromTeamId ? this.state.data.teams.find(t => t.id === tr.fromTeamId) : null;
                                const fromName = fromTeam ? this.getTeamName(fromTeam.id) : (tr.fromTeamName || 'Önceki Kulüp');
                                const fromLogo = fromTeam ? fromTeam.logo : '';
                                
                                const toTeam = tr.toTeamId ? this.state.data.teams.find(t => t.id === tr.toTeamId) : null;
                                const toName = toTeam ? this.getTeamName(toTeam.id) : (tr.toTeamName || 'Yeni Kulüp');
                                const toLogo = toTeam ? toTeam.logo : '';

                                const feeFormatted = tr.fee ? `€${Number(tr.fee).toLocaleString('tr-TR')}` : (tr.type === 'Serbest Transfer' ? 'Bedelsiz' : 'Belirtilmedi');

                                return `
                                    <!-- YATAY KOMPAKT TRANSFER SATIRI -->
                                    <div onclick="app.openTransferDetailModal(${p.id}, ${tr.id || index})" 
                                         class="bg-dark-950/80 hover:bg-dark-900/90 border border-dark-800 hover:border-emerald-500/40 rounded-2xl p-3 px-4 transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group shadow-sm">
                                        
                                        <!-- Sol: Tarih & Tür -->
                                        <div class="flex items-center gap-2 shrink-0">
                                            <span class="text-[11px] font-mono text-slate-300 bg-dark-900/90 px-2.5 py-1 rounded-lg border border-dark-750 flex items-center gap-1.5 font-bold">
                                                <i data-lucide="calendar" class="w-3 h-3 text-emerald-400"></i> ${tr.date || '-'}
                                            </span>
                                            ${tr.type ? `
                                                <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                                                    tr.type === 'Kiralık' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                                                    tr.type === 'Serbest Transfer' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                                                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                }">
                                                    ${tr.type}
                                                </span>
                                            ` : ''}
                                        </div>

                                        <!-- Orta: Kulüp Geçişi -->
                                        <div class="flex items-center gap-2.5 min-w-0 flex-1 justify-start sm:justify-center">
                                            <!-- Eski Kulüp -->
                                            <div class="flex items-center gap-2 min-w-0 max-w-[140px] sm:max-w-[170px]">
                                                <div class="w-6 h-6 rounded-md bg-dark-900 p-0.5 border border-dark-700 flex items-center justify-center shrink-0">
                                                    ${this.getLogoDisplayHTML(fromLogo, "w-full h-full object-contain")}
                                                </div>
                                                <span class="text-xs font-semibold text-slate-300 truncate" title="${fromName}">${fromName}</span>
                                            </div>

                                            <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-emerald-400 shrink-0"></i>

                                            <!-- Yeni Kulüp -->
                                            <div class="flex items-center gap-2 min-w-0 max-w-[140px] sm:max-w-[170px]">
                                                <div class="w-6 h-6 rounded-md bg-dark-900 p-0.5 border border-emerald-500/30 flex items-center justify-center shrink-0">
                                                    ${this.getLogoDisplayHTML(toLogo, "w-full h-full object-contain")}
                                                </div>
                                                <span class="text-xs font-bold text-white truncate" title="${toName}">${toName}</span>
                                            </div>
                                        </div>

                                        <!-- Sağ: Bedel & Detay Oku -->
                                        <div class="flex items-center gap-3 shrink-0 justify-between sm:justify-end">
                                            <div class="text-right">
                                                <span class="text-[11px] font-mono font-bold ${tr.fee ? 'text-emerald-400' : 'text-slate-400'}">${feeFormatted}</span>
                                            </div>
                                            <div class="w-7 h-7 rounded-xl bg-dark-900 border border-dark-750 text-slate-500 group-hover:text-emerald-400 group-hover:border-emerald-500/40 flex items-center justify-center transition-all">
                                                <i data-lucide="chevron-right" class="w-4 h-4 group-hover:translate-x-0.5 transition-transform"></i>
                                            </div>
                                        </div>

                                    </div>
                                `;
                            }).join('')}
                        </div>
                    `}
                </div>
            </div>

            <!-- SAĞ PANEL: GÖZLEM NOTLARI & VİDEOLAR (5 Kolon - Tablı) -->
            <div class="lg:col-span-5 bg-dark-900/50 backdrop-blur rounded-3xl border border-dark-800 p-6 shadow-xl flex flex-col min-h-[460px]">
                
                <!-- Tab Butonları -->
                <div class="flex gap-6 border-b border-dark-800 pb-3 mb-4 shrink-0">
                    <button onclick="app.switchMediaTab('notes')" id="btn-media-notes" class="media-tab-btn ${tabBtnBase} ${activeTab === 'notes' ? tabActive : tabInactive} flex items-center gap-2">
                        <i data-lucide="message-square-quote" class="w-4 h-4"></i> ${t('notes')}
                        ${socialNotes.length > 0 ? `<span class="text-[10px] bg-dark-800 text-slate-400 font-mono px-2 py-0.5 rounded-full">${socialNotes.length}</span>` : ''}
                    </button>
                    <button onclick="app.switchMediaTab('videos')" id="btn-media-videos" class="media-tab-btn ${tabBtnBase} ${activeTab === 'videos' ? tabActive : tabInactive} flex items-center gap-2">
                        <i data-lucide="video" class="w-4 h-4"></i> ${t('videos')}
                        ${videos.length > 0 ? `<span class="text-[10px] bg-dark-800 text-slate-400 font-mono px-2 py-0.5 rounded-full">${videos.length}</span>` : ''}
                    </button>
                </div>

                <!-- NOTLAR İÇERİĞİ -->
                <div id="content-media-notes" class="media-content ${activeTab === 'notes' ? 'flex' : 'hidden'} flex-col flex-1">
                    <div id="social-list-${p.id}" class="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2 mb-4 max-h-[360px]">
                        ${socialNotes.length === 0 ? `<div class="text-slate-600 text-xs italic text-center py-12">${t('no_notes')}</div>` : socialNotes.map(n => `
                            <div class="bg-dark-950 p-3.5 rounded-2xl border border-dark-800 text-sm group">
                                ${n.title ? `<div class="font-bold text-white mb-1">${n.title}</div>` : ''}
                                <div class="text-slate-200 break-words leading-relaxed text-xs">${this.formatLinks(n.text)}</div>
                                <div class="text-[10px] text-slate-600 mt-2 text-right font-mono pt-1 border-t border-dark-800/50">${n.date}</div>
                            </div>`).join('')}
                    </div>
                    <div class="flex flex-col gap-2 mt-auto pt-3 border-t border-dark-800/60 shrink-0">
                        <input type="text" id="social-title-${p.id}" placeholder="${t('title_opt')}" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500">
                        <div class="flex gap-2">
                            <input type="text" id="social-input-${p.id}" placeholder="${t('add_note')}..." class="flex-1 bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500">
                            <button onclick="app.addSocialNote(${p.id})" class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center"><i data-lucide="send" class="w-4 h-4"></i></button>
                        </div>
                    </div>
                </div>

                <!-- VİDEOLAR İÇERİĞİ -->
                <div id="content-media-videos" class="media-content ${activeTab === 'videos' ? 'flex' : 'hidden'} flex-col flex-1">
                    <div id="video-list-${p.id}" class="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2 mb-4 max-h-[360px]">
                        ${videos.length === 0 ? `<div class="text-slate-600 text-xs italic text-center py-12">${t('no_videos')}</div>` : videos.map((v, i) => `
                            <div class="bg-dark-950 rounded-2xl border border-dark-800 overflow-hidden shrink-0">
                                ${this.getVideoEmbedHTML(v.url)}
                                <div class="p-3 flex justify-between items-center">
                                    <div class="text-xs font-bold text-white truncate">${v.title}</div>
                                    <button onclick="app.deletePlayerVideo(${id}, ${i})" class="text-slate-500 hover:text-red-400 p-1"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
                                </div>
                            </div>`).join('')}
                    </div>
                    <div class="flex flex-col gap-2 mt-auto pt-3 border-t border-dark-800/60 shrink-0">
                        <input type="text" id="video-title-${p.id}" placeholder="${t('video_title')}" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500">
                        <div class="flex gap-2">
                            <input type="text" id="video-url-${p.id}" placeholder="${t('paste_link')}..." class="flex-1 bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500">
                            <button onclick="app.addPlayerVideo(${p.id})" class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center"><i data-lucide="plus" class="w-4 h-4"></i></button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `;

    return { topSection, bottomSection };
};