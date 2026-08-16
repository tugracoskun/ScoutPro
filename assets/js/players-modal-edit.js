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

// --- TRANSFER TESPETİ & DİYALOG ---
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
    const oldTeamName = oldTeam ? this.getTeamName(oldTeam.id) : 'Bilinmiyor';

    // Transfer sorgu modalı
    const modalHtml = `
        <div class="p-6 space-y-4 max-w-md">
            <div class="flex items-start gap-4">
                <div class="p-3 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                    <i data-lucide="arrow-right-left" class="w-6 h-6"></i>
                </div>
                <div>
                    <h3 class="text-base font-bold text-white mb-1">Takım değiştirildi</h3>
                    <p class="text-sm text-slate-400">Oyuncunun takımını <span class="text-white font-semibold">${oldTeamName}</span>'dan <span class="text-white font-semibold">${newTeamTxt}</span>'a geçirmek istiyorsunuz. Sebebi nedir?</p>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-3 pt-2">
                <button onclick="app.confirmTransferChoice('mistake')" class="flex flex-col items-center gap-2 p-4 rounded-xl border border-dark-700 bg-dark-800 hover:border-slate-500 hover:bg-dark-700 transition-all text-center">
                    <i data-lucide="rotate-ccw" class="w-5 h-5 text-slate-400"></i>
                    <span class="text-xs font-bold text-slate-300">Yanlışlığı Düzelttim</span>
                    <span class="text-[10px] text-slate-600">Sadece hatayı düzelttim</span>
                </button>
                <button onclick="app.confirmTransferChoice('transfer')" class="flex flex-col items-center gap-2 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/60 hover:bg-emerald-500/10 transition-all text-center">
                    <i data-lucide="trending-up" class="w-5 h-5 text-emerald-400"></i>
                    <span class="text-xs font-bold text-emerald-300">Transfer Oldu</span>
                    <span class="text-[10px] text-slate-500">Transfer detayı gir</span>
                </button>
            </div>
            <button onclick="app.cancelTransferChoice()" class="w-full text-xs text-slate-500 hover:text-slate-300 py-2 transition-colors">Vazgeç (eski takımı koru)</button>
        </div>
    `;
    this.showModal(modalHtml);
    setTimeout(() => { if (window.lucide) window.lucide.createIcons(); }, 10);
};

ScoutApp.prototype.confirmTransferChoice = function(choice) {
    this.closeModal();
    const pending = this.state.tempData.pendingTransfer;
    if (!pending) return;

    if (choice === 'mistake') {
        // Sadece takımı güncelle, kayıt yok
        this.state.tempData.pendingTransfer = null;
        this.notify('Takım güncellendi.');
        return;
    }

    // Transfer detay modalı
    const teams = this.state.data.teams.filter(t => t.type !== 'national');
    const newTeam = teams.find(t => t.id === pending.newTeamId);

    const detailHtml = `
        <div class="p-6 space-y-4 max-w-md">
            <div class="flex items-center gap-3 mb-1">
                <div class="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <i data-lucide="trending-up" class="w-5 h-5"></i>
                </div>
                <div>
                    <h3 class="text-base font-bold text-white">Transfer Detayları</h3>
                    <p class="text-xs text-slate-500">${pending.newTeamTxt} &mdash; Tüm alanlar opsiyoneldir</p>
                </div>
            </div>

            <div class="space-y-3">
                <!-- Transfer Şekli -->
                <div class="flex flex-col gap-1.5">
                    <label class="text-xs font-bold text-slate-400">Transfer Şekli</label>
                    <div class="flex gap-2">
                        ${['Bonservis','Kiralık','Serbest Transfer','Yetisştirme Tazminatı'].map(s =>
                            `<label class="flex items-center gap-1.5 cursor-pointer">
                                <input type="radio" name="transfer-type" value="${s}" class="accent-emerald-500">
                                <span class="text-xs text-slate-300">${s}</span>
                            </label>`
                        ).join('')}
                    </div>
                </div>

                <!-- Transfer Bedeli -->
                <div class="flex flex-col gap-1.5">
                    <label class="text-xs font-bold text-slate-400">Transfer Bedeli (€)</label>
                    <input type="number" id="transfer-fee" placeholder="Örn: 2000000" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600">
                </div>

                <!-- Sözleşme -->
                <div class="flex flex-col gap-1.5">
                    <label class="text-xs font-bold text-slate-400">Sözleşme Süresi</label>
                    <input type="text" id="transfer-contract" placeholder="Örn: 2026-07 veya 2 yıl" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600">
                </div>

                <!-- Transfer Tarihi -->
                <div class="flex flex-col gap-1.5">
                    <label class="text-xs font-bold text-slate-400">Transfer Tarihi</label>
                    <input type="date" id="transfer-date" value="${new Date().toISOString().split('T')[0]}" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-emerald-500 transition-colors">
                </div>

                <!-- Not -->
                <div class="flex flex-col gap-1.5">
                    <label class="text-xs font-bold text-slate-400">Not (opsiyonel)</label>
                    <textarea id="transfer-note" rows="2" placeholder="Ek notlar..." class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600 resize-none"></textarea>
                </div>
            </div>

            <div class="flex gap-3 pt-1">
                <button onclick="app.saveTransferData(${pending.playerId})" class="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all">
                    <i data-lucide="check" class="w-4 h-4"></i> Transferi Kaydet
                </button>
                <button onclick="app.cancelTransferChoice()" class="px-5 py-3 bg-dark-800 hover:bg-dark-700 text-slate-300 font-bold rounded-xl text-sm transition-all">
                    Vazgeç
                </button>
            </div>
        </div>
    `;
    this.showModal(detailHtml);
    setTimeout(() => { if (window.lucide) window.lucide.createIcons(); }, 10);
};

ScoutApp.prototype.saveTransferData = function(playerId) {
    const pending = this.state.tempData.pendingTransfer;
    if (!pending) { this.closeModal(); return; }

    const p = this.state.data.players.find(x => x.id === playerId);
    if (!p) { this.closeModal(); return; }

    const typeEl = document.querySelector('input[name="transfer-type"]:checked');
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
        type: typeEl ? typeEl.value : '',
        fee: fee ? parseInt(fee) : null,
        contract,
        note
    });

    // Oyuncunun takımını güncelle
    p.teamId = pending.newTeamId;

    this.saveData();
    this.state.tempData.pendingTransfer = null;
    this.closeModal();

    // Edit modal'daki orijinal teamId'yi güncelle
    const teamInput = document.getElementById('edit-p-team');
    if (teamInput) teamInput.dataset.originalTeamId = String(pending.newTeamId);

    this.notify(`✅ Transfer kaydedildi — ${pending.newTeamTxt}`);
};

ScoutApp.prototype.cancelTransferChoice = function() {
    const pending = this.state.tempData.pendingTransfer;
    if (pending) {
        // Eski takımı geri yükle
        const teamInput = document.getElementById('edit-p-team');
        const originalTeamId = teamInput ? (teamInput.dataset.originalTeamId || '') : '';
        if (teamInput && originalTeamId) {
            const oldTeam = this.state.data.teams.find(t => t.id == originalTeamId);
            teamInput.value = originalTeamId;
            const textInput = document.getElementById('edit-p-team-input');
            if (textInput && oldTeam) textInput.value = this.getTeamName(oldTeam.id);
        }
        this.state.tempData.pendingTransfer = null;
    }
    this.closeModal();
};