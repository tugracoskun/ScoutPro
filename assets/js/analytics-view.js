// --- YENİ EKLENEN: OYUNCU VERİ ANALİZ MERKEZİ (DATA HUB / SCATTER PLOT) ---

ScoutApp.prototype.renderAnalytics = function(c) {
    if (!this.state.analyticsFilter) {
        this.state.analyticsFilter = { pos: '', xAxis: '', yAxis: '', quadrant: true };
    }

    let posOptions = `<option value="">-- ${t('dh_select_pos')} --</option>`;
    POSITIONS.forEach(p => {
        const sel = (this.state.analyticsFilter.pos === p) ? 'selected' : '';
        posOptions += `<option value="${p}" ${sel}>${window.tPos ? window.tPos(p) : p}</option>`;
    });

    c.innerHTML = `
        <div class="max-w-6xl mx-auto fade-in h-full flex flex-col">
            <!-- Header & Filters -->
            <div class="bg-dark-900 p-6 rounded-2xl border border-dark-800 mb-6 shrink-0 flex flex-col md:flex-row gap-4 items-end">
                <div class="flex-1 w-full">
                    <label class="text-xs font-bold text-slate-400 ml-1 mb-1.5 block">${t('dh_select_pos')}</label>
                    <div class="relative">
                        <select id="analytics-pos" onchange="app.updateAnalyticsPos(this.value)" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-scout-500 outline-none appearance-none text-sm cursor-pointer">
                            ${posOptions}
                        </select>
                        <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"><i data-lucide="chevron-down" class="w-4 h-4"></i></div>
                    </div>
                </div>
                <div class="flex-1 w-full">
                    <label class="text-xs font-bold text-slate-400 ml-1 mb-1.5 block">${t('dh_x_axis')}</label>
                    <div class="relative">
                        <select id="analytics-x" onchange="app.updateAnalyticsFilter('xAxis', this.value)" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-scout-500 outline-none appearance-none text-sm cursor-pointer disabled:opacity-50" ${!this.state.analyticsFilter.pos ? 'disabled' : ''}>
                        </select>
                        <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"><i data-lucide="chevron-down" class="w-4 h-4"></i></div>
                    </div>
                </div>
                <div class="flex-1 w-full">
                    <label class="text-xs font-bold text-slate-400 ml-1 mb-1.5 block">${t('dh_y_axis')}</label>
                    <div class="relative">
                        <select id="analytics-y" onchange="app.updateAnalyticsFilter('yAxis', this.value)" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-scout-500 outline-none appearance-none text-sm cursor-pointer disabled:opacity-50" ${!this.state.analyticsFilter.pos ? 'disabled' : ''}>
                        </select>
                        <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"><i data-lucide="chevron-down" class="w-4 h-4"></i></div>
                    </div>
                </div>
                <div class="flex flex-col">
                    <label class="text-xs font-bold text-transparent ml-1 mb-1.5 block hidden md:block">&nbsp;</label>
                    <div class="h-[46px] flex items-center">
                        <label class="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white transition-colors">
                            <input type="checkbox" id="analytics-quadrant-toggle" onchange="app.updateAnalyticsFilter('quadrant', this.checked)" class="w-4 h-4 rounded border-dark-600 text-scout-500 focus:ring-scout-500 bg-dark-950" ${this.state.analyticsFilter.quadrant ? 'checked' : ''}>
                            4'lü Görünüm
                        </label>
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

    let options = [];
    if (groupData) {
        if (groupData['Genel']) {
            options = groupData['Genel'].map(a => a.name);
        } else {
            Object.values(groupData).forEach(cat => {
                cat.forEach(a => options.push(a.name));
            });
        }
    }

    let html = '';
    options.forEach(opt => {
        const optLabel = window.tAttr ? window.tAttr(opt) : opt;
        html += `<option value="${opt}">${optLabel}</option>`;
    });

    const xSelect = document.getElementById('analytics-x');
    const ySelect = document.getElementById('analytics-y');

    xSelect.innerHTML = html;
    ySelect.innerHTML = html;

    // Set defaults if possible (1st and 2nd items)
    if (options.length > 0) {
        if (!this.state.analyticsFilter.xAxis || !options.includes(this.state.analyticsFilter.xAxis)) {
            this.state.analyticsFilter.xAxis = options[0];
        }
        if (!this.state.analyticsFilter.yAxis || !options.includes(this.state.analyticsFilter.yAxis)) {
            this.state.analyticsFilter.yAxis = options.length > 1 ? options[1] : options[0];
        }
    }

    xSelect.value = this.state.analyticsFilter.xAxis;
    ySelect.value = this.state.analyticsFilter.yAxis;
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

    // Sadece raporlanmış ve bu pozisyondaki oyuncuları al
    const players = this.state.data.players.filter(p => p.position === pos && p.stats);

    if (players.length === 0) {
        chartArea.innerHTML = `<div class="w-full h-full flex items-center justify-center text-slate-500 font-medium">${t('dh_no_players')}</div>`;
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
                    x: parseFloat(avgX),
                    borderColor: '#4ade80',
                    strokeDashArray: 4,
                    label: {
                        borderColor: '#4ade80',
                        style: { color: '#fff', background: '#22c55e', padding: { left: 5, right: 5, top: 2, bottom: 2 } },
                        text: `Ort: ${avgX}`
                    }
                }
            ],
            yaxis: [
                {
                    y: parseFloat(avgY),
                    borderColor: '#4ade80',
                    strokeDashArray: 4,
                    label: {
                        borderColor: '#4ade80',
                        style: { color: '#fff', background: '#22c55e', padding: { left: 5, right: 5, top: 2, bottom: 2 } },
                        text: `Ort: ${avgY}`
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
                            <span class="text-slate-500">${xAxisLabel}:</span> <span class="font-mono text-scout-400 text-right font-bold">${data.x}</span>
                            <span class="text-slate-500">${yAxisLabel}:</span> <span class="font-mono text-scout-400 text-right font-bold">${data.y}</span>
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
            <div class="absolute top-16 left-16 text-[10px] sm:text-[11px] font-bold text-orange-400 max-w-[120px] sm:max-w-none">Düşük ${xAxisLabel}<br>Yüksek ${yAxisLabel}</div>
            <div class="absolute top-16 right-16 text-[10px] sm:text-[11px] font-bold text-green-400 text-right max-w-[120px] sm:max-w-none">Yüksek ${xAxisLabel}<br>Yüksek ${yAxisLabel}</div>
            <div class="absolute bottom-16 left-16 text-[10px] sm:text-[11px] font-bold text-red-500 max-w-[120px] sm:max-w-none">Düşük ${xAxisLabel}<br>Düşük ${yAxisLabel}</div>
            <div class="absolute bottom-16 right-16 text-[10px] sm:text-[11px] font-bold text-orange-400 text-right max-w-[120px] sm:max-w-none">Yüksek ${xAxisLabel}<br>Düşük ${yAxisLabel}</div>
        `;
        overlayDiv.classList.remove('hidden');
    } else {
        overlayDiv.classList.add('hidden');
    }
    
    if(typeof lucide !== 'undefined') lucide.createIcons();
};
