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
        "name": "Åland Islands",
        "nameEn": "Åland Islands",
        "flag": "https://flagcdn.com/w80/ax.png",
        "region": "Avrupa"
    },
    {
        "id": 2,
        "name": "Albania",
        "nameEn": "Albania",
        "flag": "https://flagcdn.com/w80/al.png",
        "region": "Avrupa"
    },
    {
        "id": 3,
        "name": "Andorra",
        "nameEn": "Andorra",
        "flag": "https://flagcdn.com/w80/ad.png",
        "region": "Avrupa"
    },
    {
        "id": 4,
        "name": "Austria",
        "nameEn": "Austria",
        "flag": "https://flagcdn.com/w80/at.png",
        "region": "Avrupa"
    },
    {
        "id": 5,
        "name": "Belarus",
        "nameEn": "Belarus",
        "flag": "https://flagcdn.com/w80/by.png",
        "region": "Avrupa"
    },
    {
        "id": 6,
        "name": "Belgium",
        "nameEn": "Belgium",
        "flag": "https://flagcdn.com/w80/be.png",
        "region": "Avrupa"
    },
    {
        "id": 7,
        "name": "Bosnia and Herzegovina",
        "nameEn": "Bosnia and Herzegovina",
        "flag": "https://flagcdn.com/w80/ba.png",
        "region": "Avrupa"
    },
    {
        "id": 8,
        "name": "Bulgaria",
        "nameEn": "Bulgaria",
        "flag": "https://flagcdn.com/w80/bg.png",
        "region": "Avrupa"
    },
    {
        "id": 9,
        "name": "Croatia",
        "nameEn": "Croatia",
        "flag": "https://flagcdn.com/w80/hr.png",
        "region": "Avrupa"
    },
    {
        "id": 10,
        "name": "Cyprus",
        "nameEn": "Cyprus",
        "flag": "https://flagcdn.com/w80/cy.png",
        "region": "Avrupa"
    },
    {
        "id": 11,
        "name": "Czechia",
        "nameEn": "Czechia",
        "flag": "https://flagcdn.com/w80/cz.png",
        "region": "Avrupa"
    },
    {
        "id": 12,
        "name": "Denmark",
        "nameEn": "Denmark",
        "flag": "https://flagcdn.com/w80/dk.png",
        "region": "Avrupa"
    },
    {
        "id": 13,
        "name": "Estonia",
        "nameEn": "Estonia",
        "flag": "https://flagcdn.com/w80/ee.png",
        "region": "Avrupa"
    },
    {
        "id": 14,
        "name": "Faroe Islands",
        "nameEn": "Faroe Islands",
        "flag": "https://flagcdn.com/w80/fo.png",
        "region": "Avrupa"
    },
    {
        "id": 15,
        "name": "Finland",
        "nameEn": "Finland",
        "flag": "https://flagcdn.com/w80/fi.png",
        "region": "Avrupa"
    },
    {
        "id": 16,
        "name": "France",
        "nameEn": "France",
        "flag": "https://flagcdn.com/w80/fr.png",
        "region": "Avrupa"
    },
    {
        "id": 17,
        "name": "Germany",
        "nameEn": "Germany",
        "flag": "https://flagcdn.com/w80/de.png",
        "region": "Avrupa"
    },
    {
        "id": 18,
        "name": "Gibraltar",
        "nameEn": "Gibraltar",
        "flag": "https://flagcdn.com/w80/gi.png",
        "region": "Avrupa"
    },
    {
        "id": 19,
        "name": "Greece",
        "nameEn": "Greece",
        "flag": "https://flagcdn.com/w80/gr.png",
        "region": "Avrupa"
    },
    {
        "id": 20,
        "name": "Guernsey",
        "nameEn": "Guernsey",
        "flag": "https://flagcdn.com/w80/gg.png",
        "region": "Avrupa"
    },
    {
        "id": 21,
        "name": "Hungary",
        "nameEn": "Hungary",
        "flag": "https://flagcdn.com/w80/hu.png",
        "region": "Avrupa"
    },
    {
        "id": 22,
        "name": "Iceland",
        "nameEn": "Iceland",
        "flag": "https://flagcdn.com/w80/is.png",
        "region": "Avrupa"
    },
    {
        "id": 23,
        "name": "Ireland",
        "nameEn": "Ireland",
        "flag": "https://flagcdn.com/w80/ie.png",
        "region": "Avrupa"
    },
    {
        "id": 24,
        "name": "Isle of Man",
        "nameEn": "Isle of Man",
        "flag": "https://flagcdn.com/w80/im.png",
        "region": "Avrupa"
    },
    {
        "id": 25,
        "name": "Italy",
        "nameEn": "Italy",
        "flag": "https://flagcdn.com/w80/it.png",
        "region": "Avrupa"
    },
    {
        "id": 26,
        "name": "Jersey",
        "nameEn": "Jersey",
        "flag": "https://flagcdn.com/w80/je.png",
        "region": "Avrupa"
    },
    {
        "id": 27,
        "name": "Kosovo",
        "nameEn": "Kosovo",
        "flag": "https://flagcdn.com/w80/xk.png",
        "region": "Avrupa"
    },
    {
        "id": 28,
        "name": "Latvia",
        "nameEn": "Latvia",
        "flag": "https://flagcdn.com/w80/lv.png",
        "region": "Avrupa"
    },
    {
        "id": 29,
        "name": "Liechtenstein",
        "nameEn": "Liechtenstein",
        "flag": "https://flagcdn.com/w80/li.png",
        "region": "Avrupa"
    },
    {
        "id": 30,
        "name": "Lithuania",
        "nameEn": "Lithuania",
        "flag": "https://flagcdn.com/w80/lt.png",
        "region": "Avrupa"
    },
    {
        "id": 31,
        "name": "Luxembourg",
        "nameEn": "Luxembourg",
        "flag": "https://flagcdn.com/w80/lu.png",
        "region": "Avrupa"
    },
    {
        "id": 32,
        "name": "Malta",
        "nameEn": "Malta",
        "flag": "https://flagcdn.com/w80/mt.png",
        "region": "Avrupa"
    },
    {
        "id": 33,
        "name": "Moldova",
        "nameEn": "Moldova",
        "flag": "https://flagcdn.com/w80/md.png",
        "region": "Avrupa"
    },
    {
        "id": 34,
        "name": "Monaco",
        "nameEn": "Monaco",
        "flag": "https://flagcdn.com/w80/mc.png",
        "region": "Avrupa"
    },
    {
        "id": 35,
        "name": "Montenegro",
        "nameEn": "Montenegro",
        "flag": "https://flagcdn.com/w80/me.png",
        "region": "Avrupa"
    },
    {
        "id": 36,
        "name": "Netherlands",
        "nameEn": "Netherlands",
        "flag": "https://flagcdn.com/w80/nl.png",
        "region": "Avrupa"
    },
    {
        "id": 37,
        "name": "North Macedonia",
        "nameEn": "North Macedonia",
        "flag": "https://flagcdn.com/w80/mk.png",
        "region": "Avrupa"
    },
    {
        "id": 38,
        "name": "Norway",
        "nameEn": "Norway",
        "flag": "https://flagcdn.com/w80/no.png",
        "region": "Avrupa"
    },
    {
        "id": 39,
        "name": "Poland",
        "nameEn": "Poland",
        "flag": "https://flagcdn.com/w80/pl.png",
        "region": "Avrupa"
    },
    {
        "id": 40,
        "name": "Portugal",
        "nameEn": "Portugal",
        "flag": "https://flagcdn.com/w80/pt.png",
        "region": "Avrupa"
    },
    {
        "id": 41,
        "name": "Romania",
        "nameEn": "Romania",
        "flag": "https://flagcdn.com/w80/ro.png",
        "region": "Avrupa"
    },
    {
        "id": 42,
        "name": "Russia",
        "nameEn": "Russia",
        "flag": "https://flagcdn.com/w80/ru.png",
        "region": "Avrupa"
    },
    {
        "id": 43,
        "name": "San Marino",
        "nameEn": "San Marino",
        "flag": "https://flagcdn.com/w80/sm.png",
        "region": "Avrupa"
    },
    {
        "id": 44,
        "name": "Serbia",
        "nameEn": "Serbia",
        "flag": "https://flagcdn.com/w80/rs.png",
        "region": "Avrupa"
    },
    {
        "id": 45,
        "name": "Slovakia",
        "nameEn": "Slovakia",
        "flag": "https://flagcdn.com/w80/sk.png",
        "region": "Avrupa"
    },
    {
        "id": 46,
        "name": "Slovenia",
        "nameEn": "Slovenia",
        "flag": "https://flagcdn.com/w80/si.png",
        "region": "Avrupa"
    },
    {
        "id": 47,
        "name": "Spain",
        "nameEn": "Spain",
        "flag": "https://flagcdn.com/w80/es.png",
        "region": "Avrupa"
    },
    {
        "id": 48,
        "name": "Svalbard and Jan Mayen",
        "nameEn": "Svalbard and Jan Mayen",
        "flag": "https://flagcdn.com/w80/sj.png",
        "region": "Avrupa"
    },
    {
        "id": 49,
        "name": "Sweden",
        "nameEn": "Sweden",
        "flag": "https://flagcdn.com/w80/se.png",
        "region": "Avrupa"
    },
    {
        "id": 50,
        "name": "Switzerland",
        "nameEn": "Switzerland",
        "flag": "https://flagcdn.com/w80/ch.png",
        "region": "Avrupa"
    },
    {
        "id": 51,
        "name": "Ukraine",
        "nameEn": "Ukraine",
        "flag": "https://flagcdn.com/w80/ua.png",
        "region": "Avrupa"
    },
    {
        "id": 52,
        "name": "United Kingdom",
        "nameEn": "United Kingdom",
        "flag": "https://flagcdn.com/w80/gb.png",
        "region": "Avrupa"
    },
    {
        "id": 53,
        "name": "Vatican City",
        "nameEn": "Vatican City",
        "flag": "https://flagcdn.com/w80/va.png",
        "region": "Avrupa"
    },
    {
        "id": 54,
        "name": "Algeria",
        "nameEn": "Algeria",
        "flag": "https://flagcdn.com/w80/dz.png",
        "region": "Afrika"
    },
    {
        "id": 55,
        "name": "Angola",
        "nameEn": "Angola",
        "flag": "https://flagcdn.com/w80/ao.png",
        "region": "Afrika"
    },
    {
        "id": 56,
        "name": "Benin",
        "nameEn": "Benin",
        "flag": "https://flagcdn.com/w80/bj.png",
        "region": "Afrika"
    },
    {
        "id": 57,
        "name": "Botswana",
        "nameEn": "Botswana",
        "flag": "https://flagcdn.com/w80/bw.png",
        "region": "Afrika"
    },
    {
        "id": 58,
        "name": "British Indian Ocean Territory",
        "nameEn": "British Indian Ocean Territory",
        "flag": "https://flagcdn.com/w80/io.png",
        "region": "Afrika"
    },
    {
        "id": 59,
        "name": "Burkina Faso",
        "nameEn": "Burkina Faso",
        "flag": "https://flagcdn.com/w80/bf.png",
        "region": "Afrika"
    },
    {
        "id": 60,
        "name": "Burundi",
        "nameEn": "Burundi",
        "flag": "https://flagcdn.com/w80/bi.png",
        "region": "Afrika"
    },
    {
        "id": 61,
        "name": "Cameroon",
        "nameEn": "Cameroon",
        "flag": "https://flagcdn.com/w80/cm.png",
        "region": "Afrika"
    },
    {
        "id": 62,
        "name": "Cape Verde",
        "nameEn": "Cape Verde",
        "flag": "https://flagcdn.com/w80/cv.png",
        "region": "Afrika"
    },
    {
        "id": 63,
        "name": "Central African Republic",
        "nameEn": "Central African Republic",
        "flag": "https://flagcdn.com/w80/cf.png",
        "region": "Afrika"
    },
    {
        "id": 64,
        "name": "Chad",
        "nameEn": "Chad",
        "flag": "https://flagcdn.com/w80/td.png",
        "region": "Afrika"
    },
    {
        "id": 65,
        "name": "Comoros",
        "nameEn": "Comoros",
        "flag": "https://flagcdn.com/w80/km.png",
        "region": "Afrika"
    },
    {
        "id": 66,
        "name": "Djibouti",
        "nameEn": "Djibouti",
        "flag": "https://flagcdn.com/w80/dj.png",
        "region": "Afrika"
    },
    {
        "id": 67,
        "name": "DR Congo",
        "nameEn": "DR Congo",
        "flag": "https://flagcdn.com/w80/cd.png",
        "region": "Afrika"
    },
    {
        "id": 68,
        "name": "Egypt",
        "nameEn": "Egypt",
        "flag": "https://flagcdn.com/w80/eg.png",
        "region": "Afrika"
    },
    {
        "id": 69,
        "name": "Equatorial Guinea",
        "nameEn": "Equatorial Guinea",
        "flag": "https://flagcdn.com/w80/gq.png",
        "region": "Afrika"
    },
    {
        "id": 70,
        "name": "Eritrea",
        "nameEn": "Eritrea",
        "flag": "https://flagcdn.com/w80/er.png",
        "region": "Afrika"
    },
    {
        "id": 71,
        "name": "Eswatini",
        "nameEn": "Eswatini",
        "flag": "https://flagcdn.com/w80/sz.png",
        "region": "Afrika"
    },
    {
        "id": 72,
        "name": "Ethiopia",
        "nameEn": "Ethiopia",
        "flag": "https://flagcdn.com/w80/et.png",
        "region": "Afrika"
    },
    {
        "id": 73,
        "name": "Gabon",
        "nameEn": "Gabon",
        "flag": "https://flagcdn.com/w80/ga.png",
        "region": "Afrika"
    },
    {
        "id": 74,
        "name": "Gambia",
        "nameEn": "Gambia",
        "flag": "https://flagcdn.com/w80/gm.png",
        "region": "Afrika"
    },
    {
        "id": 75,
        "name": "Ghana",
        "nameEn": "Ghana",
        "flag": "https://flagcdn.com/w80/gh.png",
        "region": "Afrika"
    },
    {
        "id": 76,
        "name": "Guinea",
        "nameEn": "Guinea",
        "flag": "https://flagcdn.com/w80/gn.png",
        "region": "Afrika"
    },
    {
        "id": 77,
        "name": "Guinea-Bissau",
        "nameEn": "Guinea-Bissau",
        "flag": "https://flagcdn.com/w80/gw.png",
        "region": "Afrika"
    },
    {
        "id": 78,
        "name": "Ivory Coast",
        "nameEn": "Ivory Coast",
        "flag": "https://flagcdn.com/w80/ci.png",
        "region": "Afrika"
    },
    {
        "id": 79,
        "name": "Kenya",
        "nameEn": "Kenya",
        "flag": "https://flagcdn.com/w80/ke.png",
        "region": "Afrika"
    },
    {
        "id": 80,
        "name": "Lesotho",
        "nameEn": "Lesotho",
        "flag": "https://flagcdn.com/w80/ls.png",
        "region": "Afrika"
    },
    {
        "id": 81,
        "name": "Liberia",
        "nameEn": "Liberia",
        "flag": "https://flagcdn.com/w80/lr.png",
        "region": "Afrika"
    },
    {
        "id": 82,
        "name": "Libya",
        "nameEn": "Libya",
        "flag": "https://flagcdn.com/w80/ly.png",
        "region": "Afrika"
    },
    {
        "id": 83,
        "name": "Madagascar",
        "nameEn": "Madagascar",
        "flag": "https://flagcdn.com/w80/mg.png",
        "region": "Afrika"
    },
    {
        "id": 84,
        "name": "Malawi",
        "nameEn": "Malawi",
        "flag": "https://flagcdn.com/w80/mw.png",
        "region": "Afrika"
    },
    {
        "id": 85,
        "name": "Mali",
        "nameEn": "Mali",
        "flag": "https://flagcdn.com/w80/ml.png",
        "region": "Afrika"
    },
    {
        "id": 86,
        "name": "Mauritania",
        "nameEn": "Mauritania",
        "flag": "https://flagcdn.com/w80/mr.png",
        "region": "Afrika"
    },
    {
        "id": 87,
        "name": "Mauritius",
        "nameEn": "Mauritius",
        "flag": "https://flagcdn.com/w80/mu.png",
        "region": "Afrika"
    },
    {
        "id": 88,
        "name": "Mayotte",
        "nameEn": "Mayotte",
        "flag": "https://flagcdn.com/w80/yt.png",
        "region": "Afrika"
    },
    {
        "id": 89,
        "name": "Morocco",
        "nameEn": "Morocco",
        "flag": "https://flagcdn.com/w80/ma.png",
        "region": "Afrika"
    },
    {
        "id": 90,
        "name": "Mozambique",
        "nameEn": "Mozambique",
        "flag": "https://flagcdn.com/w80/mz.png",
        "region": "Afrika"
    },
    {
        "id": 91,
        "name": "Namibia",
        "nameEn": "Namibia",
        "flag": "https://flagcdn.com/w80/na.png",
        "region": "Afrika"
    },
    {
        "id": 92,
        "name": "Niger",
        "nameEn": "Niger",
        "flag": "https://flagcdn.com/w80/ne.png",
        "region": "Afrika"
    },
    {
        "id": 93,
        "name": "Nigeria",
        "nameEn": "Nigeria",
        "flag": "https://flagcdn.com/w80/ng.png",
        "region": "Afrika"
    },
    {
        "id": 94,
        "name": "Republic of the Congo",
        "nameEn": "Republic of the Congo",
        "flag": "https://flagcdn.com/w80/cg.png",
        "region": "Afrika"
    },
    {
        "id": 95,
        "name": "Réunion",
        "nameEn": "Réunion",
        "flag": "https://flagcdn.com/w80/re.png",
        "region": "Afrika"
    },
    {
        "id": 96,
        "name": "Rwanda",
        "nameEn": "Rwanda",
        "flag": "https://flagcdn.com/w80/rw.png",
        "region": "Afrika"
    },
    {
        "id": 97,
        "name": "Saint Helena, Ascension and Tristan da Cunha",
        "nameEn": "Saint Helena, Ascension and Tristan da Cunha",
        "flag": "https://flagcdn.com/w80/sh.png",
        "region": "Afrika"
    },
    {
        "id": 98,
        "name": "São Tomé and Príncipe",
        "nameEn": "São Tomé and Príncipe",
        "flag": "https://flagcdn.com/w80/st.png",
        "region": "Afrika"
    },
    {
        "id": 99,
        "name": "Senegal",
        "nameEn": "Senegal",
        "flag": "https://flagcdn.com/w80/sn.png",
        "region": "Afrika"
    },
    {
        "id": 100,
        "name": "Seychelles",
        "nameEn": "Seychelles",
        "flag": "https://flagcdn.com/w80/sc.png",
        "region": "Afrika"
    },
    {
        "id": 101,
        "name": "Sierra Leone",
        "nameEn": "Sierra Leone",
        "flag": "https://flagcdn.com/w80/sl.png",
        "region": "Afrika"
    },
    {
        "id": 102,
        "name": "Somalia",
        "nameEn": "Somalia",
        "flag": "https://flagcdn.com/w80/so.png",
        "region": "Afrika"
    },
    {
        "id": 103,
        "name": "South Africa",
        "nameEn": "South Africa",
        "flag": "https://flagcdn.com/w80/za.png",
        "region": "Afrika"
    },
    {
        "id": 104,
        "name": "South Sudan",
        "nameEn": "South Sudan",
        "flag": "https://flagcdn.com/w80/ss.png",
        "region": "Afrika"
    },
    {
        "id": 105,
        "name": "Sudan",
        "nameEn": "Sudan",
        "flag": "https://flagcdn.com/w80/sd.png",
        "region": "Afrika"
    },
    {
        "id": 106,
        "name": "Tanzania",
        "nameEn": "Tanzania",
        "flag": "https://flagcdn.com/w80/tz.png",
        "region": "Afrika"
    },
    {
        "id": 107,
        "name": "Togo",
        "nameEn": "Togo",
        "flag": "https://flagcdn.com/w80/tg.png",
        "region": "Afrika"
    },
    {
        "id": 108,
        "name": "Tunisia",
        "nameEn": "Tunisia",
        "flag": "https://flagcdn.com/w80/tn.png",
        "region": "Afrika"
    },
    {
        "id": 109,
        "name": "Uganda",
        "nameEn": "Uganda",
        "flag": "https://flagcdn.com/w80/ug.png",
        "region": "Afrika"
    },
    {
        "id": 110,
        "name": "Western Sahara",
        "nameEn": "Western Sahara",
        "flag": "https://flagcdn.com/w80/eh.png",
        "region": "Afrika"
    },
    {
        "id": 111,
        "name": "Zambia",
        "nameEn": "Zambia",
        "flag": "https://flagcdn.com/w80/zm.png",
        "region": "Afrika"
    },
    {
        "id": 112,
        "name": "Zimbabwe",
        "nameEn": "Zimbabwe",
        "flag": "https://flagcdn.com/w80/zw.png",
        "region": "Afrika"
    },
    {
        "id": 113,
        "name": "Anguilla",
        "nameEn": "Anguilla",
        "flag": "https://flagcdn.com/w80/ai.png",
        "region": "Amerika"
    },
    {
        "id": 114,
        "name": "Antigua and Barbuda",
        "nameEn": "Antigua and Barbuda",
        "flag": "https://flagcdn.com/w80/ag.png",
        "region": "Amerika"
    },
    {
        "id": 115,
        "name": "Argentina",
        "nameEn": "Argentina",
        "flag": "https://flagcdn.com/w80/ar.png",
        "region": "Amerika"
    },
    {
        "id": 116,
        "name": "Aruba",
        "nameEn": "Aruba",
        "flag": "https://flagcdn.com/w80/aw.png",
        "region": "Amerika"
    },
    {
        "id": 117,
        "name": "Bahamas",
        "nameEn": "Bahamas",
        "flag": "https://flagcdn.com/w80/bs.png",
        "region": "Amerika"
    },
    {
        "id": 118,
        "name": "Barbados",
        "nameEn": "Barbados",
        "flag": "https://flagcdn.com/w80/bb.png",
        "region": "Amerika"
    },
    {
        "id": 119,
        "name": "Belize",
        "nameEn": "Belize",
        "flag": "https://flagcdn.com/w80/bz.png",
        "region": "Amerika"
    },
    {
        "id": 120,
        "name": "Bermuda",
        "nameEn": "Bermuda",
        "flag": "https://flagcdn.com/w80/bm.png",
        "region": "Amerika"
    },
    {
        "id": 121,
        "name": "Bolivia",
        "nameEn": "Bolivia",
        "flag": "https://flagcdn.com/w80/bo.png",
        "region": "Amerika"
    },
    {
        "id": 122,
        "name": "Brazil",
        "nameEn": "Brazil",
        "flag": "https://flagcdn.com/w80/br.png",
        "region": "Amerika"
    },
    {
        "id": 123,
        "name": "British Virgin Islands",
        "nameEn": "British Virgin Islands",
        "flag": "https://flagcdn.com/w80/vg.png",
        "region": "Amerika"
    },
    {
        "id": 124,
        "name": "Canada",
        "nameEn": "Canada",
        "flag": "https://flagcdn.com/w80/ca.png",
        "region": "Amerika"
    },
    {
        "id": 125,
        "name": "Caribbean Netherlands",
        "nameEn": "Caribbean Netherlands",
        "flag": "https://flagcdn.com/w80/bq.png",
        "region": "Amerika"
    },
    {
        "id": 126,
        "name": "Cayman Islands",
        "nameEn": "Cayman Islands",
        "flag": "https://flagcdn.com/w80/ky.png",
        "region": "Amerika"
    },
    {
        "id": 127,
        "name": "Chile",
        "nameEn": "Chile",
        "flag": "https://flagcdn.com/w80/cl.png",
        "region": "Amerika"
    },
    {
        "id": 128,
        "name": "Colombia",
        "nameEn": "Colombia",
        "flag": "https://flagcdn.com/w80/co.png",
        "region": "Amerika"
    },
    {
        "id": 129,
        "name": "Costa Rica",
        "nameEn": "Costa Rica",
        "flag": "https://flagcdn.com/w80/cr.png",
        "region": "Amerika"
    },
    {
        "id": 130,
        "name": "Cuba",
        "nameEn": "Cuba",
        "flag": "https://flagcdn.com/w80/cu.png",
        "region": "Amerika"
    },
    {
        "id": 131,
        "name": "Curaçao",
        "nameEn": "Curaçao",
        "flag": "https://flagcdn.com/w80/cw.png",
        "region": "Amerika"
    },
    {
        "id": 132,
        "name": "Dominica",
        "nameEn": "Dominica",
        "flag": "https://flagcdn.com/w80/dm.png",
        "region": "Amerika"
    },
    {
        "id": 133,
        "name": "Dominican Republic",
        "nameEn": "Dominican Republic",
        "flag": "https://flagcdn.com/w80/do.png",
        "region": "Amerika"
    },
    {
        "id": 134,
        "name": "Ecuador",
        "nameEn": "Ecuador",
        "flag": "https://flagcdn.com/w80/ec.png",
        "region": "Amerika"
    },
    {
        "id": 135,
        "name": "El Salvador",
        "nameEn": "El Salvador",
        "flag": "https://flagcdn.com/w80/sv.png",
        "region": "Amerika"
    },
    {
        "id": 136,
        "name": "Falkland Islands",
        "nameEn": "Falkland Islands",
        "flag": "https://flagcdn.com/w80/fk.png",
        "region": "Amerika"
    },
    {
        "id": 137,
        "name": "French Guiana",
        "nameEn": "French Guiana",
        "flag": "https://flagcdn.com/w80/gf.png",
        "region": "Amerika"
    },
    {
        "id": 138,
        "name": "Greenland",
        "nameEn": "Greenland",
        "flag": "https://flagcdn.com/w80/gl.png",
        "region": "Amerika"
    },
    {
        "id": 139,
        "name": "Grenada",
        "nameEn": "Grenada",
        "flag": "https://flagcdn.com/w80/gd.png",
        "region": "Amerika"
    },
    {
        "id": 140,
        "name": "Guadeloupe",
        "nameEn": "Guadeloupe",
        "flag": "https://flagcdn.com/w80/gp.png",
        "region": "Amerika"
    },
    {
        "id": 141,
        "name": "Guatemala",
        "nameEn": "Guatemala",
        "flag": "https://flagcdn.com/w80/gt.png",
        "region": "Amerika"
    },
    {
        "id": 142,
        "name": "Guyana",
        "nameEn": "Guyana",
        "flag": "https://flagcdn.com/w80/gy.png",
        "region": "Amerika"
    },
    {
        "id": 143,
        "name": "Haiti",
        "nameEn": "Haiti",
        "flag": "https://flagcdn.com/w80/ht.png",
        "region": "Amerika"
    },
    {
        "id": 144,
        "name": "Honduras",
        "nameEn": "Honduras",
        "flag": "https://flagcdn.com/w80/hn.png",
        "region": "Amerika"
    },
    {
        "id": 145,
        "name": "Jamaica",
        "nameEn": "Jamaica",
        "flag": "https://flagcdn.com/w80/jm.png",
        "region": "Amerika"
    },
    {
        "id": 146,
        "name": "Martinique",
        "nameEn": "Martinique",
        "flag": "https://flagcdn.com/w80/mq.png",
        "region": "Amerika"
    },
    {
        "id": 147,
        "name": "Mexico",
        "nameEn": "Mexico",
        "flag": "https://flagcdn.com/w80/mx.png",
        "region": "Amerika"
    },
    {
        "id": 148,
        "name": "Montserrat",
        "nameEn": "Montserrat",
        "flag": "https://flagcdn.com/w80/ms.png",
        "region": "Amerika"
    },
    {
        "id": 149,
        "name": "Nicaragua",
        "nameEn": "Nicaragua",
        "flag": "https://flagcdn.com/w80/ni.png",
        "region": "Amerika"
    },
    {
        "id": 150,
        "name": "Panama",
        "nameEn": "Panama",
        "flag": "https://flagcdn.com/w80/pa.png",
        "region": "Amerika"
    },
    {
        "id": 151,
        "name": "Paraguay",
        "nameEn": "Paraguay",
        "flag": "https://flagcdn.com/w80/py.png",
        "region": "Amerika"
    },
    {
        "id": 152,
        "name": "Peru",
        "nameEn": "Peru",
        "flag": "https://flagcdn.com/w80/pe.png",
        "region": "Amerika"
    },
    {
        "id": 153,
        "name": "Puerto Rico",
        "nameEn": "Puerto Rico",
        "flag": "https://flagcdn.com/w80/pr.png",
        "region": "Amerika"
    },
    {
        "id": 154,
        "name": "Saint Barthélemy",
        "nameEn": "Saint Barthélemy",
        "flag": "https://flagcdn.com/w80/bl.png",
        "region": "Amerika"
    },
    {
        "id": 155,
        "name": "Saint Kitts and Nevis",
        "nameEn": "Saint Kitts and Nevis",
        "flag": "https://flagcdn.com/w80/kn.png",
        "region": "Amerika"
    },
    {
        "id": 156,
        "name": "Saint Lucia",
        "nameEn": "Saint Lucia",
        "flag": "https://flagcdn.com/w80/lc.png",
        "region": "Amerika"
    },
    {
        "id": 157,
        "name": "Saint Martin",
        "nameEn": "Saint Martin",
        "flag": "https://flagcdn.com/w80/mf.png",
        "region": "Amerika"
    },
    {
        "id": 158,
        "name": "Saint Pierre and Miquelon",
        "nameEn": "Saint Pierre and Miquelon",
        "flag": "https://flagcdn.com/w80/pm.png",
        "region": "Amerika"
    },
    {
        "id": 159,
        "name": "Saint Vincent and the Grenadines",
        "nameEn": "Saint Vincent and the Grenadines",
        "flag": "https://flagcdn.com/w80/vc.png",
        "region": "Amerika"
    },
    {
        "id": 160,
        "name": "Sint Maarten",
        "nameEn": "Sint Maarten",
        "flag": "https://flagcdn.com/w80/sx.png",
        "region": "Amerika"
    },
    {
        "id": 161,
        "name": "Suriname",
        "nameEn": "Suriname",
        "flag": "https://flagcdn.com/w80/sr.png",
        "region": "Amerika"
    },
    {
        "id": 162,
        "name": "Trinidad and Tobago",
        "nameEn": "Trinidad and Tobago",
        "flag": "https://flagcdn.com/w80/tt.png",
        "region": "Amerika"
    },
    {
        "id": 163,
        "name": "Turks and Caicos Islands",
        "nameEn": "Turks and Caicos Islands",
        "flag": "https://flagcdn.com/w80/tc.png",
        "region": "Amerika"
    },
    {
        "id": 164,
        "name": "United States",
        "nameEn": "United States",
        "flag": "https://flagcdn.com/w80/us.png",
        "region": "Amerika"
    },
    {
        "id": 165,
        "name": "United States Minor Outlying Islands",
        "nameEn": "United States Minor Outlying Islands",
        "flag": "https://flagcdn.com/w80/um.png",
        "region": "Amerika"
    },
    {
        "id": 166,
        "name": "United States Virgin Islands",
        "nameEn": "United States Virgin Islands",
        "flag": "https://flagcdn.com/w80/vi.png",
        "region": "Amerika"
    },
    {
        "id": 167,
        "name": "Uruguay",
        "nameEn": "Uruguay",
        "flag": "https://flagcdn.com/w80/uy.png",
        "region": "Amerika"
    },
    {
        "id": 168,
        "name": "Venezuela",
        "nameEn": "Venezuela",
        "flag": "https://flagcdn.com/w80/ve.png",
        "region": "Amerika"
    },
    {
        "id": 169,
        "name": "Afghanistan",
        "nameEn": "Afghanistan",
        "flag": "https://flagcdn.com/w80/af.png",
        "region": "Asya"
    },
    {
        "id": 170,
        "name": "Armenia",
        "nameEn": "Armenia",
        "flag": "https://flagcdn.com/w80/am.png",
        "region": "Asya"
    },
    {
        "id": 171,
        "name": "Azerbaijan",
        "nameEn": "Azerbaijan",
        "flag": "https://flagcdn.com/w80/az.png",
        "region": "Asya"
    },
    {
        "id": 172,
        "name": "Bahrain",
        "nameEn": "Bahrain",
        "flag": "https://flagcdn.com/w80/bh.png",
        "region": "Asya"
    },
    {
        "id": 173,
        "name": "Bangladesh",
        "nameEn": "Bangladesh",
        "flag": "https://flagcdn.com/w80/bd.png",
        "region": "Asya"
    },
    {
        "id": 174,
        "name": "Bhutan",
        "nameEn": "Bhutan",
        "flag": "https://flagcdn.com/w80/bt.png",
        "region": "Asya"
    },
    {
        "id": 175,
        "name": "Brunei",
        "nameEn": "Brunei",
        "flag": "https://flagcdn.com/w80/bn.png",
        "region": "Asya"
    },
    {
        "id": 176,
        "name": "Cambodia",
        "nameEn": "Cambodia",
        "flag": "https://flagcdn.com/w80/kh.png",
        "region": "Asya"
    },
    {
        "id": 177,
        "name": "China",
        "nameEn": "China",
        "flag": "https://flagcdn.com/w80/cn.png",
        "region": "Asya"
    },
    {
        "id": 178,
        "name": "Georgia",
        "nameEn": "Georgia",
        "flag": "https://flagcdn.com/w80/ge.png",
        "region": "Asya"
    },
    {
        "id": 179,
        "name": "Hong Kong",
        "nameEn": "Hong Kong",
        "flag": "https://flagcdn.com/w80/hk.png",
        "region": "Asya"
    },
    {
        "id": 180,
        "name": "India",
        "nameEn": "India",
        "flag": "https://flagcdn.com/w80/in.png",
        "region": "Asya"
    },
    {
        "id": 181,
        "name": "Indonesia",
        "nameEn": "Indonesia",
        "flag": "https://flagcdn.com/w80/id.png",
        "region": "Asya"
    },
    {
        "id": 182,
        "name": "Iran",
        "nameEn": "Iran",
        "flag": "https://flagcdn.com/w80/ir.png",
        "region": "Asya"
    },
    {
        "id": 183,
        "name": "Iraq",
        "nameEn": "Iraq",
        "flag": "https://flagcdn.com/w80/iq.png",
        "region": "Asya"
    },
    {
        "id": 184,
        "name": "Israel",
        "nameEn": "Israel",
        "flag": "https://flagcdn.com/w80/il.png",
        "region": "Asya"
    },
    {
        "id": 185,
        "name": "Japan",
        "nameEn": "Japan",
        "flag": "https://flagcdn.com/w80/jp.png",
        "region": "Asya"
    },
    {
        "id": 186,
        "name": "Jordan",
        "nameEn": "Jordan",
        "flag": "https://flagcdn.com/w80/jo.png",
        "region": "Asya"
    },
    {
        "id": 187,
        "name": "Kazakhstan",
        "nameEn": "Kazakhstan",
        "flag": "https://flagcdn.com/w80/kz.png",
        "region": "Asya"
    },
    {
        "id": 188,
        "name": "Kuwait",
        "nameEn": "Kuwait",
        "flag": "https://flagcdn.com/w80/kw.png",
        "region": "Asya"
    },
    {
        "id": 189,
        "name": "Kyrgyzstan",
        "nameEn": "Kyrgyzstan",
        "flag": "https://flagcdn.com/w80/kg.png",
        "region": "Asya"
    },
    {
        "id": 190,
        "name": "Laos",
        "nameEn": "Laos",
        "flag": "https://flagcdn.com/w80/la.png",
        "region": "Asya"
    },
    {
        "id": 191,
        "name": "Lebanon",
        "nameEn": "Lebanon",
        "flag": "https://flagcdn.com/w80/lb.png",
        "region": "Asya"
    },
    {
        "id": 192,
        "name": "Macau",
        "nameEn": "Macau",
        "flag": "https://flagcdn.com/w80/mo.png",
        "region": "Asya"
    },
    {
        "id": 193,
        "name": "Malaysia",
        "nameEn": "Malaysia",
        "flag": "https://flagcdn.com/w80/my.png",
        "region": "Asya"
    },
    {
        "id": 194,
        "name": "Maldives",
        "nameEn": "Maldives",
        "flag": "https://flagcdn.com/w80/mv.png",
        "region": "Asya"
    },
    {
        "id": 195,
        "name": "Mongolia",
        "nameEn": "Mongolia",
        "flag": "https://flagcdn.com/w80/mn.png",
        "region": "Asya"
    },
    {
        "id": 196,
        "name": "Myanmar",
        "nameEn": "Myanmar",
        "flag": "https://flagcdn.com/w80/mm.png",
        "region": "Asya"
    },
    {
        "id": 197,
        "name": "Nepal",
        "nameEn": "Nepal",
        "flag": "https://flagcdn.com/w80/np.png",
        "region": "Asya"
    },
    {
        "id": 198,
        "name": "North Korea",
        "nameEn": "North Korea",
        "flag": "https://flagcdn.com/w80/kp.png",
        "region": "Asya"
    },
    {
        "id": 199,
        "name": "Oman",
        "nameEn": "Oman",
        "flag": "https://flagcdn.com/w80/om.png",
        "region": "Asya"
    },
    {
        "id": 200,
        "name": "Pakistan",
        "nameEn": "Pakistan",
        "flag": "https://flagcdn.com/w80/pk.png",
        "region": "Asya"
    },
    {
        "id": 201,
        "name": "Palestine",
        "nameEn": "Palestine",
        "flag": "https://flagcdn.com/w80/ps.png",
        "region": "Asya"
    },
    {
        "id": 202,
        "name": "Philippines",
        "nameEn": "Philippines",
        "flag": "https://flagcdn.com/w80/ph.png",
        "region": "Asya"
    },
    {
        "id": 203,
        "name": "Qatar",
        "nameEn": "Qatar",
        "flag": "https://flagcdn.com/w80/qa.png",
        "region": "Asya"
    },
    {
        "id": 204,
        "name": "Saudi Arabia",
        "nameEn": "Saudi Arabia",
        "flag": "https://flagcdn.com/w80/sa.png",
        "region": "Asya"
    },
    {
        "id": 205,
        "name": "Singapore",
        "nameEn": "Singapore",
        "flag": "https://flagcdn.com/w80/sg.png",
        "region": "Asya"
    },
    {
        "id": 206,
        "name": "South Korea",
        "nameEn": "South Korea",
        "flag": "https://flagcdn.com/w80/kr.png",
        "region": "Asya"
    },
    {
        "id": 207,
        "name": "Sri Lanka",
        "nameEn": "Sri Lanka",
        "flag": "https://flagcdn.com/w80/lk.png",
        "region": "Asya"
    },
    {
        "id": 208,
        "name": "Syria",
        "nameEn": "Syria",
        "flag": "https://flagcdn.com/w80/sy.png",
        "region": "Asya"
    },
    {
        "id": 209,
        "name": "Taiwan",
        "nameEn": "Taiwan",
        "flag": "https://flagcdn.com/w80/tw.png",
        "region": "Asya"
    },
    {
        "id": 210,
        "name": "Tajikistan",
        "nameEn": "Tajikistan",
        "flag": "https://flagcdn.com/w80/tj.png",
        "region": "Asya"
    },
    {
        "id": 211,
        "name": "Thailand",
        "nameEn": "Thailand",
        "flag": "https://flagcdn.com/w80/th.png",
        "region": "Asya"
    },
    {
        "id": 212,
        "name": "Timor-Leste",
        "nameEn": "Timor-Leste",
        "flag": "https://flagcdn.com/w80/tl.png",
        "region": "Asya"
    },
    {
        "id": 213,
        "name": "Turkey",
        "nameEn": "Turkey",
        "flag": "https://flagcdn.com/w80/tr.png",
        "region": "Asya"
    },
    {
        "id": 214,
        "name": "Turkmenistan",
        "nameEn": "Turkmenistan",
        "flag": "https://flagcdn.com/w80/tm.png",
        "region": "Asya"
    },
    {
        "id": 215,
        "name": "United Arab Emirates",
        "nameEn": "United Arab Emirates",
        "flag": "https://flagcdn.com/w80/ae.png",
        "region": "Asya"
    },
    {
        "id": 216,
        "name": "Uzbekistan",
        "nameEn": "Uzbekistan",
        "flag": "https://flagcdn.com/w80/uz.png",
        "region": "Asya"
    },
    {
        "id": 217,
        "name": "Vietnam",
        "nameEn": "Vietnam",
        "flag": "https://flagcdn.com/w80/vn.png",
        "region": "Asya"
    },
    {
        "id": 218,
        "name": "Yemen",
        "nameEn": "Yemen",
        "flag": "https://flagcdn.com/w80/ye.png",
        "region": "Asya"
    },
    {
        "id": 219,
        "name": "American Samoa",
        "nameEn": "American Samoa",
        "flag": "https://flagcdn.com/w80/as.png",
        "region": "Okyanusya"
    },
    {
        "id": 220,
        "name": "Australia",
        "nameEn": "Australia",
        "flag": "https://flagcdn.com/w80/au.png",
        "region": "Okyanusya"
    },
    {
        "id": 221,
        "name": "Christmas Island",
        "nameEn": "Christmas Island",
        "flag": "https://flagcdn.com/w80/cx.png",
        "region": "Okyanusya"
    },
    {
        "id": 222,
        "name": "Cocos (Keeling) Islands",
        "nameEn": "Cocos (Keeling) Islands",
        "flag": "https://flagcdn.com/w80/cc.png",
        "region": "Okyanusya"
    },
    {
        "id": 223,
        "name": "Cook Islands",
        "nameEn": "Cook Islands",
        "flag": "https://flagcdn.com/w80/ck.png",
        "region": "Okyanusya"
    },
    {
        "id": 224,
        "name": "Fiji",
        "nameEn": "Fiji",
        "flag": "https://flagcdn.com/w80/fj.png",
        "region": "Okyanusya"
    },
    {
        "id": 225,
        "name": "French Polynesia",
        "nameEn": "French Polynesia",
        "flag": "https://flagcdn.com/w80/pf.png",
        "region": "Okyanusya"
    },
    {
        "id": 226,
        "name": "Guam",
        "nameEn": "Guam",
        "flag": "https://flagcdn.com/w80/gu.png",
        "region": "Okyanusya"
    },
    {
        "id": 227,
        "name": "Kiribati",
        "nameEn": "Kiribati",
        "flag": "https://flagcdn.com/w80/ki.png",
        "region": "Okyanusya"
    },
    {
        "id": 228,
        "name": "Marshall Islands",
        "nameEn": "Marshall Islands",
        "flag": "https://flagcdn.com/w80/mh.png",
        "region": "Okyanusya"
    },
    {
        "id": 229,
        "name": "Micronesia",
        "nameEn": "Micronesia",
        "flag": "https://flagcdn.com/w80/fm.png",
        "region": "Okyanusya"
    },
    {
        "id": 230,
        "name": "Nauru",
        "nameEn": "Nauru",
        "flag": "https://flagcdn.com/w80/nr.png",
        "region": "Okyanusya"
    },
    {
        "id": 231,
        "name": "New Caledonia",
        "nameEn": "New Caledonia",
        "flag": "https://flagcdn.com/w80/nc.png",
        "region": "Okyanusya"
    },
    {
        "id": 232,
        "name": "New Zealand",
        "nameEn": "New Zealand",
        "flag": "https://flagcdn.com/w80/nz.png",
        "region": "Okyanusya"
    },
    {
        "id": 233,
        "name": "Niue",
        "nameEn": "Niue",
        "flag": "https://flagcdn.com/w80/nu.png",
        "region": "Okyanusya"
    },
    {
        "id": 234,
        "name": "Norfolk Island",
        "nameEn": "Norfolk Island",
        "flag": "https://flagcdn.com/w80/nf.png",
        "region": "Okyanusya"
    },
    {
        "id": 235,
        "name": "Northern Mariana Islands",
        "nameEn": "Northern Mariana Islands",
        "flag": "https://flagcdn.com/w80/mp.png",
        "region": "Okyanusya"
    },
    {
        "id": 236,
        "name": "Palau",
        "nameEn": "Palau",
        "flag": "https://flagcdn.com/w80/pw.png",
        "region": "Okyanusya"
    },
    {
        "id": 237,
        "name": "Papua New Guinea",
        "nameEn": "Papua New Guinea",
        "flag": "https://flagcdn.com/w80/pg.png",
        "region": "Okyanusya"
    },
    {
        "id": 238,
        "name": "Pitcairn Islands",
        "nameEn": "Pitcairn Islands",
        "flag": "https://flagcdn.com/w80/pn.png",
        "region": "Okyanusya"
    },
    {
        "id": 239,
        "name": "Samoa",
        "nameEn": "Samoa",
        "flag": "https://flagcdn.com/w80/ws.png",
        "region": "Okyanusya"
    },
    {
        "id": 240,
        "name": "Solomon Islands",
        "nameEn": "Solomon Islands",
        "flag": "https://flagcdn.com/w80/sb.png",
        "region": "Okyanusya"
    },
    {
        "id": 241,
        "name": "Tokelau",
        "nameEn": "Tokelau",
        "flag": "https://flagcdn.com/w80/tk.png",
        "region": "Okyanusya"
    },
    {
        "id": 242,
        "name": "Tonga",
        "nameEn": "Tonga",
        "flag": "https://flagcdn.com/w80/to.png",
        "region": "Okyanusya"
    },
    {
        "id": 243,
        "name": "Tuvalu",
        "nameEn": "Tuvalu",
        "flag": "https://flagcdn.com/w80/tv.png",
        "region": "Okyanusya"
    },
    {
        "id": 244,
        "name": "Vanuatu",
        "nameEn": "Vanuatu",
        "flag": "https://flagcdn.com/w80/vu.png",
        "region": "Okyanusya"
    },
    {
        "id": 245,
        "name": "Wallis and Futuna",
        "nameEn": "Wallis and Futuna",
        "flag": "https://flagcdn.com/w80/wf.png",
        "region": "Okyanusya"
    },
    {
        "id": 246,
        "name": "Antarctica",
        "nameEn": "Antarctica",
        "flag": "https://flagcdn.com/w80/aq.png",
        "region": "Diğer"
    },
    {
        "id": 247,
        "name": "Bouvet Island",
        "nameEn": "Bouvet Island",
        "flag": "https://flagcdn.com/w80/bv.png",
        "region": "Diğer"
    },
    {
        "id": 248,
        "name": "French Southern and Antarctic Lands",
        "nameEn": "French Southern and Antarctic Lands",
        "flag": "https://flagcdn.com/w80/tf.png",
        "region": "Diğer"
    },
    {
        "id": 249,
        "name": "Heard Island and McDonald Islands",
        "nameEn": "Heard Island and McDonald Islands",
        "flag": "https://flagcdn.com/w80/hm.png",
        "region": "Diğer"
    },
    {
        "id": 250,
        "name": "South Georgia",
        "nameEn": "South Georgia",
        "flag": "https://flagcdn.com/w80/gs.png",
        "region": "Diğer"
    }
],
    leagues: [],
    teams: [], 
    players: [], 
    matches: [], 
    watchlist: [] 
};