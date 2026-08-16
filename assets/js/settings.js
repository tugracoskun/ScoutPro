ScoutApp.prototype.renderSettings = function(c) {
    const isOfflineImagesEnabled = !(this.state.data && this.state.data.settings && this.state.data.settings.offlineImages === false);
    const isYouthTipsEnabled = !(this.state.data && this.state.data.settings && this.state.data.settings.youthTips === false);
    const isAssistantEnabled = !(this.state.data && this.state.data.settings && this.state.data.settings.assistantEnabled === false);
    const assistantPosition = (this.state.data && this.state.data.settings && this.state.data.settings.assistantPosition) || 'bottom-right';
    const currentTheme = (this.state.data && this.state.data.settings && this.state.data.settings.theme) || window.getTheme();
    const isDark = currentTheme !== 'light';

    c.innerHTML = `
        <div class="max-w-3xl mx-auto fade-in space-y-6">

            <!-- Tema Seçimi -->
            <div class="bg-dark-900 border border-dark-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <div class="p-3 bg-dark-800 rounded-lg text-scout-500">
                        <i data-lucide="${isDark ? 'moon' : 'sun'}" class="w-5 h-5 ${isDark ? 'text-blue-400' : 'text-amber-500'}"></i>
                    </div>
                    <div>
                        <div class="text-white font-bold">${t('theme')}</div>
                        <div class="text-slate-500 text-xs">${t('theme_desc')}</div>
                    </div>
                </div>

                <div class="flex items-center bg-dark-950 p-1.5 rounded-xl border border-dark-800 self-start sm:self-auto shrink-0">
                    <button onclick="app.setTheme('dark')" class="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${isDark ? 'bg-slate-800 text-white shadow border border-slate-700' : 'text-slate-400 hover:text-white'}">
                        <i data-lucide="moon" class="w-3.5 h-3.5 text-blue-400"></i>
                        ${t('dark_mode')}
                    </button>
                    <button onclick="app.setTheme('light')" class="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${!isDark ? 'bg-amber-100 text-slate-900 shadow border border-amber-300' : 'text-slate-400 hover:text-white'}">
                        <i data-lucide="sun" class="w-3.5 h-3.5 text-amber-500"></i>
                        ${t('light_mode')}
                    </button>
                </div>
            </div>

            <!-- Hızlı Asistan Modülü (Aç/Kapa & Konum) -->
            <div class="bg-dark-900 border border-dark-800 rounded-2xl p-6 space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div class="flex items-center gap-4">
                        <div class="p-3 bg-dark-800 rounded-lg text-emerald-400">
                            <i data-lucide="compass" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <div class="text-white font-bold">Hızlı Asistan (Bilgi Bankası)</div>
                            <div class="text-slate-500 text-xs">Scouting metodolojisi, 4 köşe modeli ve soru-cevap rehberi butonunu gösterir.</div>
                        </div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer shrink-0 self-start sm:self-auto">
                        <input type="checkbox" id="assistant-toggle" onchange="app.toggleAssistant(this.checked)" class="sr-only peer" ${isAssistantEnabled ? 'checked' : ''}>
                        <div class="w-11 h-6 bg-dark-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-scout-500"></div>
                    </label>
                </div>

                <div class="pt-3 border-t border-dark-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isAssistantEnabled ? '' : 'opacity-40 pointer-events-none'}">
                    <div class="text-xs text-slate-400">
                        <b class="text-white">Asistan Buton Konumu:</b> Ekrandaki sabit köşe yerleşimi
                    </div>
                    <div class="flex items-center gap-2">
                        <select id="assistant-pos-select" onchange="app.setAssistantPosition(this.value)" class="bg-dark-950 border border-dark-750 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-scout-500 cursor-pointer">
                            <option value="bottom-right" ${assistantPosition === 'bottom-right' ? 'selected' : ''}>Sağ Alt (Varsayılan)</option>
                            <option value="bottom-left" ${assistantPosition === 'bottom-left' ? 'selected' : ''}>Sol Alt</option>
                            <option value="top-right" ${assistantPosition === 'top-right' ? 'selected' : ''}>Sağ Üst</option>
                            <option value="top-left" ${assistantPosition === 'top-left' ? 'selected' : ''}>Sol Üst</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Gençlik Gelişim İpuçları (Raporlama) -->
            <div class="bg-dark-900 border border-dark-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <div class="p-3 bg-dark-800 rounded-lg text-amber-400">
                        <i data-lucide="lightbulb" class="w-5 h-5 text-amber-400"></i>
                    </div>
                    <div>
                        <div class="text-white font-bold">${t('youth_tips_title')}</div>
                        <div class="text-slate-500 text-xs">${t('youth_tips_desc')}</div>
                    </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer shrink-0 self-start sm:self-auto">
                    <input type="checkbox" id="youth-tips-toggle" onchange="app.toggleYouthTips(this.checked)" class="sr-only peer" ${isYouthTipsEnabled ? 'checked' : ''}>
                    <div class="w-11 h-6 bg-dark-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-scout-500"></div>
                </label>
            </div>

            <!-- Çevrimdışı Görseller & Logolar Modülü -->
            <div class="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
                <div class="p-6 border-b border-dark-800 flex justify-between items-center">
                    <h3 class="text-lg font-bold text-white flex items-center gap-2"><i data-lucide="image" class="text-scout-500"></i> ${t('offline_media')}</h3>
                    <div id="media-cache-badge" class="text-xs font-semibold px-3 py-1 bg-dark-800 text-slate-400 rounded-full border border-dark-700 flex items-center gap-2">
                        <div class="w-3.5 h-3.5 border-2 border-scout-500/30 border-t-scout-500 rounded-full animate-spin"></div>
                    </div>
                </div>
                <div class="p-6 space-y-6">
                    <p class="text-sm text-slate-400 mb-4">${t('offline_media_desc')}</p>
                    
                    <div class="flex items-center justify-between p-4 bg-dark-950 rounded-xl border border-dark-800">
                        <div class="flex items-center gap-4">
                            <div class="p-3 bg-dark-800 rounded-lg text-scout-400"><i data-lucide="wifi-off" class="w-5 h-5"></i></div>
                            <div>
                                <div class="text-white font-medium">${t('offline_mode_toggle')}</div>
                                <div class="text-slate-500 text-xs">${t('offline_mode_toggle_desc')}</div>
                            </div>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="offline-images-toggle" onchange="app.toggleOfflineImages(this.checked)" class="sr-only peer" ${isOfflineImagesEnabled ? 'checked' : ''}>
                            <div class="w-11 h-6 bg-dark-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-scout-500"></div>
                        </label>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button id="btn-download-media" onclick="app.downloadAllMedia()" class="p-4 bg-dark-950 border border-dark-800 hover:border-scout-500/50 rounded-xl flex items-center gap-4 transition-all group">
                            <div class="w-12 h-12 rounded-lg bg-scout-500/10 flex items-center justify-center text-scout-500 group-hover:bg-scout-500 group-hover:text-white transition-colors">
                                <i data-lucide="download-cloud" class="w-6 h-6"></i>
                            </div>
                            <div class="text-left">
                                <div class="text-white font-bold">${t('download_all_media')}</div>
                                <div class="text-xs text-slate-500">${t('download_all_media_desc')}</div>
                            </div>
                        </button>
                        <button onclick="app.clearMediaCache()" class="p-4 bg-dark-950 border border-dark-800 hover:border-red-500/50 rounded-xl flex items-center gap-4 transition-all group">
                            <div class="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                                <i data-lucide="trash-2" class="w-6 h-6"></i>
                            </div>
                            <div class="text-left">
                                <div class="text-white font-bold">${t('clear_media_cache')}</div>
                                <div class="text-xs text-slate-500">${t('clear_media_cache_desc')}</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <div class="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
                <div class="p-6 border-b border-dark-800 flex justify-between items-center">
                    <h3 class="text-lg font-bold text-white flex items-center gap-2"><i data-lucide="hard-drive" class="text-scout-500"></i> ${t('data_management')}</h3>
                    <div id="data-size-badge" class="text-xs font-semibold px-3 py-1 bg-dark-800 text-slate-400 rounded-full border border-dark-700 flex items-center gap-2">
                        <div class="w-3.5 h-3.5 border-2 border-scout-500/30 border-t-scout-500 rounded-full animate-spin"></div>
                    </div>
                </div>
                <div class="p-6 space-y-4">
                    <p class="text-sm text-slate-400 mb-4">${t('data_desc')}</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button onclick="app.backupData()" class="p-4 bg-dark-950 border border-dark-800 hover:border-scout-500/50 rounded-xl flex items-center gap-4 transition-all group"><div class="w-12 h-12 rounded-lg bg-scout-500/10 flex items-center justify-center text-scout-500 group-hover:bg-scout-500 group-hover:text-white transition-colors"><i data-lucide="download" class="w-6 h-6"></i></div><div class="text-left"><div class="text-white font-bold">${t('export')}</div><div class="text-xs text-slate-500">${t('export_desc')}</div></div></button>
                        <button onclick="app.restoreData()" class="p-4 bg-dark-950 border border-dark-800 hover:border-blue-500/50 rounded-xl flex items-center gap-4 transition-all group"><div class="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors"><i data-lucide="upload" class="w-6 h-6"></i></div><div class="text-left"><div class="text-white font-bold">${t('import')}</div><div class="text-xs text-slate-500">${t('import_desc')}</div></div></button>
                    </div>
                </div>
            </div>
            
            <div class="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
                <div class="p-6 border-b border-dark-800"><h3 class="text-lg font-bold text-white flex items-center gap-2"><i data-lucide="globe" class="text-scout-500"></i> ${t('language')}</h3></div>
                <div class="p-6 space-y-4">
                    <p class="text-sm text-slate-400 mb-4">${t('language_desc')}</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button onclick="app.changeLanguage('tr')" class="p-4 rounded-xl border flex items-center justify-between transition-colors ${window.getLang() === 'tr' ? 'bg-scout-500/10 border-scout-500 text-scout-400' : 'bg-dark-950 border-dark-800 text-slate-400 hover:border-scout-500/50 hover:bg-dark-800'}">
                            <div class="flex items-center gap-3">
                                <img src="https://flagcdn.com/w40/tr.png" class="w-6 h-4 rounded-sm shadow-sm object-cover" alt="TR">
                                <span class="font-bold text-white">Türkçe</span>
                            </div>
                            ${window.getLang() === 'tr' ? '<i data-lucide="check-circle-2" class="w-5 h-5"></i>' : ''}
                        </button>
                        <button onclick="app.changeLanguage('en')" class="p-4 rounded-xl border flex items-center justify-between transition-colors ${window.getLang() === 'en' ? 'bg-scout-500/10 border-scout-500 text-scout-400' : 'bg-dark-950 border-dark-800 text-slate-400 hover:border-scout-500/50 hover:bg-dark-800'}">
                            <div class="flex items-center gap-3">
                                <img src="https://flagcdn.com/w40/gb.png" class="w-6 h-4 rounded-sm shadow-sm object-cover" alt="GB">
                                <span class="font-bold text-white">English</span>
                            </div>
                            ${window.getLang() === 'en' ? '<i data-lucide="check-circle-2" class="w-5 h-5"></i>' : ''}
                        </button>
                    </div>
                </div>
            </div>

            <button id="restart-app-btn" onclick="app.restartApp()" class="w-full p-4 bg-red-900/10 border border-red-900/30 rounded-xl hover:bg-red-900/20 text-red-400 transition-all duration-300 flex items-center justify-center gap-2"><i data-lucide="refresh-cw" class="w-5 h-5"></i> ${t('restart')}</button>
        </div>
    `;

    setTimeout(() => {
        this.updateCacheStatusUI();
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }, 50);
};

