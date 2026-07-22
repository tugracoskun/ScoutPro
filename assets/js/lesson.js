// lesson.js - Eğitim Modülü (Duolingo Tarzı Slayt Görünümü)

ScoutApp.prototype.lessonState = {
    currentSlide: 0,
    slides: []
};

ScoutApp.prototype.renderLesson = function(container) {
    // Şimdilik 1. Ders verisini statik olarak tanımlıyoruz. 
    // Daha sonra dinamik olarak parametre alabilir.
    this.lessonState.slides = [
        {
            title: "Kaleci (GK) Mevkisi ve Rolleri",
            text: "Modern futbolda kaleci, sadece takımın son savunma hattı değil, aynı zamanda oyun kurulumunun (build-up) ilk hücum oyuncusudur. <br><br> Topa sahip olma odaklı felsefelerin yaygınlaşması, kaleciden beklenen karakteristikleri kökten değiştirmiştir. Geleneksel kalecilik vasıfları halen hayati olmakla birlikte, modern çağda ilk dokunuş, vizyon, kısa ve uzun pas dağıtımı ile kalesini terk etme becerileri ön plana çıkmıştır. Dağıtım ve alanı süpürme eğilimleri, takımın genel oyun stiliyle kusursuz bir uyum içinde olmak zorundadır.",
            icon: "shield"
        },
        {
            title: "Süpürücü Kaleci (Sweeper Keeper)",
            text: "Modern futbolun taktiksel akışkanlığının temel unsurlarından biri olan Süpürücü Kaleci, hem standart bir kalecinin görevlerini hem de savunma arkasına atılan topları toplayan dış saha oyuncusu olan bir 'libero'nun görevlerini eşzamanlı olarak üstlenir.<br><br>Pep Guardiola sistemi gibi defans hattının orta sahaya kadar çıkarıldığı (yüksek çizgi) taktiklerde, savunmanın arkasında devasa bir boşluk oluşur ve ofsayt taktikleri delinebilir. Süpürücü kaleci, bu devasa boşluğu ileri çıkarak, kalesini terk ederek (rushing out) ve yüksek konsantrasyonla önsezi becerilerini kullanarak kapatır. Hız, ivmelenme, ilk dokunuş, soğukkanlılık ve doğru karar verme (decisions) yetileri, bu rolün olmazsa olmaz bileşenleridir.<br><br>Süpürücü kalecilerin oyun zekaları ve karar alma mekanizmaları kusursuz olmalıdır; zira topla buluştuklarında doğrudan savunma bloku arkasına koşan oyunculara atacakları dikine paslarla kontratakları bizzat başlatırlar. Örneğin, Ederson gibi elit süpürücü kaleciler, hem kısa hem de milimetrik uzun paslarıyla takımın hücum etkinliğini doğrudan artırmakta ve topa sahip olma evrelerinde ekstra bir savunma oyuncusu gibi pas sirkülasyonuna katılmaktadır. Süpürücü kaleciye verilen taktiksel görev (savunma, destek veya hücum) oyuncunun ceza sahası dışına ne kadar çıkacağını belirler; savunma komutuyla daha temkinli hareket ederken, hücum komutuyla stoperlerin arasına kadar girerek oyun kurulumunu yönlendirebilir.",
            icon: "zap"
        },
        {
            title: "Geleneksel / Savunmacı Kaleci (Goalkeeper)",
            text: "Bu rol, topun risksiz bir şekilde kaleden uzaklaştırılması prensibine dayanır ve modern futbolda giderek daha az tercih edilmektedir.<br><br>Savunma yönü ağır basan, geride bekleyen ve defans çizgisinin derinde kurulduğu taktiklerde tercih edilen geleneksel kaleci, takım arkadaşı baskı altındaysa veya açık bir pas opsiyonu yoksa topu uzun ve güvenli bir şekilde ileri vurmayı hedefler. Bu profil, yüksek defans hattı oynamayan, rakip hücumcularla topa koşu yarışına girmek yerine ceza sahasında pozisyon alıp şutları karşılamayı tercih eden garanticilik odaklı taktiklerin parçasıdır.<br><br>Geleneksel kalecilerin etkinliği, büyük ölçüde hava toplarındaki hakimiyet (aerial ability), alanı komuta etme (command of area), yumruklama eğilimi (tendency to punch) ve refleks hızı ile ölçülür. Fabianski örneğinde olduğu gibi, geleneksel kaleciler pozisyonlarını doğru alarak ve stoperlerini sözlü iletişimle yönlendirerek savunma bütünlüğünü korurlar.",
            icon: "anchor"
        }
    ];
    this.lessonState.currentSlide = 0;

    this.updateLessonUI(container);
};

