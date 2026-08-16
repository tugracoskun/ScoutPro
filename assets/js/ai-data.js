// --- HIZLI ASİSTAN BİLGİ BANKASI (DATA) ---

const ASSISTANT_CATEGORIES = [
    { 
        id: 'app', 
        name: 'ScoutPro Kılavuzu', 
        icon: 'app-window', 
        color: 'from-blue-500/20 to-cyan-500/20 border-cyan-500/30 text-cyan-400',
        iconBg: 'bg-cyan-500/10 text-cyan-400',
        desc: 'Raporlama, veritabanı, transfer geçmişi ve Data Hub kullanımı.' 
    },
    { 
        id: 'positions', 
        name: 'Mevkiler & Roller', 
        icon: 'shield', 
        color: 'from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-400',
        iconBg: 'bg-emerald-500/10 text-emerald-400',
        desc: 'Modern stoper, kanat bek, regista ve forvet profilleri.' 
    },
    { 
        id: 'scouting', 
        name: 'Metodoloji & 4 Köşe', 
        icon: 'compass', 
        color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400',
        iconBg: 'bg-purple-500/10 text-purple-400',
        desc: '4 Köşe modeli, tarama (scanning) ve canlı scouting.' 
    },
    { 
        id: 'development', 
        name: 'Gelişim & Yaş Evreleri', 
        icon: 'trending-up', 
        color: 'from-amber-500/20 to-yellow-500/20 border-amber-500/30 text-amber-400',
        iconBg: 'bg-amber-500/10 text-amber-400',
        desc: 'U9-U21 yaş grupları, PHV dönemi ve Halo etkisi tuzakları.' 
    },
    { 
        id: 'faq', 
        name: 'Sık Sorulan Sorular', 
        icon: 'help-circle', 
        color: 'from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-400',
        iconBg: 'bg-rose-500/10 text-rose-400',
        desc: 'Puan hesaplama formülü, karşılaştırma ve çevrimdışı kullanım.' 
    }
];