ScoutApp.prototype.updateCacheStatusUI = async function() {
    // 1. Çevrimdışı Görseller Boyutu & Rozeti
    const badge = document.getElementById('media-cache-badge');
    if (badge) {
        let updated = false;
        try {
            if (window.electronAPI && typeof window.electronAPI.getCacheInfo === 'function') {
                const info = await window.electronAPI.getCacheInfo();
                if (info && typeof info.count === 'number') {
                    const sizeMb = (info.sizeBytes / (1024 * 1024)).toFixed(2);
                    badge.innerHTML = `<span class="text-scout-400 font-bold">${info.count}</span> görsel (<span class="text-scout-400 font-bold">${sizeMb} MB</span>)`;
                    updated = true;
                }
            }
        } catch (e) {
            console.warn("Main process getCacheInfo error:", e);
        }
        if (!updated) {
            const cachedImages = (this.state.data && this.state.data.cachedImages) || {};
            const cachedCount = Object.keys(cachedImages).length;
            let approxBytes = 0;
            Object.values(cachedImages).forEach(v => { if (typeof v === 'string') approxBytes += v.length; });
            const sizeMb = (approxBytes / (1024 * 1024)).toFixed(2);
            badge.innerHTML = `<span class="text-scout-400 font-bold">${cachedCount}</span> görsel (<span class="text-scout-400 font-bold">${sizeMb} MB</span>)`;
        }
    }

    // 2. Veri Yönetimi (JSON Veri Boyutu) Rozeti
    const dataBadge = document.getElementById('data-size-badge');
    if (dataBadge) {
        try {
            const jsonStr = JSON.stringify(this.state.data || {});
            const bytes = new Blob([jsonStr]).size;
            let sizeText = '';
            if (bytes >= 1024 * 1024) {
                sizeText = (bytes / (1024 * 1024)).toFixed(2) + ' MB';
            } else {
                sizeText = (bytes / 1024).toFixed(1) + ' KB';
            }
            dataBadge.innerHTML = `Veri Boyutu: <span class="text-scout-400 font-bold">${sizeText}</span>`;
        } catch (e) {
            dataBadge.innerHTML = `Veri Boyutu: <span class="text-slate-400">-</span>`;
        }
    }
};

