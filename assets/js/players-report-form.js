// --- YENİ RAPOR: SOL KOLON (FORM GİRİŞLERİ) ---

ScoutApp.prototype.getReportFormHTML = function() {
    const teams = this.state.data.teams.map(t=>({val:t.id, txt:t.name}));
    const r = this.state.newReport;

    return `
        <div class="lg:col-span-4 space-y-6">
            
            <!-- KİMLİK KARTI -->
            <div class="bg-dark-900 p-6 rounded-2xl border border-dark-800 space-y-4">
                <h3 class="text-lg font-bold text-white mb-4 flex gap-2"><i data-lucide="user" class="text-scout-400 w-5 h-5"></i> Kimlik</h3>
                
                ${this.createInput('rep-name', 'Adı Soyadı', 'Örn: Semih', 'text', r.name, "app.updateRep('name', this.value)")}
                
                ${teams.length > 0 
                    ? this.createSelect('rep-team', 'Takım', teams, r.teamId, "app.updateRep('teamId', this.value)") 
                    : '<div class="p-3 bg-red-900/20 border border-red-900/50 rounded text-red-400 text-xs">Önce Veritabanından Takım Ekleyiniz!</div>'}
                
                <div class="grid grid-cols-2 gap-4">
                    ${this.createSelect('rep-pos', 'Mevki', POSITIONS.map(p=>({val:p, txt:p})), r.position, 'app.handlePositionChange(this.value)')}
                    
                    <!-- DOĞUM TARİHİ -->
                    <div class="flex flex-col gap-1.5 relative z-10">
                        <label class="text-xs font-bold text-slate-400 ml-1 flex justify-between">
                            Doğum Tarihi
                            <span id="calculated-age-display" class="text-scout-400 font-mono"></span>
                        </label>
                        <input 
                            type="date" 
                            id="rep-birth" 
                            value="${r.birthDate || ''}" 
                            onchange="app.updateBirthDate(this.value)"
                            class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-scout-500 outline-none transition-all text-sm relative z-20"
                        >
                    </div>
                </div>

                <!-- YAŞA ÖZEL SCOUT İPUCU KUTUSU (Otomatik dolar) -->
                <div id="age-specific-tips" class="hidden bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 text-xs space-y-2 animate-fade-in"></div>

                <!-- BOY VE AYAK -->
                <div class="grid grid-cols-2 gap-4">
                    ${this.createInput('rep-height', 'Boy (cm)', '185', 'number', r.height, "app.updateRep('height', this.value)")}
                    ${this.createSelect('rep-foot', 'Kullandığı Ayak', [{val:'Sağ', txt:'Sağ'}, {val:'Sol', txt:'Sol'}, {val:'Her İkisi', txt:'Her İkisi'}], r.foot, "app.updateRep('foot', this.value)")}
                </div>

                <div class="flex flex-col gap-1.5">
                    <label class="text-xs font-bold text-slate-400 ml-1">Potansiyel Durumu</label>
                    <div class="relative">
                        <select onchange="app.updateRep('potential', this.value)" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-scout-500 outline-none appearance-none text-sm cursor-pointer">
                            <option value="Düşük" ${r.potential === 'Düşük' ? 'selected' : ''}>Düşük (Standart)</option>
                            <option value="Yüksek" ${r.potential === 'Yüksek' ? 'selected' : ''}>Yüksek (Gelişime Açık)</option>
                        </select>
                        <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"><i data-lucide="chevron-down" class="w-4 h-4"></i></div>
                    </div>
                </div>

                ${this.createInput('rep-source', 'Keşif Kaynağı', 'Örn: Altyapı', 'text', r.source, "app.updateRep('source', this.value)")}
            </div>
            
            <!-- BAĞLANTILAR -->
            <div class="bg-dark-900 p-6 rounded-2xl border border-dark-800 space-y-4">
                <h3 class="text-lg font-bold text-white mb-4 flex gap-2"><i data-lucide="link" class="text-scout-400 w-5 h-5"></i> Bağlantılar</h3>
                ${this.createInput('rep-tm', 'Transfermarkt URL', 'https://...', 'text', r.tmUrl, "app.updateRep('tmUrl', this.value)")}
                ${this.createInput('rep-sofa', 'Sofascore URL', 'https://...', 'text', r.sofaUrl, "app.updateRep('sofaUrl', this.value)")}
            </div>
            
            <!-- MEDYA -->
            <div class="bg-dark-900 p-6 rounded-2xl border border-dark-800">
                <h3 class="text-lg font-bold text-white mb-4 flex gap-2"><i data-lucide="image" class="text-scout-400 w-5 h-5"></i> Medya (Fotoğraf)</h3>
                <div class="flex gap-2 items-end">
                    <div class="flex-1">${this.createInput('rep-img', 'Foto URL', 'https://...', 'text', r.image, "app.updateRep('image', this.value)")}</div>
                </div>
            </div>
        </div>
    `;
};