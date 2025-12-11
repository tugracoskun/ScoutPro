// --- AI ARAYÜZ YÖNETİMİ (UI) ---

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
            <div id="ai-window" class="hidden w-[380px] bg-dark-950/90 backdrop-blur-xl border border-scout-500/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right scale-90 opacity-0" style="height: 600px;">
                
                <!-- Header -->
                <div class="bg-gradient-to-r from-scout-900/50 to-dark-900/50 p-4 border-b border-white/5 flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-scout-500 text-dark-950 flex items-center justify-center shadow-lg shadow-scout-500/20">
                            <i data-lucide="book-open" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h3 class="text-white font-bold text-sm tracking-wide">Scout Rehber</h3>
                            <p class="text-[10px] text-scout-400 font-mono">Yardım Merkezi</p>
                        </div>
                    </div>
                    <button onclick="scoutAI.toggleChat()" class="text-slate-400 hover:text-white transition-colors"><i data-lucide="x" class="w-5 h-5"></i></button>
                </div>

                <!-- Messages Area -->
                <div id="ai-messages" class="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gradient-to-b from-transparent to-dark-900/50">
                    <div class="flex gap-3 fade-in">
                        <div class="w-8 h-8 rounded-full bg-scout-500/10 flex-shrink-0 flex items-center justify-center text-scout-500 border border-scout-500/20"><i data-lucide="bot" class="w-4 h-4"></i></div>
                        <div class="bg-dark-800 p-3 rounded-2xl rounded-tl-none text-sm text-slate-200 border border-dark-700 shadow-sm">
                            Merhaba! 👋 ScoutPro kullanımında sana rehberlik etmek için buradayım. <br><br>
                            Aşağıdaki konulardan hangisi hakkında bilgi almak istersin?
                        </div>
                    </div>
                    
                    <!-- Hazır Butonlar -->
                    <div class="grid grid-cols-2 gap-2 fade-in delay-100 pl-11">
                        <button onclick="scoutAI.askTopic('watchlist')" class="ai-topic-btn">Aday Havuzu Nedir?</button>
                        <button onclick="scoutAI.askTopic('reporting')" class="ai-topic-btn">Nasıl Raporlarım?</button>
                        <button onclick="scoutAI.askTopic('database')" class="ai-topic-btn">Veritabanı Mantığı</button>
                        <button onclick="scoutAI.askTopic('backup')" class="ai-topic-btn">Yedekleme & Aktarma</button>
                        <button onclick="scoutAI.askTopic('matches')" class="ai-topic-btn">Maç İzleme</button>
                        <button onclick="scoutAI.askTopic('dev_phases')" class="ai-topic-btn">Gelişim Evreleri</button>
                        <button onclick="scoutAI.askTopic('about')" class="ai-topic-btn col-span-2 text-center">Uygulama Hakkında</button>
                    </div>
                </div>
            </div>

            <!-- FAB BUTTON -->
            <button onclick="scoutAI.toggleChat()" class="w-14 h-14 bg-dark-900 border border-scout-500/30 rounded-full shadow-2xl shadow-scout-500/10 flex items-center justify-center text-white hover:scale-110 transition-all duration-300 group relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-tr from-scout-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <i data-lucide="help-circle" class="w-7 h-7 text-scout-500 group-hover:text-white transition-colors"></i>
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
            ? `<div class="w-8 h-8 rounded-full bg-scout-500/10 flex-shrink-0 flex items-center justify-center text-scout-500 border border-scout-500/20"><i data-lucide="bot" class="w-4 h-4"></i></div>` 
            : `<div class="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center text-slate-400"><i data-lucide="user" class="w-4 h-4"></i></div>`;

        const bubbleColor = type === 'bot' 
            ? 'bg-white/10 border border-white/5 text-slate-200 rounded-tl-none backdrop-blur-md' 
            : 'bg-scout-600/90 text-white rounded-tr-none shadow-lg shadow-scout-600/20 backdrop-blur-sm';

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
            <div class="w-8 h-8 rounded-full bg-scout-500/10 flex-shrink-0 flex items-center justify-center text-scout-500 border border-scout-500/20"><i data-lucide="bot" class="w-4 h-4"></i></div>
            <div class="bg-white/10 p-3 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-1 backdrop-blur-md">
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