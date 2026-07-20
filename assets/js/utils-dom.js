// --- DOM (HTML) OLUŞTURUCULAR ---

// Resim/Logo Gösterimi
ScoutApp.prototype.getLogoDisplayHTML = function(value, classes = "w-full h-full object-contain") {
    if (value && (value.startsWith('http') || value.startsWith('data:image'))) {
        return `<img src="${value}" class="${classes}" onerror="this.style.display='none';this.nextElementSibling.classList.remove('hidden')"><div class="hidden w-full h-full flex items-center justify-center bg-dark-800 text-slate-700"><i data-lucide="image-off" class="w-1/2 h-1/2"></i></div>`;
    }
    // Emoji veya kısa metin (örn: bayraklar) için destek
    if (value && value.length > 0 && value.length <= 15) {
        return `<span class="flex items-center justify-center text-xl">${value}</span>`;
    }
    return `<div class="w-full h-full flex items-center justify-center bg-dark-800/50 text-slate-700"><i data-lucide="image" class="w-1/2 h-1/2 opacity-50"></i></div>`;
};

// Resim Yükleme Kontrolü
ScoutApp.prototype.createImageUploadControl = function(id, label, value = '') {
    const hasImage = value && (value.startsWith('http') || value.startsWith('data:image'));
    return `
        <div class="flex flex-col gap-2">
            <label class="text-xs font-bold text-slate-400 ml-1">${label}</label>
            <div class="flex gap-3 items-start">
                <div class="w-16 h-16 rounded-xl bg-dark-950 border border-dark-700 flex items-center justify-center overflow-hidden shrink-0 relative">
                    <img id="${id}-preview" src="${hasImage ? value : ''}" class="${hasImage ? 'block' : 'hidden'} w-full h-full object-contain p-1">
                    <div id="${id}-placeholder" class="${hasImage ? 'hidden' : 'flex'} w-full h-full items-center justify-center text-slate-700"><i data-lucide="image" class="w-6 h-6"></i></div>
                </div>
                <div class="flex-1 space-y-2">
                    <input type="text" id="${id}" value="${value}" placeholder="Resim URL'si yapıştırın..." oninput="app.handleImagePreview('${id}', this.value)" class="w-full bg-dark-950 border border-dark-700 rounded-lg px-3 py-2 text-white text-sm focus:border-scout-500 outline-none placeholder:text-slate-600 z-10 relative">
                </div>
            </div>
        </div>
    `;
};

ScoutApp.prototype.handleImagePreview = function(id, value) {
    const imgPreview = document.getElementById(`${id}-preview`);
    const placeholder = document.getElementById(`${id}-placeholder`);
    if (value && (value.startsWith('http') || value.startsWith('data:image'))) {
        imgPreview.src = value; imgPreview.classList.remove('hidden'); placeholder.classList.add('hidden');
    } else {
        imgPreview.src = ''; imgPreview.classList.add('hidden'); placeholder.classList.remove('hidden');
    }
};

ScoutApp.prototype.handleModalImageUpload = function(input, targetId) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target.result;
            document.getElementById(targetId).value = result;
            this.handleImagePreview(targetId, result);
        };
        reader.readAsDataURL(file);
    }
};

ScoutApp.prototype.createInput = function(id, label, ph, type='text', val='', evt='', max=null) {
    const safeVal = (val === undefined || val === null) ? '' : val;
    return `<div class="flex flex-col gap-1.5 relative z-10"><label class="text-xs font-bold text-slate-400 ml-1">${label}</label><input type="${type}" id="${id}" value="${safeVal}" oninput="${evt}" ${max ? `max="${max}"` : ''} placeholder="${ph}" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-scout-500 focus:ring-1 focus:ring-scout-500 outline-none transition-all placeholder:text-slate-600 text-sm relative z-20" autocomplete="off"></div>`;
};

