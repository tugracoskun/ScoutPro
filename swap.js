const fs = require('fs');
let content = fs.readFileSync('assets/js/dashboard.js', 'utf8');
const mapStart = content.indexOf('<div class="bg-gradient-to-br from-dark-900 to-dark-950 border border-dark-800 rounded-2xl p-6 relative flex flex-col shadow-xl mt-6 mb-6 overflow-hidden" id="map-container-wrapper">');
const chartsStart = content.indexOf('<!-- Yeni Grafikler Alanı -->');
const chartsEnd = content.indexOf('${this.generateActivityGraphHTML()}');

if (mapStart !== -1 && chartsStart !== -1 && chartsEnd !== -1) {
    const mapHtml = content.substring(mapStart, chartsStart);
    const chartsHtml = content.substring(chartsStart, chartsEnd);
    content = content.substring(0, mapStart) + chartsHtml + mapHtml + content.substring(chartsEnd);
    fs.writeFileSync('assets/js/dashboard.js', content);
    console.log('Swapped successfully');
} else {
    console.log('Could not find all markers');
}
