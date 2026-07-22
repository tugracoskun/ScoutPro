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

    const fbSlides = [
        {
            title: isEn ? "Full Back & Wing Back (LB/RB) Position and Roles" : "Bek ve Kanat Bek (Full Back & Wing Back) Mevkisi ve Rolleri",
            text: isEn ? "While in traditional soccer the responsibility for creating width in attack fell to the wingers, in modern soccer this role has largely shifted to the fullbacks. As part of this tactical evolution, fullbacks have moved beyond simply defending the touchline to become playmakers, assist providers, and key attacking weapons. In modern formations that rely on wing attacks, the overlapping principles employed by fullbacks define the character of the team’s offense." : "Klasik futbolda hücum genişliğini sağlama görevi kanat oyuncularındayken, modern futbolda bu görev büyük oranda bek oyuncularına geçmiştir. Taktiksel evrim içinde bekler, savunmanın sadece taç çizgisini savunan parçaları olmaktan çıkıp, oyun kurucu, asist sağlayıcı ve ana hücum silahlarına dönüşmüşlerdir. Kanat hücumlarının sağlandığı modern kurgularda, bek oyuncularının bindirme (overlapping) prensipleri takım hücumunun karakterini belirler.",
            icon: "users"
        },
        {
            title: isEn ? "Inverted Wing Back (False Fullback)" : "Sahte Bek (Inverted Wing Back)",
            text: isEn ? "One of the most innovative, sophisticated, and game-changing roles on the soccer field is the “false fullback.” While traditional fullbacks make vertical runs parallel to the touchline, the false fullback moves horizontally toward the center—that is, into the defensive midfield zone—when the team has possession of the ball.<br><br>The false fullback’s movement toward the center provides the team with tremendous tactical advantages. First, it creates numerical superiority in the build-up phase, crowding the central midfield and disrupting the opponent’s pressing trap in the center. Second, by building play from the center, it allows the true number eights (such as Mezzalas) or wingers to position themselves in much wider areas and closer to the attack. Third, in moments of ball loss (transitional defense), it creates an extra defensive safeguard (corridor blocker) in the center.<br><br>In some modern variations, however, false fullbacks—rather than pushing forward when the team is attacking—position themselves like the outside center back in a three-man defensive line to maximize defensive security at the back. This role demands exceptional game intelligence, passing accuracy, the ability to hold onto the ball in tight spaces, first touch, and tactical discipline from the player." : "Futbol sahasındaki en yenilikçi, en sofistike ve oyunu kökten değiştiren rollerden biri \"Sahte Bek\"tir. Klasik bekler taç çizgisine paralel dikey koşular yaparken, sahte bek takım topa sahip olduğunda merkeze, yani defansif orta saha bölgesine doğru (içe kat ederek) yatay bir hareketlenme gerçekleştirir.<br><br>Sahte bekin merkeze gelmesi takıma muazzam taktiksel avantajlar sağlar. İlk olarak, oyun kurulumunda sayısal üstünlük yaratarak merkez orta sahayı kalabalıklaştırır ve rakibin merkezden kurduğu pres tuzağını bozar. İkinci olarak, merkezden oyunu kurarak asıl sekiz numaraların (örneğin Mezzala'ların) veya kanat oyuncularının çok daha geniş alanlarda ve hücuma daha yakın konumlanmasını sağlar. Üçüncü olarak, top kaybı anlarında (geçiş savunması) merkezde ekstra bir savunma güvencesi (koridor tıkacı) yaratır.<br><br>Bazı modern varyasyonlarda ise sahte bekler, takım topla hücum ederken ileri gitmek yerine, üçlü bir savunma hattının kenar stoperi (third center back) gibi konumlanarak arkadaki savunma güvenliğini maksimize ederler. Bu rol, futbolcudan olağanüstü bir oyun zekası, pas isabeti, dar alanda top saklama becerisi, ilk dokunuş ve taktiksel disiplin talep eder.",
            icon: "git-merge"
        },
        {
            title: isEn ? "Wing Back & Complete Wing Back" : "Kanat Bek (Wing Back) ve Tam Kanat Bek (Complete Wing Back)",
            text: isEn ? "A wingback is a player who is the sole ruler of the wing—especially in three- or five-man defensive formations—and is expected to dominate the entire flank on his own, without support. This role requires the player to possess both the defensive attributes of a fullback and the attacking, dribbling, dribbling past opponents, and crossing abilities of a winger simultaneously. This versatility demands exceptional physical conditioning, explosive power, work rate, and endurance.<br><br>In the context of tactical assignments, when a wing back is assigned a defensive role, they limit their offensive involvement and prefer to stay back; when given a support command, they provide width and distribute angled passes; and when given an offensive command, they make aggressive runs into the opponent’s half, beat their man, and cut inside to deliver hard crosses toward the penalty area.<br><br>The “Complete Wing Back” variation, on the other hand, represents the ultimate and most unrestricted form of the modern attacking fullback. Rather than prioritizing defensive discipline, the player in this role aims to position themselves deep in the opponent’s half—almost like a winger—and possesses unlimited freedom and initiative in attacking rotations." : "Kanat bek, özellikle üçlü veya beşli savunma dizilişlerinde kanadın yegane hakimi olan, destek almadan tüm koridoru tek başına domine etmesi beklenen oyuncudur. Bu rol, hem bir bekin savunma özelliklerine hem de bir kanat oyuncusunun hücum, dripling, adam geçme ve orta yapma özelliklerine aynı anda sahip olmayı zorunlu kılar. Bu çok yönlülük, olağanüstü bir fiziksel kondisyon, patlayıcı güç, çalışma oranı (work rate) ve dayanıklılık gerektirir.<br><br>Taktiksel görevlendirme bağlamında bir kanat beke savunma rolü biçildiğinde, hücum katılımlarını sınırlar ve geride kalmayı tercih eder; destek komutuyla genişlik sağlar ve açılı paslar dağıtır; hücum komutu verildiğinde ise rakip sahada agresif bindirmeler yapar, adam geçer ve çizgiye inerek penaltı noktasına sert ortalar gönderir.<br><br>\"Tam Kanat Bek\" (Complete Wing Back) varyasyonu ise modern hücum beklerinin nihai ve en özgür halidir. Bu roldeki oyuncu savunma disiplininden ziyade, neredeyse bir açık oyuncusu gibi rakip sahanın derinliklerinde konumlanmayı hedefler, ataklara katılımda sınırsız bir özgürlüğe ve rotasyon inisiyatifine sahiptir.",
            icon: "zap"
        },
        {
            title: isEn ? "Classic Full Back" : "Klasik Bek (Full Back)",
            text: isEn ? "This is a player whose primary priority is defense, focused on avoiding defensive vulnerabilities against attacks down the flanks or by opposing attackers. Classic fullbacks, who still have a place in modern soccer, are responsible for maintaining the position of the team’s defensive line by moving in coordination with the center backs.<br><br>A classic fullback makes runs down the wing when the team needs extra width and cuts into the middle when the opportunity arises, but does so without completely abandoning his position and leaving the defense exposed. Only the fullback on the side where play is currently taking place makes the run up the flank, while the other fullback stays back to maintain defensive balance. When assigned a defensive role, he stays back and acts as the team’s passing hub by making safe passes to midfield." : "Birinci önceliği savunma yapmak olan, kanat açıklarına veya rakip hücum oyuncularına karşı savunma zafiyeti yaratmamaya odaklanan oyuncudur. Modern futbolda halen yeri olan klasik bekler, stoperlerle uyum içinde hareket ederek takım savunma hattının pozisyonunu korumasından sorumludurlar.<br><br>Klasik bek, takımın ekstra genişliğe ihtiyaç duyduğu anlarda kanattan bindirmeler yapar ve müsait anlarda orta keser, ancak bunu yaparken pozisyonunu tamamen terk edip savunmayı eksik bırakmaz. Sahanın sadece o an oyunun oynandığı tarafındaki bek bindirme yapar, diğer bek geride kalarak savunma dengesini gözetir. Savunma (Defend) görevi verildiğinde, geride kalır ve orta sahaya risksiz top aktarımları yaparak takımın pas istasyonu görevini görür.",
            icon: "shield"
        }
    ];

    const dmSlides = [
        {
            title: isEn ? "Defensive Midfielder Position and Roles" : "Defansif Orta Saha (Defensive Midfielder) Mevkisi ve Rolleri",
            text: isEn ? "The defensive midfield position is a strategic zone that bridges the gap between defense and attack in the modern game, determines the game’s center of gravity, and directs the tactical flow between the two penalty areas. In modern soccer, defensive midfielders are not merely ball-winning players positioned in front of the center backs; they function as the team’s brain." : "Defansif orta saha pozisyonu, modern oyunun savunma ve hücum bağlantısını kuran, oyunun ağırlık merkezini belirleyen ve iki ceza sahası arasındaki taktiksel akışı yöneten stratejik bir bölgedir. Modern futbolda defansif orta sahalar sadece stoperlerin önünde duran kesiciler değil, takımın beyni olarak işlev görmektedir.",
            icon: "shield"
        },
        {
            title: isEn ? "Segundo Volante (Second Defensive Midfielder)" : "İkinci Ön Libero (Segundo Volante)",
            text: isEn ? "Originating from South American soccer literature, this is a hybrid role that works wonders in modern tactics, particularly in systems with two defensive midfielders (such as the defensive duo in a 4-2-3-1 formation). Literally, it means “second defensive midfielder.” Although the player starts the match in a classic defensive midfield zone performing defensive duties, once the team regains possession, he acts like a “box-to-box midfielder,” making incredibly aggressive and penetrating vertical runs toward the opponent’s penalty area.<br><br>The tactical asymmetry created by the Segundo Volante is highly disruptive to defenses. In situations where attacking midfielders are tightly marked by the opponent, these delayed runs coming quickly from deep disrupt the opponent’s defensive balance. While aggressively winning the ball and battling in defense, he poses a shooting threat on the edge of the penalty area in attack, infiltrates dangerous zones, and directly impacts the score. It is essential that he be paired with a more static “Anchor” or “Deep Playmaker” to balance him out, ensuring the team does not leave itself exposed at the back." : "Güney Amerika futbol literatüründen gelen ve modern taktikte özellikle çift ön libero sistemlerinde (örneğin 4-2-3-1 dizilişinin savunma önü ikilisinde) harikalar yaratan, hibrit bir roldür. Kelime anlamı olarak \"ikinci ön libero\" anlamına gelir. Klasik bir defansif orta saha bölgesinde defansif görevlerle maça başlamasına rağmen, takım topu kazandığında \"İki Yönlü Orta Saha\" (Box-to-Box) gibi davranarak rakip ceza alanına doğru inanılmaz agresif ve delici dikey koşular yapar.<br><br>Segundo Volante'nin yarattığı taktiksel asimetri savunmalar için çok yıkıcıdır. Hücumcu orta sahaların rakip tarafından sıkı markaja alındığı durumlarda, derinlerden hızla gelen bu gecikmeli koşular rakip defansın eşleşme dengesini alt üst eder. Savunmada agresif bir şekilde top kapıp mücadele ederken, hücumda ceza sahası yayında şut tehdidi oluşturur, tehlikeli bölgelere sızar ve doğrudan skora etki eder. Yanında mutlaka onu dengeleyecek daha statik bir Çapa veya Derin Oyun Kurucu ile oynatılması, takımın geride açık vermemesi adına zorunludur.",
            icon: "zap"
        },
        {
            title: isEn ? "Regista (Dynamic/Roaming Playmaker)" : "Dinamik/Gezici Oyun Kurucu (Regista)",
            text: isEn ? "The term “Regista” (director/organizer), which has Italian origins, refers to a much more aggressive, free-flowing, and attack-oriented version of playmaking that begins from the defensive third. When a Regista receives the ball, he doesn’t just distribute safe passes in his own half; he takes the initiative in line with the flow of the game to advance with the ball all the way into the opponent’s half, personally orchestrating the team’s attacks with his vision, much like a conductor.<br><br>While the deep-lying playmaker operates in a more defensive and static zone, the Regista is a dynamic maestro who moves wherever the ball is and positions himself at the center of passing lanes. Because he has a high potential to create defensive vulnerabilities, it is essential that he be supported by a physically imposing Warrior Midfielder or a defensive Fullback." : "İtalyanca kökenli olan \"Regista\" terimi (yönetmen/organizatör), oyun kuruculuğun savunma önünden başlatıldığı, çok daha agresif, serbest ve hücumu yönlendiren versiyonudur. Bir Regista, topu aldığında sadece kendi sahasında güvenli paslar dağıtmaz; oyunun akışıyla birlikte insiyatif alarak rakip yarı alana kadar topla ilerleyebilir, vizyonuyla takımın ataklarını adeta bir orkestra şefi gibi bizzat yönetir.<br><br>Derin oyun kurucu daha defansif ve sabit bir alanı kovalarken, Regista top neredeyse oraya hareketlenen, pas rotalarının merkezine kendini yerleştiren dinamik bir maestrodur. Savunma zafiyeti yaratma potansiyeli yüksek olduğundan, yanında fizikli bir Savaşçı Orta Saha veya defansif bir Yarım Bek ile desteklenmesi elzemdir.",
            icon: "activity"
        },
        {
            title: isEn ? "Deep Lying Playmaker" : "Derin Oyun Kurucu (Deep Lying Playmaker)",
            text: isEn ? "This defensive midfielder focuses on distributing the ball and dictating the flow of the game rather than engaging in physical contact with opponents or battling for possession. His vision, the quality of his long and short passes, technical ability, and—above all—his composure under pressure must be exceptional.<br><br>Because he is positioned deep, he is relatively far from the opponent’s pressure in the attacking third and, with a very clear view of the field from his vantage point, delivers pinpoint long diagonal passes that suddenly change the direction of the game. Rather than relying on physical battles, he acts as the heart of the team by establishing mental and technical dominance." : "Rakiple fiziksel temasa veya top kapma mücadelelerine girmekten ziyade, top dağıtmaya ve oyunun akışını dikte etmeye odaklanmış defansif orta sahadır. Oyun görüşü, uzun ve kısa pas kalitesi, teknik kapasitesi ve özellikle baskı altındaki soğukkanlılığı (composure) ile ilk dokunuşu olağanüstü seviyelerde olmalıdır.<br><br>Derinde konumlandığı için rakibin ön alan baskısından nispeten uzaktır ve sahayı karşıdan çok net görerek, oyunun yönünü aniden değiştiren milimetrik uzun diyagonal paslar atar. Fiziksel bir mücadeleden ziyade, zihinsel ve teknik bir hakimiyet kurarak takımın kalbi gibi atar.",
            icon: "eye"
        },
        {
            title: isEn ? "Ball-Winning Midfielder & Anchor Man" : "Savaşçı Orta Saha (Ball-Winning Midfielder) ve Çapa (Anchor Man)",
            text: isEn ? "<strong>Ball-Winning Midfielder:</strong> This is a destructive role that stands out more for aggression, physical strength, stamina, courage, and a ruthless ability to win the ball than for game intelligence, creativity, or technical skill. Rather than defending a specific area, the player constantly presses wherever the ball is, wears down the opponent, and triggers his team’s dangerous counterattacks with sudden ball recoveries. However, his overly aggressive style of play can leave large open spaces behind him, so he should not be left on his own within a disciplined defensive structure.<br><br><strong>Anchor Man:</strong> This is the most static, disciplined, and risk-averse form of the classic defensive midfielder. He literally anchors himself just in front of the back four and never abandons his position for any offensive action. His primary task is to narrow the space available to opposing attackers, cut off passing lanes (interceptions), and, when he wins the ball, immediately pass it to the nearest skilled playmakers without dribbling or hesitating. His mental focus and defensive positioning are impeccable." : "<strong>Savaşçı Orta Saha:</strong> Oyun zekası, yaratıcılık ve teknikten ziyade agresiflik, fiziksel güç, dayanıklılık, cesaret (bravery) ve acımasız top kapma yeteneğiyle öne çıkan destrüktif roldür. Alanı korumak yerine topun olduğu yere durmaksızın pres yapar, rakibi yıpratır ve ani top kazanımlarıyla takımının tehlikeli geçiş oyunlarını tetikler. Ancak aşırı agresif oynaması, arkasında büyük alanlar bırakmasına neden olabilir, bu yüzden disiplinli bir defans yapısında tek başına bırakılmamalıdır.<br><br><strong>Çapa (Anchor Man):</strong> Klasik defansif orta sahanın en statik, disiplinli ve risksiz formudur. Savunma dörtlüsünün hemen önüne kelimenin tam anlamıyla demir atar ve pozisyonunu hiçbir hücum aksiyonu için terk etmez. Öncelikli görevi rakip hücumcuların alanlarını daraltmak, pas kanallarını kesmek (interceptions) ve topu kazandığında hiç topla oynamadan, bekletmeden en yakınındaki yetenekli yaratıcılara aktarmaktır. Zihinsel odaklanması (concentration) ve defansif yerleşimi mükemmeldir.",
            icon: "anchor"
        }
    ];

    const cmSlides = [
        {
            title: isEn ? "Central Midfielder (CM) Position and Roles" : "Merkez Orta Saha (Central Midfielder - CM) Mevkisi ve Rolleri",
            text: isEn ? "This is the area in the center of the field where the battle is fought and psychological superiority is won. Central midfield roles have evolved into highly complex structures that combine physical endurance with superior tactical intelligence." : "Sahanın merkezindeki savaşın ve psikolojik üstünlüğün kazanıldığı bölge burasıdır. Merkez orta saha rolleri, fiziksel dayanıklılık ile üstün taktik zekanın birleştirildiği son derece kompleks yapılara dönüşmüştür.",
            icon: "activity"
        },
        {
            title: isEn ? "Mezzala (Half-Winger)" : "Mezzala (Yarı Kanat)",
            text: isEn ? "One of the most debated positions in modern soccer—one on which analysts base their strategies and which wears down opposing defenses the most—is the mezzala (which means “half-winger” in Italian). The player starts the match as a central midfielder (inside midfielder), but when the team has possession, he leaves the center of the field and drifts out toward the “half-spaces” and the wings. The Mezzala plays in a much wider area than a traditional central midfielder, acts as a bridge between attack and defense, and—particularly in 4-3-3 or 3-5-2 formations—takes on the role of a conductor who sets the team’s rhythm.<br><br>The Mezzala’s primary tactical advantage lies in his ability to disrupt the opposing defense’s balance by creating numerical superiority (overload) through the wingers and fullbacks as he moves out wide when the center is tightly defended, and by forming triangles. However, this role carries a significant risk on defense. When the Mezzala joins the attack and moves out wide, massive gaps open up right in the center of the field. As some theorists have criticized, if this vulnerability is not addressed with proper tactical discipline—such as fullbacks tucking in during defense or a defensive rotation—the team’s defensive balance can collapse. Constantly on the move, the Mezzala is under an incredible physical and mental strain." : "Modern futbolun en çok tartışılan, analistlerin üzerine stratejiler kurduğu ve rakip savunmaları en çok yıpratan mevkilerinden biri Mezzala'dır (İtalyanca \"yarı kanat\" anlamına gelir). Bir merkez orta saha (iç oyuncusu) olarak maça başlar, ancak takım topa sahip olduğunda oyunun merkezini terk edip \"yarı-alanlara\" (half-spaces) ve kanatlara doğru genişleyerek (drifting) konumlanır. Mezzala, geleneksel bir merkez orta sahadan çok daha geniş alanda oynar, hücum ile savunma arasında bir köprü görevi görür ve özellikle 4-3-3 veya 3-5-2 dizilişlerinde takımın ritmini belirleyen orkestra şefi rolünü üstlenir.<br><br>Mezzala'nın temel taktiksel avantajı, merkezin katı savunulduğu anlarda kanatlara açılarak kanat oyuncuları ve beklerle yarattığı sayısal üstünlük (overload) ve üçgenler sayesinde rakip savunmanın dengesini alt üst etmesidir. Ancak bu rol, savunmada ciddi bir risk barındırır. Mezzala hücuma katılıp geniş alanlara açıldığında, sahanın tam merkezinde devasa boşluklar oluşur. Bazı teorisyenlerin eleştirdiği üzere, bu zafiyet doğru taktiksel disiplinle (örneğin savunmada sahte beklerin içe kat etmesi veya defansif bir rotasyon) kapatılmazsa takımın savunma dengesi çökebilir. Sürekli hareket halinde olan Mezzala, inanılmaz bir fiziksel ve zihinsel yük altındadır.",
            icon: "wind"
        },
        {
            title: isEn ? "Central Winger / False 10" : "Merkez Kanat Oyuncusu (Central Winger / False 10)",
            text: isEn ? "Unlike a traditional playmaker, this is a highly modern and tactically asymmetrical midfield role in which the player positions himself in the center and, upon receiving the ball, quickly and aggressively dribbles toward the touchline or the wings. It is one of the variations of the “False 10” role.<br><br>Since most teams defend the center of the opponent’s half with a crowded and rigid setup (using two defensive midfielders), the Central Winger, upon receiving the ball, immediately turns toward the spaces between the fullback and the center back to escape this congestion and runs quickly with the ball. This asymmetrical horizontal/vertical movement throws the opposing defense into chaos: Center backs do not want to abandon their positions to track him toward the wing (which would leave the center completely open), while opposing fullbacks cannot decide whether to mark the actual winger they are supposed to cover or the Central Winger rapidly approaching them with the ball from the center. This creates numerical advantages on the wings, such as 3-on-2 or 2-on-1 situations. By making deep use of vertical penetration, this role also distorts the opponent’s defensive shape during off-the-ball play and broadens the team’s attacking repertoire by layering attacks." : "Geleneksel bir oyun kurucunun aksine, merkezde pozisyon alıp topu aldığında hızla taç çizgisine, kanatlara doğru agresif dripling yapan oldukça modern ve taktiksel olarak asimetrik bir orta saha rolüdür. \"Sahte 10 numara\" (False 10) varyasyonlarından biridir.<br><br>Çoğu takım rakip sahada merkezi kalabalık ve katı bir şekilde (iki ön libero ile) savunduğu için, Merkez Kanat oyuncusu merkezdeki bu yoğunluktan (congestion) kaçmak amacıyla topla buluştuğu gibi yüzünü bek ile stoper arasındaki boşluklara dönerek hızla topla birlikte koşar. Bu asimetrik yatay/dikey hareket rakip savunmayı kaosa sürükler: Stoperler pozisyonlarını terk edip onu kanada doğru takip etmek istemez (bu durumda merkez tamamen boşalır), rakip bekler ise kendi tutmaları gereken asıl kanat oyuncusunu mu yoksa merkezden üzerine topla hızla gelen Merkez Kanat oyuncusunu mu karşılayacağına karar veremez. Bu sayede kanatlarda 3'e 2 veya 2'ye 1 gibi sayısal üstünlükler elde edilir. Dikey penetrasyonu derinlemesine kullanan bu rol, topsuz oyunda da rakibin defansif şeklini deforme eder ve atakları katmanlandırarak (layering attacks) takımın hücum yelpazesini genişletir.",
            icon: "fast-forward"
        },
        {
            title: isEn ? "Carrilero (Corridor Player)" : "Carrilero (Koridor Oyuncusu)",
            text: isEn ? "The carrilero is a “runner/carrier” role that constantly covers the horizontal corridor between the central midfield and the touchline, effectively patching up gaps that form, particularly on the flanks of the midfield. While the Mezzala expands outward in an offensive role and helps build the play, the Carrilero makes more defensive or supporting lateral shuttling movements to maintain the team’s balance between defense and attack.<br><br>For example, when the team’s fullback pushes forward to join the attack or when the Mezzala penetrates the opponent’s penalty area, the Carrilero quickly shifts into the vacated wing or half-field corridor to cut off a potential counterattack before it even begins. The Carrilero, the unsung heroes of soccer, are invaluable balancing elements that eliminate the team’s vulnerability on the flanks, particularly in diamond or narrow three-midfielder systems." : "Carrilero, merkez orta saha ile taç çizgisi arasındaki yatay koridoru durmaksızın arşınlayan, özellikle orta sahanın kanatlarında oluşan boşlukları yama gibi kapatan \"koşucu/taşıyıcı\" bir roldür. Mezzala ofansif bir rol olarak dışarı doğru genişlerken ve oyunu kurarken, Carrilero takımın savunma ve hücum dengesini sağlamak için daha çok defansif veya destek amaçlı yatay mekik hareketleri yapar.<br><br>Örneğin, takımın beki ileri çıkıp hücuma katıldığında veya Mezzala rakip ceza sahasına sızdığında, Carrilero boşalan kanat veya yarı alan koridoruna hızla kayarak rakibin olası bir geçiş hücumunu (kontra atak) daha doğmadan keser. Futbolun görünmez işçileri olan Carrilero'lar, özellikle elmas (diamond) veya dar 3'lü orta saha sistemlerinde takımın kanatlardaki kırılganlığını ortadan kaldıran, paha biçilemez denge unsurlarıdır.",
            icon: "arrow-right-circle"
        },
        {
            title: isEn ? "Box-to-Box Midfielder" : "İki Yönlü Orta Saha (Box-to-Box Midfielder)",
            text: isEn ? "As their name suggests, these are players who cover every inch of the field—from their own penalty area (box) to the opponent’s penalty area (box)—and possess tremendous lung capacity, determination, and work rate. Although pure examples of this role have become rarer in modern soccer, their tactical contributions are immense.<br><br>Defensively, they chase down opponents, intercept passes, and assist center backs; when the team gains possession, they join the attack with long-distance dribbles and look for goals by making surprise runs into the penalty area. This role, which was the heart of standard 4-4-2 systems, has evolved as systems like the 4-2-3-1 have become more widespread, leading to their responsibilities being divided into more specific defensive or offensive roles." : "Adından da anlaşılacağı üzere, kendi ceza sahasından (box) rakip ceza sahasına (box) kadar sahanın her karışına ayak basan, muazzam bir akciğer kapasitesine, kararlılığa ve çalışma oranına sahip oyunculardır. Modern futbolda saf örnekleri azalmış olsa da, taktiksel katkıları muazzamdır.<br><br>Defansif olarak rakibi kovalar, pas arasına girer, stoperlere yardım eder; top takıma geçtiğinde ise uzun mesafeli driplinglerle hücuma katılır ve ceza sahasına sürpriz koşular yaparak gol arar. Standard 4-4-2 sistemlerinin kalbi olan bu rol, 4-2-3-1 gibi sistemlerin yaygınlaşmasıyla görevlerinin daha spesifik defansif veya ofansif rollere paylaştırılması nedeniyle evrime uğramıştır.",
            icon: "refresh-ccw"
        },
        {
            title: isEn ? "Classic Central Midfielder" : "Klasik Merkez Orta Saha (Central Midfielder)",
            text: isEn ? "This is a balancing and linking role that performs both defensive and offensive duties at a basic level with simplicity, without straying unnecessarily from the center of the field. The player acts according to tactical instructions (defense, support, or attack).<br><br>He safely retrieves the ball from the defense and carries it to the attacking players, keeps pace with the tempo of the game, and, when necessary, collects loose balls near the edge of the penalty area to reignite the attack." : "Hem savunma hem de hücum görevlerini temel düzeyde, sadelikle yerine getiren, sahanın merkezinden gereksiz yere ayrılmayan dengeleyici ve bağlantı kurucu roldür. Taktiksel talimata göre (savunma, destek veya hücum) davranış gösterir.<br><br>Topu defanstan güvenli bir şekilde alarak hücum oyuncularına taşır, oyunun temposuna ayak uydurur ve gerektiğinde ceza sahası yayı civarında dönen topları toplayarak atağı tazeler.",
            icon: "circle"
        }
    ];

    this.lessonState.currentLessonId = lessonId;
    if (lessonId === 'cb') this.lessonState.slides = cbSlides;
    else if (lessonId === 'fb') this.lessonState.slides = fbSlides;
    else if (lessonId === 'dm') this.lessonState.slides = dmSlides;
    else if (lessonId === 'cm') this.lessonState.slides = cmSlides;
    else this.lessonState.slides = gkSlides;
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
