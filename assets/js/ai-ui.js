// --- AI ARAYÜZ YÖNETİMİ (UI - REDESIGNED) ---

class AI_UI {
    constructor(aiInstance) {
        this.ai = aiInstance;
        this.renderFloatingButton();
    }

    renderFloatingButton() {
        if (document.getElementById('ai-fab')) return;

        const fab = document.createElement('div');
        fab.id = 'ai-fab';
        fab.className = 'fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4';
        
        fab.innerHTML = `
            <!-- CHAT PENCERESİ -->
            <div id="ai-window" class="hidden w-[360px] bg-dark-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right scale-90 opacity-0" style="height: 550px;">
                
                <!-- Header -->
                <div class="bg-gradient-to-r from-scout-600 to-blue-600 p-4 flex justify-between items-center shadow-lg">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white">
                            <i data-lucide="sparkles" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h3 class="text-white font-bold text-sm tracking-wide">Scout Asistan</h3>
                            <p class="text-[10px] text-white/70 font-mono">Yardım Merkezi</p>
                        </div>
                    </div>
                    <button onclick="scoutAI.toggleChat()" class="text-white/70 hover:text-white transition-colors bg-white/10 p-1.5 rounded-lg hover:bg-white/20">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>

                <!-- Messages Area -->
                <div id="ai-messages" class="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-dark-950/50">
                    
                    <!-- Hoşgeldin Mesajı -->
                    <div class="flex gap-3 fade-in">
                        <div class="w-8 h-8 rounded-full bg-scout-600 flex-shrink-0 flex items-center justify-center text-white border-2 border-dark-900 shadow-md">
                            <i data-lucide="bot" class="w-4 h-4"></i>
                        </div>
                        <div class="bg-dark-800 p-3.5 rounded-2xl rounded-tl-none text-sm text-slate-200 border border-dark-700 shadow-sm leading-relaxed max-w-[85%]">
                            Merhaba! 👋 ScoutPro hakkında sana nasıl yardımcı olabilirim?
                        </div>
                    </div>
                    
                    <!-- Konu Butonları (Grid Layout) -->
                    <div class="grid grid-cols-2 gap-2.5 px-4 pb-4 fade-in delay-100">
                        <button onclick="scoutAI.askTopic('watchlist')" class="ai-topic-btn"><i data-lucide="eye" class="w-3.5 h-3.5"></i> Aday Havuzu</button>
                        <button onclick="scoutAI.askTopic('reporting')" class="ai-topic-btn"><i data-lucide="file-edit" class="w-3.5 h-3.5"></i> Raporlama</button>
                        <button onclick="scoutAI.askTopic('database')" class="ai-topic-btn"><i data-lucide="database" class="w-3.5 h-3.5"></i> Veritabanı</button>
                        <button onclick="scoutAI.askTopic('matches')" class="ai-topic-btn"><i data-lucide="tv" class="w-3.5 h-3.5"></i> Maç İzleme</button>
                        <button onclick="scoutAI.askTopic('backup')" class="ai-topic-btn"><i data-lucide="save" class="w-3.5 h-3.5"></i> Yedekleme</button>
                        <button onclick="scoutAI.askTopic('dev_phases')" class="ai-topic-btn"><i data-lucide="trending-up" class="w-3.5 h-3.5"></i> Gelişim Evreleri</button>
                        <button onclick="scoutAI.askTopic('about')" class="ai-topic-btn col-span-2 justify-center bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white"><i data-lucide="info" class="w-3.5 h-3.5"></i> Uygulama Hakkında</button>
                    </div>
                </div>
            </div>

            <!-- FAB BUTTON -->
            <button onclick="scoutAI.toggleChat()" class="w-14 h-14 bg-gradient-to-tr from-scout-600 to-blue-600 rounded-full shadow-2xl shadow-scout-500/30 flex items-center justify-center text-white hover:scale-110 transition-all duration-300 group border-2 border-white/20">
                <i data-lucide="message-circle-question" class="w-7 h-7 group-hover:rotate-12 transition-transform"></i>
                <!-- Bildirim Noktası -->
                <span class="absolute top-0 right-0 flex h-3 w-3">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-dark-900"></span>
                </span>
            </button>
        `;
        document.body.appendChild(fab);
        lucide.createIcons();
    }

    addMessage(html, type) {
        const container = document.getElementById('ai-messages');
        const msgDiv = document.createElement('div');
        msgDiv.className = `flex gap-3 ${type === 'user' ? 'flex-row-reverse' : ''} fade-in`;
        
        const avatar = type === 'bot' 
            ? `<div class="w-8 h-8 rounded-full bg-scout-600 flex-shrink-0 flex items-center justify-center text-white border-2 border-dark-900 shadow-md"><i data-lucide="bot" class="w-4 h-4"></i></div>` 
            : `<div class="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center text-slate-300 border-2 border-dark-900 shadow-md"><i data-lucide="user" class="w-4 h-4"></i></div>`;

        const bubbleColor = type === 'bot' 
            ? 'bg-dark-800 border border-dark-700 text-slate-200 rounded-tl-none' 
            : 'bg-gradient-to-br from-scout-600 to-scout-700 text-white rounded-tr-none shadow-md';

        msgDiv.innerHTML = `${avatar}<div class="p-3.5 rounded-2xl text-xs sm:text-sm border ${type==='user'?'border-transparent':''} ${bubbleColor} max-w-[85%] break-words shadow-sm leading-relaxed">${html}</div>`;

        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
        lucide.createIcons();
    }

    showTyping() {
        const container = document.getElementById('ai-messages');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'ai-typing';
        typingDiv.className = 'flex gap-3 fade-in';
        typingDiv.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-scout-600 flex-shrink-0 flex items-center justify-center text-white border-2 border-dark-900 shadow-md"><i data-lucide="bot" class="w-4 h-4"></i></div>
            <div class="bg-dark-800 p-3 rounded-2xl rounded-tl-none border border-dark-700 flex items-center gap-1 shadow-sm">
                <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
            </div>
        `;
        container.appendChild(typingDiv);
        container.scrollTop = container.scrollHeight;
        lucide.createIcons();
    }

    removeTyping() {
        const el = document.getElementById('ai-typing');
        if (el) el.remove();
    }

    toggleWindow() {
        const win = document.getElementById('ai-window');
        if (this.ai.isOpen) {
            win.classList.add('hidden', 'scale-90', 'opacity-0');
            win.classList.remove('scale-100', 'opacity-100');
        } else {
            win.classList.remove('hidden');
            setTimeout(() => { win.classList.remove('scale-90', 'opacity-0'); win.classList.add('scale-100', 'opacity-100'); }, 10);
            const container = document.getElementById('ai-messages');
            container.scrollTop = container.scrollHeight;
        }
    }
}