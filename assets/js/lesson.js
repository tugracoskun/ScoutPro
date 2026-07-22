// lesson.js - Eğitim Modülü (Duolingo Tarzı Slayt Görünümü)

ScoutApp.prototype.lessonState = {
    currentSlide: 0,
    slides: []
};

ScoutApp.prototype.renderLesson = function(container, params) {
    const lang = window.getLang();
    const isEn = lang === 'en';
    const lessonId = (params && params.lessonId) ? params.lessonId : 'gk';

    const gkSlides = [
        {
            title: isEn ? "(Goalkeeper - GK) Position and Roles" : "Kaleci (GK) Mevkisi ve Rolleri",
            text: isEn ? "In modern soccer, the goalkeeper is not only the team’s last line of defense but also the first attacking player in the build-up.<br><br>The rise of possession-oriented philosophies has fundamentally transformed the characteristics expected of a goalkeeper. While traditional goalkeeping skills remain vital, in the modern era, first touch, vision, the ability to distribute both short and long passes, and the skill to come off the line have come to the forefront. The goalkeeper’s tendencies in distribution and clearing the area must be in perfect harmony with the team’s overall playing style." : "Modern futbolda kaleci, sadece takımın son savunma hattı değil, aynı zamanda oyun kurulumunun (build-up) ilk hücum oyuncusudur. <br><br> Topa sahip olma odaklı felsefelerin yaygınlaşması, kaleciden beklenen karakteristikleri kökten değiştirmiştir. Geleneksel kalecilik vasıfları halen hayati olmakla birlikte, modern çağda ilk dokunuş, vizyon, kısa ve uzun pas dağıtımı ile kalesini terk etme becerileri ön plana çıkmıştır. Dağıtım ve alanı süpürme eğilimleri, takımın genel oyun stiliyle kusursuz bir uyum içinde olmak zorundadır.",
            icon: "shield"
        },
        {
            title: isEn ? "Sweeper Keeper" : "Süpürücü Kaleci (Sweeper Keeper)",
            text: isEn ? "One of the fundamental elements of modern soccer’s tactical fluidity, the Sweeper Keeper simultaneously assumes the roles of both a standard goalkeeper and a “libero”—an outfield player who collects balls played behind the defense.<br><br>In tactics such as Pep Guardiola’s system, where the defensive line is pushed up to midfield (high line), a massive gap forms behind the defense, and offside traps can be exploited. The Sweeper Keeper closes this massive gap by moving forward, leaving his goal (rushing out), and using his anticipatory skills with high concentration. Speed, acceleration, first touch, composure, and sound decision-making are essential components of this role.<br><br>Sweeper-keepers must possess flawless game intelligence and decision-making mechanisms; for when they receive the ball, they personally initiate counterattacks by delivering vertical passes to players sprinting directly behind the defensive block. For example, elite sweeper-keepers like Ederson directly boost the team’s offensive effectiveness with both short and pinpoint long passes, and during possession phases, they participate in the passing circulation like an extra defender. The tactical role assigned to a sweeper goalkeeper (defense, support, or attack) determines how far the player will venture outside the penalty area; with a defensive command, the player moves more cautiously, while with an attacking command, the player can move as far forward as between the center backs to direct the build-up play." : "Modern futbolun taktiksel akışkanlığının temel unsurlarından biri olan Süpürücü Kaleci, hem standart bir kalecinin görevlerini hem de savunma arkasına atılan topları toplayan dış saha oyuncusu olan bir 'libero'nun görevlerini eşzamanlı olarak üstlenir.<br><br>Pep Guardiola sistemi gibi defans hattının orta sahaya kadar çıkarıldığı (yüksek çizgi) taktiklerde, savunmanın arkasında devasa bir boşluk oluşur ve ofsayt taktikleri delinebilir. Süpürücü kaleci, bu devasa boşluğu ileri çıkarak, kalesini terk ederek (rushing out) ve yüksek konsantrasyonla önsezi becerilerini kullanarak kapatır. Hız, ivmelenme, ilk dokunuş, soğukkanlılık ve doğru karar verme (decisions) yetileri, bu rolün olmazsa olmaz bileşenleridir.<br><br>Süpürücü kalecilerin oyun zekaları ve karar alma mekanizmaları kusursuz olmalıdır; zira topla buluştuklarında doğrudan savunma bloku arkasına koşan oyunculara atacakları dikine paslarla kontratakları bizzat başlatırlar. Örneğin, Ederson gibi elit süpürücü kaleciler, hem kısa hem de milimetrik uzun paslarıyla takımın hücum etkinliğini doğrudan artırmakta ve topa sahip olma evrelerinde ekstra bir savunma oyuncusu gibi pas sirkülasyonuna katılmaktadır. Süpürücü kaleciye verilen taktiksel görev (savunma, destek veya hücum) oyuncunun ceza sahası dışına ne kadar çıkacağını belirler; savunma komutuyla daha temkinli hareket ederken, hücum komutuyla stoperlerin arasına kadar girerek oyun kurulumunu yönlendirebilir.",
            icon: "zap"
        },
        {
            title: isEn ? "Traditional / Defensive Goalkeeper (Goalkeeper)" : "Geleneksel / Savunmacı Kaleci (Goalkeeper)",
            text: isEn ? "This role is based on the principle of clearing the ball away from the goal safely and is becoming less common in modern soccer.<br><br>Preferred in tactics that prioritize defense, where the team sits deep and the defensive line is set back, the traditional goalkeeper aims to kick the ball long and safely forward if a teammate is under pressure or there is no clear passing option. This profile is part of a risk-averse tactical approach where the team does not play a high defensive line and prefers to position itself in the penalty area to block shots rather than engage in a race for the ball with opposing attackers.<br><br>The effectiveness of traditional goalkeepers is largely measured by their aerial ability, command of the area, tendency to punch the ball, and reflex speed. As seen in the case of Fabianski, traditional goalkeepers maintain defensive cohesion by positioning themselves correctly and directing their center backs through verbal communication." : "Bu rol, topun risksiz bir şekilde kaleden uzaklaştırılması prensibine dayanır ve modern futbolda giderek daha az tercih edilmektedir.<br><br>Savunma yönü ağır basan, geride bekleyen ve defans çizgisinin derinde kurulduğu taktiklerde tercih edilen geleneksel kaleci, takım arkadaşı baskı altındaysa veya açık bir pas opsiyonu yoksa topu uzun ve güvenli bir şekilde ileri vurmayı hedefler. Bu profil, yüksek defans hattı oynamayan, rakip hücumcularla topa koşu yarışına girmek yerine ceza sahasında pozisyon alıp şutları karşılamayı tercih eden garanticilik odaklı taktiklerin parçasıdır.<br><br>Geleneksel kalecilerin etkinliği, büyük ölçüde hava toplarındaki hakimiyet (aerial ability), alanı komuta etme (command of area), yumruklama eğilimi (tendency to punch) ve refleks hızı ile ölçülür. Fabianski örneğinde olduğu gibi, geleneksel kaleciler pozisyonlarını doğru alarak ve stoperlerini sözlü iletişimle yönlendirerek savunma bütünlüğünü korurlar.",
            icon: "anchor"
        }
    ];

    const cbSlides = [
        {
            title: isEn ? "Center Back (CB) Position and Roles" : "Stoper (CB) Mevkisi ve Rolleri",
            text: isEn ? "As the commanders of the defensive line, center backs must prevent opponents from finding space, direct the team, and provide leadership.<br><br>The selection and on-field behavior of modern center backs vary greatly depending on their actions after regaining possession and their relationship with the ball. The pairing of center backs within the tactical structure forms the foundation of defensive balance and possession percentage." : "Savunma duvarının komutanları olan stoperler, rakibin alan bulmasını engellemek, takımı yönlendirmek ve liderlik etmek zorundadırlar.<br><br>Modern stoperlerin seçimi ve sahadaki davranışı, topu geri kazandıktan sonraki aksiyonlarına ve topla kurdukları ilişkiye göre büyük bir çeşitlilik gösterir. Taktiksel yapı içinde stoperlerin birbirleriyle eşleştirilmeleri, savunma dengesinin ve topa sahip olma yüzdesinin temelini oluşturur.",
            icon: "users"
        },
        {
            title: isEn ? "Playmaking Center Back (Ball-Playing Defender)" : "Pasör Stoper (Ball-Playing Defender)",
            text: isEn ? "The backbone of modern soccer and the tactical starting point for attacks.<br><br>A playmaking center back is a defender who possesses the ability to build play from the back, high creativity, and ball skills as good as those of outfield players. This role does not merely involve passing the ball to the player next to them; it involves delivering vertical through balls that pierce the opposing team’s pressing lines, long diagonal passes to the wings, and key passes that initiate counterattacks. The presence of the playmaking center back on the field is the most effective way to neutralize the opponent’s high press.<br><br>With high passing accuracy and well-judged weight of pass, he dictates the direction and tempo of the game. However, since this high level of creative freedom can lead to major defensive gaps in the event of passing errors or turnovers, he is typically paired with a standard center back to balance the defensive risk." : "Modern futbolun belkemiği ve taktiksel hücum başlangıç noktasıdır.<br><br>Pasör stoper, oyunu geriden kurma becerisine, yüksek yaratıcılığa ve dış saha oyuncuları kadar iyi bir top tekniğine sahip olan savunma oyuncusudur. Bu rol, topu sadece yanındaki oyuncuya vermekle yetinmez; rakip takımın pres hatlarını delen dikey ara paslar (through balls), kanatlara atılan uzun diyagonal toplar ve kontratak başlatan anahtar paslar çıkarır. Pasör stoperin sahadaki varlığı, rakibin ön alan baskısını (high press) boşa çıkarmanın en etkili yoludur.<br><br>Yüksek pas isabeti ve ağırlığı ayarlanmış (weight of pass) dağıtımlarıyla oyunun yönünü ve temposunu tayin eder. Ancak bu yüksek yaratıcılık özgürlüğü, pas hatalarında veya top kayıplarında savunmada büyük açıklar verilmesine neden olabileceğinden, genellikle standart bir merkez savunmacı ile yan yana oynatılarak defansif risk dengelenir.",
            icon: "git-merge"
        },
        {
            title: isEn ? "Standard Central Defender" : "Standart Merkez Savunma (Central Defender)",
            text: isEn ? "This is a balanced and reliable profile that falls between a defensive center back and a playmaking center back.<br><br>Their primary role is to stop opposing attackers, anticipate danger, and prevent the ball from entering the penalty area. He does not hesitate to clear the ball when necessary, but whenever possible, he supports the team’s possession by clearing the ball out of the danger zone and delivering a safe, short pass to nearby midfielders. A standard center back does not attempt risky passes that require a high degree of creativity; instead, he plays the game simply, with composure, and remains committed to zonal marking. In most modern systems, he is positioned alongside a playmaking center back to serve as a safety net, compensating for the spaces his creative partner leaves open or the balls he loses." : "Sınırlı stoper ile pasör stoper arasında dengeli ve güvenilir bir profildir.<br><br>Birincil görevi rakip hücumcuları durdurmak, tehlikeyi sezmek ve ceza sahasına top girmesini engellemektir. Topu uzaklaştırması gerektiğinde tereddüt etmez, ancak imkan varsa topu tehlike bölgesinden çıkarıp yakındaki orta saha oyuncularına güvenli bir kısa pasla aktararak takımın topa sahip olmasını destekler. Standart merkez savunmacı, yüksek yaratıcılık gerektiren riskli paslar denemez; oyunu basit, soğukkanlı (composure) ve alan savunmasına sadık kalarak oynar. Çoğu modern sistemde, bir Pasör Stoperin yanında sigorta görevi görmek üzere konumlandırılır, böylece yaratıcı partnerinin boşalttığı alanları veya kaybettiği topları telafi eder.",
            icon: "shield"
        },
        {
            title: isEn ? "Limited Defender" : "Sınırlı Stoper (Limited Defender)",
            text: isEn ? "The primary and sole focus of the limited defender is to clear the ball as far away from the danger zone as possible.<br><br>This profile absolutely avoids taking any risks in building play from the back and, the moment it feels even the slightest pressure, clears the ball forward or out for a throw-in. While the technical abilities, first touch, passing, and vision of Limited Defenders may be quite low, they are extremely effective in terms of physical strength, aerial dominance, aggressiveness, courage, and man-marking. While using this role reduces the risk of losing possession when playing the ball out from the back to zero, it causes the ball to be given back to the opponent very quickly, making it absolutely unsuitable for teams that embrace a possession-based philosophy." : "Sınırlı stoperin birincil ve yegane odak noktası, topu tehlike bölgesinden mümkün olan en uzak mesafeye vurarak uzaklaştırmaktır.<br><br>Bu profil, savunmadan oyun kurma riskine kesinlikle girmez ve en ufak bir baskı hissettiği an topu ileriye veya taca diker. Sınırlı stoperlerin teknik kapasiteleri, ilk dokunuşları, pas veya vizyon özellikleri oldukça düşük olabilir; ancak fiziksel güç, hava hakimiyeti, agresiflik, cesaret ve adam markajı konularında son derece etkilidirler. Bu rolün kullanımı, geride topla oynarken kaptırma riskini sıfıra indirse de, topun rakibe çok çabuk geri verilmesine neden olduğu için topa sahip olma felsefesini benimseyen takımlar için kesinlikle uygun değildir.",
            icon: "alert-triangle"
        },
        {
            title: isEn ? "Libero / Sweeper" : "Libero / Süpürücü (Sweeper)",
            text: isEn ? "Although its traditional use has declined in modern soccer with the rise of four-man defensive blocks, it is still employed as a tactical variation right in the center of three-man defensive systems.<br><br>The libero drops back one step behind the defensive line to clear balls played behind the defense, intercept breakaway attackers, and make critical goal-preventing interventions (blocks, interceptions). The modern libero, however, is not merely a defensive safety net; when in possession of the ball, he dribbles forward toward midfield and distributes the ball like an extra midfielder, thereby providing the team with a numerical advantage in the opponent’s half." : "Dörtlü savunma bloklarının yaygınlaşmasıyla modern futbolda klasik kullanımı azalmış olsa da, üçlü savunma sistemlerinin tam ortasında halen taktiksel bir varyasyon olarak kullanılmaktadır.<br><br>Libero, defans hattının bir adım gerisine sarkarak (dropping behind the defensive line) savunma arkasına atılan topları süpürür, kaçan hücumcuları karşılar ve kritik gol önleyici müdahaleler (bloklar, top kesmeler) yapar. Modern libero ise sadece bir savunma sigortası değildir; topla buluştuğunda orta sahaya doğru dripling yaparak çıkar ve ekstra bir orta saha oyuncusu gibi dağıtım yapar, böylece takıma rakip yarı alanda sayısal üstünlük avantajı sunar.",
            icon: "move"
        }
    ];

    this.lessonState.currentLessonId = lessonId;
    this.lessonState.slides = lessonId === 'cb' ? cbSlides : gkSlides;
    this.lessonState.currentSlide = 0;

    this.updateLessonUI(container);
};