ScoutApp.prototype.toggleOfflineImages = function(enabled) {
    if (!this.state.data.settings) this.state.data.settings = {};
    this.state.data.settings.offlineImages = enabled;
    this.saveData();
    this.notify(enabled ? "Çevrimdışı görseller etkinleştirildi." : "Çevrimdışı görseller devredışı bırakıldı.");
};

ScoutApp.prototype.toggleYouthTips = function(enabled) {
    if (!this.state.data.settings) this.state.data.settings = {};
    this.state.data.settings.youthTips = enabled;
    this.saveData();
    const isEn = window.getLang && window.getLang() === 'en';
    this.notify(enabled ? (isEn ? "Youth development tips enabled." : "Gençlik gelişim ipuçları açıldı.") : (isEn ? "Youth development tips disabled." : "Gençlik gelişim ipuçları kapatıldı."));
};

ScoutApp.prototype.toggleAssistant = function(enabled) {
    if (window.scoutAI) {
        window.scoutAI.toggleAssistant(enabled);
    } else {
        if (!this.state.data.settings) this.state.data.settings = {};
        this.state.data.settings.assistantEnabled = enabled;
        this.saveData();
    }
    const contentArea = document.getElementById('content-area');
    if (contentArea && this.state.activePage === 'settings') {
        this.renderSettings(contentArea);
    }
};

