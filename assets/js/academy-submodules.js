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
        }
    ];

    container.innerHTML = `
        <div class="h-full w-full flex flex-col bg-dark-950 fade-in overflow-y-auto custom-scrollbar">
            <!-- Header -->
            <div class="w-full max-w-4xl mx-auto px-4 py-8 flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-black text-white mb-2">${isEn ? "Roles and Positions" : "Roller ve Pozisyonlar"}</h1>
                    <p class="text-slate-400">${isEn ? "Select a module to continue your training." : "Eğitiminize devam etmek için bir modül seçin."}</p>
                </div>
                <button onclick="app.navigate('academy')" class="group flex items-center gap-2 px-4 py-2 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-xl transition-all">
                    <i data-lucide="arrow-left" class="w-5 h-5 text-slate-400 group-hover:text-white transition-colors"></i>
                    <span class="text-slate-300 group-hover:text-white font-medium">${isEn ? "Back to Roadmap" : "Haritaya Dön"}</span>
                </button>
            </div>

            <!-- Modules Grid -->
            <div class="w-full max-w-4xl mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                ${submodules.map((mod, index) => {
                    const isLocked = mod.status === 'locked';
                    const isCompleted = app.state.completedLessons && app.state.completedLessons.includes(mod.id);
                    
                    const lockOverlay = isLocked ? `
                        <div class="absolute inset-0 bg-dark-950/60 backdrop-blur-[2px] rounded-2xl flex items-center justify-center z-10 transition-opacity group-hover:bg-dark-950/80">
                            <div class="w-12 h-12 bg-dark-800 rounded-full flex items-center justify-center shadow-lg border border-dark-700">
                                <i data-lucide="lock" class="w-6 h-6 text-slate-500"></i>
                            </div>
                        </div>
                    ` : '';

                    let borderClass = 'border-dark-800';
                    if (!isLocked) {
                        borderClass = isCompleted ? 'border-[#58cc02]/30 group-hover:border-[#58cc02]/60' : 'group-hover:border-scout-500/50';
                    }

                    return `
                        <div class="relative group cursor-${isLocked ? 'not-allowed' : 'pointer'} transition-all duration-300 hover:-translate-y-1"
                             onclick="${isLocked ? `window.alert('${isEn ? "This module is locked." : "Bu modül şu an kilitli."}', 'error')` : `app.navigate('academy-lesson', {lessonId: '${mod.id}'})`}">
                            
                            <!-- Card Background & Border -->
                            <div class="h-full bg-dark-900 border ${borderClass} rounded-2xl p-6 relative overflow-hidden transition-colors ${!isLocked ? 'group-hover:bg-dark-800' : ''}">
                                ${lockOverlay}
                                
                                <!-- Icon Area -->
                                <div class="w-14 h-14 rounded-xl ${mod.bg} ${mod.border} border flex items-center justify-center mb-6 relative">
                                    <i data-lucide="${mod.icon}" class="w-7 h-7 ${mod.color}"></i>
                                    ${isCompleted ? `
                                    <div class="absolute -top-2 -right-2 w-6 h-6 bg-[#58cc02] rounded-full flex items-center justify-center border-2 border-dark-900 shadow-md">
                                        <i data-lucide="check" class="w-3.5 h-3.5 text-white"></i>
                                    </div>
                                    ` : ''}
                                </div>
                                
                                <!-- Content -->
                                <h3 class="text-xl font-bold text-white mb-3">${mod.title}</h3>
                                <p class="text-slate-400 text-sm leading-relaxed">${mod.desc}</p>
                                
                                <!-- Action Button (Visual only) -->
                                ${!isLocked ? `
                                    <div class="mt-6 flex items-center ${isCompleted ? 'text-[#58cc02]' : 'text-scout-400'} font-bold text-sm uppercase tracking-wider">
                                        ${isCompleted ? (isEn ? 'COMPLETED' : 'TAMAMLANDI') : (isEn ? 'START' : 'BAŞLA')} 
                                        ${isCompleted ? 
                                            `<i data-lucide="check-circle" class="w-4 h-4 ml-1"></i>` : 
                                            `<i data-lucide="arrow-right" class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"></i>`
                                        }
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;

    lucide.createIcons();
};
