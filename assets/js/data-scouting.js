// --- YAŞA GÖRE GELİŞİM HEDEFLERİ (PDF ANALİZİ) ---
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

// --- ÖNEM DERECELERİ (HIGHLIGHTING) ---
// 3: Kritik, 2: Yüksek, 1: Orta, 0: Düşük

const POSITION_WEIGHTS = {
    // --- STOPER (YENİLENMİŞ) ---
    'Stoper': {
        // Kritik (3)
        'Hava Hakimiyeti': 3, 'Pozisyon Alma': 3, 'Sezgi (Anticipation)': 3, 'Konsantrasyon': 3, 'Soğukkanlılık': 3,
        // Yüksek (2)
        'Müdahale (Tackling)': 2, 'Markaj': 2, 'Güç': 2, 'Pas Dağıtımı (Kısa)': 2, 'Hat Kıran Paslar': 2, 'Liderlik & İletişim': 2,
        // Orta (1)
        'Hızlanma': 1, 'Çeviklik & Dönüş': 1, 'Son Hız (Recovery)': 1
    },

    // --- BEK ---
    'Bek': { 
        'Orta Yapma': 3, 'Hız & İvmelenme': 3, 'Dayanıklılık': 3, 'Hücum Desteği': 2, 'Top Hakimiyeti': 2 
    },

    // --- ORTA SAHA ---
    'DefansifOrtaSaha': { 
        // Kritik (3) - Tabloda 9-10 Puanlıklar
        'Baskıya Direnç': 3, 
        'Çevre Kontrolü (Scanning)': 3, 
        'Pozisyon Disiplini': 3, 
        'Dayanıklılık (Engine)': 3,
        'Soğukkanlılık': 3,
        
        // Yüksek (2) - Tabloda 7-8 Puanlıklar
        'Pas Dağıtımı (Kısa)': 2, 
        'Gölge Markajı': 2, 
        'Savunma Müdahalesi': 2, 
        'Denge ve Güç': 2, 
        'Liderlik ve İletişim': 2,
        'Agresiflik (Kontrollü)': 2,
        'İlk Dokunuş & Vücut': 2,

        // Orta (1)
        'Oyun Yönünü Değiştirme': 1, 
        'Hat Kıran Paslar': 1,
        'Çeviklik': 1
    },

    'MerkezOrtaSaha': { 
        // Kritik (3) - Tabloda 10 Puanlıklar
        'Dayanıklılık (Box-to-Box)': 3, 
        'Çalışkanlık': 3, 
        'Karar Verme': 3,
        'Alan Farkındalığı (Pocket)': 3,
        'İlk Dokunuş & Dönüş': 3,
        
        // Yüksek (2) - Tabloda 8-9 Puanlıklar
        'Progresif Pas': 2, 
        'Pas Çeşitliliği': 2, 
        'Tempo Kontrolü': 2,
        'Dinamizm & Çeviklik': 2,
        'Takım Oyunu': 2,
        'Bağlantı Oyunu': 2,

        // Orta (1) - Tabloda 7 Puanlıklar
        'Top Taşıma (Driving)': 1, 
        'Patlayıcı Kuvvet': 1,
        'Şut Tehdidi': 1
    },

    'OfansifOrtaSaha': { 
        // Kritik (3) - Tabloda "En Kritik" Olanlar
        'Dar Alanda Beceri': 3,
        'Hatlar Arası Oyun': 3,
        'Son Pas / Kilit Pas': 3,
        'Yaratıcılık & Flair': 3,
        'İlk Dokunuş & Dönüş': 3,

        // Yüksek (2)
        'Karar Verme (Hız)': 2,
        'Şut ve Bitiricilik': 2,
        'Risk Alma Cesareti': 2,
        'Çeviklik & Denge': 2,
        'Topsuz Koşu (Destek)': 2,

        // Orta (1)
        'Liderlik (Teknik)': 1,
        'Patlayıcı Hız': 1,
        'Duran Top Kullanımı': 1,
        'Pres Başlatma': 1
    },

    'Kanat': { 
        // Kritik (3) - En Temel Özellikler
        '1v1 Dripling & Eksiltme': 3,
        'İvmelenme (Acceleration)': 3,
        'Topsuz Koşu (Arka Direk)': 3,
        'Karar Verme (3. Bölge)': 3,
        
        // Yüksek (2)
        'Orta Kalitesi': 2,
        'Son Hız (Pace)': 2,
        'Çeviklik & Denge': 2,
        'Bitiricilik & Şut': 2,
        'Yaratıcılık (Flair)': 2,
        'Özgüven & Risk Alma': 2,

        // Orta (1)
        'Defansif Disiplin': 1,
        'İlk Dokunuş (Progresif)': 1,
        'Dayanıklılık (RSA)': 1
    },

    // --- FORVET ---
    'Santrafor': {
        // Kritik (3) - En Temel Özellikler
        'Bitiricilik': 3,
        'Soğukkanlılık': 3,
        'Kör Nokta Koşuları': 3,
        'Ceza Sahası Sezgisi': 3,
        'Patlayıcı Güç': 3,

        // Yüksek (2)
        'Sırtı Dönük Oyun': 2,
        'İlk Dokunuş (Ceza Sahası)': 2,
        'Kafa Vuruşu': 2,
        'Fiziksel Güç': 2,
        'Direnç (Resilience)': 2,

        // Orta (1)
        'Kanal Koşuları': 1,
        'Bağlantı Oyunu': 1,
        'Pres Yönlendirmesi': 1,
        'Denge ve Çeviklik': 1
    },

    // --- KALECİ ---
    'Kaleci': { 
        'Refleks': 3, 'Pozisyon Alma': 3, 'Elle Kontrol': 3, 'Konsantrasyon': 3, 'Birebir': 3,
        'Yan Top': 2, 'İletişim': 2, 'Ayak Hakimiyeti': 2, 'Kalede Güven': 2
    }
};

// --- EŞLEŞTİRME ---
const POSITION_MAPPING = {
    'Kaleci': { group: 'Kaleci', weightKey: 'Kaleci' },
    
    // DEFANS
    'Stoper': { group: 'Stoper', weightKey: 'Stoper' }, // Stoper artık kendi grubunu kullanıyor
    'Sağ Bek': { group: 'Bek', weightKey: 'Bek' },
    'Sol Bek': { group: 'Bek', weightKey: 'Bek' },
    
    // ORTA SAHA
    'Defansif Orta Saha': { group: 'OrtaSaha', weightKey: 'DefansifOrtaSaha' },
    'Orta Saha': { group: 'OrtaSaha', weightKey: 'MerkezOrtaSaha' },
    'Ofansif Orta Saha': { group: 'OrtaSaha', weightKey: 'OfansifOrtaSaha' },

    // KANAT
    'Sağ Kanat': { group: 'Kanat', weightKey: 'Kanat' },
    'Sol Kanat': { group: 'Kanat', weightKey: 'Kanat' },

    // FORVET
    'Santrafor': { group: 'Forvet', weightKey: 'Santrafor' }
};