ScoutApp.prototype.setAssistantPosition = function(pos) {
    if (window.scoutAI) {
        window.scoutAI.setPosition(pos);
    } else {
        if (!this.state.data.settings) this.state.data.settings = {};
        this.state.data.settings.assistantPosition = pos;
        this.saveData();
    }
};

ScoutApp.prototype.setTheme = function(theme) {
    const isLight = theme === 'light';

    // HTML element'e class uygula
    if (isLight) {
        document.documentElement.classList.add('light');
    } else {
        document.documentElement.classList.remove('light');
    }

    // Tercihi kaydet
    if (!this.state.data.settings) this.state.data.settings = {};
    this.state.data.settings.theme = theme;
    this.saveData();
    localStorage.setItem('scoutpro_theme', theme);

    // Grafiklerin temasını güncelle için event gönder
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));

    // Ayarlar sayfasını yenile (aktif kart güncellenir)
    const contentArea = document.getElementById('content-area');
    if (contentArea && this.state.activePage === 'settings') {
        this.renderSettings(contentArea);
        setTimeout(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); }, 50);
    }

    const langIsEn = window.getLang && window.getLang() === 'en';
    this.notify(isLight
        ? (langIsEn ? 'Light theme activated' : 'Aydınlık tema aktif')
        : (langIsEn ? 'Dark theme activated' : 'Karanlık tema aktif')
    );
};

