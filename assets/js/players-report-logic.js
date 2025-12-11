// --- YENİ RAPORLAMA: İŞ MANTIĞI VE KAYIT ---

ScoutApp.prototype.handlePositionChange = function(pos, resetStats = true) {
    this.state.newReport.position = pos;

    const mapping = POSITION_MAPPING[pos] || { group: 'Default', weightKey: null };
    const attributeGroup = ATTRIBUTE_GROUPS[mapping.group];
    
    if (resetStats) {
        this.state.newReport.stats = {};
        if (mapping.group === 'Default') {
             attributeGroup['Genel'].forEach(attr => this.state.newReport.stats[attr.name] = 50);
        } else {
             Object.keys(attributeGroup).forEach(category => {
                 attributeGroup[category].forEach(attr => this.state.newReport.stats[attr.name] = 50);
             });
        }
    }

    this.renderAttributeInputs(attributeGroup, mapping.weightKey);
    this.updateRadarChart();
    this.calculateAverage();
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

    // YAŞA GÖRE KPI İPUÇLARI (GELİŞMİŞ TASARIM)
    if (tipsBox && AGE_SPECIFIC_KPI) {
        let groupKey = null;
        if (age >= 9 && age <= 12) groupKey = 'U9-U12';
        else if (age >= 13 && age <= 16) groupKey = 'U13-U16';
        else if (age >= 17 && age <= 21) groupKey = 'U17-U21';

        if (groupKey) {
            const data = AGE_SPECIFIC_KPI[groupKey];
            
            // Profesyonel HTML Yapısı
            tipsBox.innerHTML = `
                <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-lg bg-scout-500/20 flex items-center justify-center text-scout-500 shrink-0 mt-1">
                        <i data-lucide="lightbulb" class="w-5 h-5"></i>
                    </div>
                    <div class="flex-1">
                        <h4 class="text-white font-bold text-sm mb-1">${data.title}</h4>
                        <p class="text-xs text-slate-300 italic mb-3 border-l-2 border-scout-500 pl-2">"${data.focus}"</p>
                        
                        <div class="space-y-2 mb-4">
                            ${data.kpis.map(k => `
                                <div class="flex items-start gap-2 text-[11px] text-slate-400">
                                    <span class="mt-1 w-1.5 h-1.5 rounded-full bg-scout-500 shrink-0"></span>
                                    <span>${k}</span>
                                </div>
                            `).join('')}
                        </div>

                        <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-2 flex gap-2 items-start text-[10px] text-red-300 mb-4">
                            <i data-lucide="alert-triangle" class="w-3 h-3 mt-0.5 shrink-0"></i>
                            ${data.warning}
                        </div>

                        <button onclick="document.getElementById('age-specific-tips').classList.add('closing')" 
                            class="w-full py-2 bg-scout-600 hover:bg-scout-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-scout-900/20 flex items-center justify-center gap-2 group">
                            <i data-lucide="check-circle" class="w-3 h-3 group-hover:scale-110 transition-transform"></i>
                            Okudum, Anladım
                        </button>
                    </div>
                </div>
            `;
            
            // Sınıfları ayarla (Animasyon için)
            tipsBox.className = "bg-dark-950 border border-scout-500/30 rounded-2xl p-5 mb-4 tips-container relative overflow-hidden";
            tipsBox.classList.remove('hidden');
            lucide.createIcons();
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
    if(badge) { badge.innerText = grade.letter; badge.className = `w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border-2 bg-dark-900 transition-all ${grade.color} ${grade.border} ${grade.shadow}`; }
};

ScoutApp.prototype.updateRadarChart = function() {
    if (!this.reportRadarChart) return;
    let labels = [], data = [];
    const pos = this.state.newReport.position;
    const mapping = POSITION_MAPPING[pos] || { group: 'Default' };
    const attributeGroup = ATTRIBUTE_GROUPS[mapping.group];

    // Kategorili veri ise ortalamaları al
    if (mapping.group !== 'Default') {
        labels = Object.keys(attributeGroup);
        data = labels.map(cat => {
            const attrs = attributeGroup[cat];
            let sum = 0;
            attrs.forEach(a => sum += (this.state.newReport.stats[a.name] || 50));
            return Math.round(sum / attrs.length);
        });
    } else {
        const s = attributeGroup['Genel']; 
        labels = s.map(x => x.name); 
        data = s.map(a => this.state.newReport.stats[a.name] || 50);
    }
    this.reportRadarChart.updateOptions({ xaxis: { categories: labels } });
    this.reportRadarChart.updateSeries([{ data: data }]);
};

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