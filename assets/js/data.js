// --- POZİSYONLAR ---
const POSITIONS = [ 
    "Kaleci", "Stoper", "Sağ Bek", "Sol Bek", 
    "Defansif Orta Saha", "Orta Saha", "Ofansif Orta Saha", 
    "Sağ Kanat", "Sol Kanat", "Santrafor" 
];

// --- YAŞA GÖRE GELİŞİM HEDEFLERİ (PDF ANALİZİ - GERİ EKLENDİ) ---
const AGE_SPECIFIC_KPI = {
    'U9-U12': {
        title: "Temel Eğitim Aşaması (Topla Aşk)",
        focus: "Bireysel teknik, yaratıcılık ve oyun sevgisi.",
        kpis: [
            "🔴 İki Ayağı Kullanabilme: Doğal akışta her iki ayağını kullanıyor mu?",
            "🔴 Top Manipülasyonu: Dar alanda topu vücudunun bir uzvu gibi kullanabiliyor mu?",
            "🔴 1v1 Yaratıcılık: Rakip eksiltme cesareti ve teknik çeşitlilik (Skor önemsiz).",
            "🔵 ABC (Agility, Balance, Coord): Koşarken kolların/bacakların uyumu.",
            "🟢 Hata Sonrası Reaksiyon: Topu kaybedince küsüyor mu, geri kazanmaya çalışıyor mu?"
        ],
        warning: "⚠️ Bu yaşta taktiksel disiplin veya saf fiziksel güç aramayın!"
    },
    'U13-U16': {
        title: "Gençlik Gelişim Aşaması (Taktiksel Uyanış)",
        focus: "Kollektif oyun, alan bilgisi ve baskı altında beceri.",
        kpis: [
            "🟡 Tarama (Scanning): Top gelmeden önce omzunun arkasını kontrol ediyor mu?",
            "🟡 Topsuz Hareket: Pas kanalı yaratmak için doğru koşular yapıyor mu?",
            "🔴 Baskı Altında Beceri: Zaman ve alan daraldığında tekniğini koruyor mu?",
            "🔵 Büyüme Atağı (PHV): 'Ergen Sakarlığı' yaşayabilir, teknik hataları geçici olabilir.",
            "🟢 Direnç (Resilience): Kötü hakem kararı veya sert rakip karşısında oyuna küsüyor mu?"
        ],
        warning: "⚠️ Fiziksel olarak erken gelişmiş oyuncuların 'Halo Etkisi'ne kanmayın."
    },
    'U17-U21': {
        title: "Profesyonel Gelişim Aşaması (Kazanma Zihniyeti)",
        focus: "Performans, yüksek yoğunluk ve profesyonellik.",
        kpis: [
            "🔵 Patlayıcı Güç & RSA: Tekrarlanan yüksek şiddetli sprint kapasitesi.",
            "🟢 Profesyonellik: Saha dışı disiplin, beslenme ve 'Görünmez Antrenman'.",
            "🟡 Taktiksel Sadakat: Karmaşık görevleri maç boyu disiplinle uyguluyor mu?",
            "🟢 Liderlik: Kriz anlarında saklanıyor mu yoksa sorumluluk alıyor mu?",
            "🔴 Pozisyonel Uzmanlık: Mevkisinin gerektirdiği spesifik aksiyonlarda elit mi?"
        ],
        warning: "⚠️ Artık 'potansiyel' değil, 'performans' ve 'istikrar' ön plandadır."
    }
};

