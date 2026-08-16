// --- OYUNCU DÜZENLEME VE SİLME MODÜLÜ ---

ScoutApp.prototype.openEditPlayerModal = function(id) {
    const p = this.state.data.players.find(x => x.id === id);
    if (!p) return;

    const teams = this.state.data.teams.filter(t => t.type !== 'national').map(t=>({val:t.id, txt:this.getTeamName(t.id), icon: t.logo}));
    const nationalTeams = this.state.data.teams.filter(t => t.type === 'national').map(t=>({val:t.id, txt:this.getTeamName(t.id), icon: t.logo}));
    const container = document.getElementById('modal-content-body');
    
    container.innerHTML = `
        <div class="max-w-2xl mx-auto bg-dark-900 p-8 rounded-3xl border border-dark-800 shadow-2xl mt-10">
            <div class="flex justify-between items-center mb-6 border-b border-dark-800 pb-4">
                <h3 class="text-xl font-bold text-white flex items-center gap-2"><i data-lucide="pencil" class="text-blue-500"></i> ${t('edit')}</h3>
                <button onclick="app.openPlayerModal(${id})" class="text-slate-400 hover:text-white flex items-center gap-1 text-sm"><i data-lucide="arrow-left" class="w-4 h-4"></i> ${t('cancel')}</button>
            </div>
            
            <div class="space-y-4">
                ${this.createInput('edit-p-name', t('player_name'), 'Ad Soyad', 'text', p.name)}
                
                <div class="grid grid-cols-2 gap-4">
                    ${this.createCustomSearchSelect('edit-p-team', 'Kulüb / Gençlik Takımı', 'Takım Ara...', teams, p.teamId, '', false, p.teamId)}
                    ${this.createCustomSearchSelect('edit-p-national-team', 'Milli Takımı', 'Milli Takım Ara...', nationalTeams, p.nationalTeamId)}
                </div>

                <div class="grid grid-cols-4 gap-4">
                    <!-- POZİSYON VE ROL -->
                    <div class="col-span-1">
                        ${this.createSelect('edit-p-pos', t('position'), POSITIONS.map(x=>({val:x, txt:tPos(x)})), p.position, 'app.handleEditPositionChange(this.value)')}
                    </div>
                    <div class="col-span-1">
                        ${this.createSelect('edit-p-role', t('role'), p.position && PLAYER_ROLES[p.position] ? [{val:'', txt:t('role')}].concat(PLAYER_ROLES[p.position].map(r=>({val:r, txt:t(r)}))) : [{val:'', txt:t('role')}], p.role || '')}
                    </div>
                    <!-- YAŞ YERİNE DOĞUM TARİHİ -->
                    <div class="col-span-1 flex flex-col gap-1.5 relative z-10">
                        <label class="text-xs font-bold text-slate-400 ml-1">${t('birth_date')}</label>
                        <input type="date" id="edit-p-birth" value="${p.birthDate || ''}" onchange="app.handleEditBirthDateChange(this.value)" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-scout-500 outline-none text-sm relative z-20">
                    </div>

                    ${this.createInput('edit-p-height', t('height') + ' (cm)', '180', 'number', p.height)}
                    ${this.createSelect('edit-p-foot', t('foot'), [{val:'Sağ', txt:t('foot_right')||'Sağ'}, {val:'Sol', txt:t('foot_left')||'Sol'}, {val:'Her İkisi', txt:t('foot_both')||'Her İkisi'}, {val:'Bilinmiyor', txt:t('unknown')}], p.foot)}
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    ${this.createCustomSearchSelect('edit-p-nationality', t('nationality'), t('nat_search_ph'), [...this.state.data.countries].sort((a,b) => b.isFavorite - a.isFavorite || this.getCountryName(a).localeCompare(this.getCountryName(b))).map(c => ({val: c.id, txt: this.getCountryName(c), icon: c.flag})), p.nationality ? this.getCountryName(this.state.data.countries.find(c => c.name === p.nationality || c.nameEn === p.nationality || c.id == p.nationality) || {name: p.nationality}) : '')}
                    
                    <div class="grid grid-cols-2 gap-3">
                        ${this.createInput('edit-p-market-value', t('market_value'), 'Örn: 5000000', 'number', p.marketValue || '')}
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-bold text-slate-400 ml-1">${t('potential')}</label>
                            <select id="edit-p-potential" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none text-sm">
                                <option value="Düşük" ${p.potential === 'Düşük' ? 'selected' : ''}>${t('potential_low')}</option>
                                <option value="Yüksek" ${p.potential === 'Yüksek' ? 'selected' : ''}>${t('potential_high')}</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div id="edit-u23-national-container" class="${(p.birthDate && this.calculateAge(p.birthDate) <= 23) ? 'flex' : 'hidden'} items-center gap-2 ml-1">
                    <input type="checkbox" id="edit-p-u23-national" ${p.u23National ? 'checked' : ''} class="w-4 h-4 accent-blue-500 rounded cursor-pointer">
                    <label for="edit-p-u23-national" class="text-sm font-bold text-slate-300 cursor-pointer">${t('u23_national')}</label>
                </div>

                ${this.createInput('edit-p-img', t('photo_url'), 'https://...', 'text', p.image)}
                
                <div class="grid grid-cols-2 gap-4">
                    ${this.createInput('edit-p-tm', 'Transfermarkt URL', 'https://...', 'text', p.tmUrl)}
                    ${this.createInput('edit-p-sofa', 'Sofascore URL', 'https://...', 'text', p.sofaUrl)}
                </div>
            </div>

            <button onclick="app.updatePlayer(${id})" class="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all">
                <i data-lucide="save" class="w-5 h-5"></i> ${t('save')}
            </button>
        </div>
    `;
    lucide.createIcons();
    // Orijinal takım ID'sini kaydet (transfer tespiti için)
    const teamInput = document.getElementById('edit-p-team');
    if (teamInput) teamInput.dataset.originalTeamId = p.teamId || '';
};

