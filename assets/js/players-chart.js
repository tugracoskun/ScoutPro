// --- KARŞILAŞTIRMALI RADAR GRAFİĞİ ---

ScoutApp.prototype.initComparisonRadar = function(p, currentReport, prevReport) {
    let categories = [], currentData = [], prevData = [];

    if (p.position === 'Kaleci' && ATTRIBUTE_SETS['Kaleci']) {
        const set = ATTRIBUTE_SETS['Kaleci'];
        categories = Object.keys(set);
        currentData = categories.map(cat => { let sum = 0; set[cat].forEach(a => sum += (currentReport.stats[a] || 50)); return Math.round(sum / set[cat].length); });
        if (prevReport) prevData = categories.map(cat => { let sum = 0; set[cat].forEach(a => sum += (prevReport.stats[a] || 50)); return Math.round(sum / set[cat].length); });
    } else {
        const set = ATTRIBUTE_SETS['Default']['Genel'];
        categories = set;
        currentData = set.map(s => currentReport.stats[s] || 50);
        if(prevReport) prevData = set.map(s => prevReport.stats[s] || 50);
    }

    const series = [{ name: currentReport.date, data: currentData }];
    if (prevReport) series.push({ name: prevReport.date, data: prevData });

    setTimeout(() => {
        const chartElement = document.querySelector("#modal-radar");
        if (!chartElement) return;
        chartElement.innerHTML = '';

        new ApexCharts(chartElement, {
            series: series,
            chart: { height: 320, width: '100%', type: 'radar', toolbar: { show: false }, background: 'transparent', fontFamily: 'Inter', animations: { enabled: true }, redrawOnParentResize: true },
            labels: categories,
            stroke: { width: [3, 2], colors: ['#22c55e', '#64748b'], dashArray: [0, 5] },
            fill: { opacity: [0.4, 0.1], colors: ['#22c55e', '#94a3b8'] },
            markers: { size: [5, 3], colors: ['#fff', '#94a3b8'], strokeColors: ['#22c55e', '#94a3b8'], strokeWidth: 2, hover: { size: 7 } },
            yaxis: { show: false, max: 100, min: 0 },
            xaxis: { labels: { style: { colors: ['#94a3b8','#94a3b8','#94a3b8','#94a3b8','#94a3b8','#94a3b8'], fontSize: '12px', fontWeight: 700, fontFamily: 'Inter' } } },
            plotOptions: { radar: { size: 110, polygons: { strokeColors: '#334155', connectorColors: '#334155', fill: { colors: ['transparent', 'transparent'] } } } },
            theme: { mode: 'dark' },
            tooltip: { theme: 'dark' },
            grid: { show: false, padding: { top: 0, bottom: 0 } }
        }).render();
    }, 250);
};