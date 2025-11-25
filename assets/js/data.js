// --- SABİTLER ---
const POSITIONS = ["Kaleci", "Stoper", "Sağ Bek", "Sol Bek", "Defansif Orta Saha", "Orta Saha", "Ofansif Orta Saha", "Sağ Kanat", "Sol Kanat", "Santrafor"];

const ATTRIBUTE_SETS = {
    'Kaleci': {
        'Teknik': ['Top Kontrolü', 'Elle Kontrol', 'Uzun Toplar', 'Elle Top Dağıtımı', 'Kale Vuruşları', 'Paslaşma', 'Ayak Hakimiyeti', '1v1 Başarısı', 'Kurtarışlar', 'Refleks', 'Yan Top'],
        'Fiziksel': ['Boy Uzunluğu', 'Kuvvet', 'Patlayıcı Kuvvet', 'Çeviklik', 'Vücut Tipi', 'Denge', 'Reaksiyon Hızı', 'Esneklik'],
        'Psikolojik': ['Dayanıklılık', 'Cesaret', 'Kararlılık', 'Zorluklara Karşı Tepki', 'Konsantrasyon', 'Arzu/İstek', 'Disiplin', 'Davranış/Tutum', 'Sakinlik'],
        'Sosyolojik': ['İletişim', 'Kalede Verdiği Güven', 'İlişkiler']
    },
    'Default': {
        'Genel': ['Hız', 'Şut', 'Pas', 'Dribling', 'Defans', 'Fizik']
    }
};

// --- BAŞLANGIÇ VERİTABANI ---
const DB = { countries: [], leagues: [], teams: [], players: [], matches: [], watchlist: [] };