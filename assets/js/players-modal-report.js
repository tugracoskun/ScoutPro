// --- OYUNCU YENİ RAPOR EKLEME MODÜLÜ (BUG FIX: VERİ YAPISI GÜNCELLENDİ) ---

ScoutApp.prototype.openNewReportMode = function(id) {
    const p = this.state.data.players.find(x => x.id === id);
    if(!p) return;

    if (!this.state.newReport) {
        this.state.newReport = typeof this.resetReport === 'function' ? this.resetReport() : { stats: {} };
    }

    // Son istatistikleri kopyala
    const lastStats = (p.history && p.history.length > 0 && p.history[0].stats) ? p.history[0].stats : (p.stats || {});
    this.state.newReport.stats = {...lastStats}; 

    // Oyuncunun takımlarına ait maçları filtrele
    const filteredMatches = this.getFilteredMatchesForPlayer(
        p.teamId,
        p.nationalTeamId,
        p.id
    );

    // Hedef maç var mı kontrol et
    const matchedMatch = (this.state.data.matches || []).find(m => m.targetPlayerId == id);
    const defaultMatchId = matchedMatch ? matchedMatch.id : '';

    // Mevkiye göre doğru özellik grubunu bul
    const mapping = POSITION_MAPPING[p.position] || { group: 'Default' };
    const attributeGroup = ATTRIBUTE_GROUPS[mapping.group];

    const container = document.getElementById('modal-content-body');
    container.innerHTML = `
        <div class="max-w-3xl mx-auto bg-dark-900 p-8 rounded-3xl border border-dark-800 shadow-2xl">
            <div class="flex justify-between items-center mb-6 border-b border-dark-800 pb-4">
                <h3 class="text-xl font-bold text-white flex items-center gap-2"><i data-lucide="file-plus" class="text-green-500"></i> ${t('new_report')}: ${p.name}</h3>
                <button onclick="app.openPlayerModal(${id})" class="text-slate-400 hover:text-white flex items-center gap-1 text-sm"><i data-lucide="arrow-left" class="w-4 h-4"></i> ${t('cancel')}</button>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <div class="flex flex-col gap-1.5">
                    <label class="text-xs font-bold text-slate-400 ml-1">${t('market_value')}</label>
                    <input type="number" id="new-rep-market-value" value="${p.marketValue || ''}" placeholder="Örn: 5000000" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500 text-sm">
                </div>
                <div class="flex flex-col gap-1.5">
                    <label class="text-xs font-bold text-slate-400 ml-1">${t('potential')}</label>
                    <select id="new-rep-potential" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-green-500 outline-none text-sm cursor-pointer">
                        <option value="Düşük" ${p.potential === 'Düşük' ? 'selected' : ''}>${t('potential_low')}</option>
                        <option value="Yüksek" ${p.potential === 'Yüksek' ? 'selected' : ''}>${t('potential_high')}</option>
                    </select>
                </div>
                <div class="flex flex-col gap-1.5">
                    <label class="text-xs font-bold text-slate-400 ml-1">${t('source')}</label>
                    <input type="text" id="new-rep-source" placeholder="Örn: Canlı İzleme..." class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500 text-sm">
                </div>
                <div class="flex flex-col gap-1.5">
                    <label class="text-xs font-bold text-slate-400 ml-1 flex items-center justify-between">
                        <span>${t('watched_match')}</span>
                    </label>
                    <select id="new-rep-match" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-green-500 outline-none text-sm cursor-pointer">
                        ${filteredMatches.length > 0 ? `
                            <option value="">-- ${t('select_match_optional')} --</option>
                            ${filteredMatches.map(m => `<option value="${m.id}" ${defaultMatchId == m.id ? 'selected' : ''}>${this.getMatchDisplay(m)}</option>`).join('')}
                        ` : `
                            <option value="">-- ${window.getLang && window.getLang() === 'en' ? 'No matches found' : 'Maç bulunamadı'} --</option>
                        `}
                    </select>
                </div>
            </div>

            <!-- Slider Alanı -->
            <div class="max-h-[500px] overflow-y-auto custom-scrollbar pr-2 mb-6">
                ${this.getSliderHTMLForUpdate(attributeGroup, lastStats, mapping.weightKey)}
            </div>

            <button onclick="app.saveNewPlayerReport(${id})" class="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 transition-all">
                <i data-lucide="save" class="w-5 h-5"></i> ${t('save')}
            </button>
        </div>
    `;
    lucide.createIcons();
};

