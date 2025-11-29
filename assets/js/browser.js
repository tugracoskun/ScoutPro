ScoutApp.prototype.openWebBrowser = function(url, title = "Web Sayfası") {
    const container = document.getElementById('in-app-browser');
    const webview = document.getElementById('webview-frame');
    const titleEl = document.getElementById('browser-title');
    const urlEl = document.getElementById('browser-url');

    if(container && webview) {
        container.classList.remove('hidden');
        webview.src = url;
        titleEl.innerText = "Yükleniyor... " + title;
        urlEl.innerText = url;
        
        webview.addEventListener('did-finish-load', () => { titleEl.innerText = webview.getTitle(); });
        webview.addEventListener('did-fail-load', (e) => { titleEl.innerText = "Hata: " + title; });
    }
};

ScoutApp.prototype.closeWebBrowser = function() {
    const container = document.getElementById('in-app-browser');
    const webview = document.getElementById('webview-frame');
    if(container) {
        container.classList.add('hidden');
        webview.src = "about:blank";
    }
};

ScoutApp.prototype.openExternal = function(url) { };