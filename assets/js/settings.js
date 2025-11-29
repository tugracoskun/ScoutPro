ScoutApp.prototype.renderSettings = function(c) {
    c.innerHTML = `
        <div class="max-w-3xl mx-auto fade-in space-y-6">
            <div class="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
                <div class="p-6 border-b border-dark-800"><h3 class="text-lg font-bold text-white">Ayarlar</h3></div>
                <div class="p-6 space-y-6">
                    <div class="flex items-center justify-between p-4 bg-dark-950 rounded-xl border border-dark-800">
                        <div class="flex items-center gap-4"><div class="p-3 bg-dark-800 rounded-lg"><i data-lucide="moon" class="w-5 h-5 text-slate-300"></i></div><div><div class="text-white font-medium">Karanlık Mod</div><div class="text-slate-500 text-xs">Varsayılan tema</div></div></div>
                    </div>
                </div>
            </div>
            <div class="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
                <div class="p-6 border-b border-dark-800"><h3 class="text-lg font-bold text-white flex items-center gap-2"><i data-lucide="hard-drive" class="text-scout-500"></i> Veri Yönetimi</h3></div>
                <div class="p-6 space-y-4">
                    <p class="text-sm text-slate-400 mb-4">Verilerinizi yedekleyebilir veya başka bir cihazdan aldığınız yedeği yükleyebilirsiniz.</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button onclick="app.backupData()" class="p-4 bg-dark-950 border border-dark-800 hover:border-scout-500/50 rounded-xl flex items-center gap-4 transition-all group"><div class="w-12 h-12 rounded-lg bg-scout-500/10 flex items-center justify-center text-scout-500 group-hover:bg-scout-500 group-hover:text-white transition-colors"><i data-lucide="download" class="w-6 h-6"></i></div><div class="text-left"><div class="text-white font-bold">Yedek Al (Export)</div><div class="text-xs text-slate-500">Verileri JSON dosyası olarak kaydet.</div></div></button>
                        <button onclick="app.restoreData()" class="p-4 bg-dark-950 border border-dark-800 hover:border-blue-500/50 rounded-xl flex items-center gap-4 transition-all group"><div class="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors"><i data-lucide="upload" class="w-6 h-6"></i></div><div class="text-left"><div class="text-white font-bold">Yedek Yükle (Import)</div><div class="text-xs text-slate-500">JSON dosyasından verileri geri yükle.</div></div></button>
                    </div>
                </div>
            </div>
            <button onclick="window.location.reload()" class="w-full p-4 bg-red-900/10 border border-red-900/30 rounded-xl hover:bg-red-900/20 text-red-400 transition-colors flex items-center justify-center gap-2"><i data-lucide="refresh-cw" class="w-5 h-5"></i> Uygulamayı Yeniden Başlat</button>
        </div>
    `;
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