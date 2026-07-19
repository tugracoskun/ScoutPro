// i18n.js - Dil ve Çeviri Yönetimi

const translations = {
    tr: {
        // --- Sidebar & Layout ---
        menu_dashboard: "Genel Bakış",
        menu_new_report: "Yeni Rapor",
        menu_database: "Veritabanı",
        menu_players: "Oyuncu Havuzu",
        menu_watchlist: "Aday Havuzu",
        menu_matches: "Maç Takvimi",
        menu_settings: "Ayarlar",
        search_player: "Oyuncu ara (Ctrl+K)",
        version: "Sürüm",

        // --- Common ---
        save: "Kaydet",
        cancel: "İptal",
        delete: "Sil",
        edit: "Düzenle",
        add: "Ekle",
        close: "Kapat",
        all: "Tümü",
        search: "Ara...",
        yes: "Evet",
        no: "Hayır",
        loading: "Yükleniyor...",
        not_found: "Bulunamadı.",
        choose: "Seçiniz",

        // --- Settings ---
        settings_title: "Ayarlar",
        dark_mode: "Karanlık Mod",
        default_theme: "Varsayılan tema",
        data_management: "Veri Yönetimi",
        data_desc: "Verilerinizi yedekleyebilir veya başka bir cihazdan aldığınız yedeği yükleyebilirsiniz.",
        export: "Yedek Al (Export)",
        export_desc: "Verileri JSON dosyası olarak kaydet.",
        import: "Yedek Yükle (Import)",
        import_desc: "JSON dosyasından verileri geri yükle.",
        restart: "Uygulamayı Yeniden Başlat",
        language: "Dil / Language",
        language_desc: "Uygulama dilini değiştir.",

        // --- Regions / Continents ---
        region_favorites: "Favoriler",
        region_europe: "Avrupa",
        region_africa: "Afrika",
        region_americas: "Amerika",
        region_asia: "Asya",
        region_oceania: "Okyanusya",
        region_other: "Diğer",

        // --- Positions ---
        pos_gk: "Kaleci",
        pos_cb: "Stoper",
        pos_rb: "Sağ Bek",
        pos_lb: "Sol Bek",
        pos_cdm: "Defansif Orta Saha",
        pos_cm: "Orta Saha",
        pos_cam: "Ofansif Orta Saha",
        pos_rw: "Sağ Kanat",
        pos_lw: "Sol Kanat",
        pos_st: "Santrafor",

        // --- Database ---
        db_title: "Veritabanı Yapısı",
        db_subtitle: "Ülke > Lig > Takım > Oyuncu",
        db_empty: "Veritabanı boş. Ülke ekleyerek başlayınız.",
        add_league: "Lig Ekle",
        add_team: "Takım Ekle",
        no_leagues: "Lig bulunamadı.",
        no_teams: "Takım yok.",
        players_count: "Oyuncu",
        team_detail: "Takım Detayı",
        return_db: "Veritabanına Dön",

        // --- Players Pool ---
        players_pool: "Oyuncu Havuzu",
        total: "Toplam",
        only_favorites: "Sadece Favoriler",
        no_players: "Kriterlere uygun oyuncu bulunamadı.",
        age: "Yaş",
        grade: "Puan",
        detail: "Detay",
        
        // --- Watchlist ---
        wl_title: "Aday Havuzu",
        new_candidate: "Yeni Aday Ekle",
        player_name: "Oyuncu Adı",
        team: "Takım",
        position: "Mevki",
        source: "Kaynak",
        notes: "Notlar",
        photo_url: "Foto URL",
        add_to_list: "Listeye Ekle",
        search_candidates: "Adaylarda ara...",
        sort_newest: "En Yeniler",
        sort_oldest: "En Eskiler",
        sort_az: "İsim (A-Z)",
        sort_za: "İsim (Z-A)",
        no_candidates: "Kriterlere uygun aday bulunamadı.",
        unknown: "Bilinmiyor",
        
        // --- Dashboard ---
        dash_welcome: "Hoş Geldin, Scout!",
        dash_subtitle: "İşte veritabanının genel durumu.",
        dash_total_players: "Toplam Oyuncu",
        dash_total_reports: "Kapsamlı Rapor",
        dash_watchlist: "Aday Havuzunda",
        dash_matches: "Yaklaşan Maç",
        dash_recent: "Son Eklenenler",
        dash_top: "En Yüksek Puanlılar",
        
        dash_reported: "Raporlanan",
        dash_reported_desc: "Detaylı analiz edilen oyuncular",
        dash_pool: "Aday Havuzu",
        dash_pool_desc: "Takip listesindeki potansiyeller",
        dash_schedule: "Maç Programı",
        dash_schedule_desc: "Planlanan izleme görevleri",
        dash_db_status: "Veritabanı Durumu",
        dash_manage: "Yönet",
        dash_country: "Ülke",
        dash_league: "Lig",
        dash_team: "Takım",
        dash_next_match: "Sıradaki Maç",
        dash_go_to_list: "Listeye Git",
        dash_no_matches: "Yaklaşan maç bulunmuyor.",
        dash_plan_match: "Maç Planla",
        dash_quick: "Hızlı İşlemler",
        dash_quick_desc: "Sık kullanılan özelliklere buradan ulaşın.",
        dash_create_report: "Rapor Oluştur",
        dash_quick_team: "Hızlı Takım Ekle",

        // --- Matches ---
        match_calendar: "Maç İzleme Takvimi",
        add_match: "Yeni Maç Ekle",
        match_date: "Tarih",
        match_home: "Ev Sahibi",
        match_away: "Deplasman",
        match_comp: "Turnuva / Lig",
        match_watch: "İzlenecek Oyuncular",
        match_status: "Durum",
        status_upcoming: "Yaklaşan",
        status_watched: "İzlendi",
        no_matches: "Kayıtlı maç bulunamadı."
    },
    en: {
        // --- Sidebar & Layout ---
        menu_dashboard: "Dashboard",
        menu_new_report: "New Report",
        menu_database: "Database",
        menu_players: "Player Pool",
        menu_watchlist: "Watchlist",
        menu_matches: "Match Calendar",
        menu_settings: "Settings",
        search_player: "Search player (Ctrl+K)",
        version: "Version",

        // --- Common ---
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        add: "Add",
        close: "Close",
        all: "All",
        search: "Search...",
        yes: "Yes",
        no: "No",
        loading: "Loading...",
        not_found: "Not found.",
        choose: "Select",

        // --- Settings ---
        settings_title: "Settings",
        dark_mode: "Dark Mode",
        default_theme: "Default theme",
        data_management: "Data Management",
        data_desc: "You can backup your data or import a backup from another device.",
        export: "Export Backup",
        export_desc: "Save data as a JSON file.",
        import: "Import Backup",
        import_desc: "Restore data from a JSON file.",
        restart: "Restart Application",
        language: "Language / Dil",
        language_desc: "Change application language.",

        // --- Regions / Continents ---
        region_favorites: "Favorites",
        region_europe: "Europe",
        region_africa: "Africa",
        region_americas: "Americas",
        region_asia: "Asia",
        region_oceania: "Oceania",
        region_other: "Other",

        // --- Positions ---
        pos_gk: "Goalkeeper",
        pos_cb: "Center Back",
        pos_rb: "Right Back",
        pos_lb: "Left Back",
        pos_cdm: "Defensive Mid",
        pos_cm: "Central Mid",
        pos_cam: "Attacking Mid",
        pos_rw: "Right Wing",
        pos_lw: "Left Wing",
        pos_st: "Striker",

        // --- Database ---
        db_title: "Database Structure",
        db_subtitle: "Country > League > Team > Player",
        db_empty: "Database is empty. Start by adding a country.",
        add_league: "Add League",
        add_team: "Add Team",
        no_leagues: "No leagues found.",
        no_teams: "No teams.",
        players_count: "Players",
        team_detail: "Team Detail",
        return_db: "Return to Database",

        // --- Players Pool ---
        players_pool: "Player Pool",
        total: "Total",
        only_favorites: "Favorites Only",
        no_players: "No players match the criteria.",
        age: "Age",
        grade: "Grade",
        detail: "Detail",
        
        // --- Watchlist ---
        wl_title: "Watchlist",
        new_candidate: "Add New Candidate",
        player_name: "Player Name",
        team: "Team",
        position: "Position",
        source: "Source",
        notes: "Notes",
        photo_url: "Photo URL",
        add_to_list: "Add to List",
        search_candidates: "Search candidates...",
        sort_newest: "Newest",
        sort_oldest: "Oldest",
        sort_az: "Name (A-Z)",
        sort_za: "Name (Z-A)",
        no_candidates: "No candidates match the criteria.",
        unknown: "Unknown",

        // --- Dashboard ---
        dash_welcome: "Welcome, Scout!",
        dash_subtitle: "Here's the overview of your database.",
        dash_total_players: "Total Players",
        dash_total_reports: "Detailed Reports",
        dash_watchlist: "In Watchlist",
        dash_matches: "Upcoming Matches",
        dash_recent: "Recently Added",
        dash_top: "Top Rated",
        
        dash_reported: "Reported",
        dash_reported_desc: "Detailed player analysis",
        dash_pool: "Watchlist",
        dash_pool_desc: "Potentials in follow list",
        dash_schedule: "Match Schedule",
        dash_schedule_desc: "Planned scouting missions",
        dash_db_status: "Database Status",
        dash_manage: "Manage",
        dash_country: "Country",
        dash_league: "League",
        dash_team: "Team",
        dash_next_match: "Next Match",
        dash_go_to_list: "Go to List",
        dash_no_matches: "No upcoming matches.",
        dash_plan_match: "Plan Match",
        dash_quick: "Quick Actions",
        dash_quick_desc: "Access frequently used features here.",
        dash_create_report: "Create Report",
        dash_quick_team: "Quick Add Team",

        // --- Matches ---
        match_calendar: "Match Calendar",
        add_match: "Add New Match",
        match_date: "Date",
        match_home: "Home",
        match_away: "Away",
        match_comp: "Competition",
        match_watch: "Players to Watch",
        match_status: "Status",
        status_upcoming: "Upcoming",
        status_watched: "Watched",
        no_matches: "No matches recorded."
    }
};

let currentLang = localStorage.getItem('scoutpro_lang') || 'tr';

window.t = function(key) {
    if (translations[currentLang] && translations[currentLang][key]) {
        return translations[currentLang][key];
    }
    return key; // Fallback
};

window.tPos = function(pos) {
    const map = {
        'Kaleci': 'pos_gk',
        'Stoper': 'pos_cb',
        'Sağ Bek': 'pos_rb',
        'Sol Bek': 'pos_lb',
        'Defansif Orta Saha': 'pos_cdm',
        'Orta Saha': 'pos_cm',
        'Ofansif Orta Saha': 'pos_cam',
        'Sağ Kanat': 'pos_rw',
        'Sol Kanat': 'pos_lw',
        'Santrafor': 'pos_st'
    };
    if (map[pos]) return window.t(map[pos]);
    return pos;
};

window.setLang = function(lang) {
    if (translations[lang]) {
        currentLang = lang;
        localStorage.setItem('scoutpro_lang', lang);
    }
};

window.getLang = function() {
    return currentLang;
};
