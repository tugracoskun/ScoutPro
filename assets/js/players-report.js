// --- YENİ RAPORLAMA MODÜLÜ (TEK VE TAM SÜRÜM) ---

// 1. ANA GÖRÜNÜM (RENDER)
ScoutApp.prototype.renderNewReport = function(c) {
    const teams = this.state.data.teams.map(t=>({val:t.id, txt:t.name}));
    const currentPos = this.state.newReport.position;

    c.innerHTML = `
        <div class="max-w-6xl mx-auto fade-in grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- SOL KOLON: KİMLİK -->
            <div class="lg:col-span-4 space-y-6">
                <div class="bg-dark-900 p-6 rounded-2xl border border-dark-800 space-y-4">
                    <h3 class="text-lg font-bold text-white mb-4 flex gap-2"><i data-lucide="user" class="text-scout-400 w-5 h-5"></i> Kimlik</h3>
                    
                    ${this.createInput('rep-name', 'Adı Soyadı', 'Örn: Semih', 'text', this.state.newReport.name, "app.updateRep('name', this.value)")}
                    
                    ${teams.length > 0 
                        ? this.createSelect('rep-team', 'Takım', teams, this.state.newReport.teamId, "app.updateRep('teamId', this.value)") 
                        : '<div class="p-3 bg-red-900/20 border border-red-900/50 rounded text-red-400 text-xs">Önce Veritabanından Takım Ekleyiniz!</div>'}
                    
                    <div class="grid grid-cols-2 gap-4">
                        ${this.createSelect('rep-pos', 'Mevki', POSITIONS.map(p=>({val:p, txt:p})), currentPos, 'app.handlePositionChange(this.value)')}
                        
                        <!-- Doğum Tarihi -->
                        <div class="flex flex-col gap-1.5 relative z-10">
                            <label class="text-xs font-bold text-slate-400 ml-1 flex justify-between">Doğum Tarihi <span id="calculated-age-display" class="text-scout-400 font-mono"></span></label>
                            <input type="date" id="rep-birth" value="${this.state.newReport.birthDate || ''}" onchange="app.updateBirthDate(this.value)" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-scout-500 outline-none transition-all text-sm relative z-20">
                        </div>
                    </div>

                    <!-- İpucu Kutusu -->
                    <div id="age-specific-tips" class="hidden bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 text-xs space-y-2 animate-fade-in"></div>

                    <div class="grid grid-cols-2 gap-4">
                        ${this.createInput('rep-height', 'Boy (cm)', '185', 'number', this.state.newReport.height, "app.updateRep('height', this.value)")}
                        ${this.createSelect('rep-foot', 'Kullandığı Ayak', [{val:'Sağ', txt:'Sağ'}, {val:'Sol', txt:'Sol'}, {val:'Her İkisi', txt:'Her İkisi'}], this.state.newReport.foot, "app.updateRep('foot', this.value)")}
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-slate-400 ml-1">Potansiyel Durumu</label>
                        <div class="relative">
                            <select onchange="app.updateRep('potential', this.value)" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-scout-500 outline-none appearance-none text-sm cursor-pointer">
                                <option value="Düşük" ${this.state.newReport.potential === 'Düşük' ? 'selected' : ''}>Düşük (Standart)</option>
                                <option value="Yüksek" ${this.state.newReport.potential === 'Yüksek' ? 'selected' : ''}>Yüksek (Gelişime Açık)</option>
                            </select>
                            <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"><i data-lucide="chevron-down" class="w-4 h-4"></i></div>
                        </div>
                    </div>

                    ${this.createInput('rep-source', 'Keşif Kaynağı', 'Örn: Altyapı', 'text', this.state.newReport.source, "app.updateRep('source', this.value)")}
                </div>
                
                <!-- Linkler -->
                <div class="bg-dark-900 p-6 rounded-2xl border border-dark-800 space-y-4">
                    <h3 class="text-lg font-bold text-white mb-4 flex gap-2"><i data-lucide="link" class="text-scout-400 w-5 h-5"></i> Bağlantılar</h3>
                    ${this.createInput('rep-tm', 'Transfermarkt URL', 'https://...', 'text', this.state.newReport.tmUrl, "app.updateRep('tmUrl', this.value)")}
                    ${this.createInput('rep-sofa', 'Sofascore URL', 'https://...', 'text', this.state.newReport.sofaUrl, "app.updateRep('sofaUrl', this.value)")}
                </div>
                
                <!-- Medya (Sadece URL) -->
                <div class="bg-dark-900 p-6 rounded-2xl border border-dark-800">
                    <h3 class="text-lg font-bold text-white mb-4 flex gap-2"><i data-lucide="image" class="text-scout-400 w-5 h-5"></i> Medya (Fotoğraf)</h3>
                    <div class="flex gap-2 items-end"><div class="flex-1">${this.createInput('rep-img', 'Foto URL', 'https://...', 'text', this.state.newReport.image, "app.updateRep('image', this.value)")}</div></div>
                </div>
            </div>

            <!-- SAĞ KOLON: ANALİZ -->
            <div class="lg:col-span-8 bg-dark-900 p-8 rounded-2xl border border-dark-800 flex flex-col h-full relative overflow-hidden">
                <div class="flex justify-between items-center sticky top-0 bg-dark-900 z-50 py-4 border-b border-dark-800/50 mb-4">
                    <h3 class="text-xl font-bold text-white">Yetenek Analizi</h3>
                    <div class="bg-dark-950 px-4 py-2 rounded-lg border border-dark-800 flex items-center gap-3">
                        <span class="text-slate-400 text-sm">Genel Puan:</span>
                        <div id="rep-avg-badge" class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 bg-dark-900 text-slate-500 border-slate-700">-</div>
                    </div>
                </div>
                
                <!-- SLIDER ALANI -->
                <div id="attribute-container" class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-8 max-h-[600px] overflow-y-auto custom-scrollbar pr-2 pb-4">
                    <div class="text-slate-500 text-sm text-center col-span-2 py-10 italic">Lütfen sol taraftan bir mevki seçiniz...</div>
                </div>

                <!-- Grafik ve Kaydet -->
                <div class="mt-auto border-t border-dark-800 pt-6 z-40 relative bg-dark-900">
                     <div id="report-radar" class="w-full h-72 flex justify-center"></div>
                     <button onclick="app.submitReport()" class="w-full mt-6 py-4 bg-scout-600 hover:bg-scout-500 text-white font-bold rounded-xl shadow-lg shadow-scout-500/20 flex items-center justify-center gap-2 transition-all group">
                        <i data-lucide="save" class="w-5 h-5 group-hover:scale-110 transition-transform"></i> 
                        Oyuncuyu Havuza Ekle
                     </button>
                </div>
            </div>
        </div>
    `;
    
    lucide.createIcons();

    // Tarih varsa yaşı güncelle
    if(this.state.newReport.birthDate) {
        this.updateBirthDate(this.state.newReport.birthDate);
    }

    // Grafiği başlat
    setTimeout(() => {
        this.initReportRadar([], []);
        if (currentPos) {
            this.handlePositionChange(currentPos, false); 
        }
    }, 150);
};


