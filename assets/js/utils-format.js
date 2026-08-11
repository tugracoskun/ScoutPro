// --- HESAPLAMA VE FORMATLAMA ---

// Yaş Hesaplama (Doğum Tarihinden)
ScoutApp.prototype.calculateAge = function(birthDateString) {
    if (!birthDateString) return '-';
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

// Tarih Formatlama (Örn: 20 Kasım 2002)
ScoutApp.prototype.formatDatePretty = function(dateString) {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const locale = (window.getLang && window.getLang() === 'en') ? 'en-US' : 'tr-TR';
    try {
        return new Date(dateString).toLocaleDateString(locale, options);
    } catch (e) {
        return dateString;
    }
};

// Harf Notu Hesaplama
ScoutApp.prototype.getGrade = function(score) {
    if (score >= 90) return { letter: 'A+', color: 'text-green-400', border: 'border-green-500', shadow: 'shadow-green-500/50', bg: 'bg-green-500/10' };
    if (score >= 85) return { letter: 'A',  color: 'text-green-500', border: 'border-green-600', shadow: 'shadow-green-600/50', bg: 'bg-green-600/10' };
    if (score >= 80) return { letter: 'B+', color: 'text-lime-400',  border: 'border-lime-500',  shadow: 'shadow-lime-500/50', bg: 'bg-lime-500/10' };
    if (score >= 75) return { letter: 'B',  color: 'text-lime-500',  border: 'border-lime-600',  shadow: 'shadow-lime-600/50', bg: 'bg-lime-600/10' };
    if (score >= 70) return { letter: 'B-', color: 'text-lime-600',  border: 'border-lime-700',  shadow: 'shadow-lime-700/50', bg: 'bg-lime-700/10' };
    if (score >= 65) return { letter: 'C+', color: 'text-yellow-400', border: 'border-yellow-500', shadow: 'shadow-yellow-500/50', bg: 'bg-yellow-500/10' };
    if (score >= 60) return { letter: 'C',  color: 'text-yellow-500', border: 'border-yellow-600', shadow: 'shadow-yellow-600/50', bg: 'bg-yellow-600/10' };
    if (score >= 55) return { letter: 'C-', color: 'text-orange-400', border: 'border-orange-500', shadow: 'shadow-orange-500/50', bg: 'bg-orange-500/10' };
    return { letter: 'D', color: 'text-red-500', border: 'border-red-600', shadow: 'shadow-red-600/50', bg: 'bg-red-600/10' };
};

// Piyasa Değeri Formatlayıcı (€ Cinsinden)
ScoutApp.prototype.formatMarketValue = function(val) {
    if (val === null || val === undefined || val === '') return '-';
    let num = parseFloat(val);
    if (isNaN(num)) return val;
    if (num >= 1000000) {
        let m = (num / 1000000);
        return '€' + (m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)) + 'M';
    }
    if (num >= 1000) {
        let k = (num / 1000);
        return '€' + (k % 1 === 0 ? k.toFixed(0) : k.toFixed(0)) + 'K';
    }
    return '€' + num.toLocaleString();
};

// Link Formatlayıcı
ScoutApp.prototype.formatLinks = function(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, url => `<span onclick="app.openExternal('${url.replace(/'/g, "\\'")}')" class="text-blue-400 hover:text-blue-300 hover:underline break-all font-medium transition-colors relative z-20 cursor-pointer">${url}</span>`);
};

// Takım İsmi Getirici
ScoutApp.prototype.getTeamName = function(id) {
    const t = this.state.data.teams.find(team => team.id == id);
    if (!t) return 'Bilinmiyor';
    
    if (t.type === 'national' && t.countryId) {
        const c = this.state.data.countries.find(x => x.id === t.countryId);
        if (c) {
            return `${this.getCountryName(c)} ${t.name}`;
        }
    }
    
    return t.name;
};

// Maç İsmi/Detayı Formatlayıcı
ScoutApp.prototype.getMatchDisplay = function(matchOrId) {
    if (!matchOrId) return '';
    let m = matchOrId;
    if (typeof matchOrId === 'number' || typeof matchOrId === 'string') {
        m = (this.state.data.matches || []).find(x => x.id == matchOrId);
    }
    if (!m) return '';
    const home = this.getTeamName(m.homeId) || m.homeName || 'Ev';
    const away = this.getTeamName(m.awayId) || m.awayName || 'Deplasman';
    let dateStr = '';
    if (m.date) {
        const d = new Date(m.date);
        if (!isNaN(d)) {
            dateStr = ' (' + d.toLocaleDateString((window.getLang && window.getLang() === 'en') ? 'en-US' : 'tr-TR', { month: 'short', day: 'numeric' }) + ')';
        }
    }
    return `${home} vs ${away}${dateStr}`;
};

// Oyuncunun Takımlarına Göre Maçları Filtreleyici
ScoutApp.prototype.getFilteredMatchesForPlayer = function(teamId, nationalTeamId, targetPlayerId) {
    const matches = this.state.data.matches || [];
    const tIdStr = teamId !== null && teamId !== undefined && teamId !== '' ? String(teamId) : null;
    const nIdStr = nationalTeamId !== null && nationalTeamId !== undefined && nationalTeamId !== '' ? String(nationalTeamId) : null;
    const pIdStr = targetPlayerId !== null && targetPlayerId !== undefined && targetPlayerId !== '' ? String(targetPlayerId) : null;

    return matches.filter(m => {
        const homeStr = String(m.homeId);
        const awayStr = String(m.awayId);
        
        // 1. Kulüp Takımı Maçı
        if (tIdStr && (homeStr === tIdStr || awayStr === tIdStr)) return true;
        
        // 2. Milli Takım Maçı
        if (nIdStr && (homeStr === nIdStr || awayStr === nIdStr)) return true;
        
        // 3. Özel Atanmış İzlenecek Oyuncu Maçı
        if (pIdStr && m.targetPlayerId && String(m.targetPlayerId) === pIdStr) return true;
        
        return false;
    });
};