async function downloadImageFallback(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) return null;
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth || img.width || 100;
                    canvas.height = img.naturalHeight || img.height || 100;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    resolve(canvas.toDataURL('image/png'));
                } catch (err) {
                    resolve(null);
                }
            };
            img.onerror = () => resolve(null);
            img.src = url;
        });
    }
}

ScoutApp.prototype.downloadAllMedia = async function() {
    const btn = document.getElementById('btn-download-media');
    const badge = document.getElementById('media-cache-badge');
    if (btn) btn.disabled = true;
    if (badge) {
        badge.innerHTML = `<div class="w-3.5 h-3.5 border-2 border-scout-500/30 border-t-scout-500 rounded-full animate-spin"></div><span class="text-scout-400 font-medium ml-1">İndiriliyor...</span>`;
    }

    this.notify(t('downloading_media'));

    // Extract all image URLs from database
    const urls = new Set();
    const data = this.state.data || {};

    if (Array.isArray(data.teams)) {
        data.teams.forEach(t => { if (t.logo && typeof t.logo === 'string' && t.logo.startsWith('http')) urls.add(t.logo); });
    }
    if (Array.isArray(data.leagues)) {
        data.leagues.forEach(l => { if (l.logo && typeof l.logo === 'string' && l.logo.startsWith('http')) urls.add(l.logo); });
    }
    if (Array.isArray(data.countries)) {
        data.countries.forEach(c => { if (c.flag && typeof c.flag === 'string' && c.flag.startsWith('http')) urls.add(c.flag); });
    }
    if (Array.isArray(data.players)) {
        data.players.forEach(p => { if (p.image && typeof p.image === 'string' && p.image.startsWith('http')) urls.add(p.image); });
    }
    if (Array.isArray(data.watchlist)) {
        data.watchlist.forEach(w => { if (w.image && typeof w.image === 'string' && w.image.startsWith('http')) urls.add(w.image); });
    }
    // Also default Unsplash images used in fallbacks
    urls.add('https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop');
    urls.add('https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=200&h=200&fit=crop');

    const urlArray = Array.from(urls);
    if (urlArray.length === 0) {
        this.notify("İndirilecek harici görsel bulunamadı.");
        if (btn) btn.disabled = false;
        this.updateCacheStatusUI();
        return;
    }

    let cachedMap = null;

    // 1. IPC indirmesini dene (Arka plan Node.js servisi)
    if (window.electronAPI && typeof window.electronAPI.cacheImages === 'function') {
        try {
            cachedMap = await window.electronAPI.cacheImages(urlArray);
        } catch (ipcErr) {
            console.warn("IPC cache-images kullanılamadı, alternatif indirme metoduna geçiliyor:", ipcErr);
        }
    }

    // 2. IPC henüz yüklenmediyse (eski ana süreç) tarayıcı üzerinden indirme yedekleme mekanizması
    if (!cachedMap || Object.keys(cachedMap).length === 0) {
        cachedMap = {};
        const batchSize = 5;
        for (let i = 0; i < urlArray.length; i += batchSize) {
            const chunk = urlArray.slice(i, i + batchSize);
            await Promise.all(chunk.map(async (url) => {
                const res = await downloadImageFallback(url);
                if (res) cachedMap[url] = res;
            }));
        }
    }

    if (!this.state.data.cachedImages) this.state.data.cachedImages = {};
    Object.assign(this.state.data.cachedImages, cachedMap);
    this.saveData();

    const count = Object.keys(cachedMap).length;
    this.notify(`${count} ${t('download_complete')}`);

    if (btn) btn.disabled = false;
    this.updateCacheStatusUI();
};