ScoutApp.prototype.getSliderHTMLForUpdate = function(attributeGroup, currentStats, weightKey) {
    let html = '';
    
    // Ağırlık verilerini al
    const weights = weightKey ? POSITION_WEIGHTS[weightKey] : {};

    // Stil belirleyici (Highlighting)
    const getStyleClass = (attrName) => {
        const w = weights[attrName];
        if (w === 3) return 'border-green-500/50 bg-green-500/5'; // Kritik
        if (w === 2) return 'border-lime-500/30 bg-lime-500/5';   // Yüksek
        return 'border-dark-800 bg-dark-950'; // Normal
    };

    const renderCard = (attr, styleClass) => {
        const rawVal = currentStats[attr.name];
        const isUnobserved = (rawVal === null);
        const val = isUnobserved ? 50 : (rawVal !== undefined ? parseInt(rawVal) : 50);
        const displayVal = isUnobserved ? '?' : val;
        const safeKey = attr.name.replace(/\s+/g, '-').replace(/\//g, '-').toLowerCase();
        const unobservedClass = isUnobserved ? 'attr-unobserved' : '';
        const color = isUnobserved ? '#64748b' : (val < 40 ? '#ef4444' : (val < 60 ? '#eab308' : (val < 80 ? '#a3e635' : '#22c55e')));
        const btnTitle = isUnobserved 
            ? (window.getLang && window.getLang() === 'en' ? 'Observed - Click to rate' : 'Gözlemlendi - Puanlamak için tıkla') 
            : (window.getLang && window.getLang() === 'en' ? 'Mark as Not Observed' : 'Bu maçta gözlemleme fırsatım olmadı (Es geç)');
        const btnStyle = isUnobserved 
            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-sm' 
            : 'bg-dark-900 text-slate-500 hover:text-white border-dark-800 hover:border-slate-600';

        return `
            <div id="card-new-${safeKey}" class="${styleClass} ${unobservedClass} px-4 py-3 rounded-xl border mb-2 transition-all">
                <div class="flex justify-between mb-2">
                    <div class="flex flex-col min-w-0 pr-2">
                        <span class="text-xs font-bold text-slate-200 truncate" title="${attr.name}">${window.tAttr ? window.tAttr(attr.name) : attr.name}</span>
                        <span class="text-[10px] text-slate-500 truncate" title="${attr.sub}">${window.tSub ? window.tSub(attr.sub) : attr.sub}</span>
                    </div>
                    <div class="flex items-center gap-1.5 shrink-0">
                        <button type="button" id="btn-unobs-new-${safeKey}" onclick="app.toggleModalReportStatObserved('${attr.name}', this)" class="unobserved-toggle-btn w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black border transition-all ${btnStyle}" title="${btnTitle}">?</button>
                        <span id="val-new-${safeKey}" class="text-sm font-black min-w-[32px] text-center transition-colors" style="color: ${color}">${displayVal}</span>
                    </div>
                </div>
                <input type="range" min="0" max="100" value="${val}" id="slider-new-${safeKey}"
                    oninput="app.updateModalReportStat('${attr.name}', this.value, this)" 
                    class="w-full h-1.5 bg-dark-800 rounded-lg appearance-none cursor-pointer"
                    style="accent-color: ${color};">
            </div>`;
    };

    // Kategorili Yapı Kontrolü
    const isCategorized = !attributeGroup['Genel'];

    if (isCategorized) {
        Object.keys(attributeGroup).forEach(cat => {
            const clr = {'Teknik':'text-red-400','Fiziksel':'text-yellow-400','Psikolojik':'text-green-400','Sosyolojik':'text-blue-400','Taktik':'text-purple-400','Mental':'text-pink-400','Psiko-Sosyal':'text-indigo-400'}[cat] || 'text-white';
            const borderClr = {'Teknik':'border-red-400','Fiziksel':'border-yellow-400','Psikolojik':'border-green-400','Sosyolojik':'border-blue-400','Taktik':'border-purple-400','Mental':'border-pink-400','Psiko-Sosyal':'border-indigo-400'}[cat] || 'border-slate-600';
            const displayCat = window.tAttr ? window.tAttr(cat) : cat;
            
            html += `<div class="col-span-2 mt-4 mb-2 pb-1 border-b ${borderClr} font-bold text-sm uppercase tracking-wider ${clr}">${displayCat}</div>`;
            
            attributeGroup[cat].forEach(attr => { 
                const styleClass = getStyleClass(attr.name);
                html += renderCard(attr, styleClass);
            });
        });
    } else {
        // Varsayılan Yapı
        attributeGroup['Genel'].forEach(attr => {
            html += renderCard(attr, 'border-dark-800 bg-dark-950');
        });
    }
    return html;
};

// --- GÖZLEMLENMEDİ (N/A) BUTON TOGGLE (MODAL RAPOR) ---
ScoutApp.prototype.toggleModalReportStatObserved = function(attrName, btnEl) {
    const safeKey = attrName.replace(/\s+/g, '-').replace(/\//g, '-').toLowerCase();
    const cardEl = document.getElementById(`card-new-${safeKey}`);
    const valDisplay = document.getElementById(`val-new-${safeKey}`);
    const sliderEl = document.getElementById(`slider-new-${safeKey}`);
    
    if (!this.state.newReport) this.state.newReport = { stats: {} };
    if (!this.state.newReport.stats) this.state.newReport.stats = {};

    const currentVal = this.state.newReport.stats[attrName];

    if (currentVal === null) {
        // Önceden gözlemlenmemişti -> aktifleştir
        const restoredVal = parseInt(sliderEl ? sliderEl.value : 50) || 50;
        this.state.newReport.stats[attrName] = restoredVal;

        if (cardEl) cardEl.classList.remove('attr-unobserved');
        const color = restoredVal < 40 ? '#ef4444' : (restoredVal < 60 ? '#eab308' : (restoredVal < 80 ? '#a3e635' : '#22c55e'));
        if (valDisplay) {
            valDisplay.innerText = restoredVal;
            valDisplay.style.color = color;
        }
        if (sliderEl) {
            sliderEl.style.accentColor = color;
            sliderEl.value = restoredVal;
        }
        if (btnEl) {
            btnEl.className = 'unobserved-toggle-btn w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black border transition-all bg-dark-900 text-slate-500 hover:text-white border-dark-800 hover:border-slate-600';
            btnEl.title = window.getLang && window.getLang() === 'en' ? 'Mark as Not Observed' : 'Bu maçta gözlemleme fırsatım olmadı (Es geç)';
        }
    } else {
        // Aktif -> gözlemlenmedi (null) yap
        this.state.newReport.stats[attrName] = null;
        if (cardEl) cardEl.classList.add('attr-unobserved');
        if (valDisplay) {
            valDisplay.innerText = '?';
            valDisplay.style.color = '#94a3b8';
        }
        if (sliderEl) {
            sliderEl.style.accentColor = '#64748b';
        }
        if (btnEl) {
            btnEl.className = 'unobserved-toggle-btn w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black border transition-all bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-sm';
            btnEl.title = window.getLang && window.getLang() === 'en' ? 'Observed - Click to rate' : 'Gözlemlendi - Puanlamak için tıkla';
        }
    }
};

ScoutApp.prototype.updateModalReportStat = function(attrName, val, inputEl) {
    if (!this.state.newReport) this.state.newReport = { stats: {} };
    if (!this.state.newReport.stats) this.state.newReport.stats = {};

    const numVal = parseInt(val);
    this.state.newReport.stats[attrName] = numVal;

    const safeKey = attrName.replace(/\s+/g, '-').replace(/\//g, '-').toLowerCase();
    const valDisplay = document.getElementById(`val-new-${safeKey}`);
    const cardEl = document.getElementById(`card-new-${safeKey}`);
    const btnEl = document.getElementById(`btn-unobs-new-${safeKey}`);

    if (cardEl && cardEl.classList.contains('attr-unobserved')) {
        cardEl.classList.remove('attr-unobserved');
    }
    if (btnEl) {
        btnEl.className = 'unobserved-toggle-btn w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black border transition-all bg-dark-900 text-slate-500 hover:text-white border-dark-800 hover:border-slate-600';
        btnEl.title = window.getLang && window.getLang() === 'en' ? 'Mark as Not Observed' : 'Bu maçta gözlemleme fırsatım olmadı (Es geç)';
    }

    const color = numVal < 40 ? '#ef4444' : (numVal < 60 ? '#eab308' : (numVal < 80 ? '#a3e635' : '#22c55e'));
    if (valDisplay) {
        valDisplay.innerText = val;
        valDisplay.style.color = color;
    }
    if (inputEl) {
        inputEl.style.accentColor = color;
    }
};

ScoutApp.prototype.openAddReportModal = function(id) {
    this.openNewReportMode(id);
};

ScoutApp.prototype.saveNewPlayerReport = function(id) {
    const p = this.state.data.players.find(x => x.id === id);
    if(!p) return;

    if (!this.state.newReport) {
        this.state.newReport = typeof this.resetReport === 'function' ? this.resetReport() : { stats: {} };
    }

    const newStats = this.state.newReport.stats || {};
    const newPotentialEl = document.getElementById('new-rep-potential');
    const newPotential = newPotentialEl ? newPotentialEl.value : (p.potential || 'Düşük');
    const newMarketValueEl = document.getElementById('new-rep-market-value');
    const newMarketValue = newMarketValueEl ? newMarketValueEl.value : (p.marketValue || '');
    const newSourceElement = document.getElementById('new-rep-source');
    const newSource = newSourceElement ? newSourceElement.value : '';
    const newMatchElement = document.getElementById('new-rep-match');
    const newMatchId = newMatchElement ? newMatchElement.value : '';
    
    // Ortalama Hesapla (null / gözlemlenmeyen değerleri es geç, sıfır sayma)
    const validStatsArr = Object.values(newStats).filter(v => typeof v === 'number' && !isNaN(v) && v !== null);
    const avg = validStatsArr.length > 0 ? Math.round(validStatsArr.reduce((a,b)=>a+b,0)/validStatsArr.length) : (p.rating || 50);
    const lang = (window.getLang && window.getLang() === 'en') ? 'en-US' : 'tr-TR';
    const today = new Date().toLocaleDateString(lang);

    const newHistoryEntry = {
        date: today,
        rating: avg,
        stats: {...newStats},
        potential: newPotential,
        marketValue: newMarketValue,
        source: newSource,
        matchId: newMatchId
    };

    if (!p.history) p.history = [];

    // Geçmişe ekle
    p.history.unshift(newHistoryEntry);
    
    // Ana veriyi güncelle (Son rapor baz alınır)
    p.rating = avg;
    p.stats = {...newStats};
    p.potential = newPotential;
    if (newMarketValue) p.marketValue = newMarketValue;
    p.dateAdded = today; 

    this.saveData(); // Kayıt
    this.notify(typeof t === 'function' ? t('success') : 'Rapor başarıyla kaydedildi');

    if (typeof this.resetReport === 'function') {
        this.state.newReport = this.resetReport(); 
    }
    this.openPlayerModal(id); 
};