const AI_TUTORIALS = {
    // ═══════════════ SCOUTPRO KULLANIM ═══════════════
    'reporting': {
        category: 'app',
        title: "📝 Oyuncu Raporlama Nasıl Yapılır?",
        summary: "Kimlik, mevkisel 4 köşe puanlaması, potansiyel ve not ekleme adımları.",
        keywords: "raporlama rapor ekle puanlama analiz puan potansiyel",
        content: `
            Oyuncu Raporu oluşturmak ScoutPro'nun kalbidir.<br><br>
            <div class="space-y-2 text-xs text-slate-300">
                <div class="bg-dark-900 p-2.5 rounded-xl border border-dark-750">
                    <b class="text-white">1. Kimlik Bilgileri:</b> Oyuncu adı, takımı, doğum tarihi, mevki, boy ve tercih ettiği ayak bilgilerini girin.
                </div>
                <div class="bg-dark-900 p-2.5 rounded-xl border border-dark-750">
                    <b class="text-white">2. 4 Köşe Puanlaması:</b> Seçtiğiniz mevkiye özel (Teknik, Taktik, Fiziksel, Psiko-Sosyal) metrikleri 1-100 arasında puanlayın.
                </div>
                <div class="bg-dark-900 p-2.5 rounded-xl border border-dark-750">
                    <b class="text-white">3. Potansiyel Belirleme:</b> Oyuncunun gelecekte ulaşabileceği tavan seviyeyi (Yüksek / Düşük) seçin.
                </div>
                <div class="bg-dark-900 p-2.5 rounded-xl border border-dark-750">
                    <b class="text-white">4. Medya & Video:</b> Raporu kaydettikten sonra oyuncu profilinden YouTube maç klipleri ve sosyal gözlem notları ekleyebilirsiniz.
                </div>
            </div>
        `
    },
    'watchlist': {
        category: 'app',
        title: "👁️ Aday Havuzu (Watchlist) Ne İşe Yarar?",
        summary: "Detaylı raporlamadan önce 'takibe aldım' dediğiniz potansiyel oyuncular listesi.",
        keywords: "aday havuzu watchlist takip izleme havuz",
        content: `
            Henüz detaylı 4 köşe analizini yapacak kadar izlemediğiniz ama radara girdiğiniz oyuncular içindir.<br><br>
            <ul class="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                <li>Sadece oyuncu ismi, takımı ve pozisyonuyla saniyeler içinde aday ekleyebilirsiniz.</li>
                <li>Gözlem notları ve öncelik seviyesi belirleyebilirsiniz.</li>
                <li>Oyuncuyu yeterince izlediğinizde tek tıkla <b class="text-scout-400">Rapor Oluştur</b> butonuna basarak tam raporlama ekranına taşıyabilirsiniz.</li>
            </ul>
        `
    },
    'database': {
        category: 'app',
        title: "🗄️ Veritabanı & Gençlik Takımları Yapısı",
        summary: "Ülke -> Kulüp / Gençlik Takımı / Milli Takım hiyerarşik organizasyonu.",
        keywords: "veritabanı takım ülke lig altyapı gençlik u19 u21 milli takım",
        content: `
            ScoutPro profesyonel bir kulüp veri yapısı kullanır:<br><br>
            <div class="space-y-1.5 text-xs text-slate-300">
                <div class="flex items-center gap-2 bg-dark-900 p-2 rounded-lg border border-dark-850">
                    <span class="w-5 h-5 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">1</span>
                    <span><b>Ülke</b> ekleyin (Örn: İspanya, Türkiye, Brezilya).</span>
                </div>
                <div class="flex items-center gap-2 bg-dark-900 p-2 rounded-lg border border-dark-850">
                    <span class="w-5 h-5 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">2</span>
                    <span><b>Kulüp Takımları</b>, <b>Gençlik Takımları</b> (U19, U21) veya <b>Milli Takımlar</b> oluşturun.</span>
                </div>
                <div class="flex items-center gap-2 bg-dark-900 p-2 rounded-lg border border-dark-850">
                    <span class="w-5 h-5 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">3</span>
                    <span>Bir kulüp eklerken tek tıkla aynı anda <b>U19, U21, U17</b> gençlik takımlarını da otomatik üretebilirsiniz!</span>
                </div>
            </div>
        `
    },
    'transfers': {
        category: 'app',
        title: "🔄 Oyuncu Transferi & Kariyer Geçmişi",
        summary: "Kulüp değiştirme, bonservis/kira bedelleri ve transfer zaman çizelgesi.",
        keywords: "transfer geçmiş kariyer kulüp değiştir bonservis kiralık bedel",
        content: `
            Raporlu bir oyuncunun kulübü değiştiğinde bunu iki şekilde işleyebilirsiniz:<br><br>
            <ul class="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                <li>Oyuncunun raporunu açıp <b>Düzenle</b>'ye basın ve Takımını değiştirin.</li>
                <li>Sistem size sorar: <i>"Yanlışlığı mı düzeltiyorsunuz, yoksa Transfer mi oldu?"</i></li>
                <li><b>Transfer Oldu</b> seçildiğinde; Bonservis, Kiralık veya Serbest transfer tipi, transfer bedeli (€), sözleşme süresi ve özel transfer notu ekleyebilirsiniz.</li>
                <li>Tüm transferler oyuncunun detay sayfasındaki <b>Transfer Geçmişi & Kariyer</b> çizelgesinde saklanır.</li>
            </ul>
        `
    },
    'datahub': {
        category: 'app',
        title: "📊 Data Hub (4'lü Matris & Saçılım Grafiği)",
        summary: "Oyuncuları X ve Y ekseni özelliklerine göre birbirleriyle kıyaslama.",
        keywords: "data hub grafik matris saçılım scatter kıyaslama istatistik",
        content: `
            Data Hub, oyuncu havuzunuzdaki benzer mevkideki oyuncuları iki farklı metriğe göre görselleştirir:<br><br>
            <ul class="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                <li>Örnek: <b>X Ekseni = Piyasa Değeri (€)</b>, <b>Y Ekseni = Müdahale (Tackling)</b>.</li>
                <li><b>4'lü Matris Görünümü:</b> Grafiği 4 çeyreğe böler (Örn: <i>Düşük Maliyet - Yüksek Başarı</i>).</li>
                <li>Grafikteki herhangi bir noktaya tıklayarak doğrudan o oyuncunun detay raporunu açabilirsiniz.</li>
            </ul>
        `
    },
    'backup': {
        category: 'app',
        title: "💾 Veri Yedekleme & Geri Yükleme",
        summary: "Verilerinizi JSON olarak dışa aktarma ve başka cihaza taşıma.",
        keywords: "yedek export import geri yükle kaydet dosya json",
        content: `
            ScoutPro verilerinizi %100 yerel ve gizli tutar. Yedek almak için:<br><br>
            <ol class="list-decimal list-inside space-y-1.5 text-xs text-slate-300">
                <li>Sol alttaki <b>Ayarlar</b> menüsüne gidin.</li>
                <li><b>Yedek Al (Export)</b> butonuna basarak tüm veritabanınızı <code>.json</code> dosyası olarak indirin.</li>
                <li>Yeni bir bilgisayara geçtiğinizde <b>Yedek Yükle (Import)</b> diyerek bu dosyayı seçin.</li>
            </ol>
        `
    },

    // ═══════════════ MEVKİLER & ROLLER ═══════════════
    'pos_cb': {
        category: 'positions',
        title: "🛡️ Modern Stoper (CB) Kriterleri",
        summary: "Hava topu, pozisyon alma, hat kıran paslar ve toparlanma hızı.",
        keywords: "stoper cb defans defansif hava hakimiyeti markaj",
        content: `
            Modern futbolda stoper sadece kesici değil, ilk oyun kurucudur:<br><br>
            <div class="space-y-2 text-xs text-slate-300">
                <div class="bg-dark-900 p-2 rounded-lg border border-dark-800">
                    <b class="text-emerald-400">Öncelikli Kriterler:</b> Pozisyon Alma, Sezgi (Anticipation), Hava Hakimiyeti, Soğukkanlılık.
                </div>
                <div class="bg-dark-900 p-2 rounded-lg border border-dark-800">
                    <b class="text-blue-400">Oyun Kurma:</b> Hat kıran dikine paslar, ters kanada diyagonal uzun top atabilme becerisi.
                </div>
                <div class="bg-dark-900 p-2 rounded-lg border border-dark-800">
                    <b class="text-amber-400">Toparlanma Hızı:</b> Savunma arkasına atılan toplarda ilk 5-10 metre dönüş ve sprint reaksiyonu.
                </div>
            </div>
        `
    },
    'pos_fullback': {
        category: 'positions',
        title: "⚡ Bek & Kanat Bek (RB/LB) Kriterleri",
        summary: "Aerobik kapasite, bindirme zamanlaması ve 1v1 savunma dayanıklılığı.",
        keywords: "bek sağ bek sol bek rb lb kanat bek orta",
        content: `
            Bekler modern takımlarda en çok efor sarf eden pozisyondur:<br><br>
            <ul class="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                <li><b>Dayanıklılık & RSA:</b> Maç boyu 10-12 km mesafe ve tekrarlanan sprint (RSA) yeteneği.</li>
                <li><b>1v1 Savunma:</b> Rakip kanat oyuncusunu içeri veya çizgiye yönlendirme disiplini.</li>
                <li><b>Hücum Katkısı:</b> İsabetli ceza sahası ortaları, overlap/underlap bindirme zamanlaması.</li>
            </ul>
        `
    },
    'pos_midfield': {
        category: 'positions',
        title: "🎯 Orta Saha Rolleri (6, 8 ve 10 Numara)",
        summary: "Regista, Box-to-Box, Mezzala ve Ofansif Oyun Kurucu farkları.",
        keywords: "orta saha cdm cm cam 6 numara 8 numara 10 numara regista mezzala",
        content: `
            Orta saha oyuncuları rollerine göre çok farklı kriterlerle değerlendirilir:<br><br>
            <div class="space-y-2 text-xs text-slate-300">
                <div class="bg-dark-900 p-2 rounded-lg border border-dark-800">
                    <b class="text-cyan-400">6 Numara (Regista/DMC):</b> Çevre kontrolü (Scanning), pas temposunu belirleme, geçiş savunması.
                </div>
                <div class="bg-dark-900 p-2 rounded-lg border border-dark-800">
                    <b class="text-amber-400">8 Numara (Box-to-Box/Mezzala):</b> Ceza sahasından ceza sahasına koşu, ikinci topları toplama, topsuz sızmalar.
                </div>
                <div class="bg-dark-900 p-2 rounded-lg border border-dark-800">
                    <b class="text-purple-400">10 Numara (CAM/Playmaker):</b> Kilit pas (Key Pass), dar alanda dönüş, yaratıcılık ve bitiricilik.
                </div>
            </div>
        `
    },
    'pos_striker': {
        category: 'positions',
        title: "⚽ Santrafor & Forvet Rolleri (9 Numara / Sahte 9)",
        summary: "Hedef forvet, pres forveti, sahte 9 ve ceza sahası tilkisi özellikleri.",
        keywords: "forvet santrafor st golcü sahte 9 hedef forvet bitiricilik",
        content: `
            Santrafor değerlendirmesinde sadece atılan gol sayısı değil, oyun içi rolü incelenir:<br><br>
            <ul class="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                <li><b>Hedef Forvet (Target Man):</b> Top saklama, sırtı dönük duvar olma, stoperleri üzerine çekme.</li>
                <li><b>Sahte 9 (False 9):</b> Orta sahaya yaklaşarak stoperleri yerinden çıkarma ve kanatlara koridor açma.</li>
                <li><b>Ceza Sahası Sezgisi:</b> Ön direk/arka direk koşuları, kör noktadan çıkış ve ilk dokunuş bitiriciliği.</li>
            </ul>
        `
    },

    // ═══════════════ METODOLOJİ & 4 KÖŞE ═══════════════
    'four_corner': {
        category: 'scouting',
        title: "🧩 4 Köşe Modeli (The 4-Corner Model)",
        summary: "Teknik, Taktik, Fiziksel ve Psiko-Sosyal dengeli analiz çerçevesi.",
        keywords: "4 köşe dört köşe model teknik taktik fiziksel psikolojik metodoloji",
        content: `
            Dünya futbolunda elit akademilerin (FA, UEFA) kullandığı holistik gözlem modeli:<br><br>
            <div class="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                <div class="bg-dark-900 p-2 rounded-lg border border-emerald-500/20">
                    <b class="text-emerald-400">1. TEKNİK:</b> İlk kontrol, iki ayak kullanımı, pas isabeti, bitiricilik.
                </div>
                <div class="bg-dark-900 p-2 rounded-lg border border-blue-500/20">
                    <b class="text-blue-400">2. TAKTİK:</b> Alan bilgisi, pozisyon alma, karar verme, topsuz hareket.
                </div>
                <div class="bg-dark-900 p-2 rounded-lg border border-amber-500/20">
                    <b class="text-amber-400">3. FİZİKSEL:</b> Hız, çeviklik, denge, patlayıcı güç, aerobik dayanıklılık.
                </div>
                <div class="bg-dark-900 p-2 rounded-lg border border-purple-500/20">
                    <b class="text-purple-400">4. PSİKO-SOSYAL:</b> Liderlik, iletişim, baskı direnci, antrenman ahlakı.
                </div>
            </div>
        `
    },
    'scanning': {
        category: 'scouting',
        title: "👁️ Çevre Kontrolü (Scanning / Tarama) Nedir?",
        summary: "Top ayağa gelmeden önce omzun arkasına bakma sıklığı ve karar hızına etkisi.",
        keywords: "tarama scanning çevre kontrolü bakış omuz de bruyne xavi",
        content: `
            Elit oyuncuları sıradan oyunculardan ayıran en büyük fark <b>Scanning</b> frekansıdır:<br><br>
            <ul class="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                <li>Bir oyuncu top kendisine gelmeden önceki 10 saniyede kaç kez başını çevirip sahadaki boşlukları ve rakipleri kontrol ediyor?</li>
                <li>Elit orta sahalar (Xavi, De Bruyne) saniyede <b>0.5 - 0.8 tarama</b> yapar.</li>
                <li>Yüksek tarama yapan oyuncu top ayağına geldiğinde düşünecek zamana ihtiyaç duymaz; pası zaten kafasında planlamıştır.</li>
            </ul>
        `
    },
    'live_scouting': {
        category: 'scouting',
        title: "🏟️ Stadyumda Canlı Maç İzlerken Nelere Bakılır?",
        summary: "Televizyon kamerasının göstermediği topsuz oyun, vücut dili ve reaksiyonlar.",
        keywords: "canlı izleme maç stadyum tribün vücut dili topsuz",
        content: `
            Stadyumda olmanın en büyük avantajı kameranın dışında kalan alandır:<br><br>
            <ol class="list-decimal list-inside space-y-1.5 text-xs text-slate-300">
                <li><b>Topsuz Oyun:</b> Top sahanın diğer ucundayken oyuncu nereye kayıyor, savunma hattını nasıl düzenliyor?</li>
                <li><b>Vücut Dili:</b> Takım arkadaşı hata yaptığında ya da kendisi top kaybettiğinde pes ediyor mu yoksa hemen baskıya mı geçiyor?</li>
                <li><b>Isınma Rutini:</b> Maç öncesi ciddiyeti, konsantrasyonu ve antrenör direktiflerine ilgisi.</li>
            </ol>
        `
    },

    // ═══════════════ GELİŞİM & YAŞ ═══════════════
    'dev_phases': {
        category: 'development',
        title: "📈 Futbolcu Gelişim Evreleri (U9 - U21)",
        summary: "Temel Eğitim (U9-12), Gençlik Gelişim (U13-16) ve Profesyonel Geçiş (U17-21).",
        keywords: "gelişim evreleri u9 u12 u13 u16 u17 u21 phv ergenlik yaş",
        content: `
            Farklı yaş grupları farklı beklentilerle değerlendirilir:<br><br>
            <div class="space-y-2 text-xs">
                <div class="bg-dark-900 p-2.5 rounded-xl border border-dark-800">
                    <div class="font-bold text-blue-400">1. Temel Eğitim (U9-U12): Topla Aşk</div>
                    <p class="text-slate-400 mt-0.5">Bireysel teknik, iki ayak kullanımı ve yaratıcılık. Taktik disiplin aranmaz.</p>
                </div>
                <div class="bg-dark-900 p-2.5 rounded-xl border border-dark-800">
                    <div class="font-bold text-amber-400">2. Gençlik Gelişim (U13-U16): Taktiksel Uyanış</div>
                    <p class="text-slate-400 mt-0.5">Topsuz hareket, tarama ve alan bilgisi. Ergenlik büyüme atağı (PHV) sebebiyle geçici sakarlıklar normaldir.</p>
                </div>
                <div class="bg-dark-900 p-2.5 rounded-xl border border-dark-800">
                    <div class="font-bold text-emerald-400">3. Profesyonel Geçiş (U17-U21): Performans</div>
                    <p class="text-slate-400 mt-0.5">Yüksek yoğunluk, profesyonel yaşam, istikrar ve maç kazanma zihniyeti.</p>
                </div>
            </div>
        `
    },
    'halo_effect': {
        category: 'development',
        title: "⚠️ Halo Etkisi & Göreceli Yaş Etkisi (RAE)",
        summary: "Fiziksel erken gelişen oyuncuların yetenek yanılsaması ve doğum ayı avantajı.",
        keywords: "halo etkisi rae fiziksel erken gelişme yanılsama ocak doğum ayı",
        content: `
            Genç oyuncu izlerken en çok düşülen iki tuzak:<br><br>
            <ul class="list-disc list-inside space-y-2 text-xs text-slate-300">
                <li><b>Halo Etkisi:</b> Yaşıtlarına göre boyu ve kas kütlesi erken gelişen oyuncu alt yaşta domine eder; ancak üst seviyede herkes aynı güce ulaştığında teknik eksiklikleri yüzünden kaybolabilir.</li>
                <li><b>Göreceli Yaş Etkisi (RAE):</b> Yılın ilk aylarında (Ocak-Mart) doğan çocuklar, yıl sonundakilere göre 11 aya varan biyolojik gelişim farkına sahiptir.</li>
            </ul>
        `
    },

    // ═══════════════ SSS (SIKÇA SORULANLAR) ═══════════════
    'faq_score': {
        category: 'faq',
        title: "❓ Oyuncunun Puanı (Rating) Nasıl Hesaplanır?",
        summary: "Mevkisel ağırlıklar ve girilen özellik puanlarının genel ortalaması.",
        keywords: "puan rating genel puan not hesaplama ortalama",
        content: `
            ScoutPro'da genel puan basit bir ortalama değildir:<br><br>
            <ul class="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                <li>Mevkisine göre o rol için <b>Kritik</b> kabul edilen özellikler (Örn: Santrafor için Bitiricilik, Stoper için Hava Hakimiyeti) genel nota daha yüksek katsayıyla etki eder.</li>
                <li>Puan aralıkları: <b>A+ (Elit)</b>, <b>A (Çok İyi)</b>, <b>B+ (İyi)</b>, <b>C (Orta)</b>, <b>D (Yetersiz)</b> şeklinde harf derecelendirmesine dönüştürülür.</li>
            </ul>
        `
    },
    'faq_compare': {
        category: 'faq',
        title: "❓ İki Oyuncuyu Nasıl Karşılaştırabilirim?",
        summary: "Radar grafiğinde karşılıklı mevkisel kıyaslama adımları.",
        keywords: "karşılaştır kıyasla compare iki oyuncu radar",
        content: `
            İki oyuncuyu kıyaslamak için:<br><br>
            <ol class="list-decimal list-inside space-y-1.5 text-xs text-slate-300">
                <li><b>Oyuncu Havuzu</b> sayfasına gidin.</li>
                <li>Sağ üstteki <b>Karşılaştır</b> butonuna basın.</li>
                <li>Açılan menüden karşılaştırmak istediğiniz iki oyuncuyu seçin.</li>
                <li>Çift renkli Radar grafiği ve yan yana 4 Köşe istatistikleriyle oyuncuların üstün yönlerini anında görün.</li>
            </ol>
        `
    },
    'faq_offline': {
        category: 'faq',
        title: "❓ İnternetsiz (Çevrimdışı) Çalışır mı?",
        summary: "ScoutPro'nun internet bağlantısı olmadan çalışma prensipleri.",
        keywords: "çevrimdışı offline internetsiz bağlantı resimler",
        content: `
            <b>Evet, ScoutPro %100 yerel ve çevrimdışı çalışır!</b><br><br>
            <ul class="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                <li>Tüm oyuncular, takımlar ve raporlar bilgisayarınızda saklanır.</li>
                <li>Ayarlar menüsünden <b>"Tüm Görselleri İndir"</b> derseniz eklediğiniz takım logoları ve oyuncu fotoğrafları da bilgisayarınıza önbelleğe alınır ve internet olmadan da kusursuz görüntülenir.</li>
            </ul>
        `
    }
};