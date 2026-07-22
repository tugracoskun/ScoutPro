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

    // Uyruk Bayrağı Bulma ve Dil Desteği
    let natObj = null;
    if (p.nationality) {
        if (typeof p.nationality === 'number' || !isNaN(p.nationality)) {
            natObj = this.state.data.countries.find(c => c.id == p.nationality);
        } else {
            natObj = this.state.data.countries.find(c => this.getCountryName(c) === p.nationality || c.name === p.nationality || c.nameEn === p.nationality);
        }
    }
    const natFlag = natObj ? `<img src="${natObj.flag}" class="w-5 h-3.5 object-cover rounded-[2px] shadow-sm">` : '';
    const natName = natObj ? this.getCountryName(natObj) : (p.nationality || '-');

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
                        <div class="flex items-center gap-2 mt-1 flex-wrap">
                            <span class="text-xs text-scout-400 font-bold uppercase tracking-wider">${p.position}${p.role ? ` <span class="opacity-60 font-normal">- ${t(p.role)}</span>` : ''}</span>
                            ${p.teamId ? `<span class="text-xs text-slate-600">•</span><span class="text-xs text-slate-400 flex items-center gap-1" title="Kulüp Takımı"><i data-lucide="shield" class="w-3 h-3"></i> ${this.getTeamName(p.teamId)}</span>` : ''}
                            ${p.nationalTeamId ? `<span class="text-xs text-slate-600">•</span><span class="text-xs text-slate-400 flex items-center gap-1" title="Milli Takım"><i data-lucide="flag" class="w-3 h-3 text-blue-400"></i> <span class="text-blue-200/80">${this.getTeamName(p.nationalTeamId)}</span></span>` : ''}
                            ${p.u23National ? `<span class="text-xs text-slate-600">•</span><span class="text-[10px] text-blue-400 font-bold px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-md flex items-center gap-1"><i data-lucide="check-circle-2" class="w-3 h-3"></i> ${t('u23_national')}</span>` : ''}
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
                                        ${h.date} (${t('grade')}: ${h.rating})
                                    </option>
                                `).join('')}
                            </select>
                            <i data-lucide="chevron-down" class="w-3 h-3 text-slate-500 absolute right-3 pointer-events-none"></i>
                        </div>
                    </div>

                    <!-- Düzenle ve Sil Butonları -->
                    <button onclick="app.openEditPlayerModal(${id})" class="w-9 h-9 rounded-lg bg-dark-800 hover:bg-blue-500/20 hover:text-blue-400 text-slate-400 flex items-center justify-center transition-all border border-dark-700" title="${t('edit')}">
                        <i data-lucide="pencil" class="w-4 h-4"></i>
                    </button>
                    
                    <button onclick="app.deletePlayer(${id})" class="w-9 h-9 rounded-lg bg-dark-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 flex items-center justify-center transition-all border border-dark-700" title="${t('delete')}">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>

                    <div class="h-8 w-[1px] bg-dark-800 mx-2"></div>

                    <button onclick="app.exportPlayerToPDF(${id}, ${selectedHistoryIndex})" class="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors border border-slate-700 shadow-lg shadow-slate-900/20" title="PDF İndir">
                        <i data-lucide="download" class="w-4 h-4"></i> PDF
                    </button>

                    <div class="h-8 w-[1px] bg-dark-800 mx-2"></div>

                    <button onclick="app.openNewReportMode(${id})" class="flex items-center gap-2 bg-scout-600 hover:bg-scout-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-scout-900/20">
                        <i data-lucide="file-plus" class="w-4 h-4"></i> ${t('new_report')}
                    </button>

                    <div class="h-8 w-[1px] bg-dark-800 mx-2"></div>
                    
                    <div class="text-right mr-2">
                        <div class="text-[10px] text-slate-500 uppercase font-bold">${t('grade')}</div>
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
                            <div class="w-full py-4 px-5 rounded-xl border border-dashed flex justify-between items-center ${potClass} mb-6"><span class="text-xs font-bold opacity-70">${t('potential').toUpperCase()}</span><span class="text-sm font-black tracking-wider uppercase">${currentReport.potential || t('potential_low')}</span></div>
                            <div class="w-full space-y-3 text-sm">
                                <div class="flex justify-between py-2 border-b border-dark-800/50"><span class="text-slate-500 font-medium">${t('age')}</span><span class="text-white font-mono font-bold">${currentAge}</span></div>
                                <div class="flex justify-between py-2 border-b border-dark-800/50"><span class="text-slate-500 font-medium">${t('birth_date')}</span><span class="text-white text-xs">${birthDatePretty}</span></div>
                                <div class="flex justify-between py-2 border-b border-dark-800/50"><span class="text-slate-500 font-medium">${t('height')}</span><span class="text-white font-mono font-bold">${p.height || '-'}</span></div>
                                <div class="flex justify-between py-2 border-b border-dark-800/50"><span class="text-slate-500 font-medium">${t('foot')}</span><span class="text-white font-bold">${p.foot || '-'}</span></div>
                                ${p.nationality ? `<div class="flex justify-between py-2 border-b border-dark-800/50"><span class="text-slate-500 font-medium">${t('nationality')}</span><span class="text-white flex items-center gap-1.5">${natFlag} <span class="font-bold">${natName}</span></span></div>` : ''}
                                <div class="flex justify-between py-2 border-b border-dark-800/50"><span class="text-slate-500 font-medium">${t('report_date')}</span><span class="text-white font-mono text-xs opacity-70">${currentReport.date}</span></div>
                                ${currentReport.source ? `<div class="flex justify-between py-2 border-b border-dark-800/50"><span class="text-slate-500 font-medium">${t('source')}</span><span class="text-white text-xs text-right max-w-[60%] truncate" title="${currentReport.source}">${currentReport.source}</span></div>` : ''}
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            ${p.tmUrl ? `<button onclick="app.openExternal('${p.tmUrl}')" class="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#1a3150]/80 hover:bg-[#1a3150] text-white text-xs font-bold transition-all border border-[#304e76] hover:scale-[1.02]"><i data-lucide="globe" class="w-4 h-4"></i> TM</button>` : `<button disabled class="py-4 rounded-2xl bg-dark-900 text-slate-600 text-xs font-bold border border-dark-800 cursor-not-allowed opacity-50">TM ${t('no_data') || 'Yok'}</button>`}
                            ${p.sofaUrl ? `<button onclick="app.openExternal('${p.sofaUrl}')" class="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#2c3e50]/80 hover:bg-[#2c3e50] text-white text-xs font-bold transition-all border border-[#48637d] hover:scale-[1.02]"><i data-lucide="activity" class="w-4 h-4"></i> Sofascore</button>` : `<button disabled class="py-4 rounded-2xl bg-dark-900 text-slate-600 text-xs font-bold border border-dark-800 cursor-not-allowed opacity-50">Sofa ${t('no_data') || 'Yok'}</button>`}
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

// --- PDF DIŞA AKTARMA ---
ScoutApp.prototype.exportPlayerToPDF = async function(id, selectedHistoryIndex) {
    if (typeof html2pdf === 'undefined') {
        window.alert('PDF kütüphanesi yüklenemedi. Sayfayı yenileyip tekrar deneyin.', 'error');
        return;
    }

    const p = this.state.data.players.find(x => x.id === id);
    if(!p) return;
    
    const currentReport = p.history && p.history.length > 0 ? p.history[selectedHistoryIndex] : { date: p.dateAdded, rating: p.rating, stats: {...p.stats}, potential: p.potential };
    const grade = this.getGrade(currentReport.rating);

    window.alert('PDF belgesi oluşturuluyor, lütfen bekleyin...', 'success');

    // Radar grafiğini resim olarak al
    let chartImageURI = '';
    if (this.comparisonRadarChart) {
        try {
            const dataURI = await this.comparisonRadarChart.dataURI();
            chartImageURI = dataURI.imgURI;
        } catch (e) {
            console.warn('Radar chart dataURI failed', e);
        }
    }

    // Nationality
    let natObj = null;
    if (p.nationality) {
        if (typeof p.nationality === 'number' || !isNaN(p.nationality)) {
            natObj = this.state.data.countries.find(c => c.id == p.nationality);
        } else {
            natObj = this.state.data.countries.find(c => this.getCountryName(c) === p.nationality || c.name === p.nationality || c.nameEn === p.nationality);
        }
    }
    const natName = natObj ? this.getCountryName(natObj) : (p.nationality || '-');

    // Yaş
    let currentAge = p.age || '-';
    if (typeof this.calculateAge === 'function' && p.birthDate) {
        currentAge = this.calculateAge(p.birthDate);
    }

    // Takım bilgileri
    const teamName = p.teamId ? this.getTeamName(p.teamId) : '-';

    // Grade renk eşleştirmesi (inline için)
    const gradeColorMap = {
        'text-green-400': '#4ade80', 'text-green-500': '#22c55e',
        'text-lime-400': '#a3e635', 'text-lime-500': '#84cc16', 'text-lime-600': '#65a30d',
        'text-yellow-400': '#facc15', 'text-yellow-500': '#eab308',
        'text-orange-400': '#fb923c', 'text-red-500': '#ef4444'
    };
    const gradeHexColor = gradeColorMap[grade.color] || '#94a3b8';

    // Özellikleri hesapla
    const mapping = POSITION_MAPPING[p.position] || { group: 'Default' };
    const attributeGroup = ATTRIBUTE_GROUPS[mapping.group];

    // Tüm özellikleri topla (strengths/weaknesses için)
    let allAttrs = [];
    let attributesHTML = '';

    if (mapping.group !== 'Default') {
        const cats = Object.keys(attributeGroup);
        
        // Özellik tablosu - 2 sütun yan yana
        attributesHTML += '<div style="display:flex; gap:6px; flex-wrap:wrap;">';
        cats.forEach(cat => {
            const attrs = attributeGroup[cat];
            const catName = window.tAttr ? window.tAttr(cat) : cat;
            
            // Her özelliği topla
            attrs.forEach(attr => {
                const val = currentReport.stats[attr.name] || 50;
                allAttrs.push({ name: attr.name, val: parseInt(val), category: catName });
            });

            attributesHTML += `
                <div style="flex:1; min-width:calc(50% - 4px); background:#fafafa; border:1px solid #e5e7eb; border-radius:6px; padding:4px 8px; margin-bottom:3px;">
                    <div style="font-size:8px; font-weight:800; color:#1e293b; text-transform:uppercase; letter-spacing:0.4px; border-bottom:1px solid #e5e7eb; padding-bottom:2px; margin-bottom:2px;">${catName}</div>
            `;
            attrs.forEach(attr => {
                const val = currentReport.stats[attr.name] || 50;
                const v = parseInt(val);
                let valColor = '#64748b';
                if (v >= 80) valColor = '#16a34a';
                else if (v >= 65) valColor = '#2563eb';
                else if (v <= 40) valColor = '#dc2626';
                const attrName = window.tAttr ? window.tAttr(attr.name) : attr.name;
                
                // Progress bar rengi
                let barColor = '#94a3b8';
                if (v >= 80) barColor = '#22c55e';
                else if (v >= 65) barColor = '#3b82f6';
                else if (v <= 40) barColor = '#ef4444';

                attributesHTML += `
                    <div style="display:flex; align-items:center; justify-content:space-between; padding:1px 0; font-size:7.5px; line-height:1.2;">
                        <span style="color:#475569; flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-right:3px;">${attrName}</span>
                        <div style="width:50px; height:3px; background:#e2e8f0; border-radius:2px; overflow:hidden; margin-right:3px; flex-shrink:0;">
                            <div style="height:100%; width:${v}%; background:${barColor}; border-radius:2px;"></div>
                        </div>
                        <span style="color:${valColor}; font-weight:700; font-family:monospace; width:16px; text-align:right; flex-shrink:0;">${v}</span>
                    </div>
                `;
            });
            attributesHTML += '</div>';
        });
        attributesHTML += '</div>';
    } else {
        const attrs = attributeGroup['Genel'] || [];
        attrs.forEach(attr => {
            const val = currentReport.stats[attr.name] || 50;
            allAttrs.push({ name: attr.name, val: parseInt(val), category: 'Genel' });
        });
        attributesHTML += '<div style="background:#fafafa; border:1px solid #e5e7eb; border-radius:8px; padding:10px;">';
        attrs.forEach(attr => {
            const val = currentReport.stats[attr.name] || 50;
            const v = parseInt(val);
            let valColor = '#64748b';
            if (v >= 80) valColor = '#16a34a';
            else if (v >= 65) valColor = '#2563eb';
            else if (v <= 40) valColor = '#dc2626';
            const attrName = window.tAttr ? window.tAttr(attr.name) : attr.name;
            attributesHTML += `
                <div style="display:flex; align-items:center; justify-content:space-between; padding:2px 0; font-size:9px;">
                    <span style="color:#475569;">${attrName}</span>
                    <span style="color:${valColor}; font-weight:700; font-family:monospace;">${v}</span>
                </div>
            `;
        });
        attributesHTML += '</div>';
    }

    // Güçlü ve Geliştirilmesi Gereken Yönler
    allAttrs.sort((a, b) => b.val - a.val);
    const maxItems = Math.min(5, Math.ceil(allAttrs.length / 2));
    const topAttrs = allAttrs.slice(0, maxItems);
    const bottomAttrs = allAttrs.slice(-maxItems).reverse();

    let strengthsHTML = '';
    topAttrs.forEach((attr, i) => {
        const attrName = window.tAttr ? window.tAttr(attr.name) : attr.name;
        strengthsHTML += `
            <div style="display:flex; align-items:center; gap:4px; padding:1.5px 0; font-size:7.5px; line-height:1.2;">
                <div style="width:13px; height:13px; border-radius:50%; background:#22c55e; color:#fff; display:flex; align-items:center; justify-content:center; font-size:6px; font-weight:800; flex-shrink:0;">${i+1}</div>
                <span style="color:#1e293b; font-weight:600; flex:1;">${attrName}</span>
                <div style="width:40px; height:3px; background:#dcfce7; border-radius:2px; overflow:hidden; flex-shrink:0;">
                    <div style="height:100%; width:${attr.val}%; background:#22c55e; border-radius:2px;"></div>
                </div>
                <span style="color:#16a34a; font-weight:800; font-family:monospace; font-size:7.5px; width:16px; text-align:right;">${attr.val}</span>
            </div>
        `;
    });

    let weaknessesHTML = '';
    bottomAttrs.forEach((attr, i) => {
        const attrName = window.tAttr ? window.tAttr(attr.name) : attr.name;
        weaknessesHTML += `
            <div style="display:flex; align-items:center; gap:4px; padding:1.5px 0; font-size:7.5px; line-height:1.2;">
                <div style="width:13px; height:13px; border-radius:50%; background:#ef4444; color:#fff; display:flex; align-items:center; justify-content:center; font-size:6px; font-weight:800; flex-shrink:0;">${i+1}</div>
                <span style="color:#1e293b; font-weight:600; flex:1;">${attrName}</span>
                <div style="width:40px; height:3px; background:#fee2e2; border-radius:2px; overflow:hidden; flex-shrink:0;">
                    <div style="height:100%; width:${attr.val}%; background:#ef4444; border-radius:2px;"></div>
                </div>
                <span style="color:#dc2626; font-weight:800; font-family:monospace; font-size:7.5px; width:16px; text-align:right;">${attr.val}</span>
            </div>
        `;
    });

    // PDF Container
    const container = document.createElement('div');
    container.style.cssText = 'position:absolute; left:-9999px; top:0; z-index:-1;';

    container.innerHTML = `
        <div id="pdf-content" style="width:595px; font-family:Inter,system-ui,-apple-system,sans-serif; color:#1e293b; background:#fff; padding:16px 22px; font-size:10px; line-height:1.3;">
            
            <!-- ═══ HEADER ═══ -->
            <div style="display:flex; align-items:center; gap:10px; padding-bottom:8px; border-bottom:2px solid #e2e8f0; margin-bottom:8px;">
                <img src="${p.image || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop'}" style="width:52px; height:52px; border-radius:8px; object-fit:cover; border:2px solid #e2e8f0; flex-shrink:0;" crossorigin="anonymous">
                <div style="flex:1; min-width:0;">
                    <div style="font-size:15px; font-weight:900; color:#0f172a; margin-bottom:1px; line-height:1.2;">${p.name}</div>
                    <div style="font-size:9px; color:#16a34a; font-weight:700; text-transform:uppercase; letter-spacing:0.4px;">${p.position}${p.role ? ' — ' + (typeof t === 'function' ? t(p.role) : p.role) : ''}</div>
                    <div style="display:flex; gap:8px; font-size:8px; color:#64748b; margin-top:2px; flex-wrap:wrap;">
                        <span>🏠 ${teamName}</span>
                        <span>🎂 ${currentAge} yaş</span>
                        <span>📏 ${p.height || '-'} cm</span>
                        <span>🦶 ${p.foot || '-'}</span>
                        <span>🌍 ${natName}</span>
                    </div>
                </div>
                <div style="text-align:center; flex-shrink:0;">
                    <div style="width:40px; height:40px; border-radius:50%; border:3px solid ${gradeHexColor}; display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:900; color:${gradeHexColor}; background:#f8fafc;">${grade.letter}</div>
                    <div style="font-size:7px; color:#94a3b8; font-weight:700; margin-top:1px; text-transform:uppercase;">${currentReport.rating} / 100</div>
                </div>
            </div>

            <!-- ═══ INFO BAR ═══ -->
            <div style="display:flex; gap:6px; margin-bottom:8px;">
                <div style="flex:1; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:5px; padding:4px 8px; text-align:center;">
                    <div style="font-size:6.5px; color:#16a34a; font-weight:700; text-transform:uppercase; letter-spacing:0.4px;">Potansiyel</div>
                    <div style="font-size:10px; font-weight:800; color:#15803d;">${currentReport.potential || '-'}</div>
                </div>
                <div style="flex:1; background:#f8fafc; border:1px solid #e2e8f0; border-radius:5px; padding:4px 8px; text-align:center;">
                    <div style="font-size:6.5px; color:#64748b; font-weight:700; text-transform:uppercase; letter-spacing:0.4px;">Rapor Tarihi</div>
                    <div style="font-size:10px; font-weight:800; color:#334155;">${currentReport.date}</div>
                </div>
                ${currentReport.source ? `
                <div style="flex:1; background:#f8fafc; border:1px solid #e2e8f0; border-radius:5px; padding:4px 8px; text-align:center;">
                    <div style="font-size:6.5px; color:#64748b; font-weight:700; text-transform:uppercase; letter-spacing:0.4px;">Kaynak</div>
                    <div style="font-size:8px; font-weight:700; color:#334155; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${currentReport.source}</div>
                </div>` : ''}
            </div>

            <!-- ═══ RADAR + GÜÇLÜ/ZAYIF ═══ -->
            <div style="display:flex; gap:8px; margin-bottom:8px;">
                ${chartImageURI ? `
                <!-- Radar Chart -->
                <div style="flex:1; background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius:8px; padding:6px; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:150px;">
                    <div style="font-size:7px; font-weight:700; color:rgba(255,255,255,0.5); text-transform:uppercase; letter-spacing:0.8px; margin-bottom:3px;">Yetenek Analizi</div>
                    <img src="${chartImageURI}" style="width:100%; max-height:140px; object-fit:contain;">
                </div>
                ` : ''}
                
                <!-- Güçlü & Geliştirilmeli -->
                <div style="flex:1; display:flex; flex-direction:column; gap:5px;">
                    <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:6px; padding:5px 8px; flex:1;">
                        <div style="font-size:7px; font-weight:800; color:#16a34a; text-transform:uppercase; letter-spacing:0.4px; margin-bottom:2px; display:flex; align-items:center; gap:3px;">
                            ★ Güçlü Yönler
                        </div>
                        ${strengthsHTML}
                    </div>
                    <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:6px; padding:5px 8px; flex:1;">
                        <div style="font-size:7px; font-weight:800; color:#dc2626; text-transform:uppercase; letter-spacing:0.4px; margin-bottom:2px; display:flex; align-items:center; gap:3px;">
                            ↗ Geliştirilmeli
                        </div>
                        ${weaknessesHTML}
                    </div>
                </div>
            </div>

            <!-- ═══ OYUNCU ÖZELLİKLERİ ═══ -->
            <div style="margin-bottom:4px;">
                <div style="font-size:10px; font-weight:800; color:#0f172a; border-bottom:2px solid #e2e8f0; padding-bottom:3px; margin-bottom:5px;">Oyuncu Özellikleri</div>
                ${attributesHTML}
            </div>

            <!-- ═══ FOOTER ═══ -->
            <div style="border-top:1px solid #e2e8f0; padding-top:5px; margin-top:4px; text-align:center; font-size:7px; color:#94a3b8; font-weight:600;">
                ScoutPro Veritabanı  •  Oluşturulma: ${new Date().toLocaleDateString('tr-TR')}  •  GİZLİ — Yetkili Personel İçindir
            </div>
        </div>
    `;

    document.body.appendChild(container);

    const opt = {
        margin:       [0.15, 0.12, 0.15, 0.12],
        filename:     p.name.replace(/\s+/g, '_') + '_Scout_Raporu.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2.5, useCORS: true, logging: false, letterRendering: true },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['css'] }
    };

    try {
        await html2pdf().set(opt).from(container.querySelector('#pdf-content')).save();
    } catch(e) {
        console.error('PDF oluşturma hatası:', e);
        window.alert('PDF oluşturulurken bir hata oluştu.', 'error');
    } finally {
        if (container.parentNode) document.body.removeChild(container);
    }
};