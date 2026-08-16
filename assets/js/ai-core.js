class ScoutAI {
    constructor(app) {
        this.app = app;
        this.isOpen = false;
        this.positions = ['bottom-right', 'bottom-left', 'top-left', 'top-right'];
        this.ui = new AI_UI(this);
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.ui.toggleWindow();
    }

    onSearch(val) {
        this.ui.searchQuery = val;
        const clearBtn = document.getElementById('ai-search-clear');
        if (clearBtn) {
            clearBtn.classList.toggle('hidden', !val);
        }
        this.updateTopicList();
    }

    clearSearch() {
        const input = document.getElementById('ai-search-input');
        if (input) input.value = '';
        this.onSearch('');
    }

    selectCategory(catId) {
        this.ui.selectedCategory = catId;
        
        // Buton stillerini güncelle
        document.querySelectorAll('.ai-cat-btn').forEach(btn => {
            btn.className = 'ai-cat-btn px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 bg-dark-900 text-slate-400 border border-dark-800 hover:text-white';
        });
        const activeBtn = document.getElementById(`cat-btn-${catId}`);
        if (activeBtn) {
            activeBtn.className = 'ai-cat-btn px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 bg-scout-500/20 text-scout-400 border border-scout-500/40 font-bold';
        }

        this.updateTopicList();
    }

    updateTopicList() {
        const container = document.getElementById('ai-topic-container');
        if (container) {
            container.innerHTML = this.ui.renderTopicsHTML();
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    }

    askTopic(topicKey) {
        const tutorial = AI_TUTORIALS[topicKey];
        if (!tutorial) return;

        // Kullanıcı sorusu
        this.ui.addMessage(`<span class="font-semibold">${tutorial.title}</span> hakkında bilgi verir misin?`, 'user');
        this.ui.showTyping();

        // Yanıt
        setTimeout(() => {
            this.ui.removeTyping();
            
            let html = `
                <div class="space-y-2">
                    <div class="flex items-center gap-2 pb-2 border-b border-dark-750">
                        <span class="font-bold text-scout-400 text-sm">${tutorial.title}</span>
                    </div>
                    <div class="text-xs text-slate-200 leading-relaxed">${tutorial.content}</div>
                </div>
            `;

            this.ui.addMessage(html, 'bot');
        }, 300);
    }

    cyclePosition() {
        const current = (this.app.state.data && this.app.state.data.settings && this.app.state.data.settings.assistantPosition) || 'bottom-right';
        const currentIndex = this.positions.indexOf(current);
        const nextIndex = (currentIndex + 1) % this.positions.length;
        const nextPos = this.positions[nextIndex];

        this.setPosition(nextPos);
    }

    setPosition(pos) {
        if (!this.app.state.data.settings) this.app.state.data.settings = {};
        this.app.state.data.settings.assistantPosition = pos;
        this.app.saveData();

        const wasOpen = this.isOpen;
        this.ui.renderFloatingButton();
        if (wasOpen) {
            const win = document.getElementById('ai-window');
            if (win) {
                win.classList.remove('hidden', 'scale-90', 'opacity-0');
                win.classList.add('scale-100', 'opacity-100');
            }
        }

        const posNames = {
            'bottom-right': 'Sağ Alt',
            'bottom-left': 'Sol Alt',
            'top-left': 'Sol Üst',
            'top-right': 'Sağ Üst'
        };
        this.app.notify(`Asistan konumu: ${posNames[pos] || pos}`);
    }

    toggleAssistant(enabled) {
        if (!this.app.state.data.settings) this.app.state.data.settings = {};
        this.app.state.data.settings.assistantEnabled = enabled;
        this.app.saveData();

        const fab = document.getElementById('ai-fab');
        if (fab) {
            fab.classList.toggle('hidden', !enabled);
        }
        this.app.notify(enabled ? "Hızlı Asistan etkinleştirildi." : "Hızlı Asistan gizlendi.");
    }
}