const fs = require('fs');
const path = require('path');

// get DB_COUNTRIES from data-constants.js
const constantsContent = fs.readFileSync('assets/js/data-constants.js', 'utf8');
const match = constantsContent.match(/countries:\s*(\[[\s\S]*?\]),\s*leagues:/);
if (!match) {
    console.error('Could not find countries in data-constants.js');
    process.exit(1);
}
const dbCountries = eval(match[1]);

const scoutDataPath = path.join(process.env.APPDATA, 'ScoutPro', 'scout_data.json');
if (fs.existsSync(scoutDataPath)) {
    const scoutData = JSON.parse(fs.readFileSync(scoutDataPath, 'utf8'));
    scoutData.countries = scoutData.countries.map(c => {
        const dbC = dbCountries.find(x => x.id === c.id);
        if (dbC && !c.nameEn) {
            c.nameEn = dbC.nameEn;
        }
        return c;
    });
    fs.writeFileSync(scoutDataPath, JSON.stringify(scoutData, null, 2));
    console.log('Updated scout_data.json countries successfully.');
} else {
    console.log('scout_data.json not found.');
}