ScoutApp.prototype.updateLessonUI = function(container) {
    if (!container) container = document.getElementById('content-area');
    
    const slideIndex = this.lessonState.currentSlide;
    const slides = this.lessonState.slides;
    const slide = slides[slideIndex];
    const isLast = slideIndex === slides.length - 1;
    const isEn = window.getLang() === 'en';
    
    const progressPercent = ((slideIndex + 1) / slides.length) * 100;

    container.innerHTML = `
        <div class="h-full w-full flex flex-col bg-dark-950 fade-in">
            <!-- Header Progress -->
            <div class="w-full max-w-3xl mx-auto px-4 py-6 flex items-center gap-4">
                <button onclick="app.navigate('academy-submodules', {stepId: 1})" class="text-slate-400 hover:text-white transition-colors">
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
                                `<span>${isEn ? 'COMPLETE' : 'TAMAMLA'}</span><i data-lucide="check-check" class="w-6 h-6"></i>` : 
                                `<span>${isEn ? 'NEXT' : 'SONRAKİ'}</span><i data-lucide="arrow-right" class="w-6 h-6 group-hover:translate-x-1 transition-transform"></i>`
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
        const isEn = window.getLang() === 'en';
        
        // Mark as completed
        const lessonId = this.lessonState.currentLessonId;
        if (lessonId && !this.state.completedLessons.includes(lessonId)) {
            this.state.completedLessons.push(lessonId);
            localStorage.setItem('scoutpro_completed_lessons', JSON.stringify(this.state.completedLessons));
        }

        this.notify(isEn ? "Congratulations! You have successfully completed this module." : "Tebrikler! Bu modülü başarıyla tamamladınız.");
        this.navigate('academy-submodules', {stepId: 1});
    }, 400);
};
