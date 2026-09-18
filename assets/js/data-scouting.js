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
    // --- STOPER (MODERN & PASÖR) ---
    'Stoper': {
        // Kritik (3)
        'Hava Hakimiyeti': 3, 'Pozisyon Alma': 3, 'Sezgi (Anticipation)': 3, 'Konsantrasyon': 3, 'Soğukkanlılık': 3,
        // Yüksek (2)
        'Müdahale (Tackling)': 2, 'Markaj': 2, 'Güç': 2, 'Pas Dağıtımı (Kısa)': 2, 'Hat Kıran Paslar': 2, 'Top Taşıma (Carrying)': 2, 'Baskıya Direnç': 2, 'Çevre Kontrolü (Scanning)': 2, 'Liderlik & İletişim': 2,
        // Orta (1)
        'Hızlanma': 1, 'Çeviklik & Dönüş': 1, 'Son Hız (Recovery)': 1, 'Uzun Top / Oyun Kurma': 1, 'İlk Dokunuş': 1
    },

    // --- BEK ---
    'Bek': { 
        // Kritik (3)
        '1v1 Savunma': 3, 'Orta Kalitesi': 3, 'Tekrarlı Sprint (RSA)': 3, 'Arka Direk Farkındalığı': 3, 'Dayanıklılık': 3,
        // Yüksek (2)
        'Top Sürme (Carrying)': 2, 'Pas & Oyun Kurulumu': 2, 'Bindirme Zamanlaması': 2, 'Geri Dönüş (Recovery)': 2, 'Hızlanma': 2, 'Son Hız': 2, 'Hat Kıran Paslar': 2,
        // Orta (1)
        'Şut & Bitiricilik': 1, 'Duran Top Kullanımı': 1, 'Dar Alanda Beceri': 1, 'İçe Kat Etme (Inverted)': 1, 'Alan Savunması': 1, 'Pressing Tetikleyicisi': 1, 'Çeviklik & Dönüş': 1, 'İlk Dokunuş': 1
    },

    // --- ORTA SAHA ---
    'DefansifOrtaSaha': { 
        // Kritik (3)
        'Baskıya Direnç': 3, 
        'Çevre Kontrolü (Scanning)': 3, 
        'Pozisyon Disiplini': 3, 
        'Dayanıklılık': 3,
        'Soğukkanlılık': 3,
        'Savunma Müdahalesi': 3,
        
        // Yüksek (2)
        'Progresif Pas': 2, 
        'İkili Mücadele Gücü': 2, 
        'Geri Dönüş & Kademe (Recovery)': 2, 
        'Hava Hakimiyeti': 2, 
        'Uzun Top & Oyun Yönü': 2, 
        'Liderlik (Teknik)': 2,
        'İlk Dokunuş & Dönüş': 2,

        // Orta (1)
        'Top Taşıma': 1, 
        'Tempo Kontrolü': 1,
        'Çeviklik & Denge': 1
    },

    'MerkezOrtaSaha': { 
        // Kritik (3)
        'Dayanıklılık': 3, 
        'Karar Verme (Hız)': 3,
        'Hatlar Arası Oyun': 3,
        'İlk Dokunuş & Dönüş': 3,
        'Çevre Kontrolü (Scanning)': 3,
        
        // Yüksek (2)
        'Progresif Pas': 2, 
        'Tempo Kontrolü': 2,
        'Top Taşıma': 2,
        'Baskıya Direnç': 2,
        'Son Pas / Kilit Pas': 2,
        'Şut ve Bitiricilik': 2,
        'Hava Hakimiyeti': 2,

        // Orta (1)
        'Savunma Müdahalesi': 1,
        'Duran Top Kullanımı': 1,
        'Uzun Top & Oyun Yönü': 1,
        'Geri Dönüş & Kademe (Recovery)': 1,
        'İkili Mücadele Gücü': 1
    },

    'OfansifOrtaSaha': { 
        // Kritik (3)
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
        'Duran Top Kullanımı': 2,

        // Orta (1)
        'Liderlik (Teknik)': 1,
        'Patlayıcı Hız': 1,
        'Top Taşıma': 1,
        'Pres Başlatma': 1
    },

    'Kanat': { 
        // Kritik (3)
        '1v1 Dripling & Eksiltme': 3,
        'İvmelenme (Acceleration)': 3,
        'Topsuz Koşu (Arka Direk)': 3,
        'Karar Verme (3. Bölge)': 3,
        
        // Yüksek (2)
        'Orta Kalitesi': 2,
        'Son Hız (Pace)': 2,
        'Çeviklik & Denge': 2,
        'Bitiricilik & Şut': 2,
        'Son Pas / Kilit Pas': 2,
        'İçe Kat Etme (Inverted Cut)': 2,
        'Yaratıcılık (Flair)': 2,
        'Özgüven & Risk Alma': 2,

        // Orta (1)
        'Defansif Disiplin': 1,
        'İlk Dokunuş (Progresif)': 1,
        'Dayanıklılık (RSA)': 1,
        'Duran Top Kullanımı': 1,
        'Dar Alan Becerisi': 1
    },

    // --- FORVET ---
    'Santrafor': {
        // Kritik (3)
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
        'Kilit Pas & Servis': 2,
        'Dar Alan Becerisi': 2,
        'Pres Yönlendirmesi (Gegenpress)': 2,
        'Çevre Kontrolü (Scanning)': 2,

        // Orta (1)
        'Kanal Koşuları': 1,
        'Bağlantı Oyunu': 1,
        'Pres Yönlendirmesi': 1,
        'Denge ve Çeviklik': 1,
        'Dripling & Eksiltme': 1,
        'Uzaktan Şut': 1
    },

    // --- KALECİ ---
    'Kaleci': { 
        'Refleks': 3, 'Pozisyon Alma': 3, 'Elle Kontrol': 3, 'Konsantrasyon': 3, 'Birebir (1v1)': 3,
        'Yan Top (Cross)': 2, 'İletişim': 2, 'Ayak Hakimiyeti': 2, 'Uzun Toplar': 2, 'Elle Top Dağıtımı': 2, 'Sweeper-Keeper': 2
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