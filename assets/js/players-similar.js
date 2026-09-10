// --- BENZER OYUNCU KEŞFİ VE METRİK ANALİZ MODÜLÜ ---

ScoutApp.prototype.getNormalizedPlayerStats = function(p) {
    if (!p) return {};
    let stats = {};
    if (p.stats && Object.keys(p.stats).length > 0) {
        stats = { ...p.stats };
    } else if (p.history && p.history.length > 0) {
        const latest = p.history[p.history.length - 1];
        if (latest && latest.stats) stats = { ...latest.stats };
    }
    return stats;
};

ScoutApp.prototype.getPositionCompatibility = function(pos1, pos2) {
    if (!pos1 || !pos2) return 0.5;
    if (pos1 === pos2) return 1.0;

    const isGK1 = pos1 === 'Kaleci';
    const isGK2 = pos2 === 'Kaleci';
    // Kaleci ile saha içi oyuncusu asla benzer olamaz
    if (isGK1 !== isGK2) return 0.0;
    if (isGK1 && isGK2) return 1.0;

    // Taktiksel Mevki Grupları
    const groups = {
        'Stoper': 'CB',
        'Sağ Bek': 'FB',
        'Sol Bek': 'FB',
        'Defansif Orta Saha': 'DM',
        'Orta Saha': 'CM',
        'Ofansif Orta Saha': 'AM',
        'Sağ Kanat': 'W',
        'Sol Kanat': 'W',
        'Santrafor': 'ST'
    };

    const g1 = groups[pos1] || 'CM';
    const g2 = groups[pos2] || 'CM';

    if (g1 === g2) return 0.95; // Sağ Bek <-> Sol Bek, Sağ Kanat <-> Sol Kanat

    // Mevkiler arası taktiksel rol uyum matrisi (0.0 - 1.0)
    const matrix = {
        'CB': { 'FB': 0.65, 'DM': 0.75, 'CM': 0.35, 'AM': 0.15, 'W': 0.10, 'ST': 0.10 },
        'FB': { 'CB': 0.65, 'DM': 0.60, 'CM': 0.50, 'AM': 0.35, 'W': 0.80, 'ST': 0.20 },
        'DM': { 'CB': 0.75, 'FB': 0.60, 'CM': 0.85, 'AM': 0.45, 'W': 0.30, 'ST': 0.20 },
        'CM': { 'CB': 0.35, 'FB': 0.50, 'DM': 0.85, 'AM': 0.85, 'W': 0.60, 'ST': 0.40 },
        'AM': { 'CB': 0.15, 'FB': 0.35, 'DM': 0.45, 'CM': 0.85, 'W': 0.80, 'ST': 0.65 },
        'W':  { 'CB': 0.10, 'FB': 0.80, 'DM': 0.30, 'CM': 0.60, 'AM': 0.80, 'ST': 0.70 },
        'ST': { 'CB': 0.10, 'FB': 0.20, 'DM': 0.20, 'CM': 0.40, 'AM': 0.65, 'W': 0.70 }
    };

    if (matrix[g1] && matrix[g1][g2] !== undefined) {
        return matrix[g1][g2];
    }
    return 0.35;
};

