// --- YENİ RAPORLAMA: GÖRÜNÜM (ANA İSKELET) ---

ScoutApp.prototype.renderNewReport = function(c) {
    const teams = this.state.data.teams.map(t=>({val:t.id, txt:t.name}));
    const currentPos = this.state.newReport.position;

    c.innerHTML = `
        <div class="max-w-6xl mx-auto fade-in grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- SOL KOLON: KİMLİK & MEDYA -->
            <div class="lg:col-span-4 space-y-6">
                
                <div class="bg-dark-900 p-6 rounded-2xl border border-dark-800 space-y-4">
                    <h3 class="text-lg font-bold text-white mb-4 flex gap-2"><i data-lucide="user" class="text-scout-400 w-5 h-5"></i> Kimlik</h3>
                    
                    ${this.createInput('rep-name', 'Adı Soyadı', 'Örn: Semih', 'text', this.state.newReport.name, "app.updateRep('name', this.value)")}
                    
                    ${teams.length > 0 
                        ? this.createSelect('rep-team', 'Takım', teams, this.state.newReport.teamId, "app.updateRep('teamId', this.value)") 
                        : '<div class="p-3 bg-red-900/20 border border-red-900/50 rounded text-red-400 text-xs">Önce Veritabanından Takım Ekleyiniz!</div>'}
                    
                    <div class="grid grid-cols-2 gap-4">
                        ${this.createSelect('rep-pos', 'Mevki', POSITIONS.map(p=>({val:p, txt:p})), currentPos, 'app.handlePositionChange(this.value)')}
                        
                        <!-- DOĞUM TARİHİ -->
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
                    <div class="flex gap-2 items-end">
                        <div class="flex-1">${this.createInput('rep-img', 'Foto URL', 'https://...', 'text', this.state.newReport.image, "app.updateRep('image', this.value)")}</div>
                    </div>
                </div>
            </div>

            <!-- SAĞ KOLON: ANALİZ -->
            <div class="lg:col-span-8 bg-dark-900 p-8 rounded-2xl border border-dark-800 flex flex-col h-full relative overflow-hidden">
                
                <div class="flex justify-between items-center sticky top-0 bg-dark-900 z-50 py-4 border-b border-dark-800/50 mb-4">
                    <h3 class="text-xl font-bold text-white">Yetenek Analizi</h3>
                    <div class="bg-dark-950 px-4 py-2 rounded-lg border border-dark-800 flex items-center gap-3">
                        <span class="text-slate-400 text-sm">Genel Puan:</span>
                        <div id="rep-avg-badge" class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 bg-dark-900 text-slate-500 border-slate-700">-</div>
                    </div>
                </div>
                
                <!-- SLIDER ALANI (Inputs.js dolduracak) -->
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

    setTimeout(() => {
        this.initReportRadar([], []);
        if (currentPos) {
            this.handlePositionChange(currentPos, false); 
        }
    }, 150);
};