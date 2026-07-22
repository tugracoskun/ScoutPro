// academy-submodules.js - Alt modül seçim menüsü

ScoutApp.prototype.renderAcademySubmodules = function(container, params) {
    if (!container) container = document.getElementById('content-area');
    
    const lang = window.getLang();
    const isEn = lang === 'en';
    const stepId = (params && params.stepId) ? params.stepId : 1;

    // Şimdilik sadece Adım 1 (Roller ve Pozisyonlar) alt modüllerini gösteriyoruz
    const submodules = [
        {
            id: 'gk',
            title: isEn ? "Goalkeeper (GK) Roles" : "Kaleci (GK) Rolleri",
            desc: isEn ? "Understand the tactical evolution of goalkeepers and the sweeper keeper role." : "Kalecilerin taktiksel evrimini ve süpürücü kaleci rolünü kavrayın.",
            icon: "shield",
            status: "active",
            color: "text-scout-400",
            bg: "bg-scout-400/20",
            border: "border-scout-400/30"
        },
        {
            id: 'cb',
            title: isEn ? "Center Back (CB) Roles" : "Stoper (CB) Rolleri",
            desc: isEn ? "Explore ball-playing defenders, standard center backs, and the libero role." : "Pasör stoperleri, standart savunmacıları ve libero rolünü keşfedin.",
            icon: "users",
            status: "active",
            color: "text-scout-400",
            bg: "bg-scout-400/20",
            border: "border-scout-400/30"
        },
        {
            id: 'fb',
            title: isEn ? "Full Back (LB/RB) Roles" : "Bek (LB/RB) Rolleri",
            desc: isEn ? "Learn about inverted fullbacks, wing-backs, and defensive fullbacks." : "Ters ayaklı bekleri, kanat bekleri ve savunmacı bekleri öğrenin.",
            icon: "move",
            status: "active",
            color: "text-scout-400",
            bg: "bg-scout-400/20",
            border: "border-scout-400/30"
        },
        {
            id: 'dm',
            title: isEn ? "Defensive Midfield (DM) Roles" : "Defansif Orta Saha (DM) Rolleri",
            desc: isEn ? "Learn about the Regista, Segundo Volante, Anchor, and Ball-Winning Midfielder." : "Regista, Segundo Volante, Çapa ve Savaşçı Orta Saha rollerini öğrenin.",
            icon: "shield",
            status: "active",
            color: "text-scout-400",
            bg: "bg-scout-400/20",
            border: "border-scout-400/30"
        },
        {
            id: 'cm',
            title: isEn ? "Central Midfield (CM) Roles" : "Merkez Orta Saha (CM) Rolleri",
            desc: isEn ? "Explore the Mezzala, Central Winger, Carrilero, and Box-to-Box Midfielder." : "Mezzala, Merkez Kanat, Carrilero ve İki Yönlü Orta Saha rollerini keşfedin.",
            icon: "activity",
            status: "active",
            color: "text-scout-400",
            bg: "bg-scout-400/20",
            border: "border-scout-400/30"
        },
        {
            id: 'am',
            title: isEn ? "Attacking Midfield (AM) Roles" : "Ofansif Orta Saha (AM) Rolleri",
            desc: isEn ? "Discover the Shadow Striker, Trequartista, Enganche, and Advanced Playmaker." : "Gölge Forvet, Trequartista, Enganche ve Ofansif Oyun Kurucu rollerini keşfedin.",
            icon: "crosshair",
            status: "active",
            color: "text-scout-400",
            bg: "bg-scout-400/20",
            border: "border-scout-400/30"
        },
        {
            id: 'wg',
            title: isEn ? "Winger (W/IF) Roles" : "Kanat (W/IF) Rolleri",
            desc: isEn ? "Learn about Inverted Wingers, Inside Forwards, Raumdeuters, and Classic Wingers." : "Ters Kanat, İç Forvet, Raumdeuter ve Klasik Kanat rollerini öğrenin.",
            icon: "wind",
            status: "active",
            color: "text-scout-400",
            bg: "bg-scout-400/20",
            border: "border-scout-400/30"
        },
        {
            id: 'cf',
            title: isEn ? "Center Forward (CF) Roles" : "Santrfor (CF) Rolleri",
            desc: isEn ? "Learn about Advanced Forward, Target Man, Poacher, and False 9." : "Yaratıcı Forvet, Hedef Adam, Fırsatçı Golcü ve Sahte 9 rollerini öğrenin.",
            icon: "target",
            status: "active",
            color: "text-scout-400",
            bg: "bg-scout-400/20",
            border: "border-scout-400/30"
        }
    ];

    const pitchNodes = [
        { label: 'CF', id: 'cf', x: 50, y: 15 },
        
        { label: 'LW', id: 'wg', x: 20, y: 25 },
        { label: 'AM', id: 'am', x: 50, y: 30 },
        { label: 'RW', id: 'wg', x: 80, y: 25 },

        { label: 'LM', id: 'wg', x: 15, y: 45 },
        { label: 'CM', id: 'cm', x: 35, y: 45 },
        { label: 'CM', id: 'cm', x: 65, y: 45 },
        { label: 'RM', id: 'wg', x: 85, y: 45 },
        
        { label: 'LWB', id: 'fb', x: 15, y: 65 },
        { label: 'DM', id: 'dm', x: 50, y: 60 },
        { label: 'RWB', id: 'fb', x: 85, y: 65 },
        
        { label: 'LB', id: 'fb', x: 20, y: 80 },
        { label: 'CB', id: 'cb', x: 35, y: 80 },
        { label: 'CB', id: 'cb', x: 65, y: 80 },
        { label: 'RB', id: 'fb', x: 80, y: 80 },
        
        { label: 'GK', id: 'gk', x: 50, y: 92 }
    ];

    container.innerHTML = `
        <div class="h-full w-full flex bg-dark-950 fade-in overflow-hidden relative">
            <!-- Left Side: Pitch -->
            <div id="pitch-wrapper" class="w-full h-full flex-shrink-0 transition-all duration-500 ease-in-out flex flex-col relative z-10">
                <!-- Header -->
                <div class="w-full px-4 md:px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 z-20">
                    <div>
                        <h1 class="text-2xl md:text-3xl font-black text-white mb-2 drop-shadow-lg">${isEn ? "Roles and Positions" : "Roller ve Pozisyonlar"}</h1>
                        <p class="text-slate-400 font-medium text-sm">${isEn ? "Select a position on the pitch to start your training." : "Eğitime başlamak için sahadan bir mevkii seçin."}</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <button onclick="if(confirm(window.getLang() === 'en' ? 'Are you sure you want to reset your progress?' : 'İlerlemenizi sıfırlamak istediğinize emin misiniz?')) { localStorage.removeItem('scoutpro_completed_lessons'); app.state.completedLessons = []; app.navigate('academy-submodules'); }" class="group flex items-center gap-2 px-4 py-2 bg-dark-800 hover:bg-red-900/40 border border-dark-700 hover:border-red-700/50 rounded-xl transition-all shadow-lg">
                            <i data-lucide="rotate-ccw" class="w-4 h-4 text-slate-400 group-hover:text-red-400 transition-colors"></i>
                            <span class="text-slate-400 group-hover:text-red-400 font-medium text-sm">${isEn ? "Reset" : "Sıfırla"}</span>
                        </button>
                        <button onclick="app.navigate('academy')" class="group flex items-center gap-2 px-4 py-2 bg-[#58cc02]/10 hover:bg-[#58cc02]/20 border border-[#58cc02]/30 rounded-xl transition-all shadow-lg">
                            <i data-lucide="arrow-left" class="w-4 h-4 text-[#58cc02] transition-colors"></i>
                            <span class="text-[#58cc02] font-bold text-sm">${isEn ? "Back" : "Geri"}</span>
                        </button>
                    </div>
                </div>

                <!-- Pitch Container -->
                <div class="flex-1 flex items-center justify-center p-4 pb-8 overflow-hidden">
                    <div class="relative mx-auto aspect-[2/3] h-[65vh] max-h-[800px] min-h-[400px] bg-gradient-to-b from-[#1a4a22] to-[#123518] rounded-md border-4 border-white/40 shadow-2xl shadow-[#58cc02]/10 transition-transform duration-500 ease-in-out" id="pitch-container">
                        
                        <!-- Field Lines (CSS) -->
                        <div class="absolute inset-0 border-[8px] md:border-[10px] border-[#1a4a22] rounded-sm pointer-events-none"></div>
                        <!-- Center Line -->
                        <div class="absolute top-1/2 left-0 right-0 border-t-2 border-white/40 -translate-y-px pointer-events-none"></div>
                        <!-- Center Circle -->
                        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 border-2 border-white/40 rounded-full pointer-events-none"></div>
                        <!-- Center Dot -->
                        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/70 rounded-full pointer-events-none"></div>
                        
                        <!-- Top Penalty Area -->
                        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[16%] border-2 border-t-0 border-white/40 pointer-events-none"></div>
                        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-[6%] border-2 border-t-0 border-white/40 pointer-events-none"></div>
                        <div class="absolute top-[16%] left-1/2 -translate-x-1/2 w-16 h-8 md:w-20 md:h-10 border-b-2 border-x-2 border-white/40 rounded-b-full pointer-events-none"></div>

                        <!-- Bottom Penalty Area -->
                        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[16%] border-2 border-b-0 border-white/40 pointer-events-none"></div>
                        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/4 h-[6%] border-2 border-b-0 border-white/40 pointer-events-none"></div>
                        <div class="absolute bottom-[16%] left-1/2 -translate-x-1/2 w-16 h-8 md:w-20 md:h-10 border-t-2 border-x-2 border-white/40 rounded-t-full pointer-events-none"></div>

                        <!-- Nodes -->
                        ${pitchNodes.map(node => {
                            const modData = submodules.find(m => m.id === node.id);
                            if (!modData) return '';
                            
                            const isCompleted = app.state.completedLessons && app.state.completedLessons.includes(node.id);
                            
                            let nodeClasses = "pitch-node absolute transform -translate-x-1/2 -translate-y-1/2 w-11 h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-xs md:text-sm shadow-xl cursor-pointer transition-all duration-300 hover:scale-110 z-10 hover:z-50 group ";
                            
                            if (isCompleted) {
                                nodeClasses += "bg-[#58cc02] text-dark-950 border-2 border-[#46a302] hover:shadow-[0_0_15px_rgba(88,204,2,0.6)]";
                            } else {
                                nodeClasses += "bg-dark-900/90 backdrop-blur text-[#58cc02] border-2 border-[#58cc02] hover:bg-dark-800 hover:shadow-[0_0_15px_rgba(88,204,2,0.4)]";
                            }

                            // Tooltip Positioning Logic
                            let tooltipClasses = "absolute mb-3 w-48 p-3 rounded-xl bg-dark-900 border border-dark-800 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 hidden md:block";
                            let arrowClasses = "absolute -bottom-1.5 w-3 h-3 bg-dark-900 border-b border-r border-dark-800 rotate-45";
                            
                            // For CF (very top), push tooltip BELOW the node
                            if (node.y < 20) {
                                tooltipClasses += " top-full mt-3 left-1/2 -translate-x-1/2";
                                tooltipClasses = tooltipClasses.replace("mb-3", "");
                                arrowClasses = "absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-dark-900 border-t border-l border-dark-800 rotate-45";
                            } else {
                                tooltipClasses += " bottom-full";
                                if (node.x > 70) {
                                    tooltipClasses += " right-0 translate-x-4"; // Push right slightly
                                    arrowClasses += " right-8"; 
                                } else if (node.x < 30) {
                                    tooltipClasses += " left-0 -translate-x-4"; // Push left slightly
                                    arrowClasses += " left-8";
                                } else {
                                    tooltipClasses += " left-1/2 -translate-x-1/2";
                                    arrowClasses += " left-1/2 -translate-x-1/2";
                                }
                            }

                            return `
                                <div class="${nodeClasses}" data-id="${node.id}" style="left: ${node.x}%; top: ${node.y}%;" onclick="window.openAcademyLesson('${node.id}')">
                                    ${node.label}
                                    ${isCompleted ? `
                                        <div class="absolute -top-1 -right-1 md:-top-1.5 md:-right-1.5 bg-white rounded-full p-0.5 shadow-md z-20">
                                            <i data-lucide="check-circle" class="w-3 h-3 md:w-4 md:h-4 text-[#58cc02]"></i>
                                        </div>
                                    ` : ''}
                                    
                                    <!-- Tooltip -->
                                    <div class="${tooltipClasses}">
                                        <div class="text-xs font-bold text-white mb-1">${modData.title}</div>
                                        <div class="text-[10px] text-slate-400 font-normal leading-relaxed">${modData.desc}</div>
                                        <div class="${arrowClasses}"></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>

            <!-- Right Side: Panel -->
            <div id="panel-wrapper" class="w-0 flex-shrink-0 opacity-0 transition-all duration-500 ease-in-out bg-dark-900 border-l border-[#58cc02]/20 overflow-hidden relative shadow-[-20px_0_40px_rgba(0,0,0,0.6)] z-20 absolute lg:relative top-0 right-0 h-full">
                <div class="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-[#58cc02]/50 to-transparent"></div>
                <div id="lesson-panel" class="w-full h-full absolute inset-0 overflow-y-auto"></div>
            </div>
        </div>
    `;

    // Global Functions for the UI interactivity
    window.openAcademyLesson = function(lessonId) {
        const pitchWrapper = document.getElementById('pitch-wrapper');
        const panelWrapper = document.getElementById('panel-wrapper');
        const pitchContainer = document.getElementById('pitch-container');
        
        if (!pitchWrapper || !panelWrapper) return;

        // Animate Split
        pitchWrapper.classList.remove('w-full');
        pitchWrapper.classList.add('w-0', 'lg:w-5/12', 'opacity-0', 'lg:opacity-100'); 
        
        panelWrapper.classList.remove('w-0', 'opacity-0');
        panelWrapper.classList.add('w-full', 'lg:w-7/12', 'opacity-100');
        
        if (pitchContainer) {
            pitchContainer.classList.add('scale-[0.85]');
        }

        // Highlight active node(s)
        document.querySelectorAll('.pitch-node').forEach(node => {
            if (node.getAttribute('data-id') === lessonId) {
                node.classList.add('ring-4', 'ring-[#58cc02]/70', 'ring-offset-4', 'ring-offset-dark-950', '!scale-125', '!z-50', 'shadow-[0_0_20px_rgba(88,204,2,0.8)]');
                node.classList.remove('opacity-40');
            } else {
                node.classList.remove('ring-4', 'ring-[#58cc02]/70', 'ring-offset-4', 'ring-offset-dark-950', '!scale-125', '!z-50', 'shadow-[0_0_20px_rgba(88,204,2,0.8)]');
                node.classList.add('opacity-40');
            }
        });

        setTimeout(() => {
            app.renderLesson(document.getElementById('lesson-panel'), {lessonId});
            lucide.createIcons();
        }, 50);
    };

    window.closeAcademyLesson = function(refreshNodes = false) {
        const pitchWrapper = document.getElementById('pitch-wrapper');
        const panelWrapper = document.getElementById('panel-wrapper');
        const pitchContainer = document.getElementById('pitch-container');
        
        if (!pitchWrapper || !panelWrapper) return;

        pitchWrapper.classList.add('w-full');
        pitchWrapper.classList.remove('w-0', 'lg:w-5/12', 'opacity-0', 'lg:opacity-100');
        
        // Reset node highlights
        document.querySelectorAll('.pitch-node').forEach(node => {
            node.classList.remove('ring-4', 'ring-[#58cc02]/70', 'ring-offset-4', 'ring-offset-dark-950', '!scale-125', '!z-50', 'opacity-40', 'shadow-[0_0_20px_rgba(88,204,2,0.8)]');
        });
        
        panelWrapper.classList.add('w-0', 'opacity-0');
        panelWrapper.classList.remove('w-full', 'lg:w-7/12', 'opacity-100');
        
        if (pitchContainer) {
            pitchContainer.classList.remove('scale-[0.85]');
        }
        
        if (refreshNodes) {
            setTimeout(() => {
                app.navigate('academy-submodules');
            }, 500);
        } else {
            // Give time for animation to finish before clearing the HTML
            setTimeout(() => {
                document.getElementById('lesson-panel').innerHTML = '';
            }, 500);
        }
    };

    lucide.createIcons();
};
