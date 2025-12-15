// --- OYUNCU YENİ RAPOR EKLEME MODÜLÜ (BUG FIX: VERİ YAPISI GÜNCELLENDİ) ---

ScoutApp.prototype.openNewReportMode = function(id) {
    const p = this.state.data.players.find(x => x.id === id);
    if(!p) return;

    // Son istatistikleri kopyala
    const lastStats = p.history[0] ? p.history[0].stats : {};
    this.state.newReport.stats = {...lastStats}; 

    // Mevkiye göre doğru özellik grubunu bul
    const mapping = POSITION_MAPPING[p.position] || { group: 'Default' };
    const attributeGroup = ATTRIBUTE_GROUPS[mapping.group];

    const container = document.getElementById('modal-content-body');
    container.innerHTML = `
        <div class="max-w-3xl mx-auto bg-dark-900 p-8 rounded-3xl border border-dark-800 shadow-2xl">
            <div class="flex justify-between items-center mb-6 border-b border-dark-800 pb-4">
                <h3 class="text-xl font-bold text-white flex items-center gap-2"><i data-lucide="file-plus" class="text-green-500"></i> Yeni Rapor Ekle: ${p.name}</h3>
                <button onclick="app.openPlayerModal(${id})" class="text-slate-400 hover:text-white flex items-center gap-1 text-sm"><i data-lucide="arrow-left" class="w-4 h-4"></i> Vazgeç</button>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="flex flex-col gap-1.5">
                    <label class="text-xs font-bold text-slate-400 ml-1">Potansiyel Durumu</label>
                    <select id="new-rep-potential" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-green-500 outline-none text-sm cursor-pointer">
                        <option value="Düşük" ${p.potential === 'Düşük' ? 'selected' : ''}>Düşük (Standart)</option>
                        <option value="Yüksek" ${p.potential === 'Yüksek' ? 'selected' : ''}>Yüksek (Gelişime Açık)</option>
                    </select>
                </div>
            </div>

            <!-- Slider Alanı -->
            <div class="max-h-[500px] overflow-y-auto custom-scrollbar pr-2 mb-6">
                ${this.getSliderHTMLForUpdate(attributeGroup, lastStats, mapping.weightKey)}
            </div>

            <button onclick="app.saveNewPlayerReport(${id})" class="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 transition-all">
                <i data-lucide="save" class="w-5 h-5"></i> Raporu Kaydet
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

    // Kategorili Yapı Kontrolü
    const isCategorized = !attributeGroup['Genel']; // Eğer 'Genel' yoksa kategorilidir

    if (isCategorized) {
        Object.keys(attributeGroup).forEach(cat => {
            const clr = {'Teknik':'text-red-400','Fiziksel':'text-yellow-400','Psikolojik':'text-green-400','Sosyolojik':'text-blue-400','Taktik':'text-purple-400','Mental':'text-pink-400','Psiko-Sosyal':'text-indigo-400'}[cat] || 'text-white';
            
            html += `<div class="col-span-2 mt-4 mb-2 pb-1 border-b border-dark-800 font-bold text-sm uppercase tracking-wider ${clr}">${cat}</div>`;
            
            attributeGroup[cat].forEach(attr => { 
                const val = currentStats[attr.name] || 50;
                const styleClass = getStyleClass(attr.name);
                
                html += `
                    <div class="${styleClass} px-4 py-3 rounded-xl border mb-2 transition-all">
                        <div class="flex justify-between mb-2">
                            <div class="flex flex-col">
                                <span class="text-xs font-bold text-slate-200">${attr.name}</span>
                                <span class="text-[10px] text-slate-500">${attr.sub}</span>
                            </div>
                            <span id="val-new-${attr.name.replace(/\s+/g,'')}" class="text-sm font-black text-green-400">${val}</span>
                        </div>
                        <input type="range" min="0" max="100" value="${val}" 
                            oninput="document.getElementById('val-new-${attr.name.replace(/\s+/g,'')}').innerText = this.value; app.state.newReport.stats['${attr.name}'] = parseInt(this.value);" 
                            class="w-full h-1.5 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-green-500">
                    </div>`;
            });
        });
    } else {
        // Varsayılan Yapı
        attributeGroup['Genel'].forEach(attr => {
            const val = currentStats[attr.name] || 50;
            html += `
                <div class="bg-dark-950 px-4 py-3 rounded-xl border border-dark-800 mb-2">
                    <div class="flex justify-between mb-2">
                        <span class="text-xs font-medium text-slate-300">${attr.name}</span>
                        <span id="val-new-${attr.name.replace(/\s+/g,'')}" class="text-xs font-bold text-green-400">${val}</span>
                    </div>
                    <input type="range" min="0" max="100" value="${val}" 
                        oninput="document.getElementById('val-new-${attr.name.replace(/\s+/g,'')}').innerText = this.value; app.state.newReport.stats['${attr.name}'] = parseInt(this.value);" 
                        class="w-full h-1.5 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-green-500">
                </div>`;
        });
    }
    return html;
};

ScoutApp.prototype.saveNewPlayerReport = function(id) {
    const p = this.state.data.players.find(x => x.id === id);
    if(!p) return;

    const newStats = this.state.newReport.stats;
    const newPotential = document.getElementById('new-rep-potential').value;
    
    // Ortalama Hesapla
    const statsArr = Object.values(newStats);
    const avg = statsArr.length > 0 ? Math.round(statsArr.reduce((a,b)=>a+b,0)/statsArr.length) : 50;
    const today = new Date().toLocaleDateString('tr-TR');

    const newHistoryEntry = {
        date: today,
        rating: avg,
        stats: {...newStats},
        potential: newPotential
    };

    // Geçmişe ekle
    p.history.unshift(newHistoryEntry);
    
    // Ana veriyi güncelle
    p.rating = avg;
    p.stats = {...newStats};
    p.potential = newPotential;
    p.dateAdded = today; 

    this.saveData(); // Kayıt
    this.notify("Yeni rapor başarıyla eklendi!");

    this.state.newReport = this.resetReport(); 
    this.openPlayerModal(id); 
};