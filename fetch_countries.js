const fs = require('fs');

fetch('https://cdn.jsdelivr.net/npm/world-countries@3.0.0/dist/countries.json')
    .then(res => res.json())
    .then(countriesData => {
        const trRegions = {
            'Europe': 'Avrupa',
            'Africa': 'Afrika',
            'Americas': 'Amerika',
            'Asia': 'Asya',
            'Oceania': 'Okyanusya'
        };
        
        countriesData.sort((a, b) => {
            const regions = {'Europe': 1, 'Africa': 2, 'Americas': 3, 'Asia': 4, 'Oceania': 5};
            const rA = regions[a.region] || 99;
            const rB = regions[b.region] || 99;
            if (rA !== rB) return rA - rB;
            
            const nameA = a.translations?.tur?.common || a.name.common;
            const nameB = b.translations?.tur?.common || b.name.common;
            return nameA.localeCompare(nameB, 'tr');
        });
        
        const DB_COUNTRIES = countriesData.map((c, i) => ({
            id: i + 1,
            name: c.translations?.tur?.common || c.name.common,
            nameEn: c.name.common,
            flag: c.cca2 ? `https://flagcdn.com/w80/${c.cca2.toLowerCase()}.png` : '',
            region: trRegions[c.region] || 'Diğer'
        }));
        
        const path = 'assets/js/data-constants.js';
        let content = fs.readFileSync(path, 'utf8');
        
        const newCountriesStr = JSON.stringify(DB_COUNTRIES, null, 4);
        content = content.replace(/countries:\s*\[[\s\S]*?\],\s*leagues:/, 'countries: ' + newCountriesStr + ',\n    leagues:');
        
        fs.writeFileSync(path, content);
        console.log('Countries populated successfully with regions! Total: ' + DB_COUNTRIES.length);
    })
    .catch(err => console.error(err));
