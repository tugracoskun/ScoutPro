// --- YENİ EKLENEN: OYUNCU VERİ ANALİZ MERKEZİ (DATA HUB / SCATTER PLOT) ---

ScoutApp.prototype.renderAnalytics = function(c) {
    if (!this.state.analyticsFilter) {
        this.state.analyticsFilter = { pos: '', xAxis: '', yAxis: '', quadrant: true, minAge: 15, maxAge: 40, potential: 'all' };
    }
    if (this.state.analyticsFilter.minAge === undefined) this.state.analyticsFilter.minAge = 15;
    if (this.state.analyticsFilter.maxAge === undefined) this.state.analyticsFilter.maxAge = 40;
    if (!this.state.analyticsFilter.potential) this.state.analyticsFilter.potential = 'all';

    let posOptions = `<option value="">-- ${t('dh_select_pos')} --</option>`;
    POSITIONS.forEach(p => {
        const sel = (this.state.analyticsFilter.pos === p) ? 'selected' : '';
        posOptions += `<option value="${p}" ${sel}>${window.tPos ? window.tPos(p) : p}</option>`;
    });

    c.innerHTML = `
        <div class="max-w-6xl mx-auto fade-in h-full flex flex-col space-y-4">
            <!-- Header & Filters (Kompakt ve Akıcı Tasarım) -->
            <div class="bg-dark-900 p-4 rounded-2xl border border-dark-800 shrink-0 space-y-3">
                <!-- Üst Satır: Pozisyon, X Ekseni, Y Ekseni, 4'lü Görünüm Butonu -->
                <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <div class="md:col-span-3">
                        <label class="text-[11px] font-bold text-slate-400 ml-1 mb-1 block">${t('dh_select_pos')}</label>
                        <div class="relative">
                            <select id="analytics-pos" onchange="app.updateAnalyticsPos(this.value)" class="w-full bg-dark-950 border border-dark-700 rounded-xl pl-3 pr-8 py-2 text-white focus:border-scout-500 outline-none appearance-none text-xs cursor-pointer">
                                ${posOptions}
                            </select>
                            <div class="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"><i data-lucide="chevron-down" class="w-3.5 h-3.5"></i></div>
                        </div>
                    </div>
                    
                    <div class="md:col-span-3">
                        <label class="text-[11px] font-bold text-slate-400 ml-1 mb-1 block">${t('dh_x_axis')}</label>
                        <div class="relative">
                            <select id="analytics-x" onchange="app.updateAnalyticsFilter('xAxis', this.value)" class="w-full bg-dark-950 border border-dark-700 rounded-xl pl-3 pr-8 py-2 text-white focus:border-scout-500 outline-none appearance-none text-xs cursor-pointer disabled:opacity-50" ${!this.state.analyticsFilter.pos ? 'disabled' : ''}>
                            </select>
                            <div class="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"><i data-lucide="chevron-down" class="w-3.5 h-3.5"></i></div>
                        </div>
                    </div>
                    
                    <div class="md:col-span-3">
                        <label class="text-[11px] font-bold text-slate-400 ml-1 mb-1 block">${t('dh_y_axis')}</label>
                        <div class="relative">
                            <select id="analytics-y" onchange="app.updateAnalyticsFilter('yAxis', this.value)" class="w-full bg-dark-950 border border-dark-700 rounded-xl pl-3 pr-8 py-2 text-white focus:border-scout-500 outline-none appearance-none text-xs cursor-pointer disabled:opacity-50" ${!this.state.analyticsFilter.pos ? 'disabled' : ''}>
                            </select>
                            <div class="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"><i data-lucide="chevron-down" class="w-3.5 h-3.5"></i></div>
                        </div>
                    </div>

                    <div class="md:col-span-3 pt-5">
                        <button onclick="app.toggleAnalyticsQuadrant()" class="w-full py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${this.state.analyticsFilter.quadrant ? 'bg-scout-500/10 border-scout-500/50 text-scout-400 shadow-sm' : 'bg-dark-950 border-dark-700 text-slate-400 hover:text-white'}">
                            <i data-lucide="grid" class="w-3.5 h-3.5"></i>
                            <span>4'lü Matris Görünümü</span>
                            <span class="w-2 h-2 rounded-full ${this.state.analyticsFilter.quadrant ? 'bg-scout-500 animate-pulse' : 'bg-slate-600'}"></span>
                        </button>
                    </div>
                </div>

                <!-- Alt Satır: Yaş Slider & Potansiyel Seçimi (Kompakt Strip) -->
                <div class="pt-2.5 border-t border-dark-800/60 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                    <!-- Yaş Aralığı Slider -->
                    <div class="flex items-center gap-3 w-full md:w-auto flex-1 bg-dark-950/60 px-3 py-1.5 rounded-xl border border-dark-800">
                        <div class="flex items-center gap-1.5 text-slate-400 font-bold shrink-0 text-[11px]">
                            <i data-lucide="users" class="w-3.5 h-3.5 text-scout-400"></i>
                            Yaş:
                        </div>
                        <div class="flex items-center gap-2 flex-1">
                            <span class="text-[11px] text-scout-400 font-mono font-bold w-4 text-right" id="age-min-label">${this.state.analyticsFilter.minAge}</span>
                            <input type="range" min="15" max="40" value="${this.state.analyticsFilter.minAge}" oninput="app.updateAnalyticsAgeMin(this.value)" class="w-full accent-scout-500 cursor-pointer h-1.5 bg-dark-800 rounded-lg">
                            <span class="text-slate-600 font-mono">-</span>
                            <input type="range" min="15" max="40" value="${this.state.analyticsFilter.maxAge}" oninput="app.updateAnalyticsAgeMax(this.value)" class="w-full accent-scout-500 cursor-pointer h-1.5 bg-dark-800 rounded-lg">
                            <span class="text-[11px] text-scout-400 font-mono font-bold w-4" id="age-max-label">${this.state.analyticsFilter.maxAge}</span>
                        </div>
                    </div>

                    <!-- Potansiyel Seçici -->
                    <div class="flex items-center gap-2.5 w-full md:w-auto bg-dark-950/60 px-3 py-1.5 rounded-xl border border-dark-800 shrink-0">
                        <div class="flex items-center gap-1.5 text-slate-400 font-bold text-[11px] shrink-0">
                            <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-400"></i>
                            Potansiyel:
                        </div>
                        <select onchange="app.updateAnalyticsFilter('potential', this.value)" class="bg-transparent text-white text-xs font-medium outline-none cursor-pointer pr-2">
                            <option value="all" class="bg-dark-900" ${this.state.analyticsFilter.potential === 'all' ? 'selected' : ''}>Tümü</option>
                            <option value="Yüksek" class="bg-dark-900" ${this.state.analyticsFilter.potential === 'Yüksek' ? 'selected' : ''}>Yüksek Potansiyel</option>
                            <option value="Düşük" class="bg-dark-900" ${this.state.analyticsFilter.potential === 'Düşük' ? 'selected' : ''}>Düşük Potansiyel</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Main Area -->
            <div class="flex-1 bg-dark-900 border border-dark-800 rounded-2xl p-6 relative flex flex-col min-h-[500px]">
                <h3 class="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1"><i data-lucide="scatter-chart" class="w-3.5 h-3.5"></i> ${t('analysis_graph')}</h3>
                
                <div id="analytics-empty-state" class="absolute inset-0 flex flex-col items-center justify-center text-slate-500 ${this.state.analyticsFilter.pos ? 'hidden' : 'flex'}">
                    <i data-lucide="line-chart" class="w-16 h-16 mb-4 opacity-20"></i>
                    <p class="text-sm font-medium text-slate-400">${t('dh_empty_state')}</p>
                </div>
                
                <!-- Global Styles for Analytics Chart -->
                <style>
                    #analytics-chart .apexcharts-toolbar {
                        flex-direction: column !important;
                        top: 50% !important;
                        transform: translateY(-50%) !important;
                        right: -16px !important;
                        background: rgba(15, 23, 42, 0.7) !important;
                        border-radius: 8px !important;
                        padding: 4px !important;
                        border: 1px solid rgba(51, 65, 85, 0.5) !important;
                        display: flex !important;
                    }
                    #analytics-chart .apexcharts-toolbar > div {
                        margin: 4px 0 !important;
                    }
                </style>

                <div id="analytics-chart" class="flex-1 w-full h-full ${this.state.analyticsFilter.pos ? 'block' : 'hidden'} relative">
                </div>

                <div id="analytics-quadrant-labels" class="absolute inset-0 pointer-events-none hidden z-10" style="padding: 3rem 2rem 3rem 4rem;">
                    <!-- Labels will be injected here -->
                </div>
            </div>
        </div>
    `;

    lucide.createIcons();

    if (this.state.analyticsFilter.pos) {
        this.populateAnalyticsDropdowns();
        setTimeout(() => this.drawAnalyticsChart(), 100);
    }
};

