// 1. Uygulamayı oluştur
const app = new ScoutApp();

// 2. Yapay Zeka Asistanını Başlat
const scoutAI = new ScoutAI(app); // <-- EKLENDİ

// 3. Kimlik Yöneticisi
const auth = new AuthManager(app);

// 4. Başlat
auth.init();