// --- OYUNCU DÜZENLEME (Otomatik Yaş Hesaplama ve U23) ---
ScoutApp.prototype.handleEditBirthDateChange = function(val) {
    const age = this.calculateAge(val);
    const u23Container = document.getElementById('edit-u23-national-container');
    if (u23Container) {
        if (age <= 23) {
            u23Container.classList.remove('hidden');
            u23Container.classList.add('flex');
        } else {
            u23Container.classList.add('hidden');
            u23Container.classList.remove('flex');
            document.getElementById('edit-p-u23-national').checked = false;
        }
    }
};

ScoutApp.prototype.handleEditPositionChange = function(val) {
    const roleSelect = document.getElementById('edit-p-role');
    if (roleSelect) {
        let html = `<option value="">${t('role')}</option>`;
        if (PLAYER_ROLES[val]) {
            PLAYER_ROLES[val].forEach(r => {
                html += `<option value="${r}">${t(r)}</option>`;
            });
        }
        roleSelect.innerHTML = html;
    }
};

ScoutApp.prototype.updatePlayer = function(id) {
    const p = this.state.data.players.find(x => x.id === id);
    if (!p) return;

    const name = document.getElementById('edit-p-name').value.trim();
    const teamId = document.getElementById('edit-p-team').value;
    const nationalTeamId = document.getElementById('edit-p-national-team').value;
    const birthDate = document.getElementById('edit-p-birth').value;
    
    if (!name || (!teamId && !nationalTeamId)) return alert("Oyuncuya en az bir kulüp veya milli takım atanmalıdır.");
    if (!birthDate) return alert(t('err_incomplete'));

    p.name = name;
    p.teamId = teamId ? parseInt(teamId) : null;
    p.nationalTeamId = nationalTeamId ? parseInt(nationalTeamId) : null;
    p.position = document.getElementById('edit-p-pos').value;
    p.role = document.getElementById('edit-p-role').value;
    p.birthDate = birthDate; // Tarihi kaydet
    
    // Yeni eklenen alanlar
    p.nationality = document.getElementById('edit-p-nationality').value.trim();
    p.u23National = document.getElementById('edit-u23-national-container').classList.contains('hidden') ? false : document.getElementById('edit-p-u23-national').checked;

    // Yaşı dinamik hesapla ve kaydet
    p.age = this.calculateAge(birthDate);

    const mvEl = document.getElementById('edit-p-market-value');
    if (mvEl) {
        p.marketValue = mvEl.value;
        if (p.history && p.history.length > 0) {
            p.history[0].marketValue = mvEl.value;
        }
    }

    p.height = document.getElementById('edit-p-height').value;
    p.foot = document.getElementById('edit-p-foot').value;
    p.potential = document.getElementById('edit-p-potential').value;
    p.image = document.getElementById('edit-p-img').value;
    p.tmUrl = document.getElementById('edit-p-tm').value;
    p.sofaUrl = document.getElementById('edit-p-sofa').value;

    this.saveData(); // Kalıcı Kayıt
    this.notify(t('success'));
    this.openPlayerModal(id); // Detay sayfasına geri dön
};

