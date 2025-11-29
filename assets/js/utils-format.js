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
    try {
        return new Date(dateString).toLocaleDateString('tr-TR', options);
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

// Link Formatlayıcı
ScoutApp.prototype.formatLinks = function(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, url => `<a href="${url}" target="_blank" class="text-blue-400 hover:text-blue-300 hover:underline break-all font-medium transition-colors relative z-20">${url}</a>`);
};

// Takım İsmi Getirici
ScoutApp.prototype.getTeamName = function(id) {
    const t = this.state.data.teams.find(team => team.id == id);
    return t ? t.name : 'Bilinmiyor';
};