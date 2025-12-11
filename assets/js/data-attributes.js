// --- ÖZELLİK HAVUZU VE ALT DETAYLAR ---
const ATTRIBUTE_GROUPS = {
    
    // 1. STOPER GRUBU (Aynen Korundu)
    'Stoper': {
        'Teknik': [
            { name: 'Müdahale (Tackling)', sub: 'Ayakta Kalarak Top Kazanma, Zamanlama, Faulsüz Hamle' },
            { name: 'Hava Hakimiyeti', sub: 'Sıçrama, Kafa Vuruşu Yönlendirme, Zamanlama' },
            { name: 'Markaj', sub: 'Rakibe Yakınlık, Temaslı Oyun, Nefes Aldırmama' },
            { name: 'Pas Dağıtımı (Kısa)', sub: 'Baskı Altında Hatasız Pas, Pas Şiddeti' },
            { name: 'Hat Kıran Paslar', sub: 'Dikey Paslar, Bloğu Delen Paslar (Packing)' },
            { name: 'Uzun Top / Oyun Kurma', sub: 'Ters Kanada Diyagonal Pas, Oyunun Yönünü Değiştirme' },
            { name: 'İlk Dokunuş', sub: 'Topu Vücuduna Göre Alma, Oyuna Açma' }
        ],
        'Taktik': [
            { name: 'Pozisyon Alma', sub: 'Ofsayt Çizgisi, Doğru Yerde Durma' },
            { name: 'Sezgi (Anticipation)', sub: 'Pas Arası Yapma (Interception), Tehlikeyi Önceden Sezme' },
            { name: 'Karar Verme', sub: 'Risk Yönetimi: Ne Zaman Pas, Ne Zaman Uzaklaştırma?' },
            { name: 'Kademeye Girme', sub: 'Bek veya Partnerinin Arkasını Toplama' },
            { name: 'Vücut Oryantasyonu', sub: 'Yan Durma (Side-on), Rakibi Dışarı Yönlendirme' }
        ],
        'Fiziksel': [
            { name: 'Güç', sub: 'Omuz Omuza Mücadele, Yıkılmama, Fiziksel Caydırıcılık' },
            { name: 'Hızlanma', sub: 'İlk 5-10 Metre Patlayıcılık, Kısa Mesafe Çıkış' },
            { name: 'Son Hız (Recovery)', sub: 'Geriye Koşularda Rakibi Yakalama (30-40m)' },
            { name: 'Sıçrama', sub: 'Dikey Sıçrama Yüksekliği (Olduğu Yerden/Koşarak)' },
            { name: 'Çeviklik & Dönüş', sub: 'Kalça Dönüş Hızı, Ters Ayakta Yakalanmama' },
            { name: 'Denge', sub: 'Müdahale Sonrası Ayakta Kalıp Oyuna Devam Etme' }
        ],
        'Psiko-Sosyal': [
            { name: 'Konsantrasyon', sub: '90 Dk Odaklanma, Basit Hata Yapmama' },
            { name: 'Soğukkanlılık', sub: 'Ceza Sahasında Paniklememe (Composure)' },
            { name: 'Liderlik & İletişim', sub: 'Savunma Hattını Yönetme, Konuşma' },
            { name: 'Cesaret', sub: 'Kafa Sokma, Şut Bloklama, Sakatlanma Pahasina Hamle' },
            { name: 'Agresiflik', sub: 'Caydırıcılık, Kontrollü Sertlik' },
            { name: 'Hata Reaksiyonu', sub: 'Oyuna Küsmeme, Hatayı Telafi Etme Çabası' }
        ]
    },

    // 2. BEK GRUBU (YENİLENDİ: SAĞ/SOL BEK)
    'Bek': {
        'Teknik': [
            { name: '1v1 Savunma', sub: 'Ayakta Kalma, Fake Yememe, Müdahale Başarısı' },
            { name: 'Orta Kalitesi', sub: 'Erken Orta, Çizgiden Kesme, Yerden Cut-back' },
            { name: 'Top Sürme (Carrying)', sub: 'Boş Alanı Kat Etme, Baskı Altında Çıkış' },
            { name: 'Pas & Oyun Kurulumu', sub: 'Merkeze Yardım, İstasyon Olma (Inverted)' },
            { name: 'Ters Ayak', sub: 'İçe Kat Ederken Şut/Pas Tehdidi' },
            { name: 'İlk Dokunuş', sub: 'Hızla Giderken Top Kontrolü' }
        ],
        'Taktik': [
            { name: 'Bindirme Zamanlaması', sub: 'Overlap/Underlap Kararı, Kanatla Uyum' },
            { name: 'Arka Direk Farkındalığı', sub: 'Kör Nokta Kontrolü, Ters Topları Sezme (Kritik)' },
            { name: 'Geri Dönüş (Recovery)', sub: 'Hücumdan Savunmaya Geçiş Hızı ve Açısı' },
            { name: 'Alan Savunması', sub: 'Stoperle Arayı Kapatma, Kanal (Half-Space) Kontrolü' },
            { name: 'Pressing Tetikleyicisi', sub: 'Rakibi Ne Zaman Karşılayacağını Bilme' }
        ],
        'Fiziksel': [
            { name: 'Tekrarlı Sprint (RSA)', sub: 'Maç Boyu Git-Gel Yapabilme Motoru' },
            { name: 'Hızlanma', sub: 'İlk 5-10 Metre Patlayıcılık' },
            { name: 'Son Hız', sub: 'Uzun Mesafede Rakibi Yakalama' },
            { name: 'Çeviklik & Dönüş', sub: 'Ters Ayakta Yakalanmama, Kalça Dönüş Hızı' },
            { name: 'Dayanıklılık', sub: '90 Dakika Tempo Koruma (Box-to-Box)' },
            { name: 'Denge', sub: 'Omuz Omuza ve Driplingde Ayakta Kalma' },
            { name: 'Sıçrama', sub: 'Hava Topu Mücadelesi' }
        ],
        'Psiko-Sosyal': [
            { name: 'Çalışkanlık', sub: 'Savunmaya Dönme İsteği, Tembellik Yapmama' },
            { name: 'Konsantrasyon', sub: 'Top Uzaktayken Oyundan Kopmama (Arka Direk)' },
            { name: 'Cesaret', sub: 'Şutlara Siper Olma, Sert Müdahaleden Kaçmama' },
            { name: 'İletişim', sub: 'Önündeki Kanat Oyuncusunu Yönetme' },
            { name: 'Agresiflik', sub: 'Rakibi Sindirme, Kontrollü Sertlik' }
        ]
    },

    // 2. ORTA SAHA GRUBU (GÜNCELLENDİ: DOS, MOS, OOS - HİBRİT HAVUZ)
    'OrtaSaha': {
        'Teknik': [
            { name: 'Dar Alanda Beceri', sub: 'Çoklu Baskıda Top Saklama, Telefon Kulübesinde Çalım (Kritik)' },
            { name: 'Son Pas / Kilit Pas', sub: 'Savunma Arkasına Öldürücü Pas, Koridor Yaratma' },
            { name: 'İlk Dokunuş & Dönüş', sub: 'Yarım Dönüş (Half-turn), Topu Yüzü Kaleye Dönük Alma' },
            { name: 'Şut ve Bitiricilik', sub: 'Ceza Sahası Dışı Şut, Gölge Forvet Koşusu (Shadow Striker)' },
            { name: 'Duran Top Kullanımı', sub: 'Korner, Frikik ve Duran Top Organizasyonu' },
            { name: 'Vücut Çalımı', sub: 'Topa Dokunmadan Rakibi Ekarte Etme (Feints)' },
            { name: 'Progresif Pas', sub: 'Dikine Oynama, Hat Kıran Paslar' }, // MOS'tan geldi
            { name: 'Top Taşıma', sub: 'Boş Alanı Kat Etme' }, // MOS'tan geldi
            { name: 'Baskıya Direnç', sub: 'Sırtı Dönük Top Alma' }, // DOS'tan geldi
            { name: 'Savunma Müdahalesi', sub: 'Top Kapma, Müdahale' } // DOS'tan geldi
        ],
        'Taktik': [
            { name: 'Hatlar Arası Oyun', sub: 'Blok Arasındaki "Cep" (Pocket) Boşluklarını Bulma' },
            { name: 'Karar Verme (Hız)', sub: 'Final Bölgesinde Hızlı Düşünme (Pas mı Şut mu?)' },
            { name: 'Topsuz Koşu (Destek)', sub: 'Forvete Alan Açma, Kör Nokta Koşusu' },
            { name: 'Pres Başlatma', sub: 'Top Kaybında Önde Baskı (Gegenpress)' },
            { name: 'Tempo Kontrolü', sub: 'Oyunu Hızlandırma/Yavaşlatma (La Pausa)' }, // MOS
            { name: 'Çevre Kontrolü (Scanning)', sub: 'Omuz Arkası Kontrol' } // DOS
        ],
        'Fiziksel': [
            { name: 'Çeviklik & Denge', sub: 'Düşük Ağırlık Merkezi, Ani Yön Değiştirme' },
            { name: 'Patlayıcı Hız', sub: 'İlk 3 Metre Çıkış Hızı (Burst)' },
            { name: 'Dayanıklılık', sub: 'Maç Boyu Hücum ve Savunma Presi' },
            { name: 'İkili Mücadele Gücü', sub: 'Omuz Omuza Ayakta Kalma' } // MOS/DOS
        ],
        'Psiko-Sosyal': [
            { name: 'Yaratıcılık & Flair', sub: 'Beklenmedik Olanı Yapma, Topuk Pası, Aşırtma' },
            { name: 'Risk Alma Cesareti', sub: 'Hata Yapsa Bile Zor Pası Deneme Özgüveni' },
            { name: 'Liderlik (Teknik)', sub: 'Oyun Sıkıştığında Topu İsteme ve Sorumluluk Alma' },
            { name: 'Bencillik/Diğerkamlık', sub: 'Şut ve Pas Dengesini Doğru Ayarlama' },
            { name: 'Soğukkanlılık', sub: 'Baskı Altında Paniklememe' },
            { name: 'Çalışkanlık', sub: 'Takım Savunmasına Yardım' }
        ]
    },

    // 3. KANAT GRUBU (GÜNCELLENDİ: SAĞ/SOL AÇIK)
    'Kanat': {
        'Teknik': [
            { name: '1v1 Dripling & Eksiltme', sub: 'Statik/Dinamik Geçiş, Body Feint, Rakibi Ekarte Etme' },
            { name: 'Orta Kalitesi', sub: 'Erken Orta, Çizgiden Kesme, Yerden Cut-back' },
            { name: 'Bitiricilik & Şut', sub: 'Ters Ayakla Plase, Yakın Direk Sert Şut, Ceza Sahası Girişi' },
            { name: 'İlk Dokunuş (Progresif)', sub: 'Topu Koşu Yoluna Alma, Hız Kesmeden Kontrol' },
            { name: 'Ters Ayak Kullanımı', sub: 'İçe Kat Ederken Şut/Pas Tehdidi, Tahmin Edilemezlik' },
            { name: 'Dar Alan Becerisi', sub: 'Çizgi Kenarında Sıkışınca Top Saklama' }
        ],
        'Taktik': [
            { name: 'Topsuz Koşu (Arka Direk)', sub: 'Ters Kanat Ortasında İkinci Forvet Gibi Girme (Kritik)' },
            { name: 'Karar Verme (3. Bölge)', sub: 'Final Anında Doğru Tercih (Çalım mı, Pas mı, Şut mu?)' },
            { name: 'Genişlik & Derinlik', sub: 'Çizgide Kalma vs İçe Kat Etme Zamanlaması' },
            { name: 'Kör Nokta Koşuları', sub: 'Bekin Görüş Alanından Çıkarak Sızma (Blindside)' },
            { name: 'Pres Tetikleme', sub: 'Pas Açısını Kapatarak (Shadow) Baskı Başlatma' }
        ],
        'Fiziksel': [
            { name: 'İvmelenme (Acceleration)', sub: 'İlk 5-10 Metre Patlayıcılık, Ani Çıkış' },
            { name: 'Son Hız (Pace)', sub: 'Geniş Alanda Topa Yetişme, Kontra Atak Hızı' },
            { name: 'Çeviklik & Denge', sub: 'Yüksek Hızda Yön Değiştirme, Düşük Ağırlık Merkezi' },
            { name: 'Dayanıklılık (RSA)', sub: 'Tekrarlı Sprint Yeteneği, Maç Boyu Git-Gel' }
        ],
        'Psiko-Sosyal': [
            { name: 'Özgüven & Risk Alma', sub: 'Hata Yapsa Bile Tekrar Deneme Cesareti' },
            { name: 'Yaratıcılık (Flair)', sub: 'Beklenmedik Hamleler, Sihirli Dokunuşlar' },
            { name: 'Defansif Disiplin', sub: 'Bekini Takip Etme (Tracking Back), Takım Savunması' },
            { name: 'Takım Oyunu', sub: 'Şut/Pas Dengesini Doğru Ayarlama (Bencillik Kontrolü)' }
        ]
    },

    // 4. FORVET GRUBU (GÜNCELLENDİ: SANTRAFOR)
    'Forvet': {
        'Teknik': [
            { name: 'Bitiricilik', sub: 'Vuruş Kalitesi, Köşeleri Arama, Tek Vuruş (One-touch)' },
            { name: 'Sırtı Dönük Oyun', sub: 'Baskı Altında Top Saklama, Duvar Olma, Servis Yapma' },
            { name: 'İlk Dokunuş (Ceza Sahası)', sub: 'Sert Pası Yumuşatma, Şut Açısı Yaratma' },
            { name: 'Kafa Vuruşu', sub: 'Zamanlama, Yönlendirme ve Sıçrama Tekniği' },
            { name: 'Zayıf Ayak', sub: 'Her İki Ayağı Şut/Pas İçin Kullanabilme' },
            { name: 'Dripling & Eksiltme', sub: 'Yüzü Dönükken Stoperin Üzerine Gitme, Çalım' },
            { name: 'Uzaktan Şut', sub: 'Ceza Sahası Dışı Tehdit (Opsiyonel)' }
        ],
        'Taktik': [
            { name: 'Kör Nokta Koşuları', sub: 'Stoperin Görüş Alanından Çıkıp Sızma (Blindside)' },
            { name: 'Ceza Sahası Sezgisi', sub: 'Topun Düşeceği Yeri Hissetme, Fırsatçılık (Poacher)' },
            { name: 'Kanal Koşuları', sub: 'Stoper-Bek Arasına Sızma (Runs into Depth)' },
            { name: 'Bağlantı Oyunu', sub: 'Orta Sahaya Yaklaşıp Pas İstasyonu Olma (False 9)' },
            { name: 'Pres Yönlendirmesi', sub: 'Kavisli Koşuyla Rakip Stoperi Hataya Zorlama' }
        ],
        'Fiziksel': [
            { name: 'Patlayıcı Güç', sub: 'İlk 3-5 Metre Çıkış Hızı, Ofsayttan Kurtulma' },
            { name: 'Fiziksel Güç', sub: 'Omuz Omuza Mücadele, Yıkılmama' },
            { name: 'Sıçrama (Jumping Reach)', sub: 'Olduğu Yerden veya Koşarak Yükselme' },
            { name: 'Denge ve Çeviklik', sub: 'Darbe Altında Ayakta Kalma, Ani Dönüşler (Spin)' },
            { name: 'Dayanıklılık', sub: '90 Dk Pres ve Koşu Kapasitesi' }
        ],
        'Psiko-Sosyal': [
            { name: 'Soğukkanlılık', sub: 'Karşı Karşıya Pozisyonlarda Nabız Kontrolü, Paniklememe' },
            { name: 'Direnç (Resilience)', sub: 'Gol Kaçırdıktan Sonra Oyundan Düşmeme İradesi' },
            { name: 'Cesaret', sub: 'Tekmeye Kafa Uzatma, Karambole Girme' },
            { name: 'Bencillik Dengesi', sub: 'Doğru Anda Şut veya Pas Tercihi' },
            { name: 'Agresiflik', sub: 'Rakip Stoperleri Rahatsız Etme' }
        ]
    },

    // 6. KALECİ GRUBU
    'Kaleci': {
        'Teknik': [
            { name: 'Top Kontrolü', sub: 'Geri Pasları Alma, Ayakla Kontrol' },
            { name: 'Elle Kontrol', sub: 'Topu Tutma, Sektirmeme, Yapıştırma' },
            { name: 'Elle Top Dağıtımı', sub: 'Hızlı ve İsabetli Elle Başlatma' },
            { name: 'Ayak Hakimiyeti', sub: 'Baskı Altında Pas, Oyun Kurma' },
            { name: 'Uzun Toplar', sub: 'Degaj ve Kale Vuruşu Mesafesi' },
            { name: 'Refleks', sub: 'Çizgi Üzerinde Reaksiyon' },
            { name: 'Yan Top', sub: 'Hava Toplarına Çıkış ve Yumruklama' },
            { name: 'Birebir', sub: 'Karşı Karşıya Pozisyonlarda Başarı' },
            { name: 'Kurtarışlar', sub: 'Zor Topları Çıkarma Kapasitesi' }
        ],
        'Fiziksel': [
            { name: 'Boy & Erişim', sub: 'Uzanma Mesafesi, Fiziksel Caydırıcılık' },
            { name: 'Çeviklik', sub: 'Yere Yatıp Kalkma Hızı' },
            { name: 'Kuvvet', sub: 'İkili Mücadelede Yıkılmama' },
            { name: 'Patlayıcı Kuvvet', sub: 'Ani Sıçrama ve Çıkış Hızı' },
            { name: 'Denge', sub: 'Pozisyon Aldıktan Sonra Sabit Kalma' },
            { name: 'Esneklik', sub: 'Zor Köşelere Uzanabilme' },
            { name: 'Vücut Tipi', sub: 'Atletik Yapı ve Kilo Kontrolü' }
        ],
        'Psikolojik (Mental)': [
            { name: 'Pozisyon Alma', sub: 'Açıyı Daraltma, Doğru Yerde Durma' },
            { name: 'Konsantrasyon', sub: '90 Dakika Boyunca Oyunda Kalma' },
            { name: 'Cesaret', sub: 'Sakatlanma Pahasina Topa Çıkma' },
            { name: 'Soğukkanlılık', sub: 'Hata Sonrası Toparlanma, Paniklememe' },
            { name: 'Kararlılık', sub: 'Kalesini Gole Kapatma Hırsı' },
            { name: 'Disiplin', sub: 'Taktiksel Sadakat ve Ciddiyet' },
            { name: 'Zorluklara Tepki', sub: 'Yenen Hatalı Golden Sonraki Tutum' }
        ],
        'Sosyolojik': [
            { name: 'İletişim', sub: 'Defans Hattını Uyarma ve Yönetme' },
            { name: 'Kalede Güven', sub: 'Takım Arkadaşlarına Verdiği Güven' },
            { name: 'Liderlik', sub: 'Savunma Organizasyonunu Yönetme' },
            { name: 'Profesyonellik', sub: 'Saha İçi ve Dışı Duruş' },
            { name: 'İlişkiler', sub: 'Takım Arkadaşlarıyla Uyumu' }
        ]
    },

    // Varsayılan
    'Default': {
        'Genel': [ { name: 'Hız', sub: '' }, { name: 'Şut', sub: '' }, { name: 'Pas', sub: '' }, { name: 'Fizik', sub: '' } ]
    }
};