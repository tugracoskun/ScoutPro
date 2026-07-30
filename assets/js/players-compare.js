// --- OYUNCU KARŞILAŞTIRMA MODÜLÜ ---

ScoutApp.prototype.openCompareModal = function() {
    const players = this.state.data.players;
    
    // Player Options for Custom Select
    const allPlayers = players.map(p => {
        const teamName = this.getTeamName(p.teamId) || '';
        return {
            txt: `${p.name} (${p.position}${teamName ? ' - ' + teamName : ''})`,
            val: p.id,
            icon: p.image && (p.image.startsWith('http') || p.image.startsWith('data:image')) ? p.image : null
        };
    });

    this.showModal(`
        <style>
            #modal-content { max-width: 1000px !important; max-height: 90vh !important; overflow-y: auto !important; }
        </style>
        <div class="p-6 md:p-8 relative">
            <button onclick="app.closeModal()" class="absolute top-4 right-4 text-slate-400 hover:bg-dark-800 hover:text-white transition-colors w-8 h-8 rounded-lg flex items-center justify-center"><i data-lucide="x" class="w-5 h-5"></i></button>
            <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <i data-lucide="scale" class="w-6 h-6 text-blue-500"></i>
                ${window.getLang && window.getLang() === 'en' ? 'Player Comparison' : 'Akıllı Oyuncu Karşılaştırma'}
            </h2>
            
            <!-- Player Selectors -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 relative z-50">
                ${this.createCustomSearchSelect('compare-player-1', '1. Oyuncu', 'Oyuncu Ara...', allPlayers, '', 'app.renderComparison()')}
                ${this.createCustomSearchSelect('compare-player-2', '2. Oyuncu', 'Oyuncu Ara...', allPlayers, '', 'app.renderComparison()')}
            </div>

            <!-- Comparison Result Area -->
            <div id="comparison-result" class="hidden gap-6 fade-in relative z-10 flex-col lg:flex-row">
                <!-- Left: Info & Radar -->
                <div class="flex-1 flex flex-col gap-4">
                    <div id="compare-info-cards" class="grid grid-cols-2 gap-4"></div>
                    <div class="bg-dark-950 border border-dark-800 rounded-2xl p-6 h-80 relative flex items-center justify-center">
                        <div id="compare-radar-chart" class="w-full h-full"></div>
                    </div>
                </div>
                
                <!-- Right: Detailed Stats -->
                <div class="flex-1 bg-dark-950 border border-dark-800 rounded-2xl p-5 flex flex-col h-auto">
                    <h3 class="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-dark-800 pb-3">
                        <i data-lucide="bar-chart-2" class="w-4 h-4 text-scout-500"></i>
                        Detaylı Özellikler
                    </h3>
                    <div id="compare-detailed-stats" class="flex-1 flex flex-col gap-6">
                        <!-- Stats will be injected here -->
                    </div>
                </div>
            </div>
            
            <div id="comparison-empty" class="text-center py-12 text-slate-500 border-2 border-dashed border-dark-800 rounded-2xl flex flex-col items-center justify-center gap-3">
                <i data-lucide="users" class="w-10 h-10 text-dark-700"></i>
                <span>Lütfen karşılaştırmak için iki oyuncu seçin.</span>
            </div>
        </div>
    `);
};

