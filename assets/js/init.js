// 1. Uygulamayı oluştur
const app = new ScoutApp();

// 2. Hızlı Asistanı Başlat
const scoutAI = new ScoutAI(app);
window.scoutAI = scoutAI;

// 3. Kimlik Yöneticisi
const auth = new AuthManager(app);

// 4. Başlat
auth.init();