ScoutApp.prototype.clearMediaCache = async function() {
    this.confirmAction("İndirilen tüm görseller silinecek. Önbelleği temizlemek istediğinize emin misiniz?", async () => {
        if (window.electronAPI && window.electronAPI.clearImageCache) {
            await window.electronAPI.clearImageCache();
        }
        if (this.state.data) {
            this.state.data.cachedImages = {};
            this.saveData();
        }
        this.notify(t('cache_cleared'));
        this.updateCacheStatusUI();
    });
};

ScoutApp.prototype.backupData = async function() {
    const result = await window.electronAPI.exportBackup(this.state.data);
    if (result.success) this.notify("Yedekleme başarıyla kaydedildi.");
    else if (!result.cancelled) this.notify("Yedekleme hatası: " + result.error);
};

ScoutApp.prototype.restoreData = async function() {
    this.confirmAction("DİKKAT: Yedek dosyasını yüklediğinizde mevcut veriler silinecek. Devam etmek istiyor musunuz?", async () => {
        const result = await window.electronAPI.importBackup();
        if (result.success && result.data) {
            this.state.data = result.data;
            this.saveData();
            this.notify("Veriler başarıyla yüklendi!");
            setTimeout(() => window.location.reload(), 1500);
        } else if (!result.cancelled) {
            this.notify("Yükleme hatası: " + result.error);
        }
    });
};

ScoutApp.prototype.changeLanguage = function(lang) {
    if (window.setLang) {
        window.setLang(lang);
        this.navigate(this.state.activePage, this.state.lastParams);
        this.updateSidebarUI();
        
        setTimeout(() => {
            const restartBtn = document.getElementById('restart-app-btn');
            if (restartBtn) {
                restartBtn.classList.add('animate-pulse', 'ring-4', 'ring-red-500/50');
                setTimeout(() => restartBtn.classList.remove('animate-pulse', 'ring-4', 'ring-red-500/50'), 1500);
            }
        }, 50);
    }
};

ScoutApp.prototype.restartApp = function() {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-dark-950 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500 opacity-0 backdrop-blur-sm';
    overlay.innerHTML = `
        <div class="w-16 h-16 border-4 border-scout-500/20 border-t-scout-500 rounded-full animate-spin mb-6"></div>
        <div class="text-white font-bold text-xl drop-shadow-md">${window.getLang() === 'en' ? 'Restarting...' : 'Yeniden Başlatılıyor...'}</div>
        <div class="text-slate-500 text-sm mt-2">${window.getLang() === 'en' ? 'Please wait' : 'Lütfen bekleyin'}</div>
    `;
    document.body.appendChild(overlay);
    
    // Trigger fade in animation
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            overlay.classList.remove('opacity-0');
            overlay.classList.add('opacity-100');
        });
    });
    
    setTimeout(() => {
        if (window.electronAPI && typeof window.electronAPI.restartApp === 'function') {
            window.electronAPI.restartApp();
        } else {
            window.location.reload();
        }
    }, 600);
};