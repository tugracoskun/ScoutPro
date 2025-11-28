// --- YENİ RAPORLAMA MODÜLÜ (V3.6 - Real Time Age) ---

ScoutApp.prototype.renderNewReport = function(c) {
    const teams = this.state.data.teams.map(t=>({val:t.id, txt:t.name}));
    const currentPos = this.state.newReport.position;

    c.innerHTML = `
        <div class="max-w-6xl mx-auto fade-in grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- SOL KOLON -->
            <div class="lg:col-span-4 space-y-6">
                <div class="bg-dark-900 p-6 rounded-2xl border border-dark-800 space-y-4">
                    <h3 class="text-lg font-bold text-white mb-4 flex gap-2"><i data-lucide="user" class="text-scout-400 w-5 h-5"></i> Kimlik</h3>
                    
                    ${this.createInput('rep-name', 'Adı Soyadı', 'Örn: Semih', 'text', this.state.newReport.name, "app.updateRep('name', this.value)")}
                    
                    ${teams.length > 0 
                        ? this.createSelect('rep-team', 'Takım', teams, this.state.newReport.teamId, "app.updateRep('teamId', this.value)") 
                        : '<div class="p-3 bg-red-900/20 border border-red-900/50 rounded text-red-400 text-xs">Önce Veritabanından Takım Ekleyiniz!</div>'}
                    
                    <!-- DOĞUM TARİHİ VE MEVKİ -->
                    <div class="grid grid-cols-2 gap-4">
                        ${this.createSelect('rep-pos', 'Mevki', POSITIONS.map(p=>({val:p, txt:p})), currentPos, 'app.handlePositionChange(this.value)')}
                        
                        <!-- YENİ: Date Input -->
                        <div class="flex flex-col gap-1.5 relative z-10">
                            <label class="text-xs font-bold text-slate-400 ml-1 flex justify-between">
                                Doğum Tarihi
                                <span id="calculated-age-display" class="text-scout-400 font-mono"></span>
                            </label>
                            <input 
                                type="date" 
                                id="rep-birth" 
                                value="${this.state.newReport.birthDate || ''}" 
                                onchange="app.updateBirthDate(this.value)"
                                class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-scout-500 outline-none transition-all text-sm relative z-20"
                            >
                        </div>
                    </div>

                    <!-- BOY VE AYAK -->
                    <div class="grid grid-cols-2 gap-4">
                        ${this.createInput('rep-height', 'Boy (cm)', '185', 'number', this.state.newReport.height, "app.updateRep('height', this.value)")}
                        ${this.createSelect('rep-foot', 'Kullandığı Ayak', [{val:'Sağ', txt:'Sağ'}, {val:'Sol', txt:'Sol'}, {val:'Her İkisi', txt:'Her İkisi'}], this.state.newReport.foot, "app.updateRep('foot', this.value)")}
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-slate-400 ml-1">Potansiyel Durumu</label>
                        <div class="relative">
                            <select onchange="app.updateRep('potential', this.value)" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-scout-500 outline-none appearance-none text-sm">
                                <option value="Düşük" ${this.state.newReport.potential === 'Düşük' ? 'selected' : ''}>Düşük (Standart)</option>
                                <option value="Yüksek" ${this.state.newReport.potential === 'Yüksek' ? 'selected' : ''}>Yüksek (Gelişime Açık)</option>
                            </select>
                            <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"><i data-lucide="chevron-down" class="w-4 h-4"></i></div>
                        </div>
                    </div>

                    ${this.createInput('rep-source', 'Keşif Kaynağı', 'Örn: Altyapı', 'text', this.state.newReport.source, "app.updateRep('source', this.value)")}
                </div>
                
                <div class="bg-dark-900 p-6 rounded-2xl border border-dark-800 space-y-4">
                    <h3 class="text-lg font-bold text-white mb-4 flex gap-2"><i data-lucide="link" class="text-scout-400 w-5 h-5"></i> Bağlantılar</h3>
                    ${this.createInput('rep-tm', 'Transfermarkt URL', 'https://...', 'text', this.state.newReport.tmUrl, "app.updateRep('tmUrl', this.value)")}
                    ${this.createInput('rep-sofa', 'Sofascore URL', 'https://...', 'text', this.state.newReport.sofaUrl, "app.updateRep('sofaUrl', this.value)")}
                </div>
                
                <div class="bg-dark-900 p-6 rounded-2xl border border-dark-800">
                    <h3 class="text-lg font-bold text-white mb-4 flex gap-2"><i data-lucide="image" class="text-scout-400 w-5 h-5"></i> Medya (Fotoğraf)</h3>
                    ${this.createInput('rep-img', 'Foto URL', 'https://...', 'text', this.state.newReport.image, "app.updateRep('image', this.value)")}
                </div>
            </div>

            <!-- SAĞ KOLON -->
            <div class="lg:col-span-8 bg-dark-900 p-8 rounded-2xl border border-dark-800 flex flex-col h-full relative overflow-hidden">
                <div class="flex justify-between items-center sticky top-0 bg-dark-900 z-50 py-4 border-b border-dark-800/50 mb-4">
                    <h3 class="text-xl font-bold text-white">Yetenek Analizi</h3>
                    <div class="bg-dark-950 px-4 py-2 rounded-lg border border-dark-800 flex items-center gap-3">
                        <span class="text-slate-400 text-sm">Genel Puan:</span>
                        <div id="rep-avg-badge" class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 bg-dark-900 text-slate-500 border-slate-700">-</div>
                    </div>
                </div>
                
                <div id="attribute-container" class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-8 max-h-[600px] overflow-y-auto custom-scrollbar pr-2 pb-4">
                    <div class="text-slate-500 text-sm text-center col-span-2 py-10 italic">Lütfen sol taraftan bir mevki seçiniz...</div>
                </div>

                <div class="mt-auto border-t border-dark-800 pt-6 z-40 relative bg-dark-900">
                     <div id="report-radar" class="w-full h-72 flex justify-center"></div>
                     <button onclick="app.submitReport()" class="w-full mt-6 py-4 bg-scout-600 hover:bg-scout-500 text-white font-bold rounded-xl shadow-lg shadow-scout-500/20 flex items-center justify-center gap-2 transition-all">
                        <i data-lucide="save" class="w-5 h-5"></i> Oyuncuyu Havuza Ekle
                     </button>
                </div>
            </div>
        </div>
    `;
    
    lucide.createIcons();

    // Eğer daha önce girilmiş bir tarih varsa yaşını hesapla göster
    if(this.state.newReport.birthDate) {
        this.updateBirthDate(this.state.newReport.birthDate);
    }

    if (currentPos) {
        this.handlePositionChange(currentPos, false); 
    } else {
        this.initReportRadar([], []);
    }
};