ScoutApp.prototype.updateAnalyticsPos = function(val) {
    this.state.analyticsFilter.pos = val;
    this.state.analyticsFilter.xAxis = '';
    this.state.analyticsFilter.yAxis = '';
    
    const xSelect = document.getElementById('analytics-x');
    const ySelect = document.getElementById('analytics-y');
    
    if (!val) {
        xSelect.disabled = true;
        ySelect.disabled = true;
        document.getElementById('analytics-chart').classList.add('hidden');
        document.getElementById('analytics-quadrant-labels').classList.add('hidden');
        document.getElementById('analytics-empty-state').classList.remove('hidden');
        document.getElementById('analytics-empty-state').classList.add('flex');
    } else {
        xSelect.disabled = false;
        ySelect.disabled = false;
        this.populateAnalyticsDropdowns();
        
        setTimeout(() => this.drawAnalyticsChart(), 100);
    }
};

ScoutApp.prototype.populateAnalyticsDropdowns = function() {
    const pos = this.state.analyticsFilter.pos;
    if (!pos) return;

    const mapping = typeof POSITION_MAPPING !== 'undefined' && POSITION_MAPPING[pos] ? POSITION_MAPPING[pos] : { group: 'Default' };
    const groupData = typeof ATTRIBUTE_GROUPS !== 'undefined' ? ATTRIBUTE_GROUPS[mapping.group] : null;

    let html = '';
    let allOptions = [];

    if (groupData) {
        if (groupData['Genel']) {
            allOptions = groupData['Genel'].map(a => a.name);
            allOptions.forEach(opt => {
                const optLabel = window.tAttr ? window.tAttr(opt) : opt;
                html += `<option value="${opt}">${optLabel}</option>`;
            });
        } else {
            Object.entries(groupData).forEach(([catKey, attrList]) => {
                const catLabel = (window.tCat ? window.tCat(catKey) : (window.tAttr ? window.tAttr(catKey) : catKey)).toUpperCase();
                // Ortalı ve şık görünmesi için tire ile ortalama padding
                const paddedLabel = `─────────  ${catLabel}  ─────────`;
                html += `<optgroup label="${paddedLabel}" class="bg-dark-900 text-scout-400 font-bold text-center">`;
                attrList.forEach(a => {
                    allOptions.push(a.name);
                    const optLabel = window.tAttr ? window.tAttr(a.name) : a.name;
                    html += `<option value="${a.name}" class="bg-dark-950 text-white font-normal text-left pl-4">${optLabel}</option>`;
                });
                html += `</optgroup>`;
            });
        }
    }

    const xSelect = document.getElementById('analytics-x');
    const ySelect = document.getElementById('analytics-y');

    xSelect.innerHTML = html;
    ySelect.innerHTML = html;

    // Set defaults if possible (1st and 2nd items)
    if (allOptions.length > 0) {
        if (!this.state.analyticsFilter.xAxis || !allOptions.includes(this.state.analyticsFilter.xAxis)) {
            this.state.analyticsFilter.xAxis = allOptions[0];
        }
        if (!this.state.analyticsFilter.yAxis || !allOptions.includes(this.state.analyticsFilter.yAxis)) {
            this.state.analyticsFilter.yAxis = allOptions.length > 1 ? allOptions[1] : allOptions[0];
        }
    }

    xSelect.value = this.state.analyticsFilter.xAxis;
    ySelect.value = this.state.analyticsFilter.yAxis;
};