ScoutApp.prototype.createDatalistInput = function(id, listId, label, ph, options, val='', evt='') {
    const safeVal = (val === undefined || val === null) ? '' : val;
    const datalist = `<datalist id="${listId}">${options.map(o => `<option value="${o.txt}">`).join('')}</datalist>`;
    return `<div class="flex flex-col gap-1.5 relative z-10"><label class="text-xs font-bold text-slate-400 ml-1">${label}</label><input list="${listId}" type="text" id="${id}" value="${safeVal}" oninput="${evt}" placeholder="${ph}" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-scout-500 focus:ring-1 focus:ring-scout-500 outline-none transition-all placeholder:text-slate-600 text-sm relative z-20" autocomplete="off">${datalist}</div>`;
};

ScoutApp.prototype.createCustomSearchSelect = function(id, label, ph, options, val='', evt='') {
    const safeVal = (val === undefined || val === null) ? '' : val;
    const selectedOpt = options.find(o => o.txt === safeVal || o.val == safeVal);
    const displayValue = selectedOpt ? selectedOpt.txt : safeVal;
    const displayIcon = selectedOpt && selectedOpt.icon ? `<img src="${selectedOpt.icon}" class="w-5 h-3.5 object-cover rounded-sm">` : '';

    const itemsHtml = options.map(o => `
        <div class="px-4 py-2.5 hover:bg-dark-800 cursor-pointer flex items-center gap-3 transition-colors text-slate-300 hover:text-white"
             onclick="app.handleCustomSelect('${id}', '${o.val}', '${o.txt.replace(/'/g, "\\'")}', '${o.icon || ''}', \`${evt}\`)">
            ${o.icon ? `<img src="${o.icon}" class="w-5 h-3.5 object-cover rounded-sm shadow-sm">` : ''}
            <span class="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">${o.txt}</span>
        </div>
    `).join('');

    return `
        <div class="flex flex-col gap-1.5 relative z-30" id="${id}-container" data-custom-select="true">
            <label class="text-xs font-bold text-slate-400 ml-1">${label}</label>
            <div class="relative">
                <div class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" id="${id}-icon-container">
                    ${displayIcon || '<i data-lucide="search" class="w-4 h-4 text-slate-500"></i>'}
                </div>
                <!-- Gizli input değeri tutar -->
                <input type="hidden" id="${id}" value="${safeVal}">
                
                <input type="text" id="${id}-input" value="${displayValue}" placeholder="${ph}" 
                    autocomplete="off"
                    onfocus="document.getElementById('${id}-dropdown').classList.remove('hidden')"
                    onblur="setTimeout(() => document.getElementById('${id}-dropdown').classList.add('hidden'), 200)"
                    oninput="app.filterCustomSelect('${id}', this.value, \`${evt}\`)"
                    class="w-full bg-dark-950 border border-dark-700 rounded-xl ${displayIcon ? 'pl-11' : 'pl-10'} pr-10 py-3 text-white focus:border-scout-500 focus:ring-1 focus:ring-scout-500 outline-none transition-all placeholder:text-slate-600 text-sm">
                <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <i data-lucide="chevron-down" class="w-4 h-4"></i>
                </div>
            </div>
            
            <!-- Dropdown -->
            <div id="${id}-dropdown" class="hidden absolute top-[calc(100%+4px)] left-0 right-0 bg-dark-950 border border-dark-700 rounded-xl shadow-2xl overflow-hidden z-50 max-h-56 overflow-y-auto custom-scrollbar">
                <div id="${id}-list" class="flex flex-col py-1">
                    ${itemsHtml}
                </div>
                <div id="${id}-empty" class="hidden px-4 py-3 text-center text-xs text-slate-500 italic">Sonuç bulunamadı.</div>
            </div>
        </div>
    `;
};