// --- OYUNCU SİLME ---
ScoutApp.prototype.deletePlayer = function(id) {
    this.confirmAction(t('confirm_delete'), () => {
        this.state.data.players = this.state.data.players.filter(x => x.id !== id);
        // İlişkili verileri temizle
        this.state.data.watchlist = this.state.data.watchlist.filter(w => w.id !== id);
        this.state.data.matches = this.state.data.matches.filter(m => m.targetPlayerId != id);
        
        this.saveData();
        this.closeModal();
        
        if(this.state.activePage === 'players') {
            this.renderPlayers(document.getElementById('content-area'));
        } else {
            this.navigate('players');
        }
        
        this.notify(t('deleted_success'));
    });
};

// --- TRANSFER TESPİTİ & DİYALOG ---
ScoutApp.prototype.onEditTeamChange = function(playerId, newTeamId, newTeamTxt, newTeamIcon) {
    const teamInput = document.getElementById('edit-p-team');
    const originalTeamId = teamInput ? (teamInput.dataset.originalTeamId || '') : '';
    const newId = String(newTeamId);
    const oldId = String(originalTeamId);

    // Aynı takım seçildiyse veya orijinal boşsa diyalog açma
    if (!oldId || newId === oldId) return;

    // Yeni takım bilgisini geçici kaydet
    this.state.tempData.pendingTransfer = { playerId, newTeamId: parseInt(newTeamId), newTeamTxt, newTeamIcon };

    const oldTeam = this.state.data.teams.find(t => t.id == originalTeamId);
    const oldTeamName = oldTeam ? this.getTeamName(oldTeam.id) : 'Önceki Takım';
    const oldTeamLogo = oldTeam ? oldTeam.logo : '';
    
    const newTeam = this.state.data.teams.find(t => t.id == newTeamId);
    const newTeamLogo = newTeam ? newTeam.logo : (newTeamIcon || '');

    // Transfer sorgu modalı - Ultra Modern ScoutPro UI
    const modalHtml = `
        <div class="p-7 max-w-lg mx-auto space-y-6 animate-fade-in">
            <!-- Header -->
            <div class="flex items-center justify-between pb-4 border-b border-dark-800/80">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/5">
                        <i data-lucide="arrow-right-left" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h3 class="text-base font-bold text-white tracking-wide">Takım Değişikliği Algılandı</h3>
                        <p class="text-xs text-slate-400">Bu işlem için bir işlem türü belirleyin</p>
                    </div>
                </div>
                <button onclick="app.cancelTransferChoice()" class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-800 transition-colors">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>
            </div>

            <!-- Transfer Görsel Özeti -->
            <div class="bg-gradient-to-r from-dark-900 via-dark-800/50 to-dark-900 p-4 rounded-2xl border border-dark-750/70 flex items-center justify-between shadow-inner">
                <!-- Eski Takım -->
                <div class="flex items-center gap-3 min-w-0 flex-1">
                    <div class="w-11 h-11 rounded-xl bg-dark-950 border border-dark-700/80 p-1.5 flex items-center justify-center shrink-0 shadow-md">
                        ${this.getLogoDisplayHTML(oldTeamLogo, "w-full h-full object-contain")}
                    </div>
                    <div class="min-w-0">
                        <span class="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">Eski Kulüp</span>
                        <span class="text-xs font-bold text-slate-200 truncate block">${oldTeamName}</span>
                    </div>
                </div>

                <!-- Transfer Oku -->
                <div class="px-3 flex flex-col items-center justify-center">
                    <div class="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-sm">
                        <i data-lucide="arrow-right" class="w-4 h-4 animate-pulse"></i>
                    </div>
                </div>

                <!-- Yeni Takım -->
                <div class="flex items-center gap-3 min-w-0 flex-1 justify-end text-right">
                    <div class="min-w-0">
                        <span class="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">Yeni Kulüp</span>
                        <span class="text-xs font-bold text-white truncate block">${newTeamTxt}</span>
                    </div>
                    <div class="w-11 h-11 rounded-xl bg-dark-950 border border-emerald-500/30 p-1.5 flex items-center justify-center shrink-0 shadow-md">
                        ${this.getLogoDisplayHTML(newTeamLogo, "w-full h-full object-contain")}
                    </div>
                </div>
            </div>

            <!-- Seçenek Kartları -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <!-- Yanlışlığı Düzeltiyorum -->
                <button onclick="app.confirmTransferChoice('mistake')" 
                        class="group p-5 rounded-2xl border border-dark-700/80 bg-dark-900/60 hover:bg-dark-800 hover:border-slate-500/60 transition-all duration-200 text-left flex flex-col justify-between relative overflow-hidden shadow-lg hover:shadow-dark-900">
                    <div class="w-10 h-10 rounded-xl bg-dark-800 border border-dark-700 text-slate-400 group-hover:text-white group-hover:border-slate-600 flex items-center justify-center mb-3 transition-colors">
                        <i data-lucide="rotate-ccw" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <span class="text-sm font-bold text-white block mb-1 group-hover:text-slate-100">Yanlışlığı Düzelttim</span>
                        <span class="text-[11px] text-slate-400 leading-relaxed block">Transfer kaydı oluşturulmaz. Sadece hatalı kulüp seçimi güncellenir.</span>
                    </div>
                </button>

                <!-- Transfer Oldu -->
                <button onclick="app.confirmTransferChoice('transfer')" 
                        class="group p-5 rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-emerald-500/10 to-dark-900/80 hover:from-emerald-500/20 hover:border-emerald-400 transition-all duration-200 text-left flex flex-col justify-between relative overflow-hidden shadow-lg shadow-emerald-950/20">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <i data-lucide="sparkles" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <div class="flex items-center gap-1.5 mb-1">
                            <span class="text-sm font-bold text-emerald-300">Oyuncu Transfer Oldu</span>
                        </div>
                        <span class="text-[11px] text-emerald-200/60 leading-relaxed block">Bonservis, kiralık vb. detayları girip oyuncunun kariyer geçmişine işleyin.</span>
                    </div>
                </button>
            </div>

            <!-- Alt İptal Butonu -->
            <div class="pt-2">
                <button onclick="app.cancelTransferChoice()" class="w-full py-3 rounded-xl border border-dark-700/60 hover:bg-dark-800/80 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center gap-2">
                    <i data-lucide="undo-2" class="w-3.5 h-3.5"></i>
                    Vazgeç ve Eski Takımı Koru
                </button>
            </div>
        </div>
    `;
    this.showModal(modalHtml);
    setTimeout(() => { if (window.lucide) window.lucide.createIcons(); }, 10);
};