// YENİ: Tarih girilince yaşı hesaplayıp gösteren fonksiyon
ScoutApp.prototype.updateBirthDate = function(val) {
    this.state.newReport.birthDate = val;
    const age = this.calculateAge(val);
    const display = document.getElementById('calculated-age-display');
    if(display) {
        display.innerText = `(${age} Yaş)`;
    }
};

// --- DİĞER FONKSİYONLAR AYNI (Players-Report.js devamı) ---
// (Kopyala-yapıştır kolaylığı için dosyanın geri kalanını da ekliyorum)

ScoutApp.prototype.handlePositionChange = function(pos, resetStats = true) {
    this.state.newReport.position = pos;
    const set = (pos === 'Kaleci') ? ATTRIBUTE_SETS['Kaleci'] : ATTRIBUTE_SETS['Default'];
    if (resetStats) {
        this.state.newReport.stats = {};
        if (pos === 'Kaleci') Object.keys(set).forEach(cat => set[cat].forEach(attr => this.state.newReport.stats[attr] = 50));
        else set['Genel'].forEach(attr => this.state.newReport.stats[attr] = 50);
    }
    this.renderAttributeInputs(set);
    this.updateRadarChart();
    this.calculateAverage();
};

ScoutApp.prototype.renderAttributeInputs = function(set) {
    const container = document.getElementById('attribute-container');
    if (!container) return;
    let html = '';
    if (Object.keys(set).length > 1 && !set['Genel']) {
        Object.keys(set).forEach(cat => {
            const clr = {'Teknik':'text-red-400','Fiziksel':'text-yellow-400','Psikolojik':'text-green-400','Sosyolojik':'text-blue-400'}[cat] || 'text-white';
            html += `<div class="col-span-1 md:col-span-2 mt-4 mb-2 pb-1 border-b border-dark-800 font-bold text-sm uppercase tracking-wider ${clr}">${cat}</div>`;
            set[cat].forEach(attr => { html += this.createSlider(attr, attr, this.state.newReport.stats[attr]||50); });
        });
    } else {
        set['Genel'].forEach(attr => { html += this.createSlider(attr, attr, this.state.newReport.stats[attr]||50); });
    }
    container.innerHTML = html;
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

ScoutApp.prototype.calculateAverage = function() {
    const stats = Object.values(this.state.newReport.stats);
    if(stats.length===0) return;
    const avg = Math.round(stats.reduce((a,b)=>a+b,0)/stats.length);
    const grade = this.getGrade(avg);
    const badge = document.getElementById('rep-avg-badge');
    if(badge) { badge.innerText = grade.letter; badge.className = `w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border-2 bg-dark-900 transition-all ${grade.color} ${grade.border} ${grade.shadow}`; }
};

ScoutApp.prototype.updateRadarChart = function() {
    if (!this.reportRadarChart) {
        const labels = Object.keys(this.state.newReport.stats).length > 0 ? Object.keys(this.state.newReport.stats) : [];
        const data = Object.values(this.state.newReport.stats);
        this.initReportRadar(labels, data);
        return;
    }
    let labels = [], data = [];
    const pos = this.state.newReport.position;
    const set = (pos === 'Kaleci') ? ATTRIBUTE_SETS['Kaleci'] : ATTRIBUTE_SETS['Default'];
    if (pos === 'Kaleci') {
        labels = Object.keys(set);
        data = labels.map(cat => { const attrs = set[cat]; let sum = 0; attrs.forEach(a => sum += (this.state.newReport.stats[a] || 50)); return Math.round(sum / attrs.length); });
    } else {
        const s = set['Genel']; labels = s; data = s.map(a => this.state.newReport.stats[a] || 50);
    }
    this.reportRadarChart.updateOptions({ xaxis: { categories: labels } });
    this.reportRadarChart.updateSeries([{ data: data }]);
};

// --- KAYIT İŞLEMİ (GÜNCELLENDİ: birthDate) ---

ScoutApp.prototype.submitReport = function() {
    const r = this.state.newReport;
    if(!r.name || !r.teamId) return alert("İsim ve Takım zorunlu.");
    
    // Yaş kontrolü artık Tarih üzerinden yapılıyor, gerekirse buraya tarih dolu mu kontrolü ekleyebiliriz
    if(!r.birthDate) return alert("Doğum tarihi giriniz.");

    const stats = Object.values(r.stats);
    const avg = stats.length > 0 ? Math.round(stats.reduce((a,b)=>a+b,0)/stats.length) : 50;
    const teamIdInt = parseInt(r.teamId);
    const reportDate = new Date().toLocaleDateString('tr-TR');
    
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
        labels: labels, stroke: { width: 2, colors: ['#22c55e'] }, fill: { opacity: 0.2, colors: ['#22c55e'] },
        markers: { size: 3, colors: ['#22c55e'], hover: { size: 5 } },
        yaxis: { show: false, min: 0, max: 100 },
        xaxis: { categories: labels, labels: { style: { colors: ['#94a3b8', '#94a3b8', '#94a3b8', '#94a3b8', '#94a3b8', '#94a3b8'], fontSize: '11px', fontFamily: 'Inter' } } },
        theme: { mode: 'dark' },
        grid: { show: true, borderColor: '#334155', strokeDashArray: 4 }
    };
    this.reportRadarChart = new ApexCharts(chartEl, options);
    this.reportRadarChart.render();
};