// 2. İŞ MANTIĞI VE SLIDERLAR

ScoutApp.prototype.handlePositionChange = function(pos, resetStats = true) {
    this.state.newReport.position = pos;

    const mapping = POSITION_MAPPING[pos] || { group: 'Default', weightKey: null };
    const attributeGroup = ATTRIBUTE_GROUPS[mapping.group];
    
    if (resetStats) {
        this.state.newReport.stats = {};
        if (mapping.group === 'Default') {
             // Eski yapı için destek (array of objects)
             attributeGroup['Genel'].forEach(attr => this.state.newReport.stats[attr.name] = 50);
        } else {
             // Yeni Kategorili yapı
             Object.keys(attributeGroup).forEach(category => {
                 attributeGroup[category].forEach(attr => this.state.newReport.stats[attr.name] = 50);
             });
        }
    }

    this.renderAttributeInputs(attributeGroup, mapping.weightKey);
    this.updateRadarChart();
    this.calculateAverage();
};

ScoutApp.prototype.renderAttributeInputs = function(attributeGroup, weightKey) {
    const container = document.getElementById('attribute-container');
    if (!container) return;
    
    let html = '';
    const weights = weightKey ? POSITION_WEIGHTS[weightKey] : {};
    
    const getStyleClass = (attrName) => {
        const w = weights[attrName];
        if (w === 3) return 'attr-critical'; 
        if (w === 2) return 'attr-high';     
        if (w === 0) return 'attr-low';      
        return '';
    };

    // Kategorili Yapı kontrolü
    // Eğer attributeGroup içinde 'Genel' varsa basittir, yoksa kategorilidir
    if (!attributeGroup['Genel']) {
        Object.keys(attributeGroup).forEach(cat => {
            const clr = {'Teknik':'text-red-400','Fiziksel':'text-yellow-400','Psikolojik':'text-green-400','Sosyolojik':'text-blue-400','Taktik':'text-purple-400','Mental':'text-pink-400','Psiko-Sosyal':'text-indigo-400'}[cat] || 'text-white';
            const borderClr = {'Teknik':'border-red-400','Fiziksel':'border-yellow-400','Psikolojik':'border-green-400','Sosyolojik':'border-blue-400','Taktik':'border-purple-400','Mental':'border-pink-400','Psiko-Sosyal':'border-indigo-400'}[cat] || 'border-slate-600';
            
            html += `<div class="col-span-1 md:col-span-2 mt-6 mb-3 pb-1 border-b border-dark-800 font-bold text-sm uppercase tracking-wider ${clr} category-header" style="border-left-color: var(--tw-border-opacity, 1) ${borderClr}">${cat}</div>`;
            
            attributeGroup[cat].forEach(attr => { 
                const val = this.state.newReport.stats[attr.name] || 50;
                const styleClass = getStyleClass(attr.name);
                html += this.createDetailedSlider(attr.name, attr.sub, val, styleClass); 
            });
        });
    } 
    else {
        // Default Yapı
        attributeGroup['Genel'].forEach(attr => { 
            const val = this.state.newReport.stats[attr.name] || 50;
            html += this.createDetailedSlider(attr.name, attr.sub, val, ''); 
        });
    }
    
    container.innerHTML = html;
};

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
                    <span class="text-[10px] text-slate-500 leading-tight mt-0.5 line-clamp-1 group-hover:text-slate-400 transition-colors">${sub}</span>
                </div>
                <span id="val-${safeKey}" class="text-sm font-black text-scout-400 bg-dark-900 px-2 py-0.5 rounded border border-dark-800 min-w-[32px] text-center">${val}</span>
            </div>
            <input type="range" min="0" max="100" value="${val}" 
                oninput="app.updateRepStat('${label}', this.value)" 
                class="w-full h-1.5 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-scout-500 relative z-20">
        </div>`;
};

ScoutApp.prototype.updateRep = function(k, v) { this.state.newReport[k] = v; };

ScoutApp.prototype.updateRepStat = function(k, v) {
    this.state.newReport.stats[k] = parseInt(v);
    const safeKey = k.replace(/\s+/g, '-').replace(/\//g, '-').toLowerCase();
    const el = document.getElementById(`val-${safeKey}`);
    if(el) el.innerText = v;
    this.updateRadarChart();
    this.calculateAverage();
};

ScoutApp.prototype.updateBirthDate = function(val) {
    this.state.newReport.birthDate = val;
    const age = this.calculateAge(val);
    const display = document.getElementById('calculated-age-display');
    const tipsBox = document.getElementById('age-specific-tips');

    if(display) {
        display.innerText = `(${age} Yaş)`;
    }

    if (tipsBox && typeof AGE_SPECIFIC_KPI !== 'undefined') {
        let groupKey = null;
        if (age >= 9 && age <= 12) groupKey = 'U9-U12';
        else if (age >= 13 && age <= 16) groupKey = 'U13-U16';
        else if (age >= 17 && age <= 21) groupKey = 'U17-U21';

        if (groupKey) {
            const data = AGE_SPECIFIC_KPI[groupKey];
            tipsBox.innerHTML = `
                <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-lg bg-scout-500/20 flex items-center justify-center text-scout-500 shrink-0 mt-1">
                        <i data-lucide="lightbulb" class="w-5 h-5"></i>
                    </div>
                    <div class="flex-1">
                        <h4 class="text-white font-bold text-sm mb-1">${data.title}</h4>
                        <p class="text-xs text-slate-300 italic mb-3 border-l-2 border-scout-500 pl-2">"${data.focus}"</p>
                        <ul class="space-y-2 mb-4">
                            ${data.kpis.map(k => `<li class="flex items-start gap-2 text-[11px] text-slate-400"><span class="mt-1 w-1.5 h-1.5 rounded-full bg-scout-500 shrink-0"></span><span>${k}</span></li>`).join('')}
                        </ul>
                        <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-2 flex gap-2 items-start text-[10px] text-red-300 mb-4">
                            <i data-lucide="alert-triangle" class="w-3 h-3 mt-0.5 shrink-0"></i>
                            ${data.warning}
                        </div>
                        <button onclick="document.getElementById('age-specific-tips').classList.add('closing'); setTimeout(()=>document.getElementById('age-specific-tips').classList.add('hidden'), 400);" class="w-full py-2 bg-scout-600 hover:bg-scout-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-scout-900/20 flex items-center justify-center gap-2 group"><i data-lucide="check-circle" class="w-3 h-3 group-hover:scale-110 transition-transform"></i> Okudum, Anladım</button>
                    </div>
                </div>
            `;
            tipsBox.className = "bg-dark-950 border border-scout-500/30 rounded-2xl p-5 mb-4 tips-container relative overflow-hidden";
            tipsBox.classList.remove('hidden');
            if(typeof lucide !== 'undefined') lucide.createIcons();
        } else {
            tipsBox.classList.add('hidden'); 
        }
    }
};

ScoutApp.prototype.calculateAverage = function() {
    const stats = Object.values(this.state.newReport.stats);
    if(stats.length===0) return;
    const avg = Math.round(stats.reduce((a,b)=>a+b,0)/stats.length);
    const grade = this.getGrade(avg);
    const badge = document.getElementById('rep-avg-badge');
    if(badge) { 
        badge.innerText = grade.letter; 
        badge.className = `w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border-2 bg-dark-900 transition-all ${grade.color} ${grade.border} ${grade.shadow}`; 
    }
};

ScoutApp.prototype.updateRadarChart = function() {
    if (!this.reportRadarChart) return;
    let labels = [], data = [];
    const pos = this.state.newReport.position;
    const mapping = POSITION_MAPPING[pos] || { group: 'Default' };
    const attributeGroup = ATTRIBUTE_GROUPS[mapping.group];

    // FIX: Kategori bazlı ortalama al
    if (mapping.group !== 'Default') {
        labels = Object.keys(attributeGroup);
        data = labels.map(cat => {
            const attrs = attributeGroup[cat];
            let sum = 0;
            let count = 0;
            attrs.forEach(attrObj => {
                const val = this.state.newReport.stats[attrObj.name] || 50;
                sum += parseInt(val);
                count++;
            });
            return count > 0 ? Math.round(sum / count) : 50;
        });
    } else {
        const s = attributeGroup['Genel']; 
        labels = s.map(x => x.name); 
        data = s.map(a => this.state.newReport.stats[a.name] || 50);
    }
    this.reportRadarChart.updateOptions({ xaxis: { categories: labels } });
    this.reportRadarChart.updateSeries([{ data: data }]);
};

// 3. KAYIT
ScoutApp.prototype.submitReport = function() {
    const r = this.state.newReport;
    if(!r.name || !r.teamId) return alert("İsim ve Takım zorunlu.");
    if(!r.birthDate) return alert("Doğum tarihi giriniz.");

    const stats = Object.values(r.stats);
    const avg = stats.length > 0 ? Math.round(stats.reduce((a,b)=>a+b,0)/stats.length) : 50;
    const teamIdInt = parseInt(r.teamId);
    const reportDate = new Date().toLocaleDateString('tr-TR');
    
    // Geçmiş Kaydı Oluştur
    const historyEntry = { date: reportDate, rating: avg, stats: {...r.stats}, potential: r.potential };

    this.state.data.players.push({
        id: Date.now(),
        ...r,
        teamId: teamIdInt,
        rating: avg,
        status: 'Scouted',
        dateAdded: reportDate,
        socialNotes: [],
        history: [historyEntry],
        videos: []
    });

    this.saveData(); // KAYIT

    this.state.newReport = this.resetReport();
    this.navigate('players');
};

ScoutApp.prototype.initReportRadar = function(labels = [], data = []) {
    const chartEl = document.querySelector("#report-radar");
    if (!chartEl) return;
    if(this.reportRadarChart) this.reportRadarChart.destroy();
    const options = {
        series: [{ name: 'Analiz', data: data }],
        chart: { height: 300, type: 'radar', toolbar: { show: false }, background: 'transparent', animations: { enabled: true } },
        labels: labels,
        stroke: { width: 2, colors: ['#22c55e'] },
        fill: { opacity: 0.2, colors: ['#22c55e'] },
        markers: { size: 3, colors: ['#22c55e'], hover: { size: 5 } },
        yaxis: { show: false, min: 0, max: 100 },
        xaxis: { categories: labels, labels: { style: { colors: ['#94a3b8', '#94a3b8', '#94a3b8', '#94a3b8', '#94a3b8', '#94a3b8'], fontSize: '11px', fontFamily: 'Inter' } } },
        theme: { mode: 'dark' },
        grid: { show: true, borderColor: '#334155', strokeDashArray: 4 }
    };
    this.reportRadarChart = new ApexCharts(chartEl, options);
    this.reportRadarChart.render();
};