ScoutApp.prototype.calculatePlayerSimilarity = function(targetPlayer, otherPlayer, metricCategory = 'all') {
    if (!targetPlayer || !otherPlayer || targetPlayer.id === otherPlayer.id) return null;

    // 1. KURAL: Kaleci kuralı - Kaleci saha içi oyuncusu ile asla benzer olamaz!
    const isTargetGK = targetPlayer.position === 'Kaleci';
    const isOtherGK = otherPlayer.position === 'Kaleci';
    if (isTargetGK !== isOtherGK) {
        return null;
    }

    const tStats = this.getNormalizedPlayerStats(targetPlayer);
    const oStats = this.getNormalizedPlayerStats(otherPlayer);

    // 2. KURAL: Sadece her iki oyuncuda da gerçekten mevcut olan ORTAK metrikleri tespit et
    const commonKeys = Object.keys(tStats).filter(key => 
        oStats.hasOwnProperty(key) && 
        tStats[key] !== undefined && tStats[key] !== null &&
        oStats[key] !== undefined && oStats[key] !== null
    );

    const tKeyCount = Object.keys(tStats).length;
    const oKeyCount = Object.keys(oStats).length;
    const maxKeys = Math.max(tKeyCount, oKeyCount);
    const overlapRatio = maxKeys > 0 ? (commonKeys.length / maxKeys) : 0;

    // Yeterli ortak metrik havuzu yoksa (örn. tamamen alakasız pozisyon raporları) eşleşme sayılmaz
    if (commonKeys.length < 3 || overlapRatio < 0.20) {
        return null;
    }

    // Kategori haritalaması
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

    // İlgili metrikleri filtrele
    const relevantKeys = commonKeys.filter(key => {
        if (metricCategory === 'all') return true;
        const cat = categoryMapping[key] || '';
        if (cat === metricCategory) return true;
        const lk = key.toLowerCase();
        if (metricCategory === 'Teknik' && (lk.includes('pas') || lk.includes('şut') || lk.includes('müdahale') || lk.includes('top') || lk.includes('orta') || lk.includes('drib') || lk.includes('kontrol') || lk.includes('vuruş') || lk.includes('refleks') || lk.includes('yan top'))) return true;
        if (metricCategory === 'Taktik' && (lk.includes('pozisyon') || lk.includes('sezgi') || lk.includes('karar') || lk.includes('vizyon') || lk.includes('kademe') || lk.includes('çizgi') || lk.includes('alan') || lk.includes('hat') || lk.includes('okuma'))) return true;
        if (metricCategory === 'Fiziksel' && (lk.includes('hız') || lk.includes('güç') || lk.includes('sıçrama') || lk.includes('denge') || lk.includes('çeviklik') || lk.includes('dayanıklılık') || lk.includes('boy') || lk.includes('kuvvet') || lk.includes('esneklik'))) return true;
        if (metricCategory === 'Psiko-Sosyal' && (lk.includes('lider') || lk.includes('soğuk') || lk.includes('konsantre') || lk.includes('cesaret') || lk.includes('agresif') || lk.includes('disiplin') || lk.includes('iletişim') || lk.includes('profesyonel'))) return true;
        return false;
    });

    if (relevantKeys.length === 0) return null;

    let totalDiff = 0;
    let comparedCount = 0;
    const metricComparisons = [];

    relevantKeys.forEach(key => {
        const v1 = parseInt(tStats[key]);
        const v2 = parseInt(oStats[key]);
        const diff = Math.abs(v1 - v2);
        // Fark arttıkça benzerlik düşer
        const matchPct = Math.max(0, 100 - (diff * 2.5));
        totalDiff += diff;
        comparedCount++;
        metricComparisons.push({
            name: key,
            targetVal: v1,
            otherVal: v2,
            diff: diff,
            matchPct: matchPct,
            category: categoryMapping[key] || 'Genel'
        });
    });

    if (comparedCount === 0) return null;

    // Ortalama metrik farkına dayalı puan (fark 3 ise ~%91, fark 8 ise ~%77, fark 15 ise ~%58)
    const avgDiff = totalDiff / comparedCount;
    const attrSimilarity = Math.max(10, 100 - (avgDiff * 2.8));

    // Genel Puan (Overall rating) yakınlığı
    const tRating = parseInt(targetPlayer.rating) || 50;
    const oRating = parseInt(otherPlayer.rating) || 50;
    const ratingDiff = Math.abs(tRating - oRating);
    const ratingMatch = Math.max(15, 100 - (ratingDiff * 2.5));

    // Mevki Taktiksel Uyum Faktörü (0.0 - 1.0)
    const posFactor = this.getPositionCompatibility(targetPlayer.position, otherPlayer.position);
    if (posFactor <= 0) return null;

    // Ham profil benzerliği
    const rawProfileScore = (attrSimilarity * 0.70) + (ratingMatch * 0.30);

    // Nihai skor: Taktiksel mevki mesafesi ile kalibre edilir
    const weightedScore = rawProfileScore * Math.pow(posFactor, 0.65);
    const similarityScore = Math.min(99, Math.max(15, Math.round(weightedScore)));

    // En benzer metrikleri sırala
    metricComparisons.sort((a, b) => a.diff - b.diff);
    const topMatches = metricComparisons.slice(0, 3);
    
    // Diğer oyuncunun hedef oyuncuya göre net üstün olduğu metrikler (+4 ve üzeri)
    const advantages = metricComparisons
        .filter(m => (m.otherVal - m.targetVal) >= 4)
        .sort((a, b) => (b.otherVal - b.targetVal) - (a.otherVal - a.targetVal))
        .slice(0, 2);

    const tAge = parseInt(targetPlayer.birthDate ? this.calculateAge(targetPlayer.birthDate) : targetPlayer.age) || 22;
    const oAge = parseInt(otherPlayer.birthDate ? this.calculateAge(otherPlayer.birthDate) : otherPlayer.age) || 22;

    return {
        player: otherPlayer,
        similarityScore: similarityScore,
        comparedCount: comparedCount,
        topMatches: topMatches,
        advantages: advantages,
        ageDiff: Math.abs(tAge - oAge),
        isSamePosition: targetPlayer.position === otherPlayer.position
    };
};

