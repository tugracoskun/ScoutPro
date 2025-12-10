// --- YENİ RAPORLAMA: SLIDER VE INPUT BİLEŞENLERİ ---

ScoutApp.prototype.renderAttributeInputs = function(set, weightKey) {
    const container = document.getElementById('attribute-container');
    if (!container) return;
    
    let html = '';
    
    // Ağırlık verilerini al
    const weights = weightKey ? POSITION_WEIGHTS[weightKey] : {};

    // Stil belirleyici
    const getStyleClass = (attrName) => {
        const w = weights[attrName];
        if (w === 3) return 'attr-critical'; // Kritik
        if (w === 2) return 'attr-high';     // Yüksek
        if (w === 0) return 'attr-low';      // Düşük
        return '';
    };

    // Kategorili Yapı (Defans, Kaleci vb.)
    if (Object.keys(set).length > 1 && !set['Genel']) {
        Object.keys(set).forEach(cat => {
            const clr = {'Teknik':'text-red-400','Fiziksel':'text-yellow-400','Psikolojik':'text-green-400','Sosyolojik':'text-blue-400','Taktik':'text-purple-400','Mental':'text-pink-400'}[cat] || 'text-white';
            const borderClr = {'Teknik':'border-red-400','Fiziksel':'border-yellow-400','Psikolojik':'border-green-400','Sosyolojik':'border-blue-400','Taktik':'border-purple-400','Mental':'border-pink-400'}[cat] || 'border-slate-600';
            
            html += `<div class="col-span-1 md:col-span-2 mt-6 mb-3 pb-1 border-b border-dark-800 font-bold text-sm uppercase tracking-wider ${clr} category-header" style="border-left-color: var(--tw-border-opacity, 1) ${borderClr}">${cat}</div>`;
            
            set[cat].forEach(attr => { 
                const val = this.state.newReport.stats[attr.name] || 50;
                const styleClass = getStyleClass(attr.name);
                html += this.createDetailedSlider(attr.name, attr.sub, val, styleClass); 
            });
        });
    } 
    // Düz Yapı (Default)
    else {
        set['Genel'].forEach(attr => { 
            const val = this.state.newReport.stats[attr.name] || 50;
            html += this.createDetailedSlider(attr.name, attr.sub, val, ''); 
        });
    }
    
    container.innerHTML = html;
};

// Alt Detaylı Slider Oluşturucu
ScoutApp.prototype.createDetailedSlider = function(label, sub, val, styleClass) {
    const safeKey = label.replace(/\s+/g, '-').replace(/\//g, '-').toLowerCase();
    
    return `
        <div class="bg-dark-950 p-4 rounded-xl border border-dark-800 relative z-10 ${styleClass} transition-colors hover:border-dark-700 group">
            <div class="flex justify-between items-start mb-3">
                <div class="flex flex-col min-w-0 pr-2">
                    <span class="text-xs font-bold text-slate-200 truncate attr-label flex items-center gap-1.5">
                        ${styleClass.includes('critical') ? '<i data-lucide="star" class="w-3 h-3 text-scout-400 fill-scout-400"></i>' : ''}
                        ${label}
                    </span>
                    <!-- ALT DETAY KISMI -->
                    <span class="text-[10px] text-slate-500 leading-tight mt-0.5 line-clamp-1 group-hover:text-slate-400 transition-colors">${sub}</span>
                </div>
                <span id="val-${safeKey}" class="text-sm font-black text-scout-400 bg-dark-900 px-2 py-0.5 rounded border border-dark-800 min-w-[32px] text-center">${val}</span>
            </div>
            <input type="range" min="0" max="100" value="${val}" 
                oninput="app.updateRepStat('${label}', this.value)" 
                class="w-full h-1.5 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-scout-500 relative z-20">
        </div>`;
};