ScoutApp.prototype.renderComparison = function() {
    const p1Id = document.getElementById('compare-player-1').value;
    const p2Id = document.getElementById('compare-player-2').value;
    
    if (!p1Id || !p2Id) return;

    const p1 = this.state.data.players.find(p => p.id == p1Id);
    const p2 = this.state.data.players.find(p => p.id == p2Id);
    
    if (!p1 || !p2) return;

    document.getElementById('comparison-empty').classList.add('hidden');
    const resultArea = document.getElementById('comparison-result');
    resultArea.classList.remove('hidden');
    resultArea.classList.add('flex');

    // Info cards rendering
    const infoHtml = `
        <div class="bg-dark-900 border border-dark-800 rounded-xl p-4 flex flex-col items-center text-center relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none"></div>
            <div class="w-16 h-16 rounded-full object-cover mb-3 border-2 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:scale-105 transition-transform overflow-hidden bg-dark-950 flex items-center justify-center">
                ${p1.image ? `<img src="${p1.image}" class="w-full h-full object-cover">` : '<i data-lucide="user" class="text-slate-600"></i>'}
            </div>
            <h3 class="font-bold text-white text-sm">${p1.name}</h3>
            <p class="text-[10px] uppercase font-bold tracking-wider text-blue-400 mt-1">${p1.position}</p>
            <div class="mt-3 bg-dark-950 px-4 py-1.5 rounded-lg border border-dark-700 flex flex-col items-center justify-center shadow-inner">
                <span class="text-[9px] text-slate-500 uppercase tracking-wide">Genel Puan</span>
                <span class="text-xl font-black text-white">${p1.rating || '-'}</span>
            </div>
        </div>
        <div class="bg-dark-900 border border-dark-800 rounded-xl p-4 flex flex-col items-center text-center relative overflow-hidden group hover:border-purple-500/30 transition-colors">
            <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none"></div>
            <div class="w-16 h-16 rounded-full object-cover mb-3 border-2 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)] group-hover:scale-105 transition-transform overflow-hidden bg-dark-950 flex items-center justify-center">
                ${p2.image ? `<img src="${p2.image}" class="w-full h-full object-cover">` : '<i data-lucide="user" class="text-slate-600"></i>'}
            </div>
            <h3 class="font-bold text-white text-sm">${p2.name}</h3>
            <p class="text-[10px] uppercase font-bold tracking-wider text-purple-400 mt-1">${p2.position}</p>
            <div class="mt-3 bg-dark-950 px-4 py-1.5 rounded-lg border border-dark-700 flex flex-col items-center justify-center shadow-inner">
                <span class="text-[9px] text-slate-500 uppercase tracking-wide">Genel Puan</span>
                <span class="text-xl font-black text-white">${p2.rating || '-'}</span>
            </div>
        </div>
    `;
    document.getElementById('compare-info-cards').innerHTML = infoHtml;
    
    // ----------------------------------------------------
    // Detaylı İstatistiklerin (Listesinin) Render Edilmesi
    // ----------------------------------------------------
    const p1Stats = p1.stats || {};
    const p2Stats = p2.stats || {};
    
    // İki oyuncunun sahip olduğu tüm benzersiz özellikleri birleştiriyoruz
    const allStatKeys = Array.from(new Set([...Object.keys(p1Stats), ...Object.keys(p2Stats)]));
    allStatKeys.sort();

    // Kategorileri haritalama
    const categoryMapping = {};
    if (typeof ATTRIBUTE_GROUPS !== 'undefined') {
        Object.values(ATTRIBUTE_GROUPS).forEach(group => {
            if (!group['Genel']) {
                Object.keys(group).forEach(category => {
                    group[category].forEach(attr => {
                        categoryMapping[attr.name] = category;
                    });
                });
            }
        });
    }

    const groupedStats = {
        'Teknik': [],
        'Taktik': [],
        'Fiziksel': [],
        'Psiko-Sosyal': [],
        'Diğer': []
    };

    allStatKeys.forEach(key => {
        const cat = categoryMapping[key] || 'Diğer';
        if (!groupedStats[cat]) groupedStats[cat] = [];
        groupedStats[cat].push(key);
    });

    let detailedHtml = '';
    
    if (allStatKeys.length === 0) {
        detailedHtml = `<div class="text-center text-slate-500 text-xs py-10">Özellik verisi bulunamadı.</div>`;
    } else {
        Object.keys(groupedStats).forEach(category => {
            if (groupedStats[category].length === 0) return;
            
            detailedHtml += `
                <div class="stat-category-group">
                    <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">${category}</h4>
                    <div class="space-y-1 bg-dark-900/50 rounded-xl p-2 border border-dark-800/50">
            `;

            groupedStats[category].forEach(key => {
                const v1Raw = p1Stats[key];
                const v2Raw = p2Stats[key];
                const v1 = parseInt(v1Raw) || 0;
                const v2 = parseInt(v2Raw) || 0;
                
                let c1 = 'text-slate-300';
                let c2 = 'text-slate-300';
                
                if (v1 > v2) {
                    c1 = 'text-blue-400 font-black';
                    c2 = 'text-slate-500';
                } else if (v2 > v1) {
                    c1 = 'text-slate-500';
                    c2 = 'text-purple-400 font-black';
                }

                const val1Str = v1Raw !== undefined ? v1Raw : '-';
                const val2Str = v2Raw !== undefined ? v2Raw : '-';
                
                detailedHtml += `
                    <div class="flex items-center justify-between py-2 px-3 hover:bg-dark-800 rounded-lg transition-colors border-b border-dark-800/50 last:border-0 group">
                        <div class="flex-1 flex justify-end pr-4">
                            <span class="text-sm ${c1}">${val1Str}</span>
                        </div>
                        <div class="w-1/2 text-center text-xs text-slate-400 font-medium truncate group-hover:text-white transition-colors" title="${key}">
                            ${window.tAttr ? window.tAttr(key) : key}
                        </div>
                        <div class="flex-1 flex justify-start pl-4">
                            <span class="text-sm ${c2}">${val2Str}</span>
                        </div>
                    </div>
                `;
            });
            
            detailedHtml += `</div></div>`;
        });
    }
    
    document.getElementById('compare-detailed-stats').innerHTML = detailedHtml;

    // Lucide ikonlarını render et
    if (window.lucide) {
        lucide.createIcons();
    }
    
    // Draw Radar Chart
    this.drawCompareRadar(p1, p2);
};

