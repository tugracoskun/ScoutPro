// --- HIZLI ASİSTAN ARAYÜZ YÖNETİMİ (KATEGORİZE & DÜZENLİ REHBER) ---

class AI_UI {
    constructor(aiInstance) {
        this.ai = aiInstance;
        this.currentView = 'categories'; // 'categories' | 'category_topics' | 'article' | 'search'
        this.activeCategory = null;
        this.activeArticleKey = null;
        this.searchQuery = '';
        this.isDragging = false;
        this.renderFloatingButton();
        this.initDraggable();
    }

    renderFloatingButton() {
        let fabBtn = document.getElementById('ai-fab-btn');
        let win = document.getElementById('ai-window');
        const isEnabled = !(window.app && window.app.state && window.app.state.data && window.app.state.data.settings && window.app.state.data.settings.assistantEnabled === false);
        
        // 1. FAB Butonunu Oluştur / Güncelle
        if (!fabBtn) {
            fabBtn = document.createElement('button');
            fabBtn.id = 'ai-fab-btn';
            document.body.appendChild(fabBtn);
        }

        fabBtn.className = `fixed z-[60] w-14 h-14 bg-gradient-to-tr from-emerald-600 via-scout-600 to-blue-600 rounded-2xl shadow-2xl shadow-scout-500/30 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-300 group border border-white/20 select-none cursor-grab active:cursor-grabbing assistant-fab-pulse ${isEnabled ? '' : 'hidden'}`;
        fabBtn.title = "Hızlı Asistan (Basılı tutarak taşıyabilirsiniz)";
        fabBtn.innerHTML = `
            <i data-lucide="compass" class="w-6 h-6 group-hover:rotate-180 transition-transform duration-500 ease-out pointer-events-none"></i>
            <span class="absolute -top-1 -right-1 flex h-3.5 w-3.5 pointer-events-none">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-dark-900 shadow-sm"></span>
            </span>
        `;

        // Butonun Başlangıç Konumu
        const coords = (window.app && window.app.state && window.app.state.data && window.app.state.data.settings && window.app.state.data.settings.assistantCoords) || null;
        if (coords && typeof coords.x === 'number' && typeof coords.y === 'number') {
            const safeX = Math.max(12, Math.min(window.innerWidth - 68, coords.x));
            const safeY = Math.max(12, Math.min(window.innerHeight - 68, coords.y));
            fabBtn.style.left = safeX + 'px';
            fabBtn.style.top = safeY + 'px';
            fabBtn.style.right = 'auto';
            fabBtn.style.bottom = 'auto';
        } else {
            fabBtn.style.right = '24px';
            fabBtn.style.bottom = '24px';
            fabBtn.style.left = 'auto';
            fabBtn.style.top = 'auto';
        }

        // 2. Asistan Penceresini Bağımsız Fixed Olarak Oluştur
        if (!win) {
            win = document.createElement('div');
            win.id = 'ai-window';
            document.body.appendChild(win);
        }

        win.className = `fixed z-[59] hidden w-[400px] sm:w-[440px] max-w-[calc(100vw-24px)] bg-dark-900/95 backdrop-blur-2xl border border-dark-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden`;
        win.style.height = '600px';
        win.style.maxHeight = 'calc(100vh - 80px)';

        win.innerHTML = `
            <!-- 1. Header -->
            <div class="bg-gradient-to-r from-emerald-600 via-scout-600 to-blue-600 p-4 px-5 flex justify-between items-center shadow-lg relative shrink-0">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center text-white shadow-inner group cursor-pointer hover:rotate-12 transition-transform">
                        <i data-lucide="compass" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h3 class="text-white font-bold text-sm tracking-wide flex items-center gap-2">
                            Hızlı Asistan
                            <span class="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-mono text-white/90 shadow-sm">v2.0</span>
                        </h3>
                        <p class="text-[11px] text-white/80">Scouting Bilgi Bankası & Rehber</p>
                    </div>
                </div>
                
                <div class="flex items-center gap-1.5">
                    <button onclick="scoutAI.resetPosition()" class="text-white/80 hover:text-white transition-all bg-white/10 hover:bg-white/20 hover:rotate-180 p-1.5 rounded-lg active:scale-90 duration-300" title="Konumu Sıfırla (Sağ Alt)">
                        <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
                    </button>
                    <button onclick="scoutAI.toggleChat()" class="text-white/80 hover:text-white transition-all bg-white/10 hover:bg-white/20 hover:scale-110 p-1.5 rounded-lg active:scale-90 duration-200" title="Kapat">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>

            <!-- 2. Arama Barı -->
            <div class="p-3.5 bg-dark-950/80 border-b border-dark-800 shrink-0">
                <div class="relative">
                    <i data-lucide="search" class="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors"></i>
                    <input type="text" id="ai-search-input" oninput="scoutAI.onSearch(this.value)" placeholder="Konularda hızlı arama yap..." class="w-full bg-dark-900 border border-dark-750 focus:border-scout-500 focus:ring-2 focus:ring-scout-500/20 rounded-xl pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all duration-200">
                    <button id="ai-search-clear" onclick="scoutAI.clearSearch()" class="hidden absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-1 hover:scale-110 transition-all">
                        <i data-lucide="x" class="w-3.5 h-3.5"></i>
                    </button>
                </div>
            </div>

            <!-- 3. Dinamik İçerik Alanı -->
            <div id="ai-main-content" class="flex-1 overflow-y-auto p-4 custom-scrollbar bg-dark-950/40">
                ${this.renderViewContent()}
            </div>
        `;

        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    positionWindowNearButton() {
        const fabBtn = document.getElementById('ai-fab-btn');
        const win = document.getElementById('ai-window');
        if (!fabBtn || !win) return;

        const btnRect = fabBtn.getBoundingClientRect();
        const winWidth = Math.min(440, window.innerWidth - 24);
        const winHeight = Math.min(600, window.innerHeight - 80);

        const btnCenterX = btnRect.left + btnRect.width / 2;
        const btnCenterY = btnRect.top + btnRect.height / 2;

        const isRightHalf = btnCenterX > (window.innerWidth / 2);
        const isBottomHalf = btnCenterY > (window.innerHeight / 2);

        // X Pozisyonu Hesaplama
        let posX = 0;
        if (isRightHalf) {
            // Butonun soluna / butonla sağ kenarı hizalayarak
            posX = btnRect.right - winWidth;
        } else {
            // Butonun sağına / butonla sol kenarı hizalayarak
            posX = btnRect.left;
        }
        // Ekran dışına taşmaması için clamp
        posX = Math.max(12, Math.min(window.innerWidth - winWidth - 12, posX));

        // Y Pozisyonu Hesaplama
        let posY = 0;
        if (isBottomHalf) {
            // Butonun hemen üstünde aç
            posY = btnRect.top - winHeight - 12;
            if (posY < 12) {
                // Üste sığmıyorsa ekranın tepesine daya
                posY = 12;
            }
        } else {
            // Butonun hemen altında aç
            posY = btnRect.bottom + 12;
            if (posY + winHeight > window.innerHeight - 12) {
                posY = window.innerHeight - winHeight - 12;
            }
        }

        win.style.left = `${Math.round(posX)}px`;
        win.style.top = `${Math.round(posY)}px`;
        win.style.right = 'auto';
        win.style.bottom = 'auto';

        // Origin efekti
        const originY = isBottomHalf ? 'bottom' : 'top';
        const originX = isRightHalf ? 'right' : 'left';
        win.style.transformOrigin = `${originY} ${originX}`;
    }

    initDraggable() {
        let isMouseDown = false;
        let hasMoved = false;
        let startX = 0;
        let startY = 0;
        let initialFabLeft = 0;
        let initialFabTop = 0;
        let rAF = null;
        let latestClientX = 0;
        let latestClientY = 0;

        const updatePosition = () => {
            const fabBtn = document.getElementById('ai-fab-btn');
            if (!fabBtn || !isMouseDown) return;

            const dx = latestClientX - startX;
            const dy = latestClientY - startY;

            if (Math.hypot(dx, dy) > 3) {
                if (!hasMoved) {
                    hasMoved = true;
                    this.isDragging = true;
                    fabBtn.classList.add('assistant-dragging', 'scale-115', 'shadow-emerald-500/50', 'ring-4', 'ring-emerald-400/40');
                    const win = document.getElementById('ai-window');
                    if (win) win.classList.add('assistant-dragging');
                }

                let newX = initialFabLeft + dx;
                let newY = initialFabTop + dy;

                const minX = 8;
                const maxX = window.innerWidth - 66;
                const minY = 8;
                const maxY = window.innerHeight - 66;

                newX = Math.max(minX, Math.min(maxX, newX));
                newY = Math.max(minY, Math.min(maxY, newY));

                fabBtn.style.left = `${newX}px`;
                fabBtn.style.top = `${newY}px`;
                fabBtn.style.right = 'auto';
                fabBtn.style.bottom = 'auto';

                const win = document.getElementById('ai-window');
                if (win && !win.classList.contains('hidden')) {
                    this.positionWindowNearButton();
                }
            }
            rAF = null;
        };

        const onStart = (clientX, clientY) => {
            const fabBtn = document.getElementById('ai-fab-btn');
            if (!fabBtn) return;

            const rect = fabBtn.getBoundingClientRect();
            isMouseDown = true;
            hasMoved = false;
            startX = clientX;
            startY = clientY;
            latestClientX = clientX;
            latestClientY = clientY;
            initialFabLeft = rect.left;
            initialFabTop = rect.top;
        };

        const onMove = (clientX, clientY) => {
            if (!isMouseDown) return;
            latestClientX = clientX;
            latestClientY = clientY;

            if (!rAF) {
                rAF = requestAnimationFrame(updatePosition);
            }
        };

        const onEnd = () => {
            if (!isMouseDown) return;
            isMouseDown = false;
            if (rAF) {
                cancelAnimationFrame(rAF);
                rAF = null;
            }

            const fabBtn = document.getElementById('ai-fab-btn');
            const win = document.getElementById('ai-window');
            if (fabBtn) {
                fabBtn.classList.remove('assistant-dragging', 'scale-115', 'shadow-emerald-500/50', 'ring-4', 'ring-emerald-400/40');
            }
            if (win) {
                win.classList.remove('assistant-dragging');
            }

            if (hasMoved) {
                if (fabBtn) {
                    const rect = fabBtn.getBoundingClientRect();
                    if (!window.app.state.data.settings) window.app.state.data.settings = {};
                    window.app.state.data.settings.assistantCoords = {
                        x: Math.round(rect.left),
                        y: Math.round(rect.top)
                    };
                    window.app.saveData();
                }

                setTimeout(() => {
                    this.isDragging = false;
                }, 60);
            } else {
                this.isDragging = false;
            }
        };

        // Mouse Eventleri
        document.addEventListener('mousedown', (e) => {
            const btn = e.target.closest('#ai-fab-btn');
            if (btn && e.button === 0) {
                onStart(e.clientX, e.clientY);
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isMouseDown) {
                onMove(e.clientX, e.clientY);
            }
        }, { passive: true });

        document.addEventListener('mouseup', () => {
            if (isMouseDown) onEnd();
        });

        // Touch Eventleri (Tablet & Mobil)
        document.addEventListener('touchstart', (e) => {
            const btn = e.target.closest('#ai-fab-btn');
            if (btn && e.touches.length > 0) {
                onStart(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (isMouseDown && e.touches.length > 0) {
                onMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        document.addEventListener('touchend', () => {
            if (isMouseDown) onEnd();
        });

        // FAB Butonuna Tıklama (Click) Dinleyicisi
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('#ai-fab-btn');
            if (btn) {
                if (this.isDragging || hasMoved) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
                this.ai.toggleChat();
            }
        });
    }

    renderViewContent() {
        if (this.searchQuery && this.searchQuery.trim().length > 0) {
            return this.renderSearchResultsHTML();
        }

        switch (this.currentView) {
            case 'article':
                return this.renderArticleHTML();
            case 'category_topics':
                return this.renderCategoryTopicsHTML();
            case 'categories':
            default:
                return this.renderCategoriesHubHTML();
        }
    }

    // 1. ANA EKRAN: Kategori Hub Kartları
    renderCategoriesHubHTML() {
        return `
            <div class="space-y-4 assistant-slide-view">
                
                <!-- Karşılama Başlığı -->
                <div class="flex items-center justify-between px-1">
                    <div>
                        <h4 class="text-xs font-bold text-white uppercase tracking-wider">Kategoriler</h4>
                        <p class="text-[11px] text-slate-400 mt-0.5">Bilgi almak istediğiniz alanı seçin</p>
                    </div>
                    <span class="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg shadow-sm">
                        ${Object.keys(AI_TUTORIALS).length} Konu
                    </span>
                </div>

                <!-- Kategori Kartları Grid -->
                <div class="grid grid-cols-1 gap-2.5">
                    ${ASSISTANT_CATEGORIES.map((cat, idx) => {
                        const topicCount = Object.values(AI_TUTORIALS).filter(t => t.category === cat.id).length;
                        return `
                            <div onclick="scoutAI.openCategory('${cat.id}')" 
                                 class="assistant-stagger-${Math.min(5, idx + 1)} assistant-card-interactive bg-dark-900/90 hover:bg-dark-850 border border-dark-800 hover:border-scout-500/40 rounded-2xl p-3.5 cursor-pointer flex items-start gap-3.5 shadow-sm group">
                                
                                <!-- Kategori İkonu -->
                                <div class="w-10 h-10 rounded-xl ${cat.iconBg} border border-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                                    <i data-lucide="${cat.icon}" class="w-5 h-5"></i>
                                </div>

                                <!-- Başlık & Açıklama -->
                                <div class="min-w-0 flex-1">
                                    <div class="flex items-center justify-between gap-2">
                                        <h5 class="text-xs font-bold text-white group-hover:text-scout-400 transition-colors">${cat.name}</h5>
                                        <span class="text-[10px] font-mono text-slate-400 bg-dark-950 px-2 py-0.5 rounded-md border border-dark-800 shrink-0 group-hover:border-scout-500/30 transition-colors">${topicCount} Başlık</span>
                                    </div>
                                    <p class="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">${cat.desc}</p>
                                </div>

                                <div class="self-center text-slate-600 group-hover:text-scout-400 transition-colors shrink-0">
                                    <i data-lucide="chevron-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"></i>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <!-- Hızlı İpucu Kartı -->
                <div class="assistant-stagger-5 bg-gradient-to-r from-scout-900/30 via-dark-900 to-dark-900 p-3.5 rounded-2xl border border-scout-500/20 text-xs text-slate-300 flex items-start gap-3 mt-2 hover:border-scout-500/40 transition-colors">
                    <i data-lucide="lightbulb" class="w-4 h-4 text-scout-400 shrink-0 mt-0.5 animate-pulse"></i>
                    <div class="leading-relaxed text-[11px] text-slate-400">
                        <b class="text-white">İpucu:</b> Merak ettiğiniz bir terimi doğrudan üstteki arama kutusuna yazarak hızlıca bulabilirsiniz.
                    </div>
                </div>

            </div>
        `;
    }

    // 2. KATEGORİ İÇİ: O Kategoriye Ait Başlıklar
    renderCategoryTopicsHTML() {
        const cat = ASSISTANT_CATEGORIES.find(c => c.id === this.activeCategory);
        if (!cat) return this.renderCategoriesHubHTML();

        const topics = Object.entries(AI_TUTORIALS).filter(([k, t]) => t.category === cat.id);

        return `
            <div class="space-y-3.5 assistant-slide-view">
                
                <!-- Geri Dön Butonu & Kategori Başlığı -->
                <div class="flex items-center justify-between pb-2 border-b border-dark-800">
                    <button onclick="scoutAI.goToCategories()" class="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-all group p-1 active:scale-95">
                        <i data-lucide="arrow-left" class="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200 text-scout-400"></i>
                        <span>Tüm Kategoriler</span>
                    </button>
                    <span class="text-[10px] font-mono text-slate-400 bg-dark-900 border border-dark-800 px-2 py-0.5 rounded-md">
                        ${topics.length} Başlık
                    </span>
                </div>

                <!-- Kategori Başlık Kartı -->
                <div class="bg-dark-900/90 p-3 rounded-2xl border border-dark-800 flex items-center gap-3 shadow-sm">
                    <div class="w-8 h-8 rounded-lg ${cat.iconBg} flex items-center justify-center shrink-0">
                        <i data-lucide="${cat.icon}" class="w-4 h-4"></i>
                    </div>
                    <div class="min-w-0">
                        <h4 class="text-xs font-bold text-white">${cat.name}</h4>
                        <p class="text-[10px] text-slate-400 truncate">${cat.desc}</p>
                    </div>
                </div>

                <!-- Konu Listesi -->
                <div class="space-y-2 pt-1">
                    ${topics.map(([key, item], index) => `
                        <div onclick="scoutAI.openArticle('${key}')" 
                             class="assistant-stagger-${Math.min(5, index + 1)} assistant-card-interactive bg-dark-900/90 hover:bg-dark-850 border border-dark-800 hover:border-scout-500/40 rounded-2xl p-3 px-3.5 cursor-pointer flex items-center justify-between gap-3 shadow-sm group">
                            
                            <div class="flex items-center gap-2.5 min-w-0 flex-1">
                                <span class="w-5 h-5 rounded-md bg-dark-950 text-slate-500 border border-dark-800 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 group-hover:text-scout-400 group-hover:border-scout-500/30 transition-colors">${index + 1}</span>
                                <div class="min-w-0 flex-1">
                                    <div class="text-xs font-bold text-white group-hover:text-scout-400 transition-colors truncate">${item.title}</div>
                                    ${item.summary ? `<div class="text-[11px] text-slate-400 line-clamp-1 mt-0.5">${item.summary}</div>` : ''}
                                </div>
                            </div>

                            <div class="w-6 h-6 rounded-lg bg-dark-950 border border-dark-800 text-slate-500 group-hover:text-scout-400 group-hover:border-scout-500/30 flex items-center justify-center shrink-0 transition-colors">
                                <i data-lucide="chevron-right" class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200"></i>
                            </div>
                        </div>
                    `).join('')}
                </div>

            </div>
        `;
    }

    // 3. DETAYLI CEVAP / MAKALE GÖRÜNÜMÜ
    renderArticleHTML() {
        const article = AI_TUTORIALS[this.activeArticleKey];
        if (!article) return this.renderCategoriesHubHTML();

        const cat = ASSISTANT_CATEGORIES.find(c => c.id === article.category) || { name: 'Genel', icon: 'compass' };

        return `
            <div class="space-y-4 assistant-slide-view pb-2">
                
                <!-- Geri Dön Butonu -->
                <div class="flex items-center justify-between pb-2 border-b border-dark-800">
                    <button onclick="scoutAI.backFromArticle()" class="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-all group p-1 active:scale-95">
                        <i data-lucide="arrow-left" class="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200 text-scout-400"></i>
                        <span>${cat.name}</span>
                    </button>
                    <span class="text-[10px] font-bold text-scout-400 bg-scout-500/10 border border-scout-500/20 px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                        <i data-lucide="${cat.icon}" class="w-3 h-3"></i> ${cat.name}
                    </span>
                </div>

                <!-- Makale Başlığı -->
                <div class="bg-dark-900/90 p-4 rounded-2xl border border-dark-800 space-y-1.5 shadow-sm">
                    <h3 class="text-sm font-bold text-white leading-snug">${article.title}</h3>
                    ${article.summary ? `<p class="text-xs text-slate-400 leading-relaxed">${article.summary}</p>` : ''}
                </div>

                <!-- Detaylı İçerik Bloğu -->
                <div class="bg-dark-900/60 p-4 rounded-2xl border border-dark-800 text-xs text-slate-200 leading-relaxed space-y-3 shadow-inner">
                    ${article.content}
                </div>

                <!-- Alt Hızlı Eylemler -->
                <div class="pt-2 flex items-center justify-between gap-2 border-t border-dark-800/80">
                    <button onclick="scoutAI.goToCategories()" class="w-full py-2.5 bg-dark-900 hover:bg-dark-800 border border-dark-750 text-slate-300 hover:text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-98">
                        <i data-lucide="grid" class="w-3.5 h-3.5 text-scout-400"></i> Diğer Konulara Göz At
                    </button>
                </div>

            </div>
        `;
    }

    // 4. ARAMA SONUÇLARI GÖRÜNÜMÜ
    renderSearchResultsHTML() {
        const query = (this.searchQuery || '').toLowerCase().trim();

        const matches = Object.entries(AI_TUTORIALS).filter(([key, item]) => {
            const pool = `${item.title} ${item.summary || ''} ${item.keywords || ''}`.toLowerCase();
            return pool.includes(query);
        });

        if (matches.length === 0) {
            return `
                <div class="text-center py-12 text-slate-500 space-y-3 assistant-slide-view">
                    <div class="w-12 h-12 rounded-2xl bg-dark-900 border border-dark-800 flex items-center justify-center mx-auto text-slate-600">
                        <i data-lucide="search-x" class="w-6 h-6 animate-pulse"></i>
                    </div>
                    <div>
                        <p class="text-xs font-bold text-slate-400">"${this.searchQuery}" için sonuç bulunamadı</p>
                        <p class="text-[11px] text-slate-600 mt-1 max-w-xs mx-auto">Farklı bir kelime aramayı deneyebilir veya kategorilere göz atabilirsiniz.</p>
                    </div>
                    <button onclick="scoutAI.clearSearch()" class="py-2 px-4 bg-dark-900 border border-dark-750 hover:bg-dark-800 text-slate-300 text-xs font-bold rounded-xl transition-all active:scale-95 inline-block mt-2">
                        Aramayı Temizle
                    </button>
                </div>
            `;
        }

        return `
            <div class="space-y-3 assistant-slide-view">
                <div class="flex items-center justify-between px-1 pb-1 border-b border-dark-800">
                    <span class="text-xs font-bold text-slate-300">Arama Sonuçları (${matches.length})</span>
                    <button onclick="scoutAI.clearSearch()" class="text-[11px] text-scout-400 hover:underline">Temizle</button>
                </div>

                <div class="space-y-2">
                    ${matches.map(([key, item], idx) => {
                        const cat = ASSISTANT_CATEGORIES.find(c => c.id === item.category);
                        return `
                            <div onclick="scoutAI.openArticle('${key}')" 
                                 class="assistant-stagger-${Math.min(5, idx + 1)} assistant-card-interactive bg-dark-900/90 hover:bg-dark-850 border border-dark-800 hover:border-scout-500/40 rounded-2xl p-3 px-3.5 cursor-pointer space-y-1 shadow-sm group">
                                
                                <div class="flex items-center justify-between gap-2">
                                    <div class="text-xs font-bold text-white group-hover:text-scout-400 transition-colors truncate">${item.title}</div>
                                    ${cat ? `<span class="text-[9px] font-bold text-slate-400 uppercase bg-dark-950 px-1.5 py-0.5 rounded border border-dark-800 shrink-0 group-hover:border-scout-500/30 transition-colors">${cat.name}</span>` : ''}
                                </div>
                                ${item.summary ? `<div class="text-[11px] text-slate-400 line-clamp-1">${item.summary}</div>` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    updateUI() {
        const main = document.getElementById('ai-main-content');
        if (main) {
            main.innerHTML = this.renderViewContent();
            main.scrollTop = 0;
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    }

    toggleWindow() {
        const win = document.getElementById('ai-window');
        if (!win) return;

        if (win.classList.contains('hidden')) {
            this.positionWindowNearButton();
            win.classList.remove('hidden', 'assistant-pop-close');
            win.classList.add('assistant-pop-open');
            setTimeout(() => {
                this.positionWindowNearButton();
            }, 10);
        } else {
            win.classList.remove('assistant-pop-open');
            win.classList.add('assistant-pop-close');
            setTimeout(() => {
                win.classList.add('hidden');
                win.classList.remove('assistant-pop-close');
            }, 190);
        }
    }
}