// --- ÖZELLİK HAVUZU VE ALT DETAYLAR ---
const ATTRIBUTE_GROUPS = {
    'Defans': {
        'Teknik': [
            { name: 'Pas Dağıtımı', sub: 'Kısa Pas, Uzun Diyagonal, Baskı Altında Pas' },
            { name: 'Top Hakimiyeti', sub: 'İlk Dokunuş, Dripling, Top Saklama' },
            { name: 'Müdahale Kalitesi', sub: 'Ayakta ve Kayarak Müdahale, Top Çalma' },
            { name: 'Hava Hakimiyeti', sub: 'Sıçrama, Kafa Vuruşu Yönlendirme' },
            { name: 'Orta Yapma', sub: 'Erken Orta, Çizgiden ve Yerden Sert Kesme' }
        ],
        'Taktik': [
            { name: 'Pozisyon Alma', sub: 'Derinlik Kontrolü, Ofsayt Çizgisi, Kademe' },
            { name: 'Oyun Okuma', sub: 'Pas Arası (Interception), Tehlikeyi Sezme' },
            { name: 'Markaj', sub: 'Alan Savunması, Adam Adama, Ceza Sahası İçi' },
            { name: 'Hücum Desteği', sub: 'Bindirme (Overlap), İçe Kat Etme (Invert)' }
        ],
        'Fiziksel': [
            { name: 'Hız & İvmelenme', sub: 'İlk 5 Metre Patlayıcılık, Uzun Mesafe Hızı' },
            { name: 'Güç & Denge', sub: 'Omuz Omuza Mücadele, Yere Sağlam Basma' },
            { name: 'Dayanıklılık', sub: 'Tekrarlı Sprint, 90 Dk Efor Kapasitesi' },
            { name: 'Çeviklik', sub: 'Dönüş Hızı, Ters Ayakta Yakalanmama' }
        ],
        'Mental': [
            { name: 'Liderlik', sub: 'Savunmayı Yönetme, İletişim, Sorumluluk' },
            { name: 'Konsantrasyon', sub: 'Hata Yapma Eğilimi, Çevre Kontrolü' },
            { name: 'Agresiflik', sub: 'Kontrollü Sertlik, Cesaret (Bravery)' },
            { name: 'Soğukkanlılık', sub: 'Baskı Altında Karar Verme (Composure)' }
        ]
    },
    'OrtaSaha': {
        'Teknik': [
            { name: 'Paslaşma', sub: 'Kısa/Uzun Pas, Oyun Kurma, Tempo Belirleme' },
            { name: 'Top Kapma', sub: 'Ayakta Kalarak Top Kazanma, Faul Yapmadan Müdahale' },
            { name: 'İlk Dokunuş', sub: 'Baskı Altında Top Kontrolü, Yönlendirme' },
            { name: 'Top Sürme', sub: 'Topu Dikine Taşıma (Progressive Carry), Alan Kazanma' },
            { name: 'Vizyon', sub: 'Asist (xA), Kilit Pas (Key Passes), Ara Pası' },
            { name: 'Şut & Bitiricilik', sub: 'Ceza Sahası Dışı Şut, Plase, Son Vuruş' }
        ],
        'Zihinsel': [
            { name: 'Pozisyon Alma', sub: 'Pas Arası Yapma, Alan Kapatma, Doğru Yer Tutma' },
            { name: 'Konsantrasyon', sub: 'Disiplin, Çevre Kontrolü (Scanning), Odaklanma' },
            { name: 'Kararlılık & Cesaret', sub: 'İkili Mücadele İsteği, Agresiflik Dozu' },
            { name: 'Çalışkanlık', sub: 'Hücum-Savunma Git-Gel (Box-to-Box), Efor' },
            { name: 'Takım Oyunu', sub: 'Pas Opsiyonu Olma, Yardımlaşma' },
            { name: 'Karar Verme', sub: 'Şut/Pas/Çalım Tercihi, Oyun Zekası' },
            { name: 'Yaratıcılık', sub: 'Öngörülemez Olma, Kilidi Açma (Flair)' },
            { name: 'Topsuz Oyun', sub: 'Boş Alanlara (Ceplere) Sızma, Pas İsteme' }
        ],
        'Fiziksel': [
            { name: 'Güç', sub: 'Top Saklama, Omuz Omuza Mücadele' },
            { name: 'Denge', sub: 'Müdahale Sonrası Ayakta Kalma, Dönüş Kabiliyeti' },
            { name: 'Dayanıklılık', sub: 'Motor Kapasitesi, 90 Dakika Tempo' },
            { name: 'Çeviklik', sub: 'Dar Alanda Yön Değiştirme, Baskıdan Kaçış' },
            { name: 'Hızlanma', sub: 'İlk Adım, Rakibinden Kurtulma Yeteneği' }
        ]
    },
    'Kanat': {
        'Teknik': [
            { name: 'Dribbling / 1v1', sub: 'Rakibi Ekarte Etme, Top Taşıma Becerisi' },
            { name: 'Orta Yapma', sub: 'Ceza Sahasına İsabetli ve Çeşitli Top Gönderme' },
            { name: 'Bitiricilik', sub: 'Gol Vuruşu Kalitesi ve Şut Tekniği' },
            { name: 'İlk Dokunuş', sub: 'Topu Alma, Yumuşatma ve Oyuna Hazırlama' },
            { name: 'Paslaşma / Vizyon', sub: 'Oyun Kurulumuna Katkı ve Kilit Pas' },
            { name: 'Uzaktan Şut', sub: 'Ceza Sahası Dışından Tehdit Yaratma' }
        ],
        'Fiziksel': [
            { name: 'Hızlanma', sub: 'İlk 10-15 Metredeki Patlayıcılık (Akselerasyon)' },
            { name: 'Hız (Son Sürat)', sub: 'Açık Alandaki Maksimum Koşu Hızı (Velocity)' },
            { name: 'Çeviklik', sub: 'Ani Yön Değiştirme ve Kıvraklık' },
            { name: 'Denge', sub: 'Fiziksel Temas Altında Ayakta Kalma' },
            { name: 'Dayanıklılık', sub: 'Maç Boyu Sprint Atabilme Kapasitesi' },
            { name: 'Zıplama', sub: 'Arka Direk Koşularında Hava Topu Üstünlüğü' }
        ],
        'Zihinsel': [
            { name: 'Karar Alma', sub: 'Doğru Seçeneği (Pas/Şut/Dribbling) Uygulama' },
            { name: 'Topsuz Alan', sub: 'Boş Koşular ve Pozisyon Alma' },
            { name: 'Özel Yetenek', sub: 'Beklenmedik, Yaratıcı Hamleler (Flair)' },
            { name: 'Cesaret', sub: 'Hata Yaptıktan Sonra Oyuna Küsmeme' },
            { name: 'Çalışkanlık', sub: 'Savunma Katkısı ve Pres Gücü' },
            { name: 'Soğukkanlılık', sub: 'Baskı Altında Net Vuruş/Pas Yapabilme' }
        ],
        'Sosyolojik': [
            { name: 'İletişim', sub: 'Takım İçi Yönlendirme, Vücut Dili' },
            { name: 'Uyum & Esneklik', sub: 'Kanat Değiştirme, Taktiksel Adaptasyon' },
            { name: 'İstikrar', sub: 'Maç İçi Devamlılık, Performans Standartı' },
            { name: 'Büyük Maç', sub: 'Baskı Altında Sorumluluk Alma' }
        ]
    },
    'Forvet': {
        'Teknik': [
            { name: 'Bitiricilik', sub: 'Gol Vuruşu, Plase, Sert Şut, Karşı Karşıya' },
            { name: 'İlk Dokunuş', sub: 'Topu Yönlendirme, Sonraki Hamleye Hazırlama' },
            { name: 'Kafa Vuruşu', sub: 'Zamanlama, Alın Tekniği, Yönlendirme' },
            { name: 'Uzaktan Şut', sub: 'Ceza Sahası Dışı Tehdit (18-25m)' },
            { name: 'Dribbling', sub: 'Yön Değiştirme, Rakip Eksiltme, Şut Açısı Yaratma' },
            { name: 'Bağlantı Oyunu', sub: 'Sırtı Dönük Oyun, Duvar Olma, Verkaç' },
            { name: 'Teknik', sub: 'Vole, Röveşata, Zor Topları Kontrol Etme' },
            { name: 'Penaltı', sub: 'Baskı Altında Duran Top Golü' }
        ],
        'Fiziksel': [
            { name: 'Hızlanma', sub: 'İlk 5-10 Metre Patlayıcılık (Explosive Power)' },
            { name: 'Hız (Sprint)', sub: 'Açık Alanda Maksimum Sürat (Top Speed)' },
            { name: 'Güç', sub: 'İkili Mücadele, Omuz Şarjına Direnç, Top Saklama' },
            { name: 'Denge', sub: 'Şut Çekerken Koordinasyon, Yıkılmama' },
            { name: 'Zıplama', sub: 'Dikey Sıçrama Testi, Hava Topu Üstünlüğü' },
            { name: 'Çeviklik', sub: 'Dar Alanda Dönüş, Kalabalık Arasında Vuruş' },
            { name: 'Dayanıklılık', sub: '90 Dk Yüksek Efor, Pres Kapasitesi' }
        ],
        'Zihinsel': [
            { name: 'Soğukkanlılık', sub: 'Son Vuruşta Paniklememe, Nabız Kontrolü' },
            { name: 'Topsuz Oyun', sub: 'Boş Koşu, Stoperi Meşgul Etme, Doğru Konumlanma' },
            { name: 'Önsezi', sub: 'Topun Düşeceği Yeri Hissetme (Fırsatçılık)' },
            { name: 'Kararlılık', sub: 'Maç Kötü Giderken Oyundan Düşmeme, Hırs' },
            { name: 'Cesaret', sub: 'Kafayı Topa Sokma, Sert Stoperin Üzerine Gitme' },
            { name: 'Konsantrasyon', sub: 'Tek Fırsat İçin 90 Dk Hazır Olma' },
            { name: 'Çalışkanlık', sub: 'Ön Alan Presi, Topu Geri Kazanma Arzusu' }
        ],
        'Sosyolojik': [
            { name: 'Baskıya Tepki', sub: 'Gol Kaçırınca Toparlanma, Medya/Taraftar Baskısı' },
            { name: 'Liderlik', sub: 'Takımı Ateşleme, Sorumluluk Alma' },
            { name: 'Uyum', sub: 'Farklı Taktik ve Partnerlerle Oynayabilme' },
            { name: 'Profesyonellik', sub: 'Antrenman Disiplini, Saha Dışı Yaşam' }
        ]
    },
    'Kaleci': {
        'Teknik': [
            { name: 'Top Kontrolü', sub: 'Geri Pasları Alma, Ayakla Kontrol' },
            { name: 'Elle Kontrol', sub: 'Topu Tutma, Sektirmeme' },
            { name: 'Uzun Toplar', sub: 'Degaj ve Kale Vuruşu Mesafesi' },
            { name: 'Refleks', sub: 'Çizgi Üzerinde Reaksiyon' },
            { name: 'Yan Top', sub: 'Hava Toplarına Çıkış ve Yumruklama' }
        ],
        'Fiziksel': [
            { name: 'Boy & Erişim', sub: 'Uzanma Mesafesi, Fiziksel Caydırıcılık' },
            { name: 'Çeviklik', sub: 'Yere Yatıp Kalkma Hızı' }
        ],
        'Mental': [
            { name: 'Pozisyon Alma', sub: 'Açıyı Daraltma, Doğru Yerde Durma' },
            { name: 'İletişim', sub: 'Defans Hattını Uyarma ve Yönetme' }
        ]
    },
    'Default': {
        'Genel': [ { name: 'Hız', sub: '' }, { name: 'Şut', sub: '' }, { name: 'Pas', sub: '' }, { name: 'Fizik', sub: '' } ]
    }
};