ScoutApp.prototype.drawCompareRadar = function(p1, p2) {
    // Determine the common attribute group
    let groupName = 'Default';
    if (p1.position === p2.position && POSITION_MAPPING[p1.position]) {
        groupName = POSITION_MAPPING[p1.position].group;
    } else {
        groupName = (POSITION_MAPPING[p1.position] ? POSITION_MAPPING[p1.position].group : 'Default');
    }

    const attributeGroup = ATTRIBUTE_GROUPS[groupName];
    let labels = [];
    let p1Data = [];
    let p2Data = [];

    if (groupName !== 'Default' && attributeGroup && !attributeGroup['Genel']) {
        const cats = Object.keys(attributeGroup);
        labels = cats.map(c => window.tAttr ? window.tAttr(c) : c);
        
        p1Data = cats.map(cat => {
            const attrs = attributeGroup[cat];
            let sum = 0, count = 0;
            attrs.forEach(attrObj => {
                const val = p1.stats[attrObj.name] || 50;
                sum += parseInt(val);
                count++;
            });
            return count > 0 ? Math.round(sum / count) : 50;
        });

        p2Data = cats.map(cat => {
            const attrs = attributeGroup[cat];
            let sum = 0, count = 0;
            attrs.forEach(attrObj => {
                const val = p2.stats[attrObj.name] || 50;
                sum += parseInt(val);
                count++;
            });
            return count > 0 ? Math.round(sum / count) : 50;
        });
    } else {
        // Fallback for missing/default positions
        labels = ['Hız', 'Şut', 'Pas', 'Dripling', 'Defans', 'Fizik'];
        p1Data = [p1.stats['Hız']||50, p1.stats['Şut']||50, p1.stats['Pas']||50, p1.stats['Top Sürme']||50, p1.stats['Defans']||50, p1.stats['Fizik']||50];
        p2Data = [p2.stats['Hız']||50, p2.stats['Şut']||50, p2.stats['Pas']||50, p2.stats['Top Sürme']||50, p2.stats['Defans']||50, p2.stats['Fizik']||50];
    }

    const series = [
        { name: p1.name, data: p1Data },
        { name: p2.name, data: p2Data }
    ];

    setTimeout(() => {
        const chartElement = document.querySelector("#compare-radar-chart");
        if (!chartElement) return;
        chartElement.innerHTML = ''; 

        if (this.comparisonRadarChartInstance) {
            this.comparisonRadarChartInstance.destroy();
        }

        this.comparisonRadarChartInstance = new ApexCharts(chartElement, {
            series: series,
            chart: { 
                height: '100%', 
                type: 'radar', 
                toolbar: { show: false }, 
                background: 'transparent', 
                fontFamily: 'Inter',
                animations: { enabled: true, easing: 'easeinout', speed: 800 }
            },
            labels: labels,
            stroke: { 
                width: 2, 
                colors: ['#3b82f6', '#a855f7']
            },
            fill: { 
                opacity: 0.3, 
                colors: ['#3b82f6', '#a855f7'] 
            },
            markers: { 
                size: 5, 
                colors: ['#fff', '#fff'], 
                strokeColors: ['#3b82f6', '#a855f7'], 
                strokeWidth: 2, 
                hover: { size: 7 } 
            },
            yaxis: { show: false, max: 100, min: 0 },
            xaxis: { 
                labels: { 
                    style: { 
                        colors: new Array(labels.length).fill('#94a3b8'), 
                        fontSize: '11px', 
                        fontWeight: 600, 
                        fontFamily: 'Inter' 
                    } 
                } 
            },
            plotOptions: {
                radar: {
                    size: 90, 
                    polygons: {
                        strokeColors: 'rgba(255,255,255,0.05)', 
                        connectorColors: 'rgba(255,255,255,0.05)'
                    }
                }
            },
            theme: { mode: 'dark' },
            tooltip: { theme: 'dark' },
            legend: { 
                show: true, 
                position: 'bottom', 
                labels: { colors: '#cbd5e1' },
                markers: { fillColors: ['#3b82f6', '#a855f7'] }
            }
        });
        
        this.comparisonRadarChartInstance.render();
    }, 150);
};