ScoutApp.prototype.updateAnalyticsAgeMin = function(val) {
    let min = parseInt(val) || 15;
    if (min > this.state.analyticsFilter.maxAge) min = this.state.analyticsFilter.maxAge;
    this.state.analyticsFilter.minAge = min;
    const label = document.getElementById('age-min-label');
    if (label) label.innerText = min;
    if (this.state.analyticsFilter.pos && this.state.analyticsFilter.xAxis && this.state.analyticsFilter.yAxis) {
        this.drawAnalyticsChart();
    }
};

ScoutApp.prototype.updateAnalyticsAgeMax = function(val) {
    let max = parseInt(val) || 40;
    if (max < this.state.analyticsFilter.minAge) max = this.state.analyticsFilter.minAge;
    this.state.analyticsFilter.maxAge = max;
    const label = document.getElementById('age-max-label');
    if (label) label.innerText = max;
    if (this.state.analyticsFilter.pos && this.state.analyticsFilter.xAxis && this.state.analyticsFilter.yAxis) {
        this.drawAnalyticsChart();
    }
};

ScoutApp.prototype.toggleAnalyticsQuadrant = function() {
    this.state.analyticsFilter.quadrant = !this.state.analyticsFilter.quadrant;
    const contentArea = document.getElementById('content-area');
    if (contentArea && this.state.activePage === 'data-hub') {
        this.renderAnalytics(contentArea);
    }
};

