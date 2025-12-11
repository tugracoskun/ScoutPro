class ScoutAI {
    constructor(app) {
        this.app = app;
        this.isOpen = false;
        this.ui = new AI_UI(this); // UI'ı başlat
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.ui.toggleWindow();
    }

    // Konu Seçimi
    askTopic(topicKey) {
        const tutorial = AI_TUTORIALS[topicKey];
        if (!tutorial) return;

        // Kullanıcı sormuş gibi göster
        this.ui.addMessage(tutorial.title + " hakkında bilgi verir misin?", 'user');
        this.ui.showTyping();

        // Cevap ver
        setTimeout(() => {
            this.ui.removeTyping();
            
            let html = `<strong class="text-scout-400 block mb-2">${tutorial.title}</strong>`;
            html += tutorial.content;

            this.ui.addMessage(html, 'bot');
        }, 600);
    }
}