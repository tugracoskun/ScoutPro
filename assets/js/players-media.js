// --- VİDEO VE NOT İŞLEMLERİ ---

ScoutApp.prototype.getVideoEmbedHTML = function(url) {
    if (url.startsWith('data:video') || url.match(/\.(mp4|webm|ogg)$/i)) {
        return `<video class="w-full aspect-video bg-black" controls><source src="${url}" type="video/mp4">Desteklenmeyen format.</video>`;
    }
    // YouTube için sadece link kartı
    return `
        <div class="w-full aspect-video bg-dark-900 flex flex-col items-center justify-center gap-2 p-4 text-center border-b border-dark-800 cursor-pointer hover:bg-dark-800 transition-colors group" onclick="window.open('${url}', '_blank')">
            <div class="p-3 rounded-full bg-dark-800 border border-dark-700 group-hover:border-scout-500/50 group-hover:text-scout-400 transition-all">
                <i data-lucide="external-link" class="w-6 h-6 text-slate-400 group-hover:text-scout-400"></i>
            </div>
            <div>
                <div class="text-sm font-bold text-white">Video Bağlantısı</div>
                <div class="text-[10px] text-slate-500">İzlemek için tıklayın</div>
            </div>
        </div>`;
};

ScoutApp.prototype.handleVideoUpload = function(input, targetId) {
    const file = input.files[0];
    if (file) {
        if (file.size > 100 * 1024 * 1024) return alert("Video boyutu 100MB'dan küçük olmalıdır.");
        const reader = new FileReader();
        reader.onload = (e) => { document.getElementById(targetId).value = e.target.result; };
        reader.readAsDataURL(file);
    }
};

ScoutApp.prototype.addPlayerVideo = function(playerId) {
    const titleInput = document.getElementById(`video-title-${playerId}`);
    const urlInput = document.getElementById(`video-url-${playerId}`);
    const title = titleInput.value.trim();
    const url = urlInput.value.trim();

    if (!title || !url) return alert("Başlık ve Link/Dosya gereklidir.");

    const player = this.state.data.players.find(p => p.id === playerId);
    if (!player) return;
    if (!player.videos) player.videos = [];

    player.videos.unshift({ title: title, url: url, date: new Date().toLocaleDateString('tr-TR') });
    
    this.saveData(); // KAYIT

    titleInput.value = '';
    urlInput.value = '';
    this.openPlayerModal(playerId, 0, 'videos');
};

ScoutApp.prototype.deletePlayerVideo = function(playerId, index) {
    this.confirmAction("Bu videoyu silmek istediğinize emin misiniz?", () => {
        const player = this.state.data.players.find(p => p.id === playerId);
        if(player && player.videos) {
            player.videos.splice(index, 1);
            this.saveData();
            this.openPlayerModal(playerId, 0, 'videos');
            this.notify("Video silindi.");
        }
    });
};

ScoutApp.prototype.addSocialNote = function(playerId, currentTab='notes') {
    const input = document.getElementById(`social-input-${playerId}`);
    const text = input.value.trim();
    if (!text) return;
    const player = this.state.data.players.find(p => p.id === playerId);
    if (!player) return;
    if (!player.socialNotes) player.socialNotes = [];
    player.socialNotes.unshift({ id: Date.now(), text: text, date: new Date().toLocaleString('tr-TR') });
    
    this.saveData(); // KAYIT

    input.value = '';
    this.openPlayerModal(playerId, 0, currentTab);
};

ScoutApp.prototype.formatLinks = function(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, url => `<a href="${url}" target="_blank" class="text-blue-400 hover:text-blue-300 hover:underline break-all font-medium transition-colors">${url}</a>`);
};