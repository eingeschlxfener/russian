/* Alphabet: Übersicht, Detail, Buchstaben-Quiz, Lesetraining */
(function () {
  const RU = window.RU, U = RU.util, ui = RU.ui;
  const TYPES = window.RU_DATA.letterTypes;

  const isLearned = (L) => RU.state.letters.includes(L.up);
  const markLearned = (L) => {
    if (isLearned(L)) return false;
    RU.state.letters.push(L.up); RU.save(); RU.addXP(3, { silent: true }); RU.checkAchievements();
    return true;
  };

  const openLetter = (idx, rerender) => {
    const L = RU.alphabet[idx], T = TYPES[L.type];
    const m = ui.modal(`
      <div class="letter-detail">
        <div class="ld-big ${T.color}"><span>${L.up}</span><span>${L.lo}</span></div>
        <span class="tag ${T.color}">${T.label}</span>
        <h2>${U.esc(L.tr)}</h2>
        <p class="ld-sound">${U.esc(L.sound)}</p>
        <div class="ld-example">
          <span class="ld-emoji">${L.emoji}</span>
          <div><div class="ru big">${U.esc(L.word)}</div>${ui.translit(L.word)}<div class="muted">${U.esc(L.wordDe)}</div></div>
          ${ui.speakBtn(L.word, 'lg', 22)}
        </div>
        <div class="ld-actions">
          <button class="btn ghost" id="ld-prev">${RU.icon('left', 16)}</button>
          <button class="btn ${isLearned(L) ? 'soft green' : 'primary'}" id="ld-learn">${isLearned(L) ? `${RU.icon('check', 16)} Gelernt` : 'Als gelernt markieren'}</button>
          <button class="btn ghost" id="ld-next">${RU.icon('right', 16)}</button>
        </div>
      </div>`, 'sm');
    RU.speak(L.word);
    m.el.querySelector('#ld-learn').onclick = () => { if (markLearned(L)) { RU.sfx('pop'); rerender(); } m.close(); };
    const go = (d) => { m.close(); setTimeout(() => openLetter((idx + d + RU.alphabet.length) % RU.alphabet.length, rerender), 210); };
    m.el.querySelector('#ld-prev').onclick = () => go(-1);
    m.el.querySelector('#ld-next').onclick = () => go(1);
  };

  const overview = (el, query) => {
    let filter = query.filter || 'all';
    const render = () => {
      const n = RU.state.letters.length;
      const list = RU.alphabet.map((L, i) => [L, i]).filter(([L]) => filter === 'all' || L.type === filter);
      el.innerHTML = `
      ${ui.pageHead('Das kyrillische Alphabet', '33 Buchstaben – viele kennst du schon! Tippe auf einen Buchstaben, um ihn zu hören.', '', `<div class="head-progress">${ui.ring(n / 33, 52, 6, 'var(--red)', `<b>${n}</b>`)}<small>von 33<br>gelernt</small></div>`)}
      <div class="action-row">
        <a class="action-card red" href="#/alphabet/quiz">${RU.icon('target', 22)}<div><b>Buchstaben-Quiz</b><small>Erkenne die Laute</small></div></a>
        <a class="action-card blue" href="#/alphabet/read">${RU.icon('eye', 22)}<div><b>Lesetraining</b><small>Wörter entziffern</small></div></a>
        <a class="action-card violet" href="#/alphabet/type">${RU.icon('keyboard', 22)}<div><b>Tipptraining</b><small>Finde die Taste</small></div></a>
      </div>
      <div class="chips filter-chips">
        <button class="chip ${filter === 'all' ? 'active' : ''}" data-f="all">Alle <small>33</small></button>
        ${Object.entries(TYPES).map(([k, t]) => `<button class="chip ${filter === k ? 'active' : ''}" data-f="${k}"><i class="dot ${t.color}"></i>${t.label} <small>${RU.alphabet.filter((L) => L.type === k).length}</small></button>`).join('')}
      </div>
      ${filter !== 'all' ? `<p class="muted filter-desc">${TYPES[filter].desc}</p>` : ''}
      <div class="letter-grid">
        ${list.map(([L, i]) => `
          <button class="letter-tile ${TYPES[L.type].color} ${isLearned(L) ? 'learned' : ''}" data-i="${i}">
            <span class="lt-letters"><b>${L.up}</b><span>${L.lo}</span></span>
            <span class="lt-tr">${L.type === 'sign' ? (L.up === 'Ь' ? 'weich' : 'hart') : U.esc(L.tr.split(' (')[0])}</span>
            ${isLearned(L) ? `<span class="lt-check">${RU.icon('check', 12)}</span>` : ''}
          </button>`).join('')}
      </div>
      <div class="card tip-card">
        <h3>💡 So lernst du das Alphabet am schnellsten</h3>
        <ol>
          <li><b>Wie im Deutschen</b> (А, К, М, О, Т) kannst du sofort.</li>
          <li>Dann die <b>falschen Freunde</b>: В = w, Н = n, Р = r, С = s, У = u, Х = ch – sie sehen bekannt aus, klingen aber anders.</li>
          <li>Zum Schluss die <b>neuen Zeichen</b>. Tipp: Я heißt „ja“ und bedeutet „ich“!</li>
          <li>Übe mit dem <a href="#/alphabet/read">Lesetraining</a> – echte Wörter lesen festigt alles.</li>
        </ol>
      </div>`;
      el.querySelectorAll('[data-f]').forEach((b) => b.onclick = () => { filter = b.dataset.f; render(); });
      el.querySelectorAll('.letter-tile').forEach((b) => b.onclick = () => openLetter(+b.dataset.i, render));
    };
    render();
  };

  /* Buchstabe → Laut (oder umgekehrt) */
  const letterQuiz = (el) => {
    ui.setup(el, {
      title: 'Buchstaben-Quiz', subtitle: 'Erkennst du alle Buchstaben?', back: '#/alphabet', showTopic: false,
      groups: [
        { key: 'dir', label: 'Richtung', options: [{ id: 'l2s', label: 'Buchstabe → Laut' }, { id: 's2l', label: 'Laut → Buchstabe' }, { id: 'mix', label: 'Gemischt' }] },
        { key: 'set', label: 'Buchstaben', options: [{ id: 'all', label: 'Alle' }, { id: 'learned', label: 'Nur gelernte' }, { id: 'hard', label: 'Neue & falsche Freunde' }] },
      ],
      onStart: (cfg) => {
        let pool = RU.alphabet;
        if (cfg.set === 'learned') pool = pool.filter(isLearned);
        if (cfg.set === 'hard') pool = pool.filter((L) => L.type === 'new' || L.type === 'false');
        if (pool.length < 4) { RU.toast('Lerne zuerst mindestens 4 Buchstaben – oder wähle „Alle“.'); return; }
        const pick = U.sample(pool, Math.min(cfg.count, pool.length));
        while (pick.length < cfg.count) pick.push(U.pick(pool));
        const questions = pick.map((L) => {
          const others = U.sample(RU.alphabet.filter((x) => x !== L), 3);
          const opts = [L, ...others];
          const dir = cfg.dir === 'mix' ? U.pick(['l2s', 's2l']) : cfg.dir;
          return dir === 'l2s'
            ? { label: 'Wie klingt dieser Buchstabe?', prompt: `<div class="big-letter">${L.up}${L.lo}</div>`, options: opts.map((x) => U.esc(x.tr)), answer: 0, speakAfter: L.word, review: { ru: `${L.up} ${L.lo}`, de: L.tr } }
            : { label: 'Welcher Buchstabe ist das?', prompt: `<div class="q-big">${U.esc(L.tr)}</div>`, sub: `<div class="muted">${U.esc(L.sound)}</div>`, options: opts.map((x) => `${x.up} ${x.lo}`), optClass: 'ru big', answer: 0, speakAfter: L.word, review: { ru: `${L.up} ${L.lo}`, de: L.tr } };
        });
        ui.mcRound(el, { questions, xpPer: 6, back: '#/alphabet', mode: 'alphabet-quiz', onRetry: () => letterQuiz(el), onFinish: (r) => {
          pick.forEach((L, i) => { if (!r.mistakes.some((m) => m.ru.startsWith(L.up))) markLearned(L); });
        } });
      },
    });
  };

  /* Wort lesen → Umschrift wählen */
  const readQuiz = (el) => {
    ui.setup(el, {
      title: 'Lesetraining', subtitle: 'Lies das kyrillische Wort und wähle die richtige Aussprache.', back: '#/alphabet',
      onStart: (cfg) => {
        const words = ui.pickWords(cfg.topic, cfg.count, (w) => !/[ ?]/.test(w.ru));
        const questions = words.map((w) => {
          const ds = RU.distractors(w, 3, 'ru').filter((d) => !/[ ?]/.test(d.ru));
          const opts = [w, ...ds].slice(0, 4);
          return { label: 'Wie liest man dieses Wort?', prompt: `<div class="q-big ru">${U.esc(w.ru)}</div>`, options: opts.map((x) => U.esc(RU.translit(x.ru))), answer: 0, speakAfter: w.ru, explain: `Bedeutung: <b>${U.esc(w.de)}</b>`, wordId: null, review: { ru: w.ru, de: `${RU.translit(w.ru)} – ${w.de}` } };
        });
        ui.mcRound(el, { questions, xpPer: 8, back: '#/alphabet', mode: 'alphabet-read', onRetry: () => readQuiz(el) });
      },
    });
  };

  /* Tipptraining: Buchstabe auf der Bildschirmtastatur finden */
  const typeTrainer = (el) => {
    RU.markMode('alphabet-type');
    let score = 0, total = 0, streak = 0, target = null, start = Date.now(), xp = 0;
    const ROUND = 20;
    const nextLetter = () => {
      target = U.pick(RU.alphabet.filter((L) => L !== target));
      el.querySelector('.tt-target').innerHTML = `<span class="tt-tr">${U.esc(target.tr)}</span><small>${U.esc(target.sound)}</small>`;
      el.querySelector('.tt-progress span').style.width = `${(total / ROUND) * 100}%`;
      el.querySelector('.tt-score').textContent = `${score} / ${total}`;
    };
    el.innerHTML = `
      ${ui.pageHead('Tipptraining', 'Finde den passenden Buchstaben auf der russischen Tastatur (ЙЦУКЕН).', '#/alphabet')}
      <div class="card tt">
        <div class="tt-top"><div class="progress tt-progress"><span></span></div><b class="tt-score">0 / 0</b></div>
        <div class="tt-target"></div>
        <div class="tt-kb"></div>
        <p class="muted small center">Tipp: Mit einer russischen Tastatur kannst du auch direkt tippen.</p>
      </div>`;
    const kb = ui.keyboard(null, {
      compact: true,
      onKey: (k) => {
        if (k === '⌫' || !target) return;
        const btn = el.querySelector(`.vkey[data-k="${k}"]`);
        total++;
        if (k === target.lo) {
          score++; streak++; RU.sfx('correct'); btn.classList.add('flash-good'); const g = 3 + Math.min(streak, 5); xp += g; RU.addXP(g);
        } else {
          streak = 0; RU.sfx('wrong'); btn.classList.add('flash-bad');
          el.querySelector(`.vkey[data-k="${target.lo}"]`).classList.add('flash-good');
        }
        setTimeout(() => el.querySelectorAll('.vkey').forEach((b) => b.classList.remove('flash-good', 'flash-bad')), 450);
        if (total >= ROUND) {
          const secs = Math.round((Date.now() - start) / 1000);
          setTimeout(() => ui.results(el, { score, total, xp, back: '#/alphabet', onRetry: () => typeTrainer(el), extra: [{ label: 'Sekunden', value: secs, icon: RU.icon('clock', 18) }] }), 500);
          target = null;
        } else setTimeout(nextLetter, 350);
      },
    });
    el.querySelector('.tt-kb').appendChild(kb);
    RU.keyHandler = (e) => { if (/^[а-яё]$/i.test(e.key)) { e.preventDefault(); kb.querySelector(`.vkey[data-k="${e.key.toLowerCase()}"]`)?.click(); } };
    nextLetter();
  };

  RU.views.alphabet = {
    title: 'Alphabet',
    render(el, parts, query) {
      if (parts[0] === 'quiz') return letterQuiz(el);
      if (parts[0] === 'read') return readQuiz(el);
      if (parts[0] === 'type') return typeTrainer(el);
      overview(el, query);
    },
  };
})();
