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
                    ${this.createCustomSearchSelect('edit-p-team', 'Kulüp Takımı', 'Kulüp Ara...', teams, p.teamId)}
                    ${this.createCustomSearchSelect('edit-p-national-team', 'Milli Takımı', 'Milli Takım Ara...', nationalTeams, p.nationalTeamId)}
                </div>

                <div class="grid grid-cols-4 gap-4">
                    <!-- POZİSYON -->
                    <div class="col-span-1">
                        ${this.createSelect('edit-p-pos', t('position'), POSITIONS.map(x=>({val:x, txt:tPos(x)})), p.position)}
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
                    
                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-slate-400 ml-1">${t('potential')}</label>
                        <select id="edit-p-potential" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none text-sm">
                            <option value="Düşük" ${p.potential === 'Düşük' ? 'selected' : ''}>${t('potential_low')}</option>
                            <option value="Yüksek" ${p.potential === 'Yüksek' ? 'selected' : ''}>${t('potential_high')}</option>
                        </select>
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
    p.birthDate = birthDate; // Tarihi kaydet
    
    // Yeni eklenen alanlar
    p.nationality = document.getElementById('edit-p-nationality').value.trim();
    p.u23National = document.getElementById('edit-u23-national-container').classList.contains('hidden') ? false : document.getElementById('edit-p-u23-national').checked;

    // Yaşı dinamik hesapla ve kaydet
    p.age = this.calculateAge(birthDate);

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