// --- POZİSYON LİSTESİ ---
const POSITIONS = [ 
    "Kaleci", "Stoper", "Sağ Bek", "Sol Bek", 
    "Defansif Orta Saha", "Orta Saha", "Ofansif Orta Saha", 
    "Sağ Kanat", "Sol Kanat", "Santrafor" 
];

// --- BAŞLANGIÇ VERİTABANI YAPISI ---
const DB = { 
    countries: [
            {
                    "id": 1,
                    "name": "Åland",
                    "flag": "https://flagcdn.com/w80/ax.png",
                    "region": "Avrupa"
            },
            {
                    "id": 2,
                    "name": "Almanya",
                    "flag": "https://flagcdn.com/w80/de.png",
                    "region": "Avrupa"
            },
            {
                    "id": 3,
                    "name": "Andorra",
                    "flag": "https://flagcdn.com/w80/ad.png",
                    "region": "Avrupa"
            },
            {
                    "id": 4,
                    "name": "Arnavutluk",
                    "flag": "https://flagcdn.com/w80/al.png",
                    "region": "Avrupa"
            },
            {
                    "id": 5,
                    "name": "Avusturya",
                    "flag": "https://flagcdn.com/w80/at.png",
                    "region": "Avrupa"
            },
            {
                    "id": 6,
                    "name": "Belarus",
                    "flag": "https://flagcdn.com/w80/by.png",
                    "region": "Avrupa"
            },
            {
                    "id": 7,
                    "name": "Belçika",
                    "flag": "https://flagcdn.com/w80/be.png",
                    "region": "Avrupa"
            },
            {
                    "id": 8,
                    "name": "Birleşik Krallık",
                    "flag": "https://flagcdn.com/w80/gb.png",
                    "region": "Avrupa"
            },
            {
                    "id": 9,
                    "name": "Bosna-Hersek",
                    "flag": "https://flagcdn.com/w80/ba.png",
                    "region": "Avrupa"
            },
            {
                    "id": 10,
                    "name": "Bulgaristan",
                    "flag": "https://flagcdn.com/w80/bg.png",
                    "region": "Avrupa"
            },
            {
                    "id": 11,
                    "name": "Cebelitarık",
                    "flag": "https://flagcdn.com/w80/gi.png",
                    "region": "Avrupa"
            },
            {
                    "id": 12,
                    "name": "çekya",
                    "flag": "https://flagcdn.com/w80/cz.png",
                    "region": "Avrupa"
            },
            {
                    "id": 13,
                    "name": "Danimarka",
                    "flag": "https://flagcdn.com/w80/dk.png",
                    "region": "Avrupa"
            },
            {
                    "id": 14,
                    "name": "Estonya",
                    "flag": "https://flagcdn.com/w80/ee.png",
                    "region": "Avrupa"
            },
            {
                    "id": 15,
                    "name": "Faroe Adaları",
                    "flag": "https://flagcdn.com/w80/fo.png",
                    "region": "Avrupa"
            },
            {
                    "id": 16,
                    "name": "Finlandiya",
                    "flag": "https://flagcdn.com/w80/fi.png",
                    "region": "Avrupa"
            },
            {
                    "id": 17,
                    "name": "Fransa",
                    "flag": "https://flagcdn.com/w80/fr.png",
                    "region": "Avrupa"
            },
            {
                    "id": 18,
                    "name": "Guernsey",
                    "flag": "https://flagcdn.com/w80/gg.png",
                    "region": "Avrupa"
            },
            {
                    "id": 19,
                    "name": "Hırvatistan",
                    "flag": "https://flagcdn.com/w80/hr.png",
                    "region": "Avrupa"
            },
            {
                    "id": 20,
                    "name": "Hollanda",
                    "flag": "https://flagcdn.com/w80/nl.png",
                    "region": "Avrupa"
            },
            {
                    "id": 21,
                    "name": "İrlanda",
                    "flag": "https://flagcdn.com/w80/ie.png",
                    "region": "Avrupa"
            },
            {
                    "id": 22,
                    "name": "İspanya",
                    "flag": "https://flagcdn.com/w80/es.png",
                    "region": "Avrupa"
            },
            {
                    "id": 23,
                    "name": "İsveç",
                    "flag": "https://flagcdn.com/w80/se.png",
                    "region": "Avrupa"
            },
            {
                    "id": 24,
                    "name": "İsviçre",
                    "flag": "https://flagcdn.com/w80/ch.png",
                    "region": "Avrupa"
            },
            {
                    "id": 25,
                    "name": "İtalya",
                    "flag": "https://flagcdn.com/w80/it.png",
                    "region": "Avrupa"
            },
            {
                    "id": 26,
                    "name": "İzlanda",
                    "flag": "https://flagcdn.com/w80/is.png",
                    "region": "Avrupa"
            },
            {
                    "id": 27,
                    "name": "Jersey",
                    "flag": "https://flagcdn.com/w80/je.png",
                    "region": "Avrupa"
            },
            {
                    "id": 28,
                    "name": "Karadağ",
                    "flag": "https://flagcdn.com/w80/me.png",
                    "region": "Avrupa"
            },
            {
                    "id": 29,
                    "name": "Kıbrıs",
                    "flag": "https://flagcdn.com/w80/cy.png",
                    "region": "Avrupa"
            },
            {
                    "id": 30,
                    "name": "Kosova",
                    "flag": "https://flagcdn.com/w80/xk.png",
                    "region": "Avrupa"
            },
            {
                    "id": 31,
                    "name": "Kuzey Makedonya",
                    "flag": "https://flagcdn.com/w80/mk.png",
                    "region": "Avrupa"
            },
            {
                    "id": 32,
                    "name": "Letonya",
                    "flag": "https://flagcdn.com/w80/lv.png",
                    "region": "Avrupa"
            },
            {
                    "id": 33,
                    "name": "Lihtenştayn",
                    "flag": "https://flagcdn.com/w80/li.png",
                    "region": "Avrupa"
            },
            {
                    "id": 34,
                    "name": "Litvanya",
                    "flag": "https://flagcdn.com/w80/lt.png",
                    "region": "Avrupa"
            },
            {
                    "id": 35,
                    "name": "Lüksemburg",
                    "flag": "https://flagcdn.com/w80/lu.png",
                    "region": "Avrupa"
            },
            {
                    "id": 36,
                    "name": "Macaristan",
                    "flag": "https://flagcdn.com/w80/hu.png",
                    "region": "Avrupa"
            },
            {
                    "id": 37,
                    "name": "Malta",
                    "flag": "https://flagcdn.com/w80/mt.png",
                    "region": "Avrupa"
            },
            {
                    "id": 38,
                    "name": "Man Adası",
                    "flag": "https://flagcdn.com/w80/im.png",
                    "region": "Avrupa"
            },
            {
                    "id": 39,
                    "name": "Moldova",
                    "flag": "https://flagcdn.com/w80/md.png",
                    "region": "Avrupa"
            },
            {
                    "id": 40,
                    "name": "Monako",
                    "flag": "https://flagcdn.com/w80/mc.png",
                    "region": "Avrupa"
            },
            {
                    "id": 41,
                    "name": "Norveç",
                    "flag": "https://flagcdn.com/w80/no.png",
                    "region": "Avrupa"
            },
            {
                    "id": 42,
                    "name": "Polonya",
                    "flag": "https://flagcdn.com/w80/pl.png",
                    "region": "Avrupa"
            },
            {
                    "id": 43,
                    "name": "Portekiz",
                    "flag": "https://flagcdn.com/w80/pt.png",
                    "region": "Avrupa"
            },
            {
                    "id": 44,
                    "name": "Romanya",
                    "flag": "https://flagcdn.com/w80/ro.png",
                    "region": "Avrupa"
            },
            {
                    "id": 45,
                    "name": "Rusya",
                    "flag": "https://flagcdn.com/w80/ru.png",
                    "region": "Avrupa"
            },
            {
                    "id": 46,
                    "name": "San Marino",
                    "flag": "https://flagcdn.com/w80/sm.png",
                    "region": "Avrupa"
            },
            {
                    "id": 47,
                    "name": "Sırbistan",
                    "flag": "https://flagcdn.com/w80/rs.png",
                    "region": "Avrupa"
            },
            {
                    "id": 48,
                    "name": "Slovakya",
                    "flag": "https://flagcdn.com/w80/sk.png",
                    "region": "Avrupa"
            },
            {
                    "id": 49,
                    "name": "Slovenya",
                    "flag": "https://flagcdn.com/w80/si.png",
                    "region": "Avrupa"
            },
            {
                    "id": 50,
                    "name": "Svalbard ve Jan Mayen",
                    "flag": "https://flagcdn.com/w80/sj.png",
                    "region": "Avrupa"
            },
            {
                    "id": 51,
                    "name": "Ukrayna",
                    "flag": "https://flagcdn.com/w80/ua.png",
                    "region": "Avrupa"
            },
            {
                    "id": 52,
                    "name": "Vatikan",
                    "flag": "https://flagcdn.com/w80/va.png",
                    "region": "Avrupa"
            },
            {
                    "id": 53,
                    "name": "Yunanistan",
                    "flag": "https://flagcdn.com/w80/gr.png",
                    "region": "Avrupa"
            },
            {
                    "id": 54,
                    "name": "Angola",
                    "flag": "https://flagcdn.com/w80/ao.png",
                    "region": "Afrika"
            },
            {
                    "id": 55,
                    "name": "Benin",
                    "flag": "https://flagcdn.com/w80/bj.png",
                    "region": "Afrika"
            },
            {
                    "id": 56,
                    "name": "Botsvana",
                    "flag": "https://flagcdn.com/w80/bw.png",
                    "region": "Afrika"
            },
            {
                    "id": 57,
                    "name": "Britanya Hint Okyanusu Toprakları",
                    "flag": "https://flagcdn.com/w80/io.png",
                    "region": "Afrika"
            },
            {
                    "id": 58,
                    "name": "Burkina Faso",
                    "flag": "https://flagcdn.com/w80/bf.png",
                    "region": "Afrika"
            },
            {
                    "id": 59,
                    "name": "Burundi",
                    "flag": "https://flagcdn.com/w80/bi.png",
                    "region": "Afrika"
            },
            {
                    "id": 60,
                    "name": "Cezayir",
                    "flag": "https://flagcdn.com/w80/dz.png",
                    "region": "Afrika"
            },
            {
                    "id": 61,
                    "name": "Cibuti",
                    "flag": "https://flagcdn.com/w80/dj.png",
                    "region": "Afrika"
            },
            {
                    "id": 62,
                    "name": "çad",
                    "flag": "https://flagcdn.com/w80/td.png",
                    "region": "Afrika"
            },
            {
                    "id": 63,
                    "name": "Ekvator Ginesi",
                    "flag": "https://flagcdn.com/w80/gq.png",
                    "region": "Afrika"
            },
            {
                    "id": 64,
                    "name": "Eritre",
                    "flag": "https://flagcdn.com/w80/er.png",
                    "region": "Afrika"
            },
            {
                    "id": 65,
                    "name": "Esvatini",
                    "flag": "https://flagcdn.com/w80/sz.png",
                    "region": "Afrika"
            },
            {
                    "id": 66,
                    "name": "Etiyopya",
                    "flag": "https://flagcdn.com/w80/et.png",
                    "region": "Afrika"
            },
            {
                    "id": 67,
                    "name": "Fas",
                    "flag": "https://flagcdn.com/w80/ma.png",
                    "region": "Afrika"
            },
            {
                    "id": 68,
                    "name": "Fildişi Sahili",
                    "flag": "https://flagcdn.com/w80/ci.png",
                    "region": "Afrika"
            },
            {
                    "id": 69,
                    "name": "Gabon",
                    "flag": "https://flagcdn.com/w80/ga.png",
                    "region": "Afrika"
            },
            {
                    "id": 70,
                    "name": "Gambiya",
                    "flag": "https://flagcdn.com/w80/gm.png",
                    "region": "Afrika"
            },
            {
                    "id": 71,
                    "name": "Gana",
                    "flag": "https://flagcdn.com/w80/gh.png",
                    "region": "Afrika"
            },
            {
                    "id": 72,
                    "name": "Gine",
                    "flag": "https://flagcdn.com/w80/gn.png",
                    "region": "Afrika"
            },
            {
                    "id": 73,
                    "name": "Gine-Bissau",
                    "flag": "https://flagcdn.com/w80/gw.png",
                    "region": "Afrika"
            },
            {
                    "id": 74,
                    "name": "Güney Afrika",
                    "flag": "https://flagcdn.com/w80/za.png",
                    "region": "Afrika"
            },
            {
                    "id": 75,
                    "name": "Güney Sudan",
                    "flag": "https://flagcdn.com/w80/ss.png",
                    "region": "Afrika"
            },
            {
                    "id": 76,
                    "name": "Kamerun",
                    "flag": "https://flagcdn.com/w80/cm.png",
                    "region": "Afrika"
            },
            {
                    "id": 77,
                    "name": "Kenya",
                    "flag": "https://flagcdn.com/w80/ke.png",
                    "region": "Afrika"
            },
            {
                    "id": 78,
                    "name": "Komorlar",
                    "flag": "https://flagcdn.com/w80/km.png",
                    "region": "Afrika"
            },
            {
                    "id": 79,
                    "name": "Kongo Cumhuriyeti",
                    "flag": "https://flagcdn.com/w80/cg.png",
                    "region": "Afrika"
            },
            {
                    "id": 80,
                    "name": "Kongo Demokratik Cumhuriyeti",
                    "flag": "https://flagcdn.com/w80/cd.png",
                    "region": "Afrika"
            },
            {
                    "id": 81,
                    "name": "Lesotho",
                    "flag": "https://flagcdn.com/w80/ls.png",
                    "region": "Afrika"
            },
            {
                    "id": 82,
                    "name": "Liberya",
                    "flag": "https://flagcdn.com/w80/lr.png",
                    "region": "Afrika"
            },
            {
                    "id": 83,
                    "name": "Libya",
                    "flag": "https://flagcdn.com/w80/ly.png",
                    "region": "Afrika"
            },
            {
                    "id": 84,
                    "name": "Madagaskar",
                    "flag": "https://flagcdn.com/w80/mg.png",
                    "region": "Afrika"
            },
            {
                    "id": 85,
                    "name": "Malavi",
                    "flag": "https://flagcdn.com/w80/mw.png",
                    "region": "Afrika"
            },
            {
                    "id": 86,
                    "name": "Mali",
                    "flag": "https://flagcdn.com/w80/ml.png",
                    "region": "Afrika"
            },
            {
                    "id": 87,
                    "name": "Mauritius",
                    "flag": "https://flagcdn.com/w80/mu.png",
                    "region": "Afrika"
            },
            {
                    "id": 88,
                    "name": "Mayotte",
                    "flag": "https://flagcdn.com/w80/yt.png",
                    "region": "Afrika"
            },
            {
                    "id": 89,
                    "name": "Mısır",
                    "flag": "https://flagcdn.com/w80/eg.png",
                    "region": "Afrika"
            },
            {
                    "id": 90,
                    "name": "Moritanya",
                    "flag": "https://flagcdn.com/w80/mr.png",
                    "region": "Afrika"
            },
            {
                    "id": 91,
                    "name": "Mozambik",
                    "flag": "https://flagcdn.com/w80/mz.png",
                    "region": "Afrika"
            },
            {
                    "id": 92,
                    "name": "Namibya",
                    "flag": "https://flagcdn.com/w80/na.png",
                    "region": "Afrika"
            },
            {
                    "id": 93,
                    "name": "Nijer",
                    "flag": "https://flagcdn.com/w80/ne.png",
                    "region": "Afrika"
            },
            {
                    "id": 94,
                    "name": "Nijerya",
                    "flag": "https://flagcdn.com/w80/ng.png",
                    "region": "Afrika"
            },
            {
                    "id": 95,
                    "name": "Orta Afrika Cumhuriyeti",
                    "flag": "https://flagcdn.com/w80/cf.png",
                    "region": "Afrika"
            },
            {
                    "id": 96,
                    "name": "Réunion",
                    "flag": "https://flagcdn.com/w80/re.png",
                    "region": "Afrika"
            },
            {
                    "id": 97,
                    "name": "Ruanda",
                    "flag": "https://flagcdn.com/w80/rw.png",
                    "region": "Afrika"
            },
            {
                    "id": 98,
                    "name": "Sahra Demokratik Arap Cumhuriyeti",
                    "flag": "https://flagcdn.com/w80/eh.png",
                    "region": "Afrika"
            },
            {
                    "id": 99,
                    "name": "Saint Helena",
                    "flag": "https://flagcdn.com/w80/sh.png",
                    "region": "Afrika"
            },
            {
                    "id": 100,
                    "name": "São Tomé ve Príncipe",
                    "flag": "https://flagcdn.com/w80/st.png",
                    "region": "Afrika"
            },
            {
                    "id": 101,
                    "name": "Senegal",
                    "flag": "https://flagcdn.com/w80/sn.png",
                    "region": "Afrika"
            },
            {
                    "id": 102,
                    "name": "Seyşeller",
                    "flag": "https://flagcdn.com/w80/sc.png",
                    "region": "Afrika"
            },
            {
                    "id": 103,
                    "name": "Sierra Leone",
                    "flag": "https://flagcdn.com/w80/sl.png",
                    "region": "Afrika"
            },
            {
                    "id": 104,
                    "name": "Somali",
                    "flag": "https://flagcdn.com/w80/so.png",
                    "region": "Afrika"
            },
            {
                    "id": 105,
                    "name": "Sudan",
                    "flag": "https://flagcdn.com/w80/sd.png",
                    "region": "Afrika"
            },
            {
                    "id": 106,
                    "name": "Tanzanya",
                    "flag": "https://flagcdn.com/w80/tz.png",
                    "region": "Afrika"
            },
            {
                    "id": 107,
                    "name": "Togo",
                    "flag": "https://flagcdn.com/w80/tg.png",
                    "region": "Afrika"
            },
            {
                    "id": 108,
                    "name": "Tunus",
                    "flag": "https://flagcdn.com/w80/tn.png",
                    "region": "Afrika"
            },
            {
                    "id": 109,
                    "name": "Uganda",
                    "flag": "https://flagcdn.com/w80/ug.png",
                    "region": "Afrika"
            },
            {
                    "id": 110,
                    "name": "Yeşil Burun",
                    "flag": "https://flagcdn.com/w80/cv.png",
                    "region": "Afrika"
            },
            {
                    "id": 111,
                    "name": "Zambiya",
                    "flag": "https://flagcdn.com/w80/zm.png",
                    "region": "Afrika"
            },
            {
                    "id": 112,
                    "name": "Zimbabve",
                    "flag": "https://flagcdn.com/w80/zw.png",
                    "region": "Afrika"
            },
            {
                    "id": 113,
                    "name": "ABD Virjin Adaları",
                    "flag": "https://flagcdn.com/w80/vi.png",
                    "region": "Amerika"
            },
            {
                    "id": 114,
                    "name": "Amerika Birleşik Devletleri",
                    "flag": "https://flagcdn.com/w80/us.png",
                    "region": "Amerika"
            },
            {
                    "id": 115,
                    "name": "Amerika Birleşik Devletleri Küçük Dış Adaları",
                    "flag": "https://flagcdn.com/w80/um.png",
                    "region": "Amerika"
            },
            {
                    "id": 116,
                    "name": "Anguilla",
                    "flag": "https://flagcdn.com/w80/ai.png",
                    "region": "Amerika"
            },
            {
                    "id": 117,
                    "name": "Antigua ve Barbuda",
                    "flag": "https://flagcdn.com/w80/ag.png",
                    "region": "Amerika"
            },
            {
                    "id": 118,
                    "name": "Arjantin",
                    "flag": "https://flagcdn.com/w80/ar.png",
                    "region": "Amerika"
            },
            {
                    "id": 119,
                    "name": "Aruba",
                    "flag": "https://flagcdn.com/w80/aw.png",
                    "region": "Amerika"
            },
            {
                    "id": 120,
                    "name": "Bahamalar",
                    "flag": "https://flagcdn.com/w80/bs.png",
                    "region": "Amerika"
            },
            {
                    "id": 121,
                    "name": "Barbados",
                    "flag": "https://flagcdn.com/w80/bb.png",
                    "region": "Amerika"
            },
            {
                    "id": 122,
                    "name": "Belize",
                    "flag": "https://flagcdn.com/w80/bz.png",
                    "region": "Amerika"
            },
            {
                    "id": 123,
                    "name": "Bermuda",
                    "flag": "https://flagcdn.com/w80/bm.png",
                    "region": "Amerika"
            },
            {
                    "id": 124,
                    "name": "Bolivya",
                    "flag": "https://flagcdn.com/w80/bo.png",
                    "region": "Amerika"
            },
            {
                    "id": 125,
                    "name": "Brezilya",
                    "flag": "https://flagcdn.com/w80/br.png",
                    "region": "Amerika"
            },
            {
                    "id": 126,
                    "name": "Cayman Adaları",
                    "flag": "https://flagcdn.com/w80/ky.png",
                    "region": "Amerika"
            },
            {
                    "id": 127,
                    "name": "Curaçao",
                    "flag": "https://flagcdn.com/w80/cw.png",
                    "region": "Amerika"
            },
            {
                    "id": 128,
                    "name": "Dominik Cumhuriyeti",
                    "flag": "https://flagcdn.com/w80/do.png",
                    "region": "Amerika"
            },
            {
                    "id": 129,
                    "name": "Dominika",
                    "flag": "https://flagcdn.com/w80/dm.png",
                    "region": "Amerika"
            },
            {
                    "id": 130,
                    "name": "Ekvador",
                    "flag": "https://flagcdn.com/w80/ec.png",
                    "region": "Amerika"
            },
            {
                    "id": 131,
                    "name": "El Salvador",
                    "flag": "https://flagcdn.com/w80/sv.png",
                    "region": "Amerika"
            },
            {
                    "id": 132,
                    "name": "Falkland (Malvina) Adaları",
                    "flag": "https://flagcdn.com/w80/fk.png",
                    "region": "Amerika"
            },
            {
                    "id": 133,
                    "name": "Fransız Guyanası",
                    "flag": "https://flagcdn.com/w80/gf.png",
                    "region": "Amerika"
            },
            {
                    "id": 134,
                    "name": "Grenada",
                    "flag": "https://flagcdn.com/w80/gd.png",
                    "region": "Amerika"
            },
            {
                    "id": 135,
                    "name": "Grönland",
                    "flag": "https://flagcdn.com/w80/gl.png",
                    "region": "Amerika"
            },
            {
                    "id": 136,
                    "name": "Guadeloupe",
                    "flag": "https://flagcdn.com/w80/gp.png",
                    "region": "Amerika"
            },
            {
                    "id": 137,
                    "name": "Guatemala",
                    "flag": "https://flagcdn.com/w80/gt.png",
                    "region": "Amerika"
            },
            {
                    "id": 138,
                    "name": "Guyana",
                    "flag": "https://flagcdn.com/w80/gy.png",
                    "region": "Amerika"
            },
            {
                    "id": 139,
                    "name": "Haiti",
                    "flag": "https://flagcdn.com/w80/ht.png",
                    "region": "Amerika"
            },
            {
                    "id": 140,
                    "name": "Honduras",
                    "flag": "https://flagcdn.com/w80/hn.png",
                    "region": "Amerika"
            },
            {
                    "id": 141,
                    "name": "Jamaika",
                    "flag": "https://flagcdn.com/w80/jm.png",
                    "region": "Amerika"
            },
            {
                    "id": 142,
                    "name": "Kanada",
                    "flag": "https://flagcdn.com/w80/ca.png",
                    "region": "Amerika"
            },
            {
                    "id": 143,
                    "name": "Karayip Hollandası",
                    "flag": "https://flagcdn.com/w80/bq.png",
                    "region": "Amerika"
            },
            {
                    "id": 144,
                    "name": "Kolombiya",
                    "flag": "https://flagcdn.com/w80/co.png",
                    "region": "Amerika"
            },
            {
                    "id": 145,
                    "name": "Kosta Rika",
                    "flag": "https://flagcdn.com/w80/cr.png",
                    "region": "Amerika"
            },
            {
                    "id": 146,
                    "name": "Küba",
                    "flag": "https://flagcdn.com/w80/cu.png",
                    "region": "Amerika"
            },
            {
                    "id": 147,
                    "name": "Martinik",
                    "flag": "https://flagcdn.com/w80/mq.png",
                    "region": "Amerika"
            },
            {
                    "id": 148,
                    "name": "Meksika",
                    "flag": "https://flagcdn.com/w80/mx.png",
                    "region": "Amerika"
            },
            {
                    "id": 149,
                    "name": "Montserrat",
                    "flag": "https://flagcdn.com/w80/ms.png",
                    "region": "Amerika"
            },
            {
                    "id": 150,
                    "name": "Nikaragua",
                    "flag": "https://flagcdn.com/w80/ni.png",
                    "region": "Amerika"
            },
            {
                    "id": 151,
                    "name": "Panama",
                    "flag": "https://flagcdn.com/w80/pa.png",
                    "region": "Amerika"
            },
            {
                    "id": 152,
                    "name": "Paraguay",
                    "flag": "https://flagcdn.com/w80/py.png",
                    "region": "Amerika"
            },
            {
                    "id": 153,
                    "name": "Peru",
                    "flag": "https://flagcdn.com/w80/pe.png",
                    "region": "Amerika"
            },
            {
                    "id": 154,
                    "name": "Porto Riko",
                    "flag": "https://flagcdn.com/w80/pr.png",
                    "region": "Amerika"
            },
            {
                    "id": 155,
                    "name": "Saint Barthélemy",
                    "flag": "https://flagcdn.com/w80/bl.png",
                    "region": "Amerika"
            },
            {
                    "id": 156,
                    "name": "Saint Kitts ve Nevis",
                    "flag": "https://flagcdn.com/w80/kn.png",
                    "region": "Amerika"
            },
            {
                    "id": 157,
                    "name": "Saint Lucia",
                    "flag": "https://flagcdn.com/w80/lc.png",
                    "region": "Amerika"
            },
            {
                    "id": 158,
                    "name": "Saint Martin",
                    "flag": "https://flagcdn.com/w80/mf.png",
                    "region": "Amerika"
            },
            {
                    "id": 159,
                    "name": "Saint Pierre ve Miquelon",
                    "flag": "https://flagcdn.com/w80/pm.png",
                    "region": "Amerika"
            },
            {
                    "id": 160,
                    "name": "Saint Vincent ve Grenadinler",
                    "flag": "https://flagcdn.com/w80/vc.png",
                    "region": "Amerika"
            },
            {
                    "id": 161,
                    "name": "Sint Maarten",
                    "flag": "https://flagcdn.com/w80/sx.png",
                    "region": "Amerika"
            },
            {
                    "id": 162,
                    "name": "Surinam",
                    "flag": "https://flagcdn.com/w80/sr.png",
                    "region": "Amerika"
            },
            {
                    "id": 163,
                    "name": "şili",
                    "flag": "https://flagcdn.com/w80/cl.png",
                    "region": "Amerika"
            },
            {
                    "id": 164,
                    "name": "Trinidad ve Tobago",
                    "flag": "https://flagcdn.com/w80/tt.png",
                    "region": "Amerika"
            },
            {
                    "id": 165,
                    "name": "Turks ve Caicos Adaları",
                    "flag": "https://flagcdn.com/w80/tc.png",
                    "region": "Amerika"
            },
            {
                    "id": 166,
                    "name": "Uruguay",
                    "flag": "https://flagcdn.com/w80/uy.png",
                    "region": "Amerika"
            },
            {
                    "id": 167,
                    "name": "Venezuela",
                    "flag": "https://flagcdn.com/w80/ve.png",
                    "region": "Amerika"
            },
            {
                    "id": 168,
                    "name": "Virjin Adaları",
                    "flag": "https://flagcdn.com/w80/vg.png",
                    "region": "Amerika"
            },
            {
                    "id": 169,
                    "name": "Afganistan",
                    "flag": "https://flagcdn.com/w80/af.png",
                    "region": "Asya"
            },
            {
                    "id": 170,
                    "name": "Azerbaycan",
                    "flag": "https://flagcdn.com/w80/az.png",
                    "region": "Asya"
            },
            {
                    "id": 171,
                    "name": "Bahreyn",
                    "flag": "https://flagcdn.com/w80/bh.png",
                    "region": "Asya"
            },
            {
                    "id": 172,
                    "name": "Bangladeş",
                    "flag": "https://flagcdn.com/w80/bd.png",
                    "region": "Asya"
            },
            {
                    "id": 173,
                    "name": "Birleşik Arap Emirlikleri",
                    "flag": "https://flagcdn.com/w80/ae.png",
                    "region": "Asya"
            },
            {
                    "id": 174,
                    "name": "Brunei",
                    "flag": "https://flagcdn.com/w80/bn.png",
                    "region": "Asya"
            },
            {
                    "id": 175,
                    "name": "Butan",
                    "flag": "https://flagcdn.com/w80/bt.png",
                    "region": "Asya"
            },
            {
                    "id": 176,
                    "name": "çin",
                    "flag": "https://flagcdn.com/w80/cn.png",
                    "region": "Asya"
            },
            {
                    "id": 177,
                    "name": "Doğu Timor",
                    "flag": "https://flagcdn.com/w80/tl.png",
                    "region": "Asya"
            },
            {
                    "id": 178,
                    "name": "Endonezya",
                    "flag": "https://flagcdn.com/w80/id.png",
                    "region": "Asya"
            },
            {
                    "id": 179,
                    "name": "Ermenistan",
                    "flag": "https://flagcdn.com/w80/am.png",
                    "region": "Asya"
            },
            {
                    "id": 180,
                    "name": "Filipinler",
                    "flag": "https://flagcdn.com/w80/ph.png",
                    "region": "Asya"
            },
            {
                    "id": 181,
                    "name": "Filistin",
                    "flag": "https://flagcdn.com/w80/ps.png",
                    "region": "Asya"
            },
            {
                    "id": 182,
                    "name": "Güney Kore",
                    "flag": "https://flagcdn.com/w80/kr.png",
                    "region": "Asya"
            },
            {
                    "id": 183,
                    "name": "Gürcistan",
                    "flag": "https://flagcdn.com/w80/ge.png",
                    "region": "Asya"
            },
            {
                    "id": 184,
                    "name": "Hindistan",
                    "flag": "https://flagcdn.com/w80/in.png",
                    "region": "Asya"
            },
            {
                    "id": 185,
                    "name": "Hong Kong",
                    "flag": "https://flagcdn.com/w80/hk.png",
                    "region": "Asya"
            },
            {
                    "id": 186,
                    "name": "Irak",
                    "flag": "https://flagcdn.com/w80/iq.png",
                    "region": "Asya"
            },
            {
                    "id": 187,
                    "name": "İran",
                    "flag": "https://flagcdn.com/w80/ir.png",
                    "region": "Asya"
            },
            {
                    "id": 188,
                    "name": "İsrail",
                    "flag": "https://flagcdn.com/w80/il.png",
                    "region": "Asya"
            },
            {
                    "id": 189,
                    "name": "Japonya",
                    "flag": "https://flagcdn.com/w80/jp.png",
                    "region": "Asya"
            },
            {
                    "id": 190,
                    "name": "Kamboçya",
                    "flag": "https://flagcdn.com/w80/kh.png",
                    "region": "Asya"
            },
            {
                    "id": 191,
                    "name": "Katar",
                    "flag": "https://flagcdn.com/w80/qa.png",
                    "region": "Asya"
            },
            {
                    "id": 192,
                    "name": "Kazakistan",
                    "flag": "https://flagcdn.com/w80/kz.png",
                    "region": "Asya"
            },
            {
                    "id": 193,
                    "name": "Kırgızistan",
                    "flag": "https://flagcdn.com/w80/kg.png",
                    "region": "Asya"
            },
            {
                    "id": 194,
                    "name": "Kuveyt",
                    "flag": "https://flagcdn.com/w80/kw.png",
                    "region": "Asya"
            },
            {
                    "id": 195,
                    "name": "Kuzey Kore",
                    "flag": "https://flagcdn.com/w80/kp.png",
                    "region": "Asya"
            },
            {
                    "id": 196,
                    "name": "Laos",
                    "flag": "https://flagcdn.com/w80/la.png",
                    "region": "Asya"
            },
            {
                    "id": 197,
                    "name": "Lübnan",
                    "flag": "https://flagcdn.com/w80/lb.png",
                    "region": "Asya"
            },
            {
                    "id": 198,
                    "name": "Makao",
                    "flag": "https://flagcdn.com/w80/mo.png",
                    "region": "Asya"
            },
            {
                    "id": 199,
                    "name": "Maldivler",
                    "flag": "https://flagcdn.com/w80/mv.png",
                    "region": "Asya"
            },
            {
                    "id": 200,
                    "name": "Malezya",
                    "flag": "https://flagcdn.com/w80/my.png",
                    "region": "Asya"
            },
            {
                    "id": 201,
                    "name": "Moğolistan",
                    "flag": "https://flagcdn.com/w80/mn.png",
                    "region": "Asya"
            },
            {
                    "id": 202,
                    "name": "Myanmar",
                    "flag": "https://flagcdn.com/w80/mm.png",
                    "region": "Asya"
            },
            {
                    "id": 203,
                    "name": "Nepal",
                    "flag": "https://flagcdn.com/w80/np.png",
                    "region": "Asya"
            },
            {
                    "id": 204,
                    "name": "özbekistan",
                    "flag": "https://flagcdn.com/w80/uz.png",
                    "region": "Asya"
            },
            {
                    "id": 205,
                    "name": "Pakistan",
                    "flag": "https://flagcdn.com/w80/pk.png",
                    "region": "Asya"
            },
            {
                    "id": 206,
                    "name": "Singapur",
                    "flag": "https://flagcdn.com/w80/sg.png",
                    "region": "Asya"
            },
            {
                    "id": 207,
                    "name": "Sri Lanka",
                    "flag": "https://flagcdn.com/w80/lk.png",
                    "region": "Asya"
            },
            {
                    "id": 208,
                    "name": "Suriye",
                    "flag": "https://flagcdn.com/w80/sy.png",
                    "region": "Asya"
            },
            {
                    "id": 209,
                    "name": "Suudi Arabistan",
                    "flag": "https://flagcdn.com/w80/sa.png",
                    "region": "Asya"
            },
            {
                    "id": 210,
                    "name": "Tacikistan",
                    "flag": "https://flagcdn.com/w80/tj.png",
                    "region": "Asya"
            },
            {
                    "id": 211,
                    "name": "Tayland",
                    "flag": "https://flagcdn.com/w80/th.png",
                    "region": "Asya"
            },
            {
                    "id": 212,
                    "name": "Tayvan",
                    "flag": "https://flagcdn.com/w80/tw.png",
                    "region": "Asya"
            },
            {
                    "id": 213,
                    "name": "Türkiye",
                    "flag": "https://flagcdn.com/w80/tr.png",
                    "region": "Asya"
            },
            {
                    "id": 214,
                    "name": "Türkmenistan",
                    "flag": "https://flagcdn.com/w80/tm.png",
                    "region": "Asya"
            },
            {
                    "id": 215,
                    "name": "Umman",
                    "flag": "https://flagcdn.com/w80/om.png",
                    "region": "Asya"
            },
            {
                    "id": 216,
                    "name": "ürdün",
                    "flag": "https://flagcdn.com/w80/jo.png",
                    "region": "Asya"
            },
            {
                    "id": 217,
                    "name": "Vietnam",
                    "flag": "https://flagcdn.com/w80/vn.png",
                    "region": "Asya"
            },
            {
                    "id": 218,
                    "name": "Yemen",
                    "flag": "https://flagcdn.com/w80/ye.png",
                    "region": "Asya"
            },
            {
                    "id": 219,
                    "name": "Amerikan Samoası",
                    "flag": "https://flagcdn.com/w80/as.png",
                    "region": "Okyanusya"
            },
            {
                    "id": 220,
                    "name": "Avustralya",
                    "flag": "https://flagcdn.com/w80/au.png",
                    "region": "Okyanusya"
            },
            {
                    "id": 221,
                    "name": "Bağımsız Samoa Devleti",
                    "flag": "https://flagcdn.com/w80/ws.png",
                    "region": "Okyanusya"
            },
            {
                    "id": 222,
                    "name": "Christmas Adası",
                    "flag": "https://flagcdn.com/w80/cx.png",
                    "region": "Okyanusya"
            },
            {
                    "id": 223,
                    "name": "Cocos (Keeling) Adaları",
                    "flag": "https://flagcdn.com/w80/cc.png",
                    "region": "Okyanusya"
            },
            {
                    "id": 224,
                    "name": "Cook Adaları",
                    "flag": "https://flagcdn.com/w80/ck.png",
                    "region": "Okyanusya"
            },
            {
                    "id": 225,
                    "name": "Fiji",
                    "flag": "https://flagcdn.com/w80/fj.png",
                    "region": "Okyanusya"
            },
            {
                    "id": 226,
                    "name": "Fransız Polinezyası",
                    "flag": "https://flagcdn.com/w80/pf.png",
                    "region": "Okyanusya"
            },
            {
                    "id": 227,
                    "name": "Guam",
                    "flag": "https://flagcdn.com/w80/gu.png",
                    "region": "Okyanusya"
            },
            {
                    "id": 228,
                    "name": "Kiribati",
                    "flag": "https://flagcdn.com/w80/ki.png",
                    "region": "Okyanusya"
            },
            {
                    "id": 229,
                    "name": "Kuzey Mariana Adaları",
                    "flag": "https://flagcdn.com/w80/mp.png",
                    "region": "Okyanusya"
            },
            {
                    "id": 230,
                    "name": "Marshall Adaları",
                    "flag": "https://flagcdn.com/w80/mh.png",
                    "region": "Okyanusya"
            },
            {
                    "id": 231,
                    "name": "Mikronezya",
                    "flag": "https://flagcdn.com/w80/fm.png",
                    "region": "Okyanusya"
            },
            {
                    "id": 232,
                    "name": "Nauru",
                    "flag": "https://flagcdn.com/w80/nr.png",
                    "region": "Okyanusya"
            },
            {
                    "id": 233,
                    "name": "Niue",
                    "flag": "https://flagcdn.com/w80/nu.png",
                    "region": "Okyanusya"
            },
            {
                    "id": 234,
                    "name": "Norfolk Adası",
                    "flag": "https://flagcdn.com/w80/nf.png",
                    "region": "Okyanusya"
            },
            {
                    "id": 235,
                    "name": "Palau",
                    "flag": "https://flagcdn.com/w80/pw.png",
                    "region": "Okyanusya"
            },
            {
                    "id": 236,
                    "name": "Papua Yeni Gine",
                    "flag": "https://flagcdn.com/w80/pg.png",
                    "region": "Okyanusya"
            },
            {
                    "id": 237,
                    "name": "Pitcairn Adaları",
                    "flag": "https://flagcdn.com/w80/pn.png",
                    "region": "Okyanusya"
            },
            {
                    "id": 238,
                    "name": "Solomon Adaları",
                    "flag": "https://flagcdn.com/w80/sb.png",
                    "region": "Okyanusya"
            },
            {
                    "id": 239,
                    "name": "Tokelau",
                    "flag": "https://flagcdn.com/w80/tk.png",
                    "region": "Okyanusya"
            },
            {
                    "id": 240,
                    "name": "Tonga",
                    "flag": "https://flagcdn.com/w80/to.png",
                    "region": "Okyanusya"
            },
            {
                    "id": 241,
                    "name": "Tuvalu",
                    "flag": "https://flagcdn.com/w80/tv.png",
                    "region": "Okyanusya"
            },
            {
                    "id": 242,
                    "name": "Vanuatu",
                    "flag": "https://flagcdn.com/w80/vu.png",
                    "region": "Okyanusya"
            },
            {
                    "id": 243,
                    "name": "Wallis ve Futuna Adaları Bölgesi",
                    "flag": "https://flagcdn.com/w80/wf.png",
                    "region": "Okyanusya"
            },
            {
                    "id": 244,
                    "name": "Yeni Kaledonya",
                    "flag": "https://flagcdn.com/w80/nc.png",
                    "region": "Okyanusya"
            },
            {
                    "id": 245,
                    "name": "Yeni Zelanda",
                    "flag": "https://flagcdn.com/w80/nz.png",
                    "region": "Okyanusya"
            },
            {
                    "id": 246,
                    "name": "Antarktika",
                    "flag": "https://flagcdn.com/w80/aq.png",
                    "region": "Diğer"
            },
            {
                    "id": 247,
                    "name": "Bouvet Adası",
                    "flag": "https://flagcdn.com/w80/bv.png",
                    "region": "Diğer"
            },
            {
                    "id": 248,
                    "name": "Fransız Güney ve Antarktika Toprakları",
                    "flag": "https://flagcdn.com/w80/tf.png",
                    "region": "Diğer"
            },
            {
                    "id": 249,
                    "name": "Güney Georgia ve Güney Sandwich Adaları",
                    "flag": "https://flagcdn.com/w80/gs.png",
                    "region": "Diğer"
            },
            {
                    "id": 250,
                    "name": "Heard Adası ve McDonald Adaları",
                    "flag": "https://flagcdn.com/w80/hm.png",
                    "region": "Diğer"
            }
    ],

    leagues: [],
    teams: [], 
    players: [], 
    matches: [], 
    watchlist: [] 
};