ScoutApp.prototype.confirmTransferChoice = function(choice) {
    const pending = this.state.tempData.pendingTransfer;
    if (!pending) {
        this.closeModal();
        return;
    }

    const p = this.state.data.players.find(x => x.id === pending.playerId);

    if (choice === 'mistake') {
        // Takımı doğrudan yeni takıma güncelle ve kaydet
        if (p) {
            p.teamId = pending.newTeamId;
            this.saveData();
        }
        this.state.tempData.pendingTransfer = null;
        
        // Düzenleme ekranına yeni takımla geri dön
        this.openEditPlayerModal(pending.playerId);
        this.notify('Kulüp bilgisi güncellendi.');
        return;
    }

    // Transfer detay modalı
    const oldTeamId = (p && p.teamId) || (document.getElementById('edit-p-team')?.dataset.originalTeamId);
    const oldTeam = this.state.data.teams.find(t => t.id == oldTeamId);
    const oldTeamName = oldTeam ? this.getTeamName(oldTeam.id) : 'Önceki Takım';
    const oldTeamLogo = oldTeam ? oldTeam.logo : '';

    const newTeam = this.state.data.teams.find(t => t.id === pending.newTeamId);
    const newTeamLogo = newTeam ? newTeam.logo : (pending.newTeamIcon || '');

    const transferTypes = [
        { id: 'Bonservis', label: 'Bonservis', icon: 'banknote', desc: 'Kalıcı Transfer' },
        { id: 'Kiralık', label: 'Kiralık', icon: 'clock', desc: 'Geçici Transfer' },
        { id: 'Serbest Transfer', label: 'Serbest', icon: 'user-check', desc: 'Bedelsiz İmza' },
        { id: 'Yetiştirme Tazminatı', label: 'Altyapı / Yetiştirme', icon: 'graduation-cap', desc: 'Akademi Geçişi' }
    ];

    const detailHtml = `
        <div class="p-7 max-w-xl mx-auto space-y-6 animate-fade-in">
            <!-- Header -->
            <div class="flex items-center justify-between pb-4 border-b border-dark-800/80">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/5">
                        <i data-lucide="trending-up" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h3 class="text-base font-bold text-white tracking-wide">Transfer Detayları</h3>
                        <p class="text-xs text-slate-400">Tüm alanlar opsiyoneldir, dilediğinizi doldurabilirsiniz</p>
                    </div>
                </div>
                <button onclick="app.cancelTransferChoice()" class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-800 transition-colors">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>
            </div>

            <!-- Mini Takım Özeti -->
            <div class="bg-dark-900/90 border border-dark-750 p-3.5 rounded-2xl flex items-center justify-between px-5">
                <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-lg bg-dark-950 p-1 border border-dark-700 flex items-center justify-center shrink-0">
                        ${this.getLogoDisplayHTML(oldTeamLogo, "w-full h-full object-contain")}
                    </div>
                    <span class="text-xs font-bold text-slate-300 truncate max-w-[140px]">${oldTeamName}</span>
                </div>
                <div class="flex items-center gap-2 text-emerald-400">
                    <span class="text-[11px] font-bold uppercase tracking-wider">Transfer</span>
                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </div>
                <div class="flex items-center gap-2.5">
                    <span class="text-xs font-bold text-white truncate max-w-[140px]">${pending.newTeamTxt}</span>
                    <div class="w-8 h-8 rounded-lg bg-dark-950 p-1 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        ${this.getLogoDisplayHTML(newTeamLogo, "w-full h-full object-contain")}
                    </div>
                </div>
            </div>

            <!-- Transfer Şekli (Seçilebilir Butonlar) -->
            <div class="space-y-2">
                <label class="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <i data-lucide="layers" class="w-3.5 h-3.5 text-emerald-400"></i> Transfer Şekli
                </label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5" id="transfer-type-selector">
                    ${transferTypes.map((t, idx) => `
                        <button type="button" 
                                onclick="app.selectTransferType('${t.id}')"
                                id="tr-type-btn-${t.id.replace(/[^a-zA-Z0-9]/g, '')}"
                                class="tr-type-btn p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between gap-1.5 ${idx === 0 ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md shadow-emerald-950/30' : 'bg-dark-900 border-dark-700 text-slate-400 hover:text-slate-200 hover:border-dark-600'}">
                            <div class="flex items-center justify-between w-full">
                                <i data-lucide="${t.icon}" class="w-4 h-4 ${idx === 0 ? 'text-emerald-400' : 'text-slate-500'}"></i>
                                <span class="w-2 h-2 rounded-full ${idx === 0 ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-dark-700'}"></span>
                            </div>
                            <div>
                                <span class="text-xs font-bold block leading-tight">${t.label}</span>
                                <span class="text-[9px] opacity-60 block">${t.desc}</span>
                            </div>
                        </button>
                    `).join('')}
                </div>
                <input type="hidden" id="selected-transfer-type" value="Bonservis">
            </div>

            <!-- Form Alanları -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Transfer Bedeli -->
                <div class="space-y-1.5">
                    <label class="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <i data-lucide="circle-dollar-sign" class="w-3.5 h-3.5 text-emerald-400"></i> Transfer Bedeli (€)
                    </label>
                    <div class="relative">
                        <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">€</span>
                        <input type="number" id="transfer-fee" placeholder="Örn: 2500000" class="w-full bg-dark-950 border border-dark-700 rounded-xl pl-8 pr-4 py-2.5 text-white text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all placeholder:text-slate-600">
                    </div>
                </div>

                <!-- Sözleşme Süresi -->
                <div class="space-y-1.5">
                    <label class="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <i data-lucide="file-text" class="w-3.5 h-3.5 text-emerald-400"></i> Sözleşme Süresi
                    </label>
                    <input type="text" id="transfer-contract" placeholder="Örn: 3 Yıl (2029)" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all placeholder:text-slate-600">
                </div>

                <!-- Transfer Tarihi -->
                <div class="space-y-1.5">
                    <label class="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <i data-lucide="calendar" class="w-3.5 h-3.5 text-emerald-400"></i> Transfer Tarihi
                    </label>
                    <input type="date" id="transfer-date" value="${new Date().toISOString().split('T')[0]}" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all">
                </div>

                <!-- Not / Detay -->
                <div class="space-y-1.5">
                    <label class="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <i data-lucide="message-square" class="w-3.5 h-3.5 text-emerald-400"></i> Not (Opsiyonel)
                    </label>
                    <input type="text" id="transfer-note" placeholder="Örn: %20 sonraki satış payı" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all placeholder:text-slate-600">
                </div>
            </div>

            <!-- Butonlar -->
            <div class="flex items-center gap-3 pt-3 border-t border-dark-800/80">
                <button onclick="app.cancelTransferChoice()" class="w-1/3 py-3 px-4 rounded-xl border border-dark-700 bg-dark-900 hover:bg-dark-800 text-slate-300 text-xs font-bold transition-all text-center">
                    Vazgeç
                </button>
                <button onclick="app.saveTransferData(${pending.playerId})" class="w-2/3 py-3 px-4 bg-gradient-to-r from-emerald-600 to-scout-600 hover:from-emerald-500 hover:to-scout-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all">
                    <i data-lucide="check" class="w-4 h-4"></i> Transferi Onayla & Kaydet
                </button>
            </div>
        </div>
    `;
    this.showModal(detailHtml);
    setTimeout(() => { if (window.lucide) window.lucide.createIcons(); }, 10);
};

