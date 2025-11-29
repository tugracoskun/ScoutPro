// --- SİSTEM VE BİLDİRİM FONKSİYONLARI ---

// Toast Bildirimi (Alert Override)
window.alert = function(message, type = 'error') {
    const container = document.getElementById('notification-container');
    if (!container) return;
    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
    const icon = type === 'success' ? 'check-circle' : 'alert-circle';
    const toast = document.createElement('div');
    toast.className = `toast-message flex items-center gap-3 ${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl border border-white/10 min-w-[300px] relative overflow-hidden`;
    toast.innerHTML = `<i data-lucide="${icon}" class="w-6 h-6 shrink-0"></i><span class="text-sm font-bold">${message}</span><div class="absolute bottom-0 left-0 h-1 bg-white/30 w-full animate-[shrink_3s_linear_forwards]"></div>`;
    container.appendChild(toast);
    lucide.createIcons();
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; toast.style.transition = 'all 0.3s ease'; setTimeout(() => toast.remove(), 300); }, 3000);
};

ScoutApp.prototype.notify = function(msg) { window.alert(msg, 'success'); };

// Özel Onay Kutusu
ScoutApp.prototype.confirmAction = function(message, onConfirmCallback) {
    const oldConfirm = document.getElementById('custom-confirm-modal');
    if (oldConfirm) oldConfirm.remove();
    const modal = document.createElement('div');
    modal.id = 'custom-confirm-modal';
    modal.className = 'fixed inset-0 z-[200] flex items-center justify-center bg-dark-950/80 backdrop-blur-sm fade-in px-4';
    modal.innerHTML = `<div class="bg-dark-900 border border-dark-800 p-6 rounded-2xl shadow-2xl w-full max-w-sm text-center transform scale-100 transition-all"><div class="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500"><i data-lucide="alert-triangle" class="w-6 h-6"></i></div><h3 class="text-lg font-bold text-white mb-2">Emin misiniz?</h3><p class="text-slate-400 text-sm mb-6">${message}</p><div class="flex gap-3"><button id="btn-cancel" class="flex-1 py-2.5 rounded-xl bg-dark-800 text-slate-300 hover:bg-dark-700 font-medium transition-colors">Vazgeç</button><button id="btn-confirm" class="flex-1 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-500 font-bold transition-colors">Evet, Sil</button></div></div>`;
    document.body.appendChild(modal);
    lucide.createIcons();
    document.getElementById('btn-cancel').onclick = () => modal.remove();
    document.getElementById('btn-confirm').onclick = () => { modal.remove(); onConfirmCallback(); };
};