// --- ÖNEM DERECELERİ ---
const POSITION_WEIGHTS = {
    'Stoper': {
        'Hava Hakimiyeti': 3, 'Pozisyon Alma': 3, 'Oyun Okuma': 3, 'Konsantrasyon': 3,
        'Pas Dağıtımı': 2, 'Müdahale Kalitesi': 2, 'Markaj': 2, 'Güç & Denge': 2
    },
    'Bek': { 
        'Orta Yapma': 3, 'Hız & İvmelenme': 3, 'Dayanıklılık': 3, 'Hücum Desteği': 2, 'Top Hakimiyeti': 2 
    },
    'DefansifOrtaSaha': { 
        'Pozisyon Alma': 3, 'Konsantrasyon': 3,
        'Top Kapma': 2, 'Paslaşma': 2, 'İlk Dokunuş': 2, 'Kararlılık & Cesaret': 2, 'Güç': 2, 'Denge': 2
    },
    'MerkezOrtaSaha': { 
        'Dayanıklılık': 3, 'Çalışkanlık': 3,
        'Paslaşma': 2, 'Takım Oyunu': 2, 'Çeviklik': 2, 'Karar Verme': 2
    },
    'OfansifOrtaSaha': { 
        'Vizyon': 3, 'Top Kontrolü / Teknik': 3, 'Yaratıcılık': 3,
        'Karar Verme': 2, 'Şut & Bitiricilik': 2, 'Çeviklik': 2
    },
    'Kanat': { 
        'Hızlanma': 3, 'Hız (Son Sürat)': 3, 'Dribbling / 1v1': 3, 'Orta Yapma': 3,
        'Çeviklik': 2, 'İlk Dokunuş': 2, 'Topsuz Alan': 2, 'Özel Yetenek': 2
    },
    'Santrafor': {
        'Bitiricilik': 3, 'Soğukkanlılık': 3, 'Topsuz Oyun': 3, 'Hızlanma': 3, 'Önsezi': 3,
        'İlk Dokunuş': 2, 'Kafa Vuruşu': 2, 'Güç': 2, 'Denge': 2, 'Çeviklik': 2
    },
    'Kaleci': { 'Refleks': 3, 'Pozisyon Alma': 3, 'Elle Kontrol': 3 }
};

// --- EŞLEŞTİRME ---
const POSITION_MAPPING = {
    'Kaleci': { group: 'Kaleci', weightKey: 'Kaleci' },
    'Stoper': { group: 'Defans', weightKey: 'Stoper' },
    'Sağ Bek': { group: 'Defans', weightKey: 'Bek' },
    'Sol Bek': { group: 'Defans', weightKey: 'Bek' },
    'Defansif Orta Saha': { group: 'OrtaSaha', weightKey: 'DefansifOrtaSaha' },
    'Orta Saha': { group: 'OrtaSaha', weightKey: 'MerkezOrtaSaha' },
    'Ofansif Orta Saha': { group: 'OrtaSaha', weightKey: 'OfansifOrtaSaha' },
    'Sağ Kanat': { group: 'Kanat', weightKey: 'Kanat' },
    'Sol Kanat': { group: 'Kanat', weightKey: 'Kanat' },
    'Santrafor': { group: 'Forvet', weightKey: 'Santrafor' }
};

// --- VERİTABANI ---
const DB = { countries: [], leagues: [], teams: [], players: [], matches: [], watchlist: [] };