ScoutApp.prototype.selectTransferType = function(typeId) {
    const hiddenInput = document.getElementById('selected-transfer-type');
    if (hiddenInput) hiddenInput.value = typeId;

    const allButtons = document.querySelectorAll('.tr-type-btn');
    allButtons.forEach(btn => {
        btn.classList.remove('bg-emerald-500/15', 'border-emerald-500', 'text-white', 'shadow-md', 'shadow-emerald-950/30');
        btn.classList.add('bg-dark-900', 'border-dark-700', 'text-slate-400');
        
        const dot = btn.querySelector('span.rounded-full');
        if (dot) {
            dot.className = 'w-2 h-2 rounded-full bg-dark-700';
        }
        const icon = btn.querySelector('svg');
        if (icon) icon.classList.remove('text-emerald-400');
    });

    const activeBtn = document.getElementById(`tr-type-btn-${typeId.replace(/[^a-zA-Z0-9]/g, '')}`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-dark-900', 'border-dark-700', 'text-slate-400');
        activeBtn.classList.add('bg-emerald-500/15', 'border-emerald-500', 'text-white', 'shadow-md', 'shadow-emerald-950/30');
        
        const dot = activeBtn.querySelector('span.rounded-full');
        if (dot) {
            dot.className = 'w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400';
        }
        const icon = activeBtn.querySelector('svg');
        if (icon) icon.classList.add('text-emerald-400');
    }
};

