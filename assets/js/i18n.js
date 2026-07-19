// i18n.js - Dil ve Çeviri Yönetimi

const translations = {
    tr: {
        // --- Sidebar & Layout ---
        section_operation: "Operasyon",
        section_database: "Veritabanı",
        section_scouting: "İzleme",
        menu_dashboard: "Genel Bakış",
        menu_new_report: "Yeni Rapor",
        menu_database: "Takım Şablonları",
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
        success: "İşlem başarılı.",
        err_incomplete: "Gerekli alanları doldurunuz.",
        confirm_delete: "Silmek istediğinize emin misiniz?",
        deleted_success: "Başarıyla silindi.",

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
        cat_def: "Defans",
        cat_mid: "Orta Saha",

        cat_teknik: "Teknik",
        cat_fiziksel: "Fiziksel",
        cat_psikolojik: "Psikolojik",
        cat_sosyolojik: "Sosyolojik",
        cat_taktik: "Taktik",
        cat_mental: "Mental",
        cat_psiko_sosyal: "Psiko-Sosyal",

        // --- Database ---
        db_title: "Takım Şablonları",
        db_subtitle: "Ülke > Lig > Takım > Oyuncu",
        db_empty: "Şablon boş. Ülke ekleyerek başlayınız.",
        add_league: "Lig Ekle",
        add_team: "Takım Ekle",
        no_leagues: "Lig bulunamadı.",
        no_teams: "Takım yok.",
        players_count: "Oyuncu",
        team_detail: "Takım Detayı",
        return_db: "Şablonlara Dön",

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
        dash_db_status: "Takım Şablonları Durumu",
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
        match_plan: "Maç Planla",
        home_team: "Ev Sahibi Takım",
        away_team: "Deplasman Takımı",
        match_link: "Maç Linki",
        target_player: "Hedef Oyuncu",
        go_to_watchlist: "Aday Havuzuna Git",
        watchlist_title: "Maç Listesi",
        reported: "Raporlu",
        candidate: "Aday",
        general_tracking: "Genel İzleme",
        target: "Hedef",
        no_date: "Tarih Yok",
        go_to_player: "Oyuncuya Git",
        match_date: "Tarih",
        match_home: "Ev Sahibi",
        match_away: "Deplasman",
        match_comp: "Turnuva / Lig",
        match_watch: "İzlenecek Oyuncular",
        match_status: "Durum",
        status_upcoming: "Yaklaşan",
        status_watched: "İzlendi",
        no_matches: "Kayıtlı maç bulunamadı.",

        // --- Report Modal/Page ---
        identity: "Kimlik",
        birth_date: "Doğum Tarihi",
        height: "Boy (cm)",
        foot: "Kullandığı Ayak",
        foot_right: "Sağ",
        foot_left: "Sol",
        foot_both: "Her İkisi",
        potential: "Potansiyel Durumu",
        potential_low: "Düşük (Standart)",
        potential_high: "Yüksek (Gelişime Açık)",
        links: "Bağlantılar",
        media: "Medya (Fotoğraf)",
        skill_analysis: "Yetenek Analizi",
        overall_grade: "Genel Puan:",
        select_position_prompt: "Lütfen sol taraftan bir mevki seçiniz...",
        add_to_pool: "Oyuncuyu Havuza Ekle",
        analysis: "Analiz",
        new_report: "Yeni Rapor Ekle",
        standard: "Standart",
        open_to_dev: "Gelişime Açık",
        read_understood: "Okudum, Anladım"
    },
    en: {
        // --- Sidebar & Layout ---
        section_operation: "Operation",
        section_database: "Database",
        section_scouting: "Scouting",
        menu_dashboard: "Dashboard",
        menu_new_report: "New Report",
        menu_database: "Team Templates",
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
        cat_def: "Defender",
        cat_mid: "Midfielder",

        // --- Database ---
        db_title: "Team Templates",
        db_subtitle: "Country > League > Team > Player",
        db_empty: "Templates are empty. Start by adding a country.",
        add_league: "Add League",
        add_team: "Add Team",
        no_leagues: "No leagues found.",
        no_teams: "No teams.",
        players_count: "Players",
        team_detail: "Team Details",
        return_db: "Return to Templates",

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
        dash_schedule_desc: "Planned scouting assignments",
        dash_db_status: "Team Templates Status",
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
        match_calendar: "Match Scouting Calendar",
        add_match: "Add New Match",
        match_plan: "Plan Match",
        home_team: "Home Team",
        away_team: "Away Team",
        match_link: "Match Link",
        target_player: "Target Player",
        go_to_watchlist: "Go to Watchlist",
        watchlist_title: "Match List",
        reported: "Reported",
        candidate: "Candidate",
        general_tracking: "General Tracking",
        target: "Target",
        no_date: "No Date",
        go_to_player: "Go to Player",
        match_date: "Date",
        match_home: "Home",
        match_away: "Away",
        match_comp: "Tournament / League",
        match_watch: "Players to Watch",
        match_status: "Status",
        status_upcoming: "Upcoming",
        status_watched: "Watched",
        no_matches: "No scheduled matches found.",

        // --- Report Modal/Page ---
        identity: "Identity",
        birth_date: "Birth Date",
        height: "Height (cm)",
        foot: "Preferred Foot",
        foot_right: "Right",
        foot_left: "Left",
        foot_both: "Both",
        potential: "Potential Status",
        potential_low: "Low (Standard)",
        potential_high: "High (High Ceiling)",
        links: "Links",
        media: "Media (Photo)",
        skill_analysis: "Skill Analysis",
        overall_grade: "Overall Grade:",
        select_position_prompt: "Please select a position from the left...",
        add_to_pool: "Add Player to Pool",
        analysis: "Analysis",
        new_report: "Add New Report",
        standard: "Standard",
        open_to_dev: "High Ceiling",
        success: "Success.",
        err_incomplete: "Please fill the required fields.",
        confirm_delete: "Are you sure you want to delete?",
        deleted_success: "Deleted successfully.",
        read_understood: "I've Read & Understood"
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

// Ülke adı getirme yardımcısı
ScoutApp.prototype.getCountryName = function(country) {
    if (!country) return '';
    if (this.currentLang === 'en' && country.nameEn) {
        return country.nameEn;
    }
    return country.name;
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