ScoutApp.prototype.openSimilarPlayersModal = function(prefillId = null) {
    const players = this.state.data.players || [];
    if (players.length < 2) {
        return alert("Benzer oyuncu analizi yapabilmek için sistemde en az 2 kayıtlı oyuncu bulunmalıdır.");
    }

    const defaultId = prefillId || players[0].id;

    if (!this.state.similarAnalysis) {
        this.state.similarAnalysis = {
            targetId: defaultId,
            metricCategory: 'all',
            samePositionOnly: false,
            minMatch: 50
        };
    } else {
        if (prefillId) this.state.similarAnalysis.targetId = prefillId;
        else if (!this.state.similarAnalysis.targetId) this.state.similarAnalysis.targetId = defaultId;
    }

    const allPlayerOptions = players.map(p => {
        const teamName = this.getTeamName(p.teamId) || '';
        return {
            txt: `${p.name} (${p.position}${teamName ? ' - ' + teamName : ''})`,
            val: p.id,
            icon: p.image && (p.image.startsWith('http') || p.image.startsWith('data:image')) ? p.image : null
        };
    });

    this.showModal(`
        <style>
            #modal-content { max-width: 1050px !important; max-height: 92vh !important; overflow-y: auto !important; }
        </style>
        <div class="p-6 md:p-7 relative space-y-5">
            <!-- KAPATMA BUTONU -->
            <button onclick="app.closeModal()" class="absolute top-4 right-4 text-slate-400 hover:bg-dark-800 hover:text-white transition-colors w-8 h-8 rounded-lg flex items-center justify-center">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>

            <!-- BAŞLIK (Sade, ikonsuz) -->
            <div class="border-b border-dark-800 pb-3.5 pr-8">
                <h2 class="text-lg font-bold text-white">
                    Benzer Oyuncu Keşfi
                </h2>
                <p class="text-xs text-slate-400 mt-0.5">Hedef oyuncunun nitelik ve metriklerine en çok benzeyen profiller</p>
            </div>

            <!-- FİLTRE VE HEDEF SEÇİM BARI (Kompakt, simetrik ve hizalı) -->
            <div class="bg-dark-950 p-4 rounded-2xl border border-dark-800 space-y-3 relative z-40">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <!-- Hedef Oyuncu Seçici -->
                    <div class="w-full sm:w-80">
                        ${this.createCustomSearchSelect('similar-target-player', 'Hedef Oyuncu', 'Oyuncu Ara...', allPlayerOptions, this.state.similarAnalysis.targetId, 'app.onSimilarTargetChange(this.value)')}
                    </div>

                    <!-- Sağ Kontroller: Aynı Mevki & Eşleşme Oranı (Birebir simetrik ve ikonsuz) -->
                    <div class="flex items-center gap-2 self-end sm:self-auto pt-4 sm:pt-0">
                        <button type="button" onclick="app.setSimilarFilter('samePositionOnly', !app.state.similarAnalysis.samePositionOnly)" 
                            class="h-9 px-3.5 rounded-xl text-xs font-bold border transition-all ${this.state.similarAnalysis.samePositionOnly ? 'bg-scout-600 text-white border-scout-500' : 'bg-dark-900 text-slate-300 border-dark-700 hover:text-white'}">
                            Aynı Mevki
                        </button>

                        <select onchange="app.setSimilarFilter('minMatch', parseInt(this.value))" class="h-9 px-3 bg-dark-900 border border-dark-700 text-slate-300 text-xs font-bold rounded-xl outline-none focus:border-scout-500 cursor-pointer">
                            <option value="50" ${this.state.similarAnalysis.minMatch === 50 ? 'selected' : ''}>%50+ Eşleşme</option>
                            <option value="70" ${this.state.similarAnalysis.minMatch === 70 ? 'selected' : ''}>%70+ Eşleşme</option>
                            <option value="80" ${this.state.similarAnalysis.minMatch === 80 ? 'selected' : ''}>%80+ Eşleşme</option>
                            <option value="85" ${this.state.similarAnalysis.minMatch === 85 ? 'selected' : ''}>%85+ Eşleşme</option>
                        </select>
                    </div>
                </div>

                <!-- Metrik Odak Filtreleri (Tek satır, taşma yapmaz) -->
                <div class="flex items-center gap-2 pt-2.5 border-t border-dark-800/80 overflow-x-auto">
                    <span class="text-xs font-bold text-slate-400 shrink-0 mr-1">Metrik Odağı:</span>
                    <div class="flex items-center gap-1.5 flex-nowrap">
                        <button type="button" onclick="app.setSimilarFilter('metricCategory', 'all')" class="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all whitespace-nowrap ${this.state.similarAnalysis.metricCategory === 'all' ? 'bg-scout-600 text-white border-scout-500' : 'bg-dark-900 text-slate-400 border-dark-700 hover:text-white'}">Tümü</button>
                        <button type="button" onclick="app.setSimilarFilter('metricCategory', 'Teknik')" class="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all whitespace-nowrap ${this.state.similarAnalysis.metricCategory === 'Teknik' ? 'bg-scout-600 text-white border-scout-500' : 'bg-dark-900 text-slate-400 border-dark-700 hover:text-white'}">Teknik</button>
                        <button type="button" onclick="app.setSimilarFilter('metricCategory', 'Taktik')" class="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all whitespace-nowrap ${this.state.similarAnalysis.metricCategory === 'Taktik' ? 'bg-scout-600 text-white border-scout-500' : 'bg-dark-900 text-slate-400 border-dark-700 hover:text-white'}">Taktik</button>
                        <button type="button" onclick="app.setSimilarFilter('metricCategory', 'Fiziksel')" class="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all whitespace-nowrap ${this.state.similarAnalysis.metricCategory === 'Fiziksel' ? 'bg-scout-600 text-white border-scout-500' : 'bg-dark-900 text-slate-400 border-dark-700 hover:text-white'}">Fiziksel</button>
                        <button type="button" onclick="app.setSimilarFilter('metricCategory', 'Psiko-Sosyal')" class="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all whitespace-nowrap ${this.state.similarAnalysis.metricCategory === 'Psiko-Sosyal' ? 'bg-scout-600 text-white border-scout-500' : 'bg-dark-900 text-slate-400 border-dark-700 hover:text-white'}">Psiko-Sosyal</button>
                    </div>
                </div>
            </div>

            <!-- ANALİZ VE SONUÇ ALANI -->
            <div id="similar-players-container" class="relative z-10">
                <!-- Dinamik olarak renderSimilarPlayersResults ile doldurulur -->
            </div>
        </div>
    `);

    lucide.createIcons();
    this.renderSimilarPlayersResults();
};

