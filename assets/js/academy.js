// academy.js - Scout Eğitimi Modülü (Yol Haritası / Roadmap UI)

ScoutApp.prototype.renderAcademy = function(container) {
    // 4 adımlık statik yapı
    const steps = [
        {
            id: 1,
            title: t('academy_step1'),
            desc: "Sahadaki rolleri, mevki özelliklerini ve güncel futbol taktiklerini anlayın.",
            icon: "users",
            status: "active", // active, locked, completed
            color: "text-scout-400",
            bg: "bg-scout-500/20",
            border: "border-scout-500",
            shadow: "shadow-[0_0_20px_rgba(34,197,94,0.3)]"
        },
        {
            id: 2,
            title: t('academy_step2'),
            desc: "Veri gizliliği, kulüp sırları ve doğru analiz raporlamanın temel kuralları.",
            icon: "shield-check",
            status: "locked",
            color: "text-slate-500",
            bg: "bg-dark-800",
            border: "border-dark-700",
            shadow: ""
        },
        {
            id: 3,
            title: t('academy_step3'),
            desc: "Gelişim potansiyeli nasıl tespit edilir? Hangi yaşta nelere dikkat edilmeli?",
            icon: "baby",
            status: "locked",
            color: "text-slate-500",
            bg: "bg-dark-800",
            border: "border-dark-700",
            shadow: ""
        },
        {
            id: 4,
            title: t('academy_step4'),
            desc: "Uygulamadaki tüm modülleri verimli kullanarak takımınızı zafere taşıyın.",
            icon: "monitor-play",
            status: "locked",
            color: "text-slate-500",
            bg: "bg-dark-800",
            border: "border-dark-700",
            shadow: ""
        }
    ];

    let stepsHTML = '';
    
    steps.forEach((step, index) => {
        const isLeft = index % 2 === 0;
        const isLast = index === steps.length - 1;
        const disabledAttr = step.status === 'locked' ? 'disabled' : '';
        const cursorClass = step.status === 'locked' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:-translate-y-1 transition-transform hover:scale-105';

        stepsHTML += `
            <div class="relative flex justify-center mb-16 w-full">
                <!-- Dikey bağlantı çizgisi -->
                ${!isLast ? `<div class="absolute w-3 bg-dark-800 h-24 top-20 z-0 ${step.status !== 'locked' ? 'bg-gradient-to-b from-scout-500/50 to-dark-800' : ''}"></div>` : ''}

                <!-- Adım İçeriği -->
                <button ${disabledAttr} class="relative z-10 flex flex-col items-center group ${cursorClass}" onclick="app.showNotification('Bu modül şu anda hazırlanıyor.', 'info')">
                    
                    <!-- Baloncuk (Tooltip benzeri açıklama) -->
                    <div class="absolute ${isLeft ? 'right-[110%]' : 'left-[110%]'} top-1/2 -translate-y-1/2 w-64 p-4 rounded-2xl bg-dark-900 border border-dark-800 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 hidden md:block">
                        <div class="text-sm font-bold text-white mb-1">${step.title}</div>
                        <div class="text-xs text-slate-400 leading-relaxed">${step.desc}</div>
                        <!-- Üçgen OK -->
                        <div class="absolute top-1/2 -translate-y-1/2 ${isLeft ? '-right-2 border-l-dark-900 border-l-[8px] border-y-transparent border-y-[8px]' : '-left-2 border-r-dark-900 border-r-[8px] border-y-transparent border-y-[8px]'}"></div>
                    </div>

                    <!-- Dairesel İkon -->
                    <div class="w-24 h-24 rounded-full ${step.bg} ${step.border} border-4 flex items-center justify-center ${step.shadow} ${step.status === 'active' ? 'animate-pulse' : ''} bg-dark-950">
                        <i data-lucide="${step.icon}" class="w-10 h-10 ${step.color}"></i>
                    </div>
                    
                    <!-- Adım İsmi -->
                    <div class="mt-4 text-sm font-bold ${step.status === 'locked' ? 'text-slate-500' : 'text-white'} bg-dark-900 px-5 py-2.5 rounded-xl border border-dark-800 shadow-lg whitespace-nowrap tracking-wide">
                        ${step.title}
                    </div>
                    
                </button>
            </div>
        `;
    });

    container.innerHTML = `
        <div class="h-full w-full overflow-y-auto custom-scrollbar fade-in">
            <div class="p-4 md:p-8 max-w-4xl mx-auto flex flex-col min-h-full">
                
                <!-- Başlık Alanı -->
                <div class="text-center mb-12 relative mt-4">
                    <div class="inline-flex items-center justify-center w-20 h-20 bg-blue-500/10 border-2 border-blue-500/30 text-blue-400 rounded-2xl mb-6 shadow-inner">
                        <i data-lucide="graduation-cap" class="w-10 h-10"></i>
                    </div>
                    <h2 class="text-3xl font-black text-white mb-3 tracking-tight">${t('dash_academy_title')}</h2>
                    <p class="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
                        ${t('dash_academy_desc')}
                    </p>
                    
                    <div class="mt-8 inline-flex flex-col items-center bg-dark-900 border border-dark-800 px-6 py-4 rounded-2xl shadow-lg">
                        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">${t('dash_academy_progress')}</span>
                        <div class="flex items-center gap-3">
                            <span class="text-3xl font-black text-blue-400">1</span>
                            <span class="text-xl font-black text-slate-700">/</span>
                            <span class="text-2xl font-black text-slate-500">4</span>
                        </div>
                    </div>
                </div>

                <!-- Roadmap (Yol Haritası) -->
                <div class="relative py-10 flex flex-col items-center w-full">
                    ${stepsHTML}
                </div>

                <div class="text-center mt-auto pb-12">
                    <button onclick="app.navigate('dashboard')" class="px-6 py-3 bg-dark-800 hover:bg-dark-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 mx-auto transition-colors">
                        <i data-lucide="arrow-left" class="w-4 h-4"></i> Genel Bakışa Dön
                    </button>
                </div>
            </div>
        </div>
    `;
};
