/* Zahlentrainer */
(function () {
  const RU = window.RU, U = RU.util, ui = RU.ui;
  const RANGES = { r10: [0, 10], r20: [0, 20], r100: [0, 100], r1000: [0, 1000], r10000: [1000, 9999] };

  const page = (el, query) => {
    el.innerHTML = `
      ${ui.pageHead('Zahlen', 'Von ноль bis миллион – mit Konverter und Trainer.')}
      <div class="grid-2">
        <div class="card">
          <div class="card-label">${RU.icon('hash', 16)} Zahlen-Konverter</div>
          <input id="numin" class="type-input" type="number" min="0" max="999999999" value="${U.randInt(11, 99)}" inputmode="numeric">
          <div class="num-out"><div class="ru num-words" id="numout"></div>${ui.speakBtn('', 'lg', 22)}</div>
          <div id="numtr"></div>
        </div>
        <div class="card">
          <div class="card-label">${RU.icon('book', 16)} Die Grundzahlen</div>
          <div class="num-table">
            ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 20, 30, 40, 50, 100, 200, 1000].map((n) => `<button class="num-cell" data-speak="${RU.numberWords(n)}"><b>${n}</b><span class="ru">${RU.numberWords(n)}</span></button>`).join('')}
          </div>
        </div>
      </div>
      <h2 class="section-title">Zahlentrainer</h2>
      <div class="mode-grid three">
        <a class="mode-card blue" href="#/numbers/train?mode=listen"><span class="mode-ico">${RU.icon('headphones', 26)}</span><div><b>Hören</b><p>Hör die Zahl und tippe sie als Ziffern.</p></div></a>
        <a class="mode-card gold" href="#/numbers/train?mode=read"><span class="mode-ico">${RU.icon('eye', 26)}</span><div><b>Lesen</b><p>Welche Zahl steht da auf Russisch?</p></div></a>
        <a class="mode-card green" href="#/numbers/train?mode=write"><span class="mode-ico">${RU.icon('pen', 26)}</span><div><b>Schreiben</b><p>Schreibe die Zahl auf Russisch aus.</p></div></a>
      </div>`;
    const inp = el.querySelector('#numin'), out = el.querySelector('#numout'), sp = el.querySelector('.num-out [data-speak]'), tr = el.querySelector('#numtr');
    const upd = () => {
      const v = parseInt(inp.value, 10);
      if (isNaN(v) || v < 0 || v > 999999999) { out.textContent = '—'; tr.innerHTML = ''; return; }
      const w = RU.numberWords(v);
      out.textContent = w; sp.dataset.speak = w; tr.innerHTML = ui.translit(w);
    };
    inp.addEventListener('input', upd); upd();
  };

  const train = (el, query) => {
    const mode = query.mode || 'listen';
    const titles = { listen: 'Zahlen hören', read: 'Zahlen lesen', write: 'Zahlen schreiben' };
    ui.setup(el, {
      title: titles[mode], subtitle: 'Wähle einen Zahlenbereich.', back: '#/numbers', showTopic: false, query,
      groups: [{ key: 'range', label: 'Bereich', value: 'r20', options: [{ id: 'r10', label: '0–10' }, { id: 'r20', label: '0–20' }, { id: 'r100', label: '0–100' }, { id: 'r1000', label: '0–1000' }, { id: 'r10000', label: '1000–9999' }] }],
      onStart: (cfg) => {
        const [a, b] = RANGES[cfg.range];
        const nums = [];
        while (nums.length < cfg.count) { const n = U.randInt(a, b); if (!nums.includes(n) || b - a < cfg.count) nums.push(n); }
        const back = '#/numbers';
        const retry = () => train(el, query);
        if (mode === 'read') {
          const questions = nums.map((n) => {
            const opts = new Set([n]);
            while (opts.size < 4) { const d = U.clamp(n + U.pick([-1, 1, -10, 10, 2, -2, 100, -100, 5, -5]) * (Math.random() < 0.5 ? 1 : U.randInt(1, 3)), a, Math.max(b, a + 4)); opts.add(d); }
            const arr = [...opts];
            return { label: 'Welche Zahl ist das?', prompt: `<div class="q-big ru">${RU.numberWords(n)}</div>`, options: arr.map(String), answer: 0, speakAfter: RU.numberWords(n), review: { ru: RU.numberWords(n), de: String(n) } };
          });
          return ui.mcRound(el, { questions, back, mode: 'numbers-read', xpPer: 8, onRetry: retry });
        }
        const items = nums.map((n) => ({ ru: RU.numberWords(n), de: String(n), n }));
        if (mode === 'listen') {
          return RU.runTyping(el, items, {
            mode: 'numbers-listen', lang: 'de', back, onRetry: retry,
            label: () => 'Tippe die Zahl, die du hörst', expected: (it) => it.de,
            prompt: (it) => `<button class="big-speaker" data-speak="${it.ru}" aria-label="Anhören">${RU.icon('volume', 42)}</button><button class="slow-btn" data-slow="${it.ru}">🐢 langsam</button>`,
            onShow: (it) => { setTimeout(() => RU.speak(it.ru), 300); const inp = el.querySelector('#ans'); inp.inputMode = 'numeric'; inp.placeholder = 'Zahl eintippen …'; },
          });
        }
        RU.runTyping(el, items, {
          mode: 'numbers-write', lang: 'ru', back, onRetry: retry,
          label: () => 'Schreibe die Zahl auf Russisch', expected: (it) => it.ru,
          prompt: (it) => `<div class="q-big">${it.n.toLocaleString('de-DE')}</div>`,
        });
      },
    });
  };

  RU.views.numbers = {
    title: 'Zahlen',
    render(el, parts, query) { if (parts[0] === 'train') train(el, query); else page(el, query); },
  };
})();