ScoutApp.prototype.onSimilarTargetChange = function(newId) {
    if (!newId) return;
    this.state.similarAnalysis.targetId = parseInt(newId);
    this.renderSimilarPlayersResults();
};

ScoutApp.prototype.setSimilarFilter = function(key, value) {
    if (!this.state.similarAnalysis) return;
    this.state.similarAnalysis[key] = value;
    this.openSimilarPlayersModal(this.state.similarAnalysis.targetId);
};

ScoutApp.prototype.renderSimilarPlayersResults = function() {
    const container = document.getElementById('similar-players-container');
    if (!container) return;

    const players = this.state.data.players || [];
    const filter = this.state.similarAnalysis;
    const targetPlayer = players.find(p => p.id === parseInt(filter.targetId));

    if (!targetPlayer) {
        container.innerHTML = `<div class="text-center py-12 text-slate-500 border-2 border-dashed border-dark-800 rounded-2xl">Lütfen geçerli bir hedef oyuncu seçin.</div>`;
        return;
    }

    // Hedef oyuncu dışındaki tüm oyuncuları tara ve benzerlik puanlarını hesapla
    let matches = [];
    players.forEach(other => {
        if (other.id === targetPlayer.id) return;
        if (filter.samePositionOnly && other.position !== targetPlayer.position) return;

        const sim = this.calculatePlayerSimilarity(targetPlayer, other, filter.metricCategory);
        if (sim && sim.similarityScore >= filter.minMatch) {
            matches.push(sim);
        }
    });

    // Benzerliğe göre azalan sırala
    matches.sort((a, b) => b.similarityScore - a.similarityScore);

    const targetAge = targetPlayer.birthDate ? this.calculateAge(targetPlayer.birthDate) : targetPlayer.age;
    const targetGrade = this.getGrade(targetPlayer.rating);
    const targetStats = this.getNormalizedPlayerStats(targetPlayer);
    
    // Hedef oyuncunun en belirgin 4 niteliği
    const targetTopStats = Object.entries(targetStats)
        .map(([k, v]) => ({ name: k, val: parseInt(v) || 0 }))
        .sort((a, b) => b.val - a.val)
        .slice(0, 4);

    const html = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <!-- SOL KOLON: HEDEF OYUNCU KARTI -->
            <div class="lg:col-span-4 space-y-3.5">
                <div class="bg-dark-900 border border-dark-800 rounded-2xl p-4 relative">
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-dark-800 text-slate-300 border border-dark-700">
                            Referans Oyuncu
                        </span>
                        <span class="text-xs font-bold ${targetGrade.color}">${targetGrade.letter} (${targetPlayer.rating})</span>
                    </div>

                    <div class="flex items-center gap-3 mb-3.5">
                        <img src="${this.getImageUrl(targetPlayer.image)}" class="w-14 h-14 rounded-xl object-cover bg-dark-950 border border-dark-700" onerror="this.onerror=null;this.src=window.DEFAULT_AVATAR_DATA_URL">
                        <div class="overflow-hidden">
                            <h3 class="font-bold text-white text-sm truncate">${targetPlayer.name}</h3>
                            <p class="text-xs text-scout-400 font-semibold mt-0.5">${targetPlayer.position}</p>
                            <p class="text-xs text-slate-400 truncate mt-0.5">${this.getTeamName(targetPlayer.teamId)}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-3 gap-2 p-2 bg-dark-950/60 rounded-xl border border-dark-800/80 text-center mb-3.5 text-xs">
                        <div>
                            <span class="text-[10px] text-slate-500 block uppercase font-bold">Yaş</span>
                            <span class="font-bold text-white">${targetAge || '-'}</span>
                        </div>
                        <div>
                            <span class="text-[10px] text-slate-500 block uppercase font-bold">Ayak</span>
                            <span class="font-semibold text-white">${targetPlayer.foot || 'Sağ'}</span>
                        </div>
                        <div>
                            <span class="text-[10px] text-slate-500 block uppercase font-bold">Boy</span>
                            <span class="font-bold text-white">${targetPlayer.height ? targetPlayer.height + ' cm' : '-'}</span>
                        </div>
                    </div>

                    <!-- Öne Çıkan Nitelikleri -->
                    <div>
                        <span class="text-[11px] font-bold text-slate-400 block mb-1.5">Öne Çıkan Metrikler</span>
                        <div class="space-y-1">
                            ${targetTopStats.map(s => `
                                <div class="flex items-center justify-between text-xs bg-dark-950/40 px-2.5 py-1 rounded-lg border border-dark-800/40">
                                    <span class="text-slate-300 truncate">${s.name}</span>
                                    <span class="font-bold text-scout-400">${s.val}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Sade Bilgi Notu -->
                <div class="p-3 bg-dark-900/40 border border-dark-800/60 rounded-xl text-xs text-slate-400">
                    <span class="font-bold text-slate-300 block mb-0.5">Nasıl Hesaplanır?</span>
                    <p class="text-[11px] leading-relaxed text-slate-400">
                        Seçilen metrik grubundaki niteliklerin yakınlığı ve genel puan kıyası ile benzerlik oranı belirlenir.
                    </p>
                </div>
            </div>

            <!-- SAĞ KOLON: EŞLEŞEN BENZER OYUNCULAR LİSTESİ -->
            <div class="lg:col-span-8 space-y-3">
                <div class="flex items-center justify-between px-1">
                    <span class="text-xs font-bold text-slate-400 flex items-center gap-2">
                        <span>Bulunan Eşleşmeler</span>
                        <span class="px-2 py-0.5 rounded-md bg-dark-800 text-slate-200 text-xs font-bold">${matches.length} Oyuncu</span>
                    </span>
                    <span class="text-[11px] text-slate-500">Benzerlik oranına göre</span>
                </div>

                ${matches.length === 0 ? `
                    <div class="text-center py-14 text-slate-500 border-2 border-dashed border-dark-800 rounded-2xl flex flex-col items-center justify-center gap-2">
                        <i data-lucide="search-x" class="w-8 h-8 text-slate-600"></i>
                        <span class="text-sm font-semibold">${targetPlayer.position === 'Kaleci' ? 'Sistemde karşılaştırılabilecek başka kaleci bulunamadı.' : 'Bu kriterlere uygun benzer oyuncu bulunamadı.'}</span>
                        <p class="text-xs text-slate-500 max-w-sm">${targetPlayer.position === 'Kaleci' ? 'Kaleciler mevki dinamikleri gereği yalnızca diğer kalecilerle eşleştirilir. Havuzunuza başka bir kaleci raporladığınızda burada listelenecektir.' : 'Eşleşme oranını düşürerek veya "Aynı Mevki" filtresini kaldırarak daha fazla sonuca ulaşabilirsiniz.'}</p>
                    </div>
                ` : `
                    <div class="space-y-2.5 max-h-[560px] overflow-y-auto custom-scrollbar pr-1">
                        ${matches.map(m => {
                            const p = m.player;
                            const age = p.birthDate ? this.calculateAge(p.birthDate) : p.age;
                            const grade = this.getGrade(p.rating);
                            
                            // Sade ve standart renk teması
                            let badgeTheme = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                            if (m.similarityScore < 70) {
                                badgeTheme = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                            } else if (m.similarityScore < 85) {
                                badgeTheme = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
                            }

                            return `
                                <div class="p-3.5 bg-dark-900 border border-dark-800 hover:border-dark-700 rounded-xl transition-all">
                                    <div class="flex items-center justify-between gap-3">
                                        <!-- Profil Bilgisi -->
                                        <div class="flex items-center gap-3 min-w-0">
                                            <div class="relative shrink-0">
                                                <img src="${this.getImageUrl(p.image)}" class="w-12 h-12 rounded-xl object-cover bg-dark-950 border border-dark-700" onerror="this.onerror=null;this.src=window.DEFAULT_AVATAR_DATA_URL">
                                                ${p.isFavorite ? `<span class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 flex items-center justify-center text-white"><i data-lucide="heart" class="w-2 h-2 fill-white"></i></span>` : ''}
                                            </div>
                                            <div class="min-w-0">
                                                <div class="flex items-center gap-1.5">
                                                    <h4 class="font-bold text-white text-sm hover:text-scout-400 cursor-pointer transition-colors truncate" onclick="app.closeModal(); app.openPlayerModal(${p.id})">
                                                        ${p.name}
                                                    </h4>
                                                    <span class="text-xs font-bold ${grade.color}">(${p.rating})</span>
                                                </div>
                                                <div class="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5 truncate">
                                                    <span class="text-scout-400 font-semibold">${p.position}</span>
                                                    <span>•</span>
                                                    <span class="truncate">${this.getTeamName(p.teamId)}</span>
                                                    <span>•</span>
                                                    <span>${age} yaş</span>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Eşleşme Oranı ve Aksiyon Butonları (Kompakt, standart font, ikonsuz eşleşme) -->
                                        <div class="flex items-center gap-2 shrink-0">
                                            <div class="px-2.5 py-1 rounded-lg text-xs font-bold border ${badgeTheme}">
                                                %${m.similarityScore} Eşleşme
                                            </div>

                                            <button onclick="app.closeModal(); app.openCompareModal(${targetPlayer.id}, ${p.id})" 
                                                class="px-2.5 py-1 rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white text-xs font-bold border border-dark-700 transition-all flex items-center gap-1.5"
                                                title="Hedef oyuncuyla yan yana kıyasla">
                                                <i data-lucide="scale" class="w-3.5 h-3.5"></i>
                                                <span class="hidden sm:inline">Karşılaştır</span>
                                            </button>

                                            <button onclick="app.closeModal(); app.openPlayerModal(${p.id})" 
                                                class="p-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-400 hover:text-white border border-dark-700 transition-all"
                                                title="Oyuncu Rapor Detayını Gör">
                                                <i data-lucide="chevron-right" class="w-4 h-4"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Alt Kısım: Sade ve Temiz Metrik Özeti (Kutu kutu karmaşa yerine akıcı satır) -->
                                    <div class="mt-2.5 pt-2 border-t border-dark-800/60 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs">
                                        <div class="flex items-center gap-1.5 flex-wrap">
                                            <span class="text-[11px] font-semibold text-slate-500">En Yakın:</span>
                                            ${m.topMatches.map(tm => `
                                                <span class="text-slate-300 text-xs">
                                                    ${tm.name} <span class="text-white font-bold">${tm.otherVal}</span><span class="text-slate-500 text-[11px]">/${tm.targetVal}</span>
                                                </span>
                                            `).join('<span class="text-slate-600 text-[10px]">•</span>')}
                                        </div>

                                        ${m.advantages.length > 0 ? `
                                            <div class="flex items-center gap-1.5 flex-wrap">
                                                <span class="text-[11px] font-semibold text-emerald-400/80">Artı Yönü:</span>
                                                ${m.advantages.map(adv => `
                                                    <span class="text-emerald-400 text-xs font-medium">
                                                        +${adv.otherVal - adv.targetVal} ${adv.name}
                                                    </span>
                                                `).join('<span class="text-slate-600 text-[10px]">•</span>')}
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `}
            </div>
        </div>
    `;

    container.innerHTML = html;
    lucide.createIcons();
};
