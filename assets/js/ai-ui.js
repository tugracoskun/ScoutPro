// --- HIZLI ASİSTAN ARAYÜZ YÖNETİMİ (QUICK ASSISTANT UI) ---

class AI_UI {
    constructor(aiInstance) {
        this.ai = aiInstance;
        this.selectedCategory = 'all';
        this.searchQuery = '';
        this.renderFloatingButton();
    }

    getPositionClasses(pos) {
        switch (pos) {
            case 'bottom-left':
                return {
                    fab: 'fixed bottom-6 left-6 z-[60] flex flex-col items-start gap-4',
                    window: 'origin-bottom-left',
                    align: 'items-start'
                };
            case 'top-right':
                return {
                    fab: 'fixed top-20 right-6 z-[60] flex flex-col items-end gap-4',
                    window: 'origin-top-right',
                    align: 'items-end'
                };
            case 'top-left':
                return {
                    fab: 'fixed top-20 left-6 z-[60] flex flex-col items-start gap-4',
                    window: 'origin-top-left',
                    align: 'items-start'
                };
            case 'bottom-right':
            default:
                return {
                    fab: 'fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4',
                    window: 'origin-bottom-right',
                    align: 'items-end'
                };
        }
    }

    renderFloatingButton() {
        let fab = document.getElementById('ai-fab');
        const isEnabled = !(window.app && window.app.state && window.app.state.data && window.app.state.data.settings && window.app.state.data.settings.assistantEnabled === false);
        const position = (window.app && window.app.state && window.app.state.data && window.app.state.data.settings && window.app.state.data.settings.assistantPosition) || 'bottom-right';
        const posConfig = this.getPositionClasses(position);

        if (!fab) {
            fab = document.createElement('div');
            fab.id = 'ai-fab';
            document.body.appendChild(fab);
        }

        fab.className = `${posConfig.fab} ${isEnabled ? '' : 'hidden'}`;
        
        fab.innerHTML = `
            <!-- ASİSTAN PENCERESİ -->
            <div id="ai-window" class="hidden w-[380px] sm:w-[420px] max-w-[calc(100vw-32px)] bg-dark-900/95 backdrop-blur-2xl border border-dark-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${posConfig.window} scale-90 opacity-0" style="height: 580px; max-height: calc(100vh - 100px);">
                
                <!-- Header -->
                <div class="bg-gradient-to-r from-emerald-600 via-scout-600 to-blue-600 p-4 px-5 flex justify-between items-center shadow-lg relative">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center text-white shadow-inner">
                            <i data-lucide="compass" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <h3 class="text-white font-bold text-sm tracking-wide flex items-center gap-2">
                                Hızlı Asistan
                                <span class="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-mono text-white/90">v2.0</span>
                            </h3>
                            <p class="text-[11px] text-white/80">Scouting Bilgi Bankası & Rehber</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-1.5">
                        <!-- Konum Değiştirme Kısayolu -->
                        <button onclick="scoutAI.cyclePosition()" class="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-lg" title="Konumu Değiştir">
                            <i data-lucide="move" class="w-4 h-4"></i>
                        </button>
                        <!-- Kapat Butonu -->
                        <button onclick="scoutAI.toggleChat()" class="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-lg">
                            <i data-lucide="x" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>

                <!-- Arama ve Kategori Filtresi Barı -->
                <div class="p-3 bg-dark-950/80 border-b border-dark-800 space-y-2.5 shrink-0">
                    <!-- Arama Inputu -->
                    <div class="relative">
                        <i data-lucide="search" class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
                        <input type="text" id="ai-search-input" oninput="scoutAI.onSearch(this.value)" placeholder="Soru veya konu ara (Örn: Stoper, Tarama, 4 Köşe, Transfer)..." class="w-full bg-dark-900 border border-dark-750 focus:border-scout-500 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 outline-none transition-colors">
                        <button id="ai-search-clear" onclick="scoutAI.clearSearch()" class="hidden absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                            <i data-lucide="x" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>

                    <!-- Kategori Tabları (Yatay Kaydırılabilir) -->
                    <div class="flex gap-1.5 overflow-x-auto custom-scrollbar pb-1 text-[11px]">
                        ${ASSISTANT_CATEGORIES.map(cat => `
                            <button onclick="scoutAI.selectCategory('${cat.id}')" id="cat-btn-${cat.id}" class="ai-cat-btn px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${this.selectedCategory === cat.id ? 'bg-scout-500/20 text-scout-400 border border-scout-500/40 font-bold' : 'bg-dark-900 text-slate-400 border border-dark-800 hover:text-white'}">
                                <i data-lucide="${cat.icon}" class="w-3 h-3"></i>
                                ${cat.name}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Messages & Content Area -->
                <div id="ai-messages" class="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-dark-950/40">
                    
                    <!-- Hoşgeldin Kartı -->
                    <div class="flex gap-3 fade-in">
                        <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-scout-600 flex-shrink-0 flex items-center justify-center text-white border border-dark-700 shadow-md">
                            <i data-lucide="compass" class="w-4 h-4"></i>
                        </div>
                        <div class="bg-dark-900 p-3.5 rounded-2xl rounded-tl-none text-xs sm:text-sm text-slate-200 border border-dark-800 shadow-sm leading-relaxed max-w-[88%]">
                            Merhaba Scout! 👋 Merak ettiğin bir konuyu arayabilir veya aşağıdaki hazır başlıklardan birini seçerek detaylı bilgi alabilirsin.
                        </div>
                    </div>

                    <!-- Konu / Soru Kartları Listesi -->
                    <div id="ai-topic-container" class="space-y-2 fade-in">
                        ${this.renderTopicsHTML()}
                    </div>

                </div>
            </div>

            <!-- FAB BUTTON -->
            <button onclick="scoutAI.toggleChat()" id="ai-fab-btn" class="w-14 h-14 bg-gradient-to-tr from-emerald-600 via-scout-600 to-blue-600 rounded-2xl shadow-2xl shadow-scout-500/25 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all duration-300 group border border-white/20 relative" title="Hızlı Asistan">
                <i data-lucide="compass" class="w-6 h-6 group-hover:rotate-45 transition-transform duration-300"></i>
                <!-- Bildirim Noktası -->
                <span class="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-dark-900"></span>
                </span>
            </button>
        `;

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    renderTopicsHTML() {
        const query = (this.searchQuery || '').toLowerCase().trim();
        const cat = this.selectedCategory || 'all';

        const filtered = Object.entries(AI_TUTORIALS).filter(([key, item]) => {
            const matchesCat = (cat === 'all') || (item.category === cat);
            if (!matchesCat) return false;

            if (!query) return true;
            const searchPool = `${item.title} ${item.summary || ''} ${item.keywords || ''}`.toLowerCase();
            return searchPool.includes(query);
        });

        if (filtered.length === 0) {
            return `
                <div class="text-center py-8 text-slate-500 space-y-2">
                    <i data-lucide="search-x" class="w-8 h-8 mx-auto opacity-40"></i>
                    <p class="text-xs">Aramanıza uygun konu bulunamadı.</p>
                </div>
            `;
        }

        return filtered.map(([key, item]) => `
            <div onclick="scoutAI.askTopic('${key}')" class="bg-dark-900/90 hover:bg-dark-850 border border-dark-800 hover:border-scout-500/40 rounded-2xl p-3 px-3.5 cursor-pointer transition-all duration-200 group flex items-center justify-between gap-3 shadow-sm">
                <div class="min-w-0 flex-1">
                    <div class="text-xs font-bold text-white group-hover:text-scout-400 transition-colors truncate">${item.title}</div>
                    ${item.summary ? `<div class="text-[11px] text-slate-400 line-clamp-1 mt-0.5">${item.summary}</div>` : ''}
                </div>
                <div class="w-6 h-6 rounded-lg bg-dark-950 border border-dark-800 text-slate-500 group-hover:text-scout-400 group-hover:border-scout-500/30 flex items-center justify-center shrink-0 transition-colors">
                    <i data-lucide="chevron-right" class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"></i>
                </div>
            </div>
        `).join('');
    }

    addMessage(html, type) {
        const container = document.getElementById('ai-messages');
        if (!container) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = `flex gap-3 ${type === 'user' ? 'flex-row-reverse' : ''} fade-in`;
        
        const avatar = type === 'bot' 
            ? `<div class="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-scout-600 flex-shrink-0 flex items-center justify-center text-white border border-dark-700 shadow-md"><i data-lucide="compass" class="w-4 h-4"></i></div>` 
            : `<div class="w-8 h-8 rounded-xl bg-dark-800 border border-dark-700 flex-shrink-0 flex items-center justify-center text-slate-300 shadow-md"><i data-lucide="user" class="w-4 h-4"></i></div>`;

        const bubbleColor = type === 'bot' 
            ? 'bg-dark-900 border border-dark-750 text-slate-200 rounded-tl-none shadow-md' 
            : 'bg-gradient-to-br from-scout-600 to-blue-600 text-white rounded-tr-none shadow-md border border-white/10';

        msgDiv.innerHTML = `${avatar}<div class="p-4 rounded-2xl text-xs sm:text-sm ${bubbleColor} max-w-[88%] break-words shadow-sm leading-relaxed">${html}</div>`;

        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    showTyping() {
        const container = document.getElementById('ai-messages');
        if (!container) return;

        const typingDiv = document.createElement('div');
        typingDiv.id = 'ai-typing';
        typingDiv.className = 'flex gap-3 fade-in';
        typingDiv.innerHTML = `
            <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-scout-600 flex-shrink-0 flex items-center justify-center text-white border border-dark-700">
                <i data-lucide="compass" class="w-4 h-4"></i>
            </div>
            <div class="bg-dark-900 border border-dark-750 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                <span class="w-1.5 h-1.5 bg-scout-400 rounded-full animate-bounce"></span>
                <span class="w-1.5 h-1.5 bg-scout-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span class="w-1.5 h-1.5 bg-scout-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
        `;
        container.appendChild(typingDiv);
        container.scrollTop = container.scrollHeight;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    removeTyping() {
        const typing = document.getElementById('ai-typing');
        if (typing) typing.remove();
    }

    toggleWindow() {
        const win = document.getElementById('ai-window');
        if (!win) return;

        if (win.classList.contains('hidden')) {
            win.classList.remove('hidden');
            setTimeout(() => {
                win.classList.remove('scale-90', 'opacity-0');
                win.classList.add('scale-100', 'opacity-100');
            }, 10);
        } else {
            win.classList.remove('scale-100', 'opacity-100');
            win.classList.add('scale-90', 'opacity-0');
            setTimeout(() => win.classList.add('hidden'), 300);
        }
    }
}