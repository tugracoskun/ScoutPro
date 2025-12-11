// --- YENİ RAPOR: SAĞ KOLON (ANALİZ VE GRAFİK) ---

ScoutApp.prototype.getReportAnalysisHTML = function() {
    return `
        <div class="lg:col-span-8 bg-dark-900 p-8 rounded-2xl border border-dark-800 flex flex-col h-full relative overflow-hidden">
            
            <!-- Başlık ve Puan (Sticky) -->
            <div class="flex justify-between items-center sticky top-0 bg-dark-900 z-50 py-4 border-b border-dark-800/50 mb-4">
                <h3 class="text-xl font-bold text-white flex items-center gap-2">
                    <i data-lucide="radar" class="text-scout-500 w-5 h-5"></i> Yetenek Analizi
                </h3>
                <div class="bg-dark-950 px-4 py-2 rounded-lg border border-dark-800 flex items-center gap-3">
                    <span class="text-slate-400 text-sm">Genel Puan:</span>
                    <div id="rep-avg-badge" class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 bg-dark-900 text-slate-500 border-slate-700">-</div>
                </div>
            </div>
            
            <!-- SLIDER ALANI (JS ile dolar) -->
            <div id="attribute-container" class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-8 max-h-[600px] overflow-y-auto custom-scrollbar pr-2 pb-4">
                <div class="text-slate-500 text-sm text-center col-span-2 py-10 italic">Lütfen sol taraftan bir mevki seçiniz...</div>
            </div>

            <!-- GRAFİK VE KAYDET -->
            <div class="mt-auto border-t border-dark-800 pt-6 z-40 relative bg-dark-900">
                 <!-- Grafik -->
                 <div id="report-radar" class="w-full h-72 flex justify-center"></div>
                 
                 <!-- Kaydet Butonu -->
                 <button onclick="app.submitReport()" class="w-full mt-6 py-4 bg-scout-600 hover:bg-scout-500 text-white font-bold rounded-xl shadow-lg shadow-scout-500/20 flex items-center justify-center gap-2 transition-all group">
                    <i data-lucide="save" class="w-5 h-5 group-hover:scale-110 transition-transform"></i> 
                    Oyuncuyu Havuza Ekle
                 </button>
            </div>
        </div>
    `;
};