ScoutApp.prototype.handleCustomSelect = function(id, val, text, icon, evtCode) {
    const hiddenInput = document.getElementById(id);
    const textInput = document.getElementById(`${id}-input`);
    const iconContainer = document.getElementById(`${id}-icon-container`);
    
    hiddenInput.value = text; // or val, keeping text to match previous saving format
    textInput.value = text;
    
    if (icon) {
        iconContainer.innerHTML = `<img src="${icon}" class="w-5 h-3.5 object-cover rounded-sm">`;
        textInput.classList.remove('pl-10');
        textInput.classList.add('pl-11');
    } else {
        iconContainer.innerHTML = '<i data-lucide="search" class="w-4 h-4 text-slate-500"></i>';
        textInput.classList.remove('pl-11');
        textInput.classList.add('pl-10');
    }
    
    document.getElementById(`${id}-dropdown`).classList.add('hidden');
    
    if (evtCode) {
        const dummyInput = { value: text }; // Simulate standard input for the callback
        const callbackFn = new Function('value', evtCode.replace('this.value', 'value'));
        callbackFn.call(dummyInput, text);
    }
};

ScoutApp.prototype.filterCustomSelect = function(id, query, evtCode) {
    const list = document.getElementById(`${id}-list`);
    const empty = document.getElementById(`${id}-empty`);
    const hiddenInput = document.getElementById(id);
    const iconContainer = document.getElementById(`${id}-icon-container`);
    const textInput = document.getElementById(`${id}-input`);
    
    if(!list) return;

    // Trigger update logic so user can also type a new country
    hiddenInput.value = query;
    if (evtCode) {
        const callbackFn = new Function('value', evtCode.replace('this.value', 'value'));
        callbackFn.call({ value: query }, query);
    }

    const items = list.children;
    let hasVisible = false;
    
    const q = query.toLowerCase();
    
    for(let i=0; i<items.length; i++) {
        const text = items[i].querySelector('span').innerText.toLowerCase();
        if (text.includes(q)) {
            items[i].classList.remove('hidden');
            items[i].classList.add('flex');
            hasVisible = true;
        } else {
            items[i].classList.add('hidden');
            items[i].classList.remove('flex');
        }
    }
    
    if (hasVisible) {
        empty.classList.add('hidden');
    } else {
        empty.classList.remove('hidden');
    }
    
    if (!query) {
        iconContainer.innerHTML = '<i data-lucide="search" class="w-4 h-4 text-slate-500"></i>';
        textInput.classList.remove('pl-11');
        textInput.classList.add('pl-10');
    }
};

ScoutApp.prototype.createSelect = function(id, label, options, val='', evt='', isFull=false) {
    return `<div class="flex flex-col gap-1.5 w-full relative z-10">${label ? `<label class="text-xs font-bold text-slate-400 ml-1">${label}</label>` : ''}<div class="relative"><select id="${id}" onchange="${evt}" class="w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-scout-500 outline-none appearance-none text-sm relative z-20 cursor-pointer"><option value="" disabled ${!val?'selected':''}>Seçiniz</option>${options.map(o => `<option value="${o.val}" ${val==o.val?'selected':''}>${o.txt}</option>`).join('')}</select><div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 z-30"><i data-lucide="chevron-down" class="w-4 h-4"></i></div></div></div>`;
};

ScoutApp.prototype.createSlider = function(label, key, val) {
    const safeKey = key.replace(/\s+/g, '-').replace(/\//g, '-').toLowerCase();
    return `<div class="bg-dark-950 px-4 py-3 rounded-xl border border-dark-800 relative z-10"><div class="flex justify-between mb-2"><span class="text-xs font-medium text-slate-300 truncate pr-2" title="${label}">${label}</span><span id="val-${safeKey}" class="text-xs font-bold text-scout-400">${val}</span></div><input type="range" min="0" max="100" value="${val}" oninput="app.updateRepStat('${key}', this.value)" class="w-full h-1.5 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-scout-500 relative z-20"></div>`;
};

ScoutApp.prototype.createStatCard = function(title, val, sub, icon, color, bg) {
    return `<div class="bg-dark-900 border border-dark-800 p-6 rounded-2xl relative z-10"><div class="flex justify-between items-start mb-4"><div class="p-3 rounded-lg ${bg}"><i data-lucide="${icon}" class="w-6 h-6 ${color}"></i></div></div><div class="text-slate-400 text-sm font-medium mb-1">${title}</div><div class="flex items-end gap-2"><p class="text-2xl font-bold text-white">${val}</p><span class="text-xs text-slate-500 mb-1 font-medium">${sub}</span></div></div>`;
};