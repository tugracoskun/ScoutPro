// academy.js - Scout Eğitimi Modülü (Yol Haritası / Roadmap UI)

ScoutApp.prototype.renderAcademy = function(container) {
    const steps = [
        {
            id: 1,
            title: t('academy_step1'),
            desc: "Sahadaki rolleri, mevki özelliklerini ve güncel futbol taktiklerini anlayın.",
            icon: "users",
            status: "active",
            color: "text-scout-400",
            bg: "bg-scout-500/20",
            border: "border-scout-500",
            pos: {x: 50, y: 10}
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
            pos: {x: 80, y: 30}
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
            pos: {x: 50, y: 50}
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
            pos: {x: 20, y: 75}
        },
        {
            id: 5,
            title: t('academy_step5'),
            desc: "İstatistikleri doğru okuma, veri tabanlı performans değerlendirmesi.",
            icon: "bar-chart-2",
            status: "locked",
            color: "text-slate-500",
            bg: "bg-dark-800",
            border: "border-dark-700",
            pos: {x: 50, y: 100}
        },
        {
            id: 6,
            title: t('academy_step6'),
            desc: "Teknik heyet ve yönetim için etkili, kısa ve öz oyuncu raporları yazmak.",
            icon: "file-text",
            status: "locked",
            color: "text-slate-500",
            bg: "bg-dark-800",
            border: "border-dark-700",
            pos: {x: 80, y: 125}
        },
        {
            id: 7,
            title: t('academy_step7'),
            desc: "Sportif direktör ve menajerlerle iletişim kurmanın incelikleri.",
            icon: "message-square",
            status: "locked",
            color: "text-slate-500",
            bg: "bg-dark-800",
            border: "border-dark-700",
            pos: {x: 50, y: 150}
        },
        {
            id: 8,
            title: t('academy_step8'),
            desc: "Kısa ve uzun vadeli oyuncu kariyeri planlama stratejileri.",
            icon: "trending-up",
            status: "locked",
            color: "text-slate-500",
            bg: "bg-dark-800",
            border: "border-dark-700",
            pos: {x: 20, y: 175}
        },
        {
            id: 9,
            title: t('academy_step9'),
            desc: "Tüm eğitimleri tamamlayıp sertifikanızı alın ve uzmanlığınızı kanıtlayın.",
            icon: "award",
            status: "locked",
            color: "text-slate-500",
            bg: "bg-dark-800",
            border: "border-dark-700",
            pos: {x: 50, y: 190}
        }
    ];

    let stepsHTML = '';
    
    steps.forEach((step) => {
        const disabledAttr = step.status === 'locked' ? 'disabled' : '';
        const cursorClass = step.status === 'locked' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:-translate-y-1 active:translate-y-1 transition-transform hover:scale-105';
        
        let btnBg = step.status === 'locked' ? 'bg-dark-800' : 'bg-[#58cc02]';
        let btnBorderColor = step.status === 'locked' ? 'border-dark-950' : 'border-[#46a302]';
        let iconColor = step.status === 'locked' ? 'text-slate-500' : 'text-white';
        let iconPulse = step.status === 'active' ? 'animate-bounce' : '';

        // Tooltip konumu: eğer obje soldaysa sağa doğru açılmalı, sağdaysa sola doğru açılmalı, ortadaysa duruma göre
        const tooltipSide = step.pos.x > 50 ? 'right' : 'left';
        const tooltipPosClass = tooltipSide === 'right' ? 'right-[110%]' : 'left-[110%]';
        const tooltipArrowClass = tooltipSide === 'right' ? '-right-2 border-l-dark-900 border-l-[6px] border-y-transparent border-y-[6px]' : '-left-2 border-r-dark-900 border-r-[6px] border-y-transparent border-y-[6px]';

        stepsHTML += `
            <div class="absolute" style="left: ${step.pos.x}%; top: ${step.pos.y / 2}%; transform: translate(-50%, -50%); z-index: 10;">
                <button ${disabledAttr} class="relative flex flex-col items-center group ${cursorClass}" onclick="${step.status === 'active' ? `app.navigate('academy-lesson')` : `app.showNotification('Bu modül şu an kilitli.', 'info')`}">
                    
                    <div class="absolute ${tooltipPosClass} top-1/2 -translate-y-1/2 w-48 p-3 rounded-2xl bg-dark-900 border border-dark-800 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 hidden md:block">
                        <div class="text-xs font-bold text-white mb-1">${step.title}</div>
                        <div class="text-[10px] text-slate-400 leading-relaxed">${step.desc}</div>
                        <div class="absolute top-1/2 -translate-y-1/2 ${tooltipArrowClass}"></div>
                    </div>

                    <div class="w-16 h-16 md:w-20 md:h-20 rounded-full ${btnBg} border-b-[6px] ${btnBorderColor} flex items-center justify-center shadow-lg relative overflow-hidden ring-4 ring-dark-950">
                        <i data-lucide="${step.icon}" class="w-7 h-7 md:w-8 md:h-8 ${iconColor} relative z-10 ${iconPulse}"></i>
                    </div>
                </button>
            </div>
        `;
    });
    const activeStep = steps.find(s => s.status === 'active') || steps[0];
    const totalSteps = steps.length;

    container.innerHTML = `
        <div class="h-full w-full overflow-y-auto custom-scrollbar fade-in bg-dark-950">
            <div class="p-4 md:p-8 max-w-4xl mx-auto flex flex-col min-h-full">
                <!-- Sıradaki Eğitim Önizlemesi (Next Training Preview) -->
                <div class="mb-8 w-full max-w-md mx-auto relative group cursor-pointer mt-4" onclick="app.navigate('academy-lesson')">
                    <div class="absolute -inset-1 bg-gradient-to-r from-[#58cc02]/20 to-blue-500/20 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                    <div class="relative bg-dark-900 border border-dark-800 rounded-2xl p-5 flex items-start gap-4">
                        <div class="w-14 h-14 rounded-xl ${activeStep.bg} border-b-[4px] ${activeStep.border} flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                            <i data-lucide="${activeStep.icon}" class="w-6 h-6 ${activeStep.color}"></i>
                        </div>
                        <div class="flex-1">
                            <div class="flex justify-between items-start mb-1">
                                <span class="text-[10px] font-black text-[#58cc02] uppercase tracking-widest bg-[#58cc02]/10 px-2 py-0.5 rounded-md">SIRADAKİ EĞİTİM</span>
                                <span class="text-xs font-bold text-slate-500">${activeStep.id} / ${totalSteps}</span>
                            </div>
                            <h3 class="text-lg font-bold text-white mb-1 group-hover:text-[#58cc02] transition-colors">${activeStep.title}</h3>
                            <p class="text-xs text-slate-400 line-clamp-2">${activeStep.desc}</p>
                        </div>
                    </div>
                </div>
                <!-- Snake Roadmap Alanı -->
                <div class="relative w-full max-w-md mx-auto mt-6" style="aspect-ratio: 1/2; min-height: 800px;">
                    <!-- Arka Plan Kıvrımlı Yolu (SVG) -->
                    <svg viewBox="0 0 100 200" class="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                        <path d="M 50 10 Q 90 15, 80 30 Q 70 45, 50 50 Q 10 55, 20 75 Q 30 95, 50 100 Q 90 105, 80 125 Q 70 145, 50 150 Q 10 155, 20 175 Q 30 195, 50 190" 
                              fill="none" stroke="#334155" stroke-width="1.5" stroke-dasharray="3 3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    
                    <!-- Adımlar -->
                    ${stepsHTML}
                </div>

                <div class="text-center mt-12 pb-12">
                    <button onclick="app.navigate('dashboard')" class="px-6 py-3 bg-dark-800 hover:bg-dark-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 mx-auto transition-colors">
                        <i data-lucide="arrow-left" class="w-4 h-4"></i> Genel Bakışa Dön
                    </button>
                </div>
            </div>
        </div>
    `;
};
