// --- YENİ RAPORLAMA: GÖRÜNÜM (MAIN VIEW) ---

ScoutApp.prototype.renderNewReport = function(c) {
    const currentPos = this.state.newReport.position;

    // İki parçayı birleştir
    c.innerHTML = `
        <div class="max-w-6xl mx-auto fade-in grid grid-cols-1 lg:grid-cols-12 gap-8">
            ${this.getReportFormHTML()}      <!-- Sol Kolon -->
            ${this.getReportAnalysisHTML()}  <!-- Sağ Kolon -->
        </div>
    `;
    
    lucide.createIcons();

    // Eğer daha önce girilmiş bir tarih varsa (sayfa değişimi vs.) yaşı hesapla göster
    if(this.state.newReport.birthDate) {
        this.updateBirthDate(this.state.newReport.birthDate);
    }

    // Grafiği ve sliderları başlat
    setTimeout(() => {
        this.initReportRadar([], []);
        
        if (currentPos) {
            this.handlePositionChange(currentPos, false); 
        }
    }, 150);
};