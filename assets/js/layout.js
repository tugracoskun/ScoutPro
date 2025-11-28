// --- UYGULAMA İSKELETİ VE LAYOUT ---

ScoutApp.prototype.renderLayout = function() {
    // FIX: Body'yi silmek yerine özel kapsayıcıyı hedefliyoruz
    const root = document.getElementById('app-root');
    if (!root) return;

    root.innerHTML = `
        <!-- SIDEBAR -->
        <aside id="sidebar" class="w-72 bg-dark-900 border-r border-dark-800 flex flex-col z-30 shadow-2xl transition-all duration-300">
            <div class="h-20 flex items-center px-6 border-b border-dark-800 overflow-hidden">
                <div class="flex items-center gap-3 text-scout-500">
                    <!-- LOGO -->
                    <div class="w-10 h-10 flex items-center justify-center">
                        <img src="assets/logo.png" class="w-full h-full object-contain drop-shadow-lg" alt="Logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                        <div class="hidden min-w-[32px] h-8 items-center justify-center bg-scout-500/10 rounded-lg"><i data-lucide="radar" class="w-6 h-6"></i></div>
                    </div>
                    <div class="sidebar-text flex flex-col">
                        <span class="font-cyber text-2xl tracking-wide text-white leading-none mt-1">Scout<span class="text-scout-500">Pro</span></span>
                        <span class="text-[10px] text-slate-500 font-mono mt-1">Custom DB</span>
                    </div>
                </div>
            </div>

            <nav class="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                <div class="px-3 mb-2 mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider sidebar-text">Operasyon</div>
                <button onclick="app.navigate('dashboard')" class="nav-item" id="nav-dashboard"><div class="min-w-[24px] flex justify-center"><i data-lucide="layout-dashboard" class="w-5 h-5"></i></div><span class="sidebar-text ml-3 font-medium text-sm">Dashboard</span></button>
                <button onclick="app.navigate('new-report')" class="nav-item" id="nav-new-report"><div class="min-w-[24px] flex justify-center"><i data-lucide="file-plus" class="w-5 h-5 text-scout-400"></i></div><span class="sidebar-text ml-3 font-medium text-sm text-scout-400">Yeni Rapor</span></button>

                <div class="px-3 mb-2 mt-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider sidebar-text">Veritabanı</div>
                <button onclick="app.navigate('database')" class="nav-item" id="nav-database"><div class="min-w-[24px] flex justify-center"><i data-lucide="database" class="w-5 h-5"></i></div><span class="sidebar-text ml-3 font-medium text-sm">Takım Veritabanı</span></button>
                <button onclick="app.navigate('players')" class="nav-item" id="nav-players"><div class="min-w-[24px] flex justify-center"><i data-lucide="users" class="w-5 h-5"></i></div><span class="sidebar-text ml-3 font-medium text-sm">Oyuncu Havuzu</span></button>

                <div class="px-3 mb-2 mt-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider sidebar-text">İzleme</div>
                <button onclick="app.navigate('matches')" class="nav-item" id="nav-matches"><div class="min-w-[24px] flex justify-center relative"><i data-lucide="tv-2" class="w-5 h-5"></i></div><span class="sidebar-text ml-3 font-medium text-sm">Maç İzleme Listesi</span></button>
                <button onclick="app.navigate('watchlist')" class="nav-item" id="nav-watchlist"><div class="min-w-[24px] flex justify-center"><i data-lucide="eye" class="w-5 h-5"></i></div><span class="sidebar-text ml-3 font-medium text-sm">Aday Havuzu</span></button>
            </nav>

            <div class="p-4 border-t border-dark-800 bg-dark-900/50 backdrop-blur">
                <button onclick="app.navigate('settings')" class="nav-item" id="nav-settings"><div class="min-w-[24px] flex justify-center"><i data-lucide="settings-2" class="w-5 h-5"></i></div><span class="sidebar-text ml-3 font-medium text-sm">Ayarlar</span></button>
                <button onclick="app.toggleSidebar()" class="w-full mt-2 flex items-center justify-center p-2 rounded-lg hover:bg-dark-800 text-slate-600 hover:text-slate-300 transition-colors group"><i data-lucide="chevrons-left" class="w-4 h-4 transition-transform duration-300" id="sidebar-toggle-icon"></i></button>
            </div>
        </aside>

        <!-- MAIN AREA -->
        <main class="flex-1 flex flex-col min-w-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-scout-900/10 via-dark-950 to-dark-950 relative">
            <header class="h-20 border-b border-dark-800/50 bg-dark-950/80 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-20">
                <div class="flex flex-col">
                    <h1 id="page-title" class="text-xl font-bold text-white">Dashboard</h1>
                    <span id="page-subtitle" class="text-xs text-slate-500">Genel Bakış</span>
                </div>
                <div class="relative w-64 md:w-80 group">
                    <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-scout-500 transition-colors w-4 h-4"></i>
                    <input id="global-search" type="text" onkeyup="app.handleSearch(this.value)" placeholder="Oyuncu veya Takım Ara..." class="w-full bg-dark-900/50 border border-dark-800 text-slate-200 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-scout-500/50 focus:ring-1 focus:ring-scout-500/50 transition-all placeholder:text-slate-600">
                </div>
            </header>

            <div id="content-area" class="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
                <!-- DYNAMIC CONTENT -->
            </div>
        </main>

        <!-- MODAL SYSTEM & NOTIFICATIONS -->
        <div id="modal-overlay" class="fixed inset-0 z-50 hidden bg-dark-950/80 backdrop-blur-md flex items-center justify-center px-4 fade-in"><div id="modal-content" class="bg-dark-900 border border-dark-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative"></div></div>
        <div id="notification-container" class="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"></div>
    `;
};