ScoutApp.prototype.saveTransferData = function(playerId) {
    const pending = this.state.tempData.pendingTransfer;
    if (!pending) { this.closeModal(); return; }

    const p = this.state.data.players.find(x => x.id === playerId);
    if (!p) { this.closeModal(); return; }

    const type = document.getElementById('selected-transfer-type')?.value || 'Bonservis';
    const fee = document.getElementById('transfer-fee')?.value || '';
    const contract = document.getElementById('transfer-contract')?.value || '';
    const date = document.getElementById('transfer-date')?.value || new Date().toISOString().split('T')[0];
    const note = document.getElementById('transfer-note')?.value || '';

    const oldTeamId = p.teamId;

    // Transfer geçmişini kaydet
    if (!p.transfers) p.transfers = [];
    p.transfers.push({
        id: Date.now(),
        date,
        fromTeamId: oldTeamId || null,
        toTeamId: pending.newTeamId,
        toTeamName: pending.newTeamTxt,
        type: type,
        fee: fee ? parseInt(fee) : null,
        contract,
        note
    });

    // Oyuncunun takımını güncelle ve kalıcı kaydet
    p.teamId = pending.newTeamId;

    this.saveData();
    this.state.tempData.pendingTransfer = null;
    
    // Düzenleme ekranına güncel takımla geri dön
    this.openEditPlayerModal(playerId);

    this.notify(`✅ Transfer kaydedildi — ${pending.newTeamTxt}`);
};

ScoutApp.prototype.cancelTransferChoice = function() {
    const pending = this.state.tempData.pendingTransfer;
    if (pending && pending.playerId) {
        const playerId = pending.playerId;
        this.state.tempData.pendingTransfer = null;
        // Eski takımı koruyarak düzenleme modalına dön
        this.openEditPlayerModal(playerId);
    } else {
        this.closeModal();
    }
};