// --- KARŞILAŞTIRMALI RADAR GRAFİĞİ (V4.0 - Kategori Bazlı Ortalama Fix) ---

ScoutApp.prototype.initComparisonRadar = function(p, currentReport, prevReport) {
    let labels = [];
    let currentData = [];
    let prevData = [];

    // 1. Oyuncunun Pozisyon Grubunu Bul (Örn: Stoper -> Defans Grubu)
    const mapping = POSITION_MAPPING[p.position] || { group: 'Default' };
    const groupName = mapping.group;
    
    // 2. O Grubun Özelliklerini Getir
    const attributeGroup = ATTRIBUTE_GROUPS[groupName];

    if (groupName !== 'Default') {
        // --- KATEGORİLİ YAPI (Defans, Orta Saha, Forvet vb.) ---
        // Burada her kategorinin (Teknik, Fiziksel vb.) ortalamasını alacağız.
        
        labels = Object.keys(attributeGroup); // ['Teknik', 'Taktik', 'Fiziksel', 'Mental']
        
        // Mevcut Rapor Ortalamaları
        currentData = labels.map(cat => {
            const attrs = attributeGroup[cat]; // Bu kategorideki özellikler listesi
            let sum = 0;
            let count = 0;
            
            attrs.forEach(attrObj => {
                // BUG FIX: Artık attr bir obje {name: '...', sub: '...'} olduğu için .name ile alıyoruz
                const val = currentReport.stats[attrObj.name] || 50;
                sum += parseInt(val);
                count++;
            });
            
            return count > 0 ? Math.round(sum / count) : 50;
        });

        // Önceki Rapor Ortalamaları (Varsa)
        if (prevReport) {
            prevData = labels.map(cat => {
                const attrs = attributeGroup[cat];
                let sum = 0;
                let count = 0;
                attrs.forEach(attrObj => {
                    const val = prevReport.stats[attrObj.name] || 50;
                    sum += parseInt(val);
                    count++;
                });
                return count > 0 ? Math.round(sum / count) : 50;
            });
        }

    } else {
        // --- VARSAYILAN YAPI (Eski/Basit) ---
        const s = attributeGroup['Genel'];
        labels = s.map(item => item.name);
        currentData = s.map(item => currentReport.stats[item.name] || 50);
        if (prevReport) {
            prevData = s.map(item => prevReport.stats[item.name] || 50);
        }
    }

    // Serileri Hazırla
    const series = [{ name: 'Mevcut: ' + currentReport.date, data: currentData }];
    if (prevReport) {
        series.push({ name: 'Önceki: ' + prevReport.date, data: prevData });
    }

    // 3. Grafiği Çiz (Gecikmeli - DOM hazır olsun diye)
    setTimeout(() => {
        const chartElement = document.querySelector("#modal-radar");
        
        if (!chartElement) return;
        chartElement.innerHTML = ''; // Temizle

        new ApexCharts(chartElement, {
            series: series,
            chart: { 
                height: '100%', // Parent yüksekliğine uy
                type: 'radar', 
                toolbar: { show: false }, 
                background: 'transparent', 
                fontFamily: 'Inter',
                animations: { enabled: true },
                redrawOnParentResize: true 
            },
            labels: labels,
            stroke: { 
                width: [3, 2], 
                colors: ['#22c55e', '#94a3b8'], // Yeşil (Güncel), Gri (Eski)
                dashArray: [0, 4] // Eskisi kesik çizgi
            },
            fill: { 
                opacity: [0.5, 0.1], 
                colors: ['#22c55e', '#94a3b8'] 
            },
            markers: { 
                size: [5, 3], 
                colors: ['#fff', '#94a3b8'], 
                strokeColors: ['#22c55e', '#94a3b8'], 
                strokeWidth: 2, 
                hover: { size: 7 } 
            },
            yaxis: { 
                show: false, 
                max: 100, 
                min: 0 
            },
            xaxis: { 
                labels: { 
                    style: { 
                        colors: new Array(labels.length).fill('#cbd5e1'), // Tüm etiketler açık gri
                        fontSize: '11px', 
                        fontWeight: 700, 
                        fontFamily: 'Inter' 
                    } 
                } 
            },
            plotOptions: {
                radar: {
                    size: 110, // Grafiğin boyutu
                    polygons: {
                        strokeColors: 'rgba(255,255,255,0.1)', // Örümcek ağı çizgileri
                        connectorColors: 'rgba(255,255,255,0.1)',
                        fill: { colors: ['transparent', 'transparent'] }
                    }
                }
            },
            theme: { mode: 'dark' },
            tooltip: { theme: 'dark' },
            grid: { show: false, padding: { top: 0, bottom: 0 } }
        }).render();
    }, 300);
};