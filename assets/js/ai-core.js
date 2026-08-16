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

    openCategory(catId) {
        this.ui.activeCategory = catId;
        this.ui.currentView = 'category_topics';
        this.ui.updateUI();
    }

    goToCategories() {
        this.ui.activeCategory = null;
        this.ui.activeArticleKey = null;
        this.ui.currentView = 'categories';
        this.ui.updateUI();
    }

    openArticle(articleKey) {
        this.ui.activeArticleKey = articleKey;
        this.ui.currentView = 'article';
        this.ui.updateUI();
    }

    backFromArticle() {
        if (this.ui.activeCategory) {
            this.ui.currentView = 'category_topics';
        } else {
            this.ui.currentView = 'categories';
        }
        this.ui.updateUI();
    }

    onSearch(val) {
        this.ui.searchQuery = val;
        const clearBtn = document.getElementById('ai-search-clear');
        if (clearBtn) {
            clearBtn.classList.toggle('hidden', !val || val.trim().length === 0);
        }
        this.ui.updateUI();
    }

    clearSearch() {
        const input = document.getElementById('ai-search-input');
        if (input) input.value = '';
        this.onSearch('');
    }

    resetPosition() {
        if (!this.app.state.data.settings) this.app.state.data.settings = {};
        this.app.state.data.settings.assistantCoords = null;
        this.app.saveData();

        const fabBtn = document.getElementById('ai-fab-btn');
        if (fabBtn) {
            fabBtn.style.right = '24px';
            fabBtn.style.bottom = '24px';
            fabBtn.style.left = 'auto';
            fabBtn.style.top = 'auto';
            this.ui.positionWindowNearButton();
        }
        this.app.notify("Asistan konumu varsayılana (Sağ Alt) sıfırlandı.");
    }

    toggleAssistant(enabled) {
        if (!this.app.state.data.settings) this.app.state.data.settings = {};
        this.app.state.data.settings.assistantEnabled = enabled;
        this.app.saveData();

        const fabBtn = document.getElementById('ai-fab-btn');
        if (fabBtn) {
            fabBtn.classList.toggle('hidden', !enabled);
        }
        const win = document.getElementById('ai-window');
        if (win && !enabled) {
            win.classList.add('hidden', 'scale-90', 'opacity-0');
            this.isOpen = false;
        }
        this.app.notify(enabled ? "Hızlı Asistan etkinleştirildi." : "Hızlı Asistan gizlendi.");
    }
}