ScoutApp.prototype.updateAnalyticsFilter = function(key, val) {
    this.state.analyticsFilter[key] = val;
    
    // Auto-draw when options change
    if (this.state.analyticsFilter.pos && this.state.analyticsFilter.xAxis && this.state.analyticsFilter.yAxis) {
        this.drawAnalyticsChart();
    }
};

ScoutApp.prototype.drawAnalyticsChart = function() {
    const pos = this.state.analyticsFilter.pos;
    const xAxisAttr = this.state.analyticsFilter.xAxis;
    const yAxisAttr = this.state.analyticsFilter.yAxis;

    const emptyState = document.getElementById('analytics-empty-state');
    const chartArea = document.getElementById('analytics-chart');

    if (!pos || !xAxisAttr || !yAxisAttr) return;

    emptyState.classList.add('hidden');
    emptyState.classList.remove('flex');
    chartArea.classList.remove('hidden');

    // Sadece raporlanmış, pozisyonu uyan, yaş ve potansiyel kriterlerini karşılayan oyuncuları al
    const minAge = this.state.analyticsFilter.minAge || 15;
    const maxAge = this.state.analyticsFilter.maxAge || 40;
    const pot = this.state.analyticsFilter.potential || 'all';

    const players = this.state.data.players.filter(p => {
        if (p.position !== pos || !p.stats) return false;
        const age = parseInt(p.age) || 0;
        if (age && (age < minAge || age > maxAge)) return false;
        if (pot !== 'all' && p.potential !== pot) return false;
        return true;
    });

    if (players.length === 0) {
        chartArea.innerHTML = `<div class="w-full h-full flex flex-col items-center justify-center text-slate-500 font-medium gap-2"><i data-lucide="filter-x" class="w-8 h-8 opacity-40"></i>Kriterlere uyan oyuncu bulunamadı.</div>`;
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    // Data for scatter plot
    let sumX = 0;
    let sumY = 0;
    let validCount = 0;

    const seriesData = players.map(p => {
        const xVal = p.stats[xAxisAttr] || 0;
        const yVal = p.stats[yAxisAttr] || 0;
        
        sumX += xVal;
        sumY += yVal;
        validCount++;

        return {
            x: xVal,
            y: yVal,
            player: p // store full player for tooltip/click
        };
    });

    const avgX = validCount > 0 ? (sumX / validCount).toFixed(2) : 50;
    const avgY = validCount > 0 ? (sumY / validCount).toFixed(2) : 50;

    if (this.analyticsChartInstance) {
        this.analyticsChartInstance.destroy();
    }

    const xAxisLabel = window.tAttr ? window.tAttr(xAxisAttr) : xAxisAttr;
    const yAxisLabel = window.tAttr ? window.tAttr(yAxisAttr) : yAxisAttr;

    const options = {
        series: [{
            name: "Oyuncular",
            data: seriesData
        }],
        chart: {
            height: '100%',
            type: 'scatter',
            toolbar: { 
                show: true,
                tools: {
                    pan: false,
                    reset: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-ccw"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>'
                }
            },
            background: 'transparent',
            animations: { enabled: false },
            zoom: {
                type: 'xy'
            },
            events: {
                markerClick: function(event, chartContext, { seriesIndex, dataPointIndex, config }) {
                    const dataPoint = config.series[seriesIndex].data[dataPointIndex];
                    if (dataPoint && dataPoint.player) {
                        if (window.app) window.app.openPlayerModal(dataPoint.player.id);
                    }
                }
            }
        },
        xaxis: {
            title: { text: xAxisLabel, style: { color: '#94a3b8', fontSize: '12px', fontWeight: 600, fontFamily: 'Inter' } },
            labels: { style: { colors: '#64748b' } },
            min: 0,
            max: 100,
            tickAmount: 10
        },
        yaxis: {
            title: { text: yAxisLabel, style: { color: '#94a3b8', fontSize: '12px', fontWeight: 600, fontFamily: 'Inter' } },
            labels: { style: { colors: '#64748b' } },
            min: 0,
            max: 100,
            tickAmount: 10
        },
        annotations: this.state.analyticsFilter.quadrant ? {
            xaxis: [
                {
                    x: 50,
                    borderColor: '#475569',
                    strokeDashArray: 4,
                    label: {
                        borderColor: '#334155',
                        style: { color: '#94a3b8', background: '#1e293b', padding: { left: 6, right: 6, top: 3, bottom: 3 } },
                        text: `Baraj: 50`
                    }
                }
            ],
            yaxis: [
                {
                    y: 50,
                    borderColor: '#475569',
                    strokeDashArray: 4,
                    label: {
                        borderColor: '#334155',
                        style: { color: '#94a3b8', background: '#1e293b', padding: { left: 6, right: 6, top: 3, bottom: 3 } },
                        text: `Baraj: 50`
                    }
                }
            ]
        } : {},
        grid: {
            borderColor: window.getTheme() === 'light' ? '#e2e8f0' : '#1e293b',
            xaxis: { lines: { show: true } },
            yaxis: { lines: { show: true } },
            padding: {
                bottom: 15,
                left: 15,
                right: 30
            }
        },
        theme: { mode: window.getTheme() },
        markers: {
            size: 8,
            colors: ['#3b82f6'],
            strokeColors: window.getTheme() === 'light' ? '#e2e8f0' : '#1e293b',
            strokeWidth: 2,
            hover: { size: 10 }
        },
        tooltip: {
            theme: window.getTheme(),
            custom: function({series, seriesIndex, dataPointIndex, w}) {
                const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
                const player = data.player;
                const teamName = player.teamId && window.app ? window.app.getTeamName(player.teamId) : '';
                return `
                    <div class="p-3 bg-dark-900 border border-dark-700 shadow-xl rounded-xl">
                        <div class="font-bold text-white mb-1 flex items-center gap-2">
                            ${player.image ? `<img src="${window.app ? window.app.getImageUrl(player.image) : player.image}" class="w-6 h-6 rounded-full object-cover" onerror="this.onerror=null;this.src=window.DEFAULT_AVATAR_DATA_URL">` : `<i data-lucide="user" class="w-4 h-4 text-slate-400"></i>`}
                            ${player.name}
                        </div>
                        <div class="text-[10px] text-slate-400 mb-2">${teamName}</div>
                        <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                            <span class="text-slate-500">${xAxisLabel}:</span> 
                            <span class="font-mono text-right font-bold ${window.app && window.app.getGrade ? window.app.getGrade(data.x).color : 'text-scout-400'}">${data.x}</span>
                            <span class="text-slate-500">${yAxisLabel}:</span> 
                            <span class="font-mono text-right font-bold ${window.app && window.app.getGrade ? window.app.getGrade(data.y).color : 'text-scout-400'}">${data.y}</span>
                        </div>
                    </div>
                `;
            }
        }
    };

    chartArea.innerHTML = '';
    this.analyticsChartInstance = new ApexCharts(chartArea, options);
    this.analyticsChartInstance.render();
    
    // YENİ: HTML Overlays (Quadrant Metinleri)
    const overlayDiv = document.getElementById('analytics-quadrant-labels');
    if (this.state.analyticsFilter.quadrant) {
        overlayDiv.innerHTML = `
            <div class="absolute top-16 left-16 text-[10px] sm:text-[11px] font-bold max-w-[140px] sm:max-w-none leading-relaxed">
                <span class="text-red-500">Düşük ${xAxisLabel}</span><br>
                <span class="text-green-400">Yüksek ${yAxisLabel}</span>
            </div>
            <div class="absolute top-16 right-16 text-[10px] sm:text-[11px] font-bold text-right max-w-[140px] sm:max-w-none leading-relaxed">
                <span class="text-green-400">Yüksek ${xAxisLabel}</span><br>
                <span class="text-green-400">Yüksek ${yAxisLabel}</span>
            </div>
            <div class="absolute bottom-16 left-16 text-[10px] sm:text-[11px] font-bold max-w-[140px] sm:max-w-none leading-relaxed">
                <span class="text-red-500">Düşük ${xAxisLabel}</span><br>
                <span class="text-red-500">Düşük ${yAxisLabel}</span>
            </div>
            <div class="absolute bottom-16 right-16 text-[10px] sm:text-[11px] font-bold text-right max-w-[140px] sm:max-w-none leading-relaxed">
                <span class="text-green-400">Yüksek ${xAxisLabel}</span><br>
                <span class="text-red-500">Düşük ${yAxisLabel}</span>
            </div>
        `;
        overlayDiv.classList.remove('hidden');
    } else {
        overlayDiv.classList.add('hidden');
    }
    
    if(typeof lucide !== 'undefined') lucide.createIcons();
};
