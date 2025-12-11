// --- AI BİLGİ BANKASI (DATA) ---

const AI_TUTORIALS = {
    'watchlist': {
        title: "👁️ Aday Havuzu (Watchlist)",
        content: `
            Burası, henüz detaylı analizini yapmadığınız ama <i>"gözüm üzerinde olsun"</i> dediğiniz oyuncular içindir.<br><br>
            <ul class="list-disc list-inside space-y-1 text-slate-300 text-xs">
                <li>Hızlıca oyuncu ismi ve takım girerek ekleyebilirsiniz.</li>
                <li>Detaylı puanlama yapmanıza gerek yoktur.</li>
                <li>Listede oyuncunun yanındaki <i data-lucide="clipboard-list" class="inline w-3 h-3"></i> ikonuna basarak onu <b>Raporlama</b> ekranına taşıyabilirsiniz.</li>
            </ul>
        `
    },
    'reporting': {
        title: "📝 Detaylı Raporlama",
        content: `
            Bir oyuncuyu tam anlamıyla analiz etmek için bu ekranı kullanın.<br><br>
            <ul class="list-disc list-inside space-y-1 text-slate-300 text-xs">
                <li><b>Kimlik:</b> Ad, takım, doğum tarihi, boy, ayak gibi temel bilgiler.</li>
                <li><b>Puanlama:</b> Mevkiye özel (Örn: Stoper için Markaj) özellikleri puanlayın.</li>
                <li><b>Potansiyel:</b> Oyuncunun gelişim tavanını belirleyin.</li>
            </ul><br>
            Kaydettikten sonra detay ekranından oyuncuya <b>Video</b> ve <b>Gözlem Notu</b> ekleyebilirsiniz.
        `
    },
    'database': {
        title: "🗄️ Veritabanı Mantığı",
        content: `
            ScoutPro hiyerarşik bir yapı kullanır. Bir oyuncu ekleyebilmek için önce takımını kurmalısınız.<br><br>
            <b>Sıralama Şöyledir:</b><br>
            1. 🌍 <b>Ülke Ekle:</b> (Örn: Türkiye)<br>
            2. 🏆 <b>Lig Ekle:</b> (Örn: Süper Lig)<br>
            3. 🛡️ <b>Takım Ekle:</b> (Örn: Galatasaray)<br><br>
            Takımların logolarını internetten URL olarak ekleyebilirsiniz.
        `
    },
    'backup': {
        title: "💾 Veri Yedekleme & Aktarma",
        content: `
            Uygulama tamamen çevrimdışı (offline) çalışır ve veriler bilgisayarınızda saklanır. Verilerinizi kaybetmemek veya başka bilgisayara taşımak için:<br><br>
            1. <b>Ayarlar</b> menüsüne gidin.<br>
            2. <b>Yedek Al (Export)</b> butonuna basın.<br>
            3. İnen <b>.json</b> dosyasını saklayın.<br><br>
            Başka bir bilgisayarda <b>Yedek Yükle (Import)</b> diyerek bu dosyayı seçerseniz tüm verileriniz geri gelir.
        `
    },
    'matches': {
        title: "📅 Maç İzleme Planı",
        content: `
            Hafta sonu izleyeceğiniz maçları ve o maçta özellikle dikkat edeceğiniz oyuncuları planlayın.<br><br>
            <ul class="list-disc list-inside space-y-1 text-slate-300 text-xs">
                <li>Ev sahibi ve deplasman takımını seçin.</li>
                <li>Maç tarihini ve saatini girin.</li>
                <li><b>Hedef Oyuncu:</b> O maçta özellikle kimi izleyeceksiniz? (Aday veya Raporlu oyuncu seçilebilir).</li>
            </ul><br>
            Maç saati geldiğinde Dashboard ekranında "Sıradaki Maç" olarak hatırlatılır.
        `
    },
    'dev_phases': {
        title: "📈 Futbolcu Gelişim Evreleri",
        content: `
            ScoutPro, oyuncuları sadece yeteneklerine göre değil, biyolojik ve zihinsel olgunluklarına göre değerlendirir.<br><br>
            <div class="space-y-3 mt-2">
                <div class="bg-white/5 p-2 rounded-lg border border-white/5">
                    <div class="text-xs font-bold text-blue-300">1. Temel Eğitim (U9-U12)</div>
                    <div class="text-[10px] text-slate-300">Odak: Top hakimiyeti ve oyun sevgisi. Taktiksel disiplin aranmaz.</div>
                </div>
                <div class="bg-white/5 p-2 rounded-lg border border-white/5">
                    <div class="text-xs font-bold text-yellow-300">2. Gençlik Gelişim (U13-U16)</div>
                    <div class="text-[10px] text-slate-300">Odak: Taktiksel uyanış. Fiziksel değişimler (Growth Spurt) teknik hatalara yol açabilir.</div>
                </div>
                <div class="bg-white/5 p-2 rounded-lg border border-white/5">
                    <div class="text-xs font-bold text-green-300">3. Profesyonel Gelişim (U17-U21)</div>
                    <div class="text-[10px] text-slate-300">Odak: Kazanma zihniyeti, yüksek yoğunluk ve profesyonellik.</div>
                </div>
            </div>
        `
    },
    'about': {
        title: "🚀 ScoutPro v1.0.2",
        content: `
            Profesyonel scoutlar ve futbol tutkunları için geliştirilmiş, tamamen çevrimdışı çalışan kişisel veritabanı ve analiz aracı.<br><br>
            <span class="text-xs text-slate-400">Teknoloji: ElectronJS, Tailwind, ApexCharts</span>
        `
    }
};