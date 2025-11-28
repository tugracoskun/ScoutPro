// --- YARDIMCI FONKSİYONLAR (UTILS) ---

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

// Logo/Resim Gösterimi
ScoutApp.prototype.getLogoDisplayHTML = function(value, classes = "w-full h-full object-contain") {
    if (value && (value.startsWith('http') || value.startsWith('data:image'))) {
        return `<img src="${value}" class="${classes}" onerror="this.style.display='none';this.nextElementSibling.classList.remove('hidden')"><div class="hidden w-full h-full flex items-center justify-center bg-dark-800 text-slate-700"><i data-lucide="image-off" class="w-1/2 h-1/2"></i></div>`;
    }
    return `<div class="w-full h-full flex items-center justify-center bg-dark-800/50 text-slate-700"><i data-lucide="image" class="w-1/2 h-1/2 opacity-50"></i></div>`;
};

// Resim Yükleme Kontrolü
ScoutApp.prototype.createImageUploadControl = function(id, label, value = '') {
    const hasImage = value && (value.startsWith('http') || value.startsWith('data:image'));
    return `
        <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-slate-400 ml-1">${label}</label>
            <div class="flex gap-3 items-start">
                <div class="w-16 h-16 rounded-xl bg-dark-950 border border-dark-700 flex items-center justify-center overflow-hidden shrink-0 relative">
                    <img id="${id}-preview" src="${hasImage ? value : ''}" class="${hasImage ? 'block' : 'hidden'} w-full h-full object-contain p-1">
                    <div id="${id}-placeholder" class="${hasImage ? 'hidden' : 'flex'} w-full h-full items-center justify-center text-slate-700"><i data-lucide="image" class="w-6 h-6"></i></div>
                </div>
                <div class="flex-1 space-y-2">
                    <input type="text" id="${id}" value="${value}" placeholder="Resim URL'si yapıştırın..." oninput="app.handleImagePreview('${id}', this.value)" class="w-full bg-dark-950 border border-dark-700 rounded-lg px-3 py-2 text-white text-sm focus:border-scout-500 outline-none placeholder:text-slate-600 z-10 relative">
                </div>
            </div>
        </div>
    `;
};

// Resim Önizleme Mantığı
ScoutApp.prototype.handleImagePreview = function(id, value) {
    const imgPreview = document.getElementById(`${id}-preview`);
    const placeholder = document.getElementById(`${id}-placeholder`);
    if (value && (value.startsWith('http') || value.startsWith('data:image'))) {
        imgPreview.src = value; imgPreview.classList.remove('hidden'); placeholder.classList.add('hidden');
    } else {
        imgPreview.src = ''; imgPreview.classList.add('hidden'); placeholder.classList.remove('hidden');
    }
};

// Input Oluşturucu (BUG FIX: Value güvenliği ve Z-Index eklendi)
ScoutApp.prototype.createInput = function(id, label, ph, type='text', val='', evt='', max=null) {
    // Eğer val undefined veya null ise boş string yap
    const safeVal = (val === undefined || val === null) ? '' : val;
    
    return `
        <div class="flex flex-col gap-1.5 relative z-10">
            <label class="text-xs font-bold text-slate-400 ml-1">${label}</label>
            <input 
                type="${type}" 
                id="${id}" 
                value="${safeVal}" 
                oninput="${evt}" 
                ${max ? `max="${max}"` : ''} 
                placeholder="${ph}" 
                class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-scout-500 focus:ring-1 focus:ring-scout-500 outline-none transition-all placeholder:text-slate-600 text-sm relative z-20"
                autocomplete="off"
            >
        </div>`;
};

// Select Oluşturucu
ScoutApp.prototype.createSelect = function(id, label, options, val='', evt='', isFull=false) {
    return `
        <div class="flex flex-col gap-1.5 w-full relative z-10">
            ${label ? `<label class="text-xs font-bold text-slate-400 ml-1">${label}</label>` : ''}
            <div class="relative">
                <select id="${id}" onchange="${evt}" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-scout-500 outline-none appearance-none text-sm relative z-20 cursor-pointer">
                    <option value="" disabled ${!val?'selected':''}>Seçiniz</option>
                    ${options.map(o => `<option value="${o.val}" ${val==o.val?'selected':''}>${o.txt}</option>`).join('')}
                </select>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 z-30"><i data-lucide="chevron-down" class="w-4 h-4"></i></div>
            </div>
        </div>`;
};

// Slider Oluşturucu
ScoutApp.prototype.createSlider = function(label, key, val) {
    const safeKey = key.replace(/\s+/g, '-').replace(/\//g, '-').toLowerCase();
    return `
        <div class="bg-dark-950 px-4 py-3 rounded-xl border border-dark-800 relative z-10">
            <div class="flex justify-between mb-2">
                <span class="text-xs font-medium text-slate-300 truncate pr-2" title="${label}">${label}</span>
                <span id="val-${safeKey}" class="text-xs font-bold text-scout-400">${val}</span>
            </div>
            <input type="range" min="0" max="100" value="${val}" oninput="app.updateRepStat('${key}', this.value)" class="w-full h-1.5 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-scout-500 relative z-20">
        </div>`;
};

// İstatistik Kartı
ScoutApp.prototype.createStatCard = function(title, val, sub, icon, color, bg) {
    return `<div class="bg-dark-900 border border-dark-800 p-6 rounded-2xl relative z-10"><div class="flex justify-between items-start mb-4"><div class="p-3 rounded-lg ${bg}"><i data-lucide="${icon}" class="w-6 h-6 ${color}"></i></div></div><div class="text-slate-400 text-sm font-medium mb-1">${title}</div><div class="flex items-end gap-2"><p class="text-2xl font-bold text-white">${val}</p><span class="text-xs text-slate-500 mb-1 font-medium">${sub}</span></div></div>`;
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

// --- SİSTEM UYARILARINI GÜZELLEŞTİRME (ALERT OVERRIDE) ---
// Bu kod, tarayıcının o çirkin ve donduran alert kutusunu iptal eder,
// yerine bizim havalı bildirim kutumuzu çalıştırır.

window.alert = function(message, type = 'error') {
    const container = document.getElementById('notification-container');
    if (!container) return;

    // Renk ayarı (Hata ise Kırmızı, Başarılı ise Yeşil)
    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
    const icon = type === 'success' ? 'check-circle' : 'alert-circle';

    // Bildirim HTML'i
    const toast = document.createElement('div');
    toast.className = `toast-message flex items-center gap-3 ${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl border border-white/10 min-w-[300px] relative overflow-hidden`;
    
    toast.innerHTML = `
        <i data-lucide="${icon}" class="w-6 h-6 shrink-0"></i>
        <span class="text-sm font-bold">${message}</span>
        <div class="absolute bottom-0 left-0 h-1 bg-white/30 w-full animate-[shrink_3s_linear_forwards]"></div>
    `;

    // Kutuya ekle
    container.appendChild(toast);
    lucide.createIcons();

    // 3 Saniye sonra sil
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// Başarılı işlem mesajları için kısayol (Örn: app.notify("Kaydedildi"))
ScoutApp.prototype.notify = function(msg) {
    window.alert(msg, 'success');
};

// --- ÖZEL ONAY KUTUSU (CONFIRM REPLACEMENT) ---
ScoutApp.prototype.confirmAction = function(message, onConfirmCallback) {
    // Varsa eski onayı temizle
    const oldConfirm = document.getElementById('custom-confirm-modal');
    if (oldConfirm) oldConfirm.remove();

    // Modal HTML'i
    const modal = document.createElement('div');
    modal.id = 'custom-confirm-modal';
    modal.className = 'fixed inset-0 z-[200] flex items-center justify-center bg-dark-950/80 backdrop-blur-sm fade-in px-4';
    
    modal.innerHTML = `
        <div class="bg-dark-900 border border-dark-800 p-6 rounded-2xl shadow-2xl w-full max-w-sm text-center transform scale-100 transition-all">
            <div class="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <i data-lucide="alert-triangle" class="w-6 h-6"></i>
            </div>
            <h3 class="text-lg font-bold text-white mb-2">Emin misiniz?</h3>
            <p class="text-slate-400 text-sm mb-6">${message}</p>
            <div class="flex gap-3">
                <button id="btn-cancel" class="flex-1 py-2.5 rounded-xl bg-dark-800 text-slate-300 hover:bg-dark-700 font-medium transition-colors">Vazgeç</button>
                <button id="btn-confirm" class="flex-1 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-500 font-bold transition-colors">Evet, Sil</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    lucide.createIcons();

    // Buton İşlevleri
    document.getElementById('btn-cancel').onclick = () => modal.remove();
    
    document.getElementById('btn-confirm').onclick = () => {
        modal.remove();
        onConfirmCallback(); // "Evet" denirse asıl işlemi yap
    };
};

// --- YAŞ HESAPLAMA MOTORU ---
ScoutApp.prototype.calculateAge = function(birthDateString) {
    if (!birthDateString) return '-';
    
    const today = new Date();
    const birthDate = new Date(birthDateString);
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    // Henüz doğum günü gelmediyse 1 yaş düş
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
};

// Formatlı Tarih Gösterimi (Örn: 10 Ekim 2002)
ScoutApp.prototype.formatDatePretty = function(dateString) {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
};