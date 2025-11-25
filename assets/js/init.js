const app = new ScoutApp();
const auth = new AuthManager(app);

// Uygulama başlatma yetkisini Auth Manager'a veriyoruz
auth.init();