ScoutApp.prototype.updateLessonUI = function(container) {
    if (!container) container = document.getElementById('content-area');
    
    const slideIndex = this.lessonState.currentSlide;
    const slides = this.lessonState.slides;
    const slide = slides[slideIndex];
    const isLast = slideIndex === slides.length - 1;
    
    const progressPercent = ((slideIndex + 1) / slides.length) * 100;

    container.innerHTML = `
        <div class="h-full w-full flex flex-col bg-dark-950 fade-in">
            <!-- Header Progress -->
            <div class="w-full max-w-3xl mx-auto px-4 py-6 flex items-center gap-4">
                <button onclick="app.navigate('academy')" class="text-slate-400 hover:text-white transition-colors">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
                <div class="flex-1 bg-dark-800 h-3 rounded-full overflow-hidden">
                    <div class="bg-[#58cc02] h-full rounded-full transition-all duration-500 ease-out" style="width: ${progressPercent}%;"></div>
                </div>
                <div class="text-[#58cc02] font-black text-sm">${slideIndex + 1} / ${slides.length}</div>
            </div>

            <!-- Content Area -->
            <div class="flex-1 overflow-y-auto custom-scrollbar flex justify-center px-4 py-8">
                <div class="w-full max-w-2xl fade-in-up">
                    <div class="bg-dark-900 border border-dark-800 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
                        
                        <!-- Arka plan süsü -->
                        <div class="absolute -top-10 -right-10 text-dark-800 opacity-20 pointer-events-none">
                            <i data-lucide="${slide.icon}" class="w-64 h-64"></i>
                        </div>

                        <div class="relative z-10">
                            
                            <h2 class="text-3xl font-black text-white mb-6 leading-tight">${slide.title}</h2>
                            
                            <div class="text-slate-300 text-lg leading-relaxed space-y-4">
                                ${slide.text}
                            </div>
                        </div>
                    </div>
                    <!-- İleri / Tamamla Butonu -->
                    <div class="flex justify-end mt-4 mb-8">
                        <button onclick="${isLast ? "app.finishLesson()" : "app.nextLessonSlide()"}" class="group w-auto px-8 py-3 bg-[#58cc02] hover:bg-[#46a302] text-white rounded-2xl font-black text-lg transition-transform hover:-translate-y-1 active:translate-y-1 shadow-[0_4px_0_#46a302] hover:shadow-[0_6px_0_#46a302] active:shadow-none flex items-center justify-center gap-2">
                            ${isLast ? 
                                '<span>TAMAMLA</span><i data-lucide="check-check" class="w-6 h-6"></i>' : 
                                '<span>SONRAKİ</span><i data-lucide="arrow-right" class="w-6 h-6 group-hover:translate-x-1 transition-transform"></i>'
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Yeni render edilen ikonları oluştur
    if(window.lucide) {
        lucide.createIcons();
    }
};

ScoutApp.prototype.nextLessonSlide = function() {
    if (this.lessonState.currentSlide < this.lessonState.slides.length - 1) {
        this.lessonState.currentSlide++;
        this.updateLessonUI();
    }
};

ScoutApp.prototype.finishLesson = function() {
    const container = document.querySelector('#content-area > div');
    if(container) {
        container.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        container.style.opacity = '0';
        container.style.transform = 'translateY(20px) scale(0.95)';
    }
    
    setTimeout(() => {
        this.showNotification("Tebrikler! Rol ve Pozisyonlar eğitimini başarıyla tamamladınız.", "success");
        this.navigate('academy');
    }, 400);
};
