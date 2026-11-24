/* Üben: Karteikarten, Quiz, Schreiben, Hören, Sprechen */
(function () {
  const RU = window.RU, U = RU.util, ui = RU.ui;

  /* ================= Übersicht ================= */
  const hub = (el) => {
    const due = RU.srs.dueWords().length;
    const modes = [
      ['flashcards', 'cards', 'Karteikarten', 'Intelligentes Wiederholen nach dem Leitner-System. Was du gut kannst, kommt seltener.', 'violet', due ? `${due} fällig` : ''],
      ['quiz', 'target', 'Quiz', 'Wähle die richtige Übersetzung aus vier Möglichkeiten. Mit Combo-Bonus!', 'gold', ''],
      ['write', 'pen', 'Schreiben', 'Tippe die Übersetzung – mit kyrillischer Bildschirmtastatur und Lautschrift-Eingabe.', 'green', ''],
      ['listen', 'headphones', 'Hören', 'Verstehe gesprochenes Russisch: Bedeutung wählen oder Diktat schreiben.', 'blue', ''],
      ['speak', 'mic', 'Sprechen', 'Sprich Wörter ins Mikrofon und lass deine Aussprache prüfen.', 'red', RU.speech.recognitionSupported ? '' : 'eingeschränkt'],
    ];
    el.innerHTML = `
      ${ui.pageHead('Üben', 'Fünf Übungsarten für jeden Lerntyp. Alle Übungen passen sich deinem Fortschritt an.')}
      <div class="mode-grid">
        ${modes.map(([r, ic, t, d, c, badge]) => `<a class="mode-card ${c}" href="#/practice/${r}"><span class="mode-ico">${RU.icon(ic, 28)}</span><div><b>${t}</b>${badge ? `<span class="tag ${c}">${badge}</span>` : ''}<p>${d}</p></div>${RU.icon('right', 20, 'mode-arrow')}</a>`).join('')}
      </div>`;
  };

  /* ================= Karteikarten ================= */
  const fmtInterval = (days) => days < 0.01 ? '1 Min' : days < 1 ? `${Math.round(days * 24)} Std` : days === 1 ? '1 Tag' : `${Math.round(days)} Tage`;
  const INTERVALS = [0, 1, 2, 4, 8, 16, 32];
  const preview = (id, grade) => {
    const b = RU.srs.get(id)?.b || 0;
    if (grade === 0) return '1 Min';
    if (grade === 1) return fmtInterval(Math.max(0.5, INTERVALS[Math.max(1, b)] / 2));
    return fmtInterval(INTERVALS[Math.min(6, b + (grade === 3 ? 2 : 1))]);
  };

  const flashcards = (el, query) => {
    const due = RU.srs.dueWords().length;
    ui.setup(el, {
      title: 'Karteikarten', subtitle: 'Decke die Karte auf und bewerte ehrlich, wie gut du das Wort wusstest.', query,
      defaultTopic: due ? 'due' : 'all',
      groups: [{ key: 'side', label: 'Vorderseite', options: [{ id: 'ru', label: '🇷🇺 Russisch' }, { id: 'de', label: '🇩🇪 Deutsch' }, { id: 'mix', label: '🔀 Gemischt' }] }],
      onStart: (cfg) => runCards(el, ui.pickWords(cfg.topic, cfg.count), cfg, query),
    });
  };

  const runCards = (el, words, cfg, query) => {
    RU.markMode('flashcards');
    const queue = words.slice(), requeued = new Set();
    let flipped = false, xp = 0, done = 0;
    const counts = [0, 0, 0, 0];
    const total = words.length;
    const show = () => {
      if (!queue.length) return finish();
      flipped = false;
      const w = queue[0], front = cfg.side === 'mix' ? U.pick(['ru', 'de']) : cfg.side;
      const ruSide = `<div class="fc-word ru">${U.esc(w.ru)}</div>${ui.translit(w.ru)}`;
      const deSide = `<div class="fc-word">${U.esc(w.de)}</div>`;
      const b = RU.srs.level(w.id), t = RU.topicById[w.topic];
      el.innerHTML = `
      <div class="session">
        <div class="session-top">
          <a class="icon-btn" href="#/practice" aria-label="Beenden">${RU.icon('x')}</a>
          <div class="progress"><span style="width:${(done / total) * 100}%"></span></div>
          <div class="muted small">${done}/${total}</div>
        </div>
        <div class="flashcard" tabindex="0" role="button" aria-label="Karte umdrehen">
          <div class="fc-inner">
            <div class="fc-face fc-front">
              <div class="fc-meta"><span>${t.icon} ${U.esc(t.name)}</span>${ui.levelDots(b)}</div>
              ${front === 'ru' ? ruSide : deSide}
              ${front === 'ru' ? ui.speakBtn(w.ru, 'fc-speak', 22) : ''}
              <div class="fc-tap muted small">Tippen zum Umdrehen · Leertaste</div>
            </div>
            <div class="fc-face fc-back">
              <div class="fc-meta"><span>${front === 'ru' ? '🇩🇪 Deutsch' : '🇷🇺 Russisch'}</span></div>
              ${front === 'ru' ? deSide : ruSide}
              ${ui.speakBtn(w.ru, 'fc-speak', 22)}
            </div>
          </div>
        </div>
        <div class="rate-row">
          ${[['Nochmal', 'red'], ['Schwer', 'gold'], ['Gut', 'green'], ['Leicht', 'blue']].map(([l, c], g) => `<button class="rate ${c}" data-g="${g}" disabled><kbd>${g + 1}</kbd><b>${l}</b><small>${preview(w.id, g)}</small></button>`).join('')}
        </div>
      </div>`;
      const card = el.querySelector('.flashcard');
      card.onclick = flip;
      el.querySelectorAll('.rate').forEach((btn) => btn.onclick = () => rate(+btn.dataset.g));
      if (front === 'ru' && RU.state.settings.autoplay) RU.speak(w.ru);
      card.dataset.front = front;
    };
    const flip = () => {
      const card = el.querySelector('.flashcard');
      flipped = !flipped; card.classList.toggle('flipped', flipped); RU.sfx('flip');
      el.querySelectorAll('.rate').forEach((b) => b.disabled = false);
      el.querySelector('.rate-row').classList.add('ready');
      if (flipped && card.dataset.front === 'de' && RU.state.settings.autoplay) RU.speak(queue[0].ru);
    };
    const rate = (g) => {
      if (!el.querySelector('.rate-row.ready')) return;
      const w = queue.shift();
      RU.srs.rate(w.id, g);
      counts[g]++;
      const gain = [2, 5, 8, 10][g]; xp += gain; RU.addXP(gain);
      if (g === 0 && !requeued.has(w.id)) { requeued.add(w.id); queue.splice(Math.min(queue.length, 3), 0, w); }
      else done++;
      RU.sfx(g === 0 ? 'wrong' : 'correct');
      show();
    };
    const finish = () => {
      RU.keyHandler = null;
      const known = total - requeued.size;
      ui.results(el, {
        score: known, total, xp, back: query.topic && RU.topicById[query.topic] ? `#/vocab/${query.topic}` : '#/practice',
        onRetry: () => flashcards(el, query),
        extra: [{ label: 'Leicht', value: counts[3], icon: '⚡' }, { label: 'Gut', value: counts[2], icon: '👍' }, { label: 'Nochmal', value: counts[0], icon: '🔁' }],
      });
    };
    RU.keyHandler = (e) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!flipped) flip(); else if (e.key === 'Enter') rate(2); }
      const n = parseInt(e.key, 10); if (n >= 1 && n <= 4) rate(n - 1);
    };
    show();
  };

  /* ================= Quiz ================= */
  const quiz = (el, query) => {
    ui.setup(el, {
      title: 'Vokabel-Quiz', subtitle: 'Vier Antworten, eine ist richtig. Richtige Antworten in Folge geben Bonus-XP!', query,
      groups: [{ key: 'dir', label: 'Richtung', options: [{ id: 'ru-de', label: 'Russisch → Deutsch' }, { id: 'de-ru', label: 'Deutsch → Russisch' }, { id: 'mix', label: 'Gemischt' }] }],
      onStart: (cfg) => {
        const words = ui.pickWords(cfg.topic, cfg.count);
        const questions = words.map((w) => {
          const dir = cfg.dir === 'mix' ? U.pick(['ru-de', 'de-ru']) : cfg.dir;
          const opts = [w, ...RU.distractors(w, 3, dir === 'ru-de' ? 'de' : 'ru')];
          const t = RU.topicById[w.topic];
          return dir === 'ru-de'
            ? { label: `${t.icon} Was bedeutet …`, prompt: `<div class="q-big ru">${U.esc(w.ru)}</div>`, sub: `<div class="q-sub">${ui.translit(w.ru)}${ui.speakBtn(w.ru)}</div>`, options: opts.map((x) => U.esc(x.de)), answer: 0, wordId: w.id, speakAfter: w.ru, review: w }
            : { label: `${t.icon} Wie sagt man auf Russisch …`, prompt: `<div class="q-big">${U.esc(w.de)}</div>`, options: opts.map((x) => U.esc(x.ru)), optClass: 'ru', answer: 0, wordId: w.id, speakAfter: w.ru, review: w };
        });
        ui.mcRound(el, { questions, back: backFor(query), mode: 'quiz', onRetry: () => quiz(el, query) });
      },
    });
  };
  const backFor = (query) => (query.topic && RU.topicById[query.topic] ? `#/vocab/${query.topic}` : '#/practice');

  /* ================= Tipp-Engine (Schreiben & Diktat) ================= */
  const runTyping = (el, items, opt) => {
    RU.markMode(opt.mode);
    let i = 0, score = 0, xp = 0, hints = 0, state = 'input';
    const mistakes = [];
    const S = RU.state.settings;
    let showKb = opt.lang === 'ru' && matchMedia('(pointer: coarse)').matches === false;

    const show = () => {
      state = 'input'; hints = 0;
      const it = items[i];
      el.innerHTML = `
      <div class="session">
        <div class="session-top">
          <a class="icon-btn" href="${opt.back}" aria-label="Beenden">${RU.icon('x')}</a>
          <div class="progress"><span style="width:${(i / items.length) * 100}%"></span></div>
          <div class="muted small">${i + 1}/${items.length}</div>
        </div>
        <div class="q-card">
          <div class="q-label">${opt.label(it)}</div>
          <div class="q-prompt">${opt.prompt(it)}</div>
        </div>
        <div class="type-box">
          <input id="ans" class="type-input ${opt.lang === 'ru' ? 'ru' : ''}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${opt.lang === 'ru' ? 'Auf Russisch schreiben …' : 'Auf Deutsch schreiben …'}" lang="${opt.lang}">
          <div class="type-tools">
            <button class="btn ghost sm" id="hint">${RU.icon('bulb', 14)} Tipp</button>
            ${opt.lang === 'ru' ? `<button class="btn ghost sm ${showKb ? 'active' : ''}" id="kbtoggle">${RU.icon('keyboard', 14)} Tastatur</button>
            <label class="switch sm" title="Lateinische Buchstaben automatisch umwandeln (z. B. privet → привет)"><input type="checkbox" id="phon" ${S.phonetic ? 'checked' : ''}><span></span>abc→абв</label>` : ''}
            <span class="spacer"></span>
            <button class="btn ghost sm" id="skip">Weiß nicht</button>
            <button class="btn primary" id="check">Prüfen</button>
          </div>
          <div class="kb-slot"></div>
        </div>
        <div class="feedback" aria-live="polite"></div>
      </div>`;
      const inp = el.querySelector('#ans');
      if (opt.lang === 'ru') {
        ui.attachPhonetic(inp, () => S.phonetic);
        el.querySelector('#phon').onchange = (e) => { S.phonetic = e.target.checked; RU.save(); inp.focus(); };
        const slot = el.querySelector('.kb-slot');
        const kb = ui.keyboard(inp); slot.appendChild(kb); slot.hidden = !showKb;
        el.querySelector('#kbtoggle').onclick = (e) => { showKb = !showKb; slot.hidden = !showKb; e.currentTarget.classList.toggle('active', showKb); inp.focus(); };
      }
      el.querySelector('#hint').onclick = () => {
        if (state !== 'input') return;
        const target = opt.expected(it).split(' / ')[0].replace(/\(.*?\)/g, '').trim();
        const cur = inp.value; let k = 0;
        while (k < cur.length && k < target.length && cur[k].toLowerCase() === target[k].toLowerCase()) k++;
        inp.value = target.slice(0, k + 1); hints++; inp.focus(); RU.sfx('click');
      };
      el.querySelector('#skip').onclick = () => check(true);
      el.querySelector('#check').onclick = () => check(false);
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); if (state === 'input') check(false); else next(); } });
      if (opt.onShow) opt.onShow(it);
      setTimeout(() => inp.focus(), 50);
    };

    const check = (skip) => {
      if (state !== 'input') return;
      const it = items[i], inp = el.querySelector('#ans');
      const expected = opt.expected(it);
      const res = skip ? false : U.check(inp.value, expected);
      if (!skip && !inp.value.trim()) { inp.classList.add('shake'); setTimeout(() => inp.classList.remove('shake'), 400); return; }
      state = 'done';
      inp.readOnly = true;
      RU.state.stats.answers++;
      if (it.id && RU.wordById[it.id]) RU.srs.answer(it.id, !!res);
      const fb = el.querySelector('.feedback');
      const sol = `<span class="${opt.lang === 'ru' ? 'ru' : ''}">${U.esc(expected)}</span>`;
      if (res) {
        score++; RU.state.stats.correct++;
        const gain = Math.max(3, (res === 'exact' ? 14 : 9) - hints * 3); xp += gain; RU.addXP(gain);
        inp.classList.add('good'); RU.sfx('correct');
        fb.innerHTML = `<div class="fb good">${RU.icon('check', 18)}<div><b>${res === 'exact' ? U.pick(['Правильно!', 'Отлично!', 'Супер!', 'Молодец!']) : 'Fast richtig!'}</b> ${res === 'close' ? `Genau: ${sol}` : ''}</div></div><button class="btn primary" id="next">Weiter ${RU.icon('right', 16)}</button>`;
      } else {
        inp.classList.add('bad'); RU.sfx('wrong');
        mistakes.push({ ru: it.ru, de: it.de });
        fb.innerHTML = `<div class="fb bad">${RU.icon('x', 18)}<div><b>${skip ? 'Kein Problem!' : 'Nicht ganz.'}</b> Richtig ist: ${sol}${!skip ? `<br><span class="muted">Deine Antwort: ${U.esc(inp.value)}</span>` : ''}</div></div><button class="btn primary" id="next">Weiter ${RU.icon('right', 16)}</button>`;
      }
      if (RU.state.settings.autoplay) RU.speak(it.ru);
      RU.save();
      el.querySelector('#next').onclick = next;
      el.querySelector('#next').focus({ preventScroll: true });
      fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    };
    const next = () => { i++; if (i < items.length) show(); else finish(); };
    const finish = () => {
      if (score === items.length) { RU.state.stats.perfect++; RU.save(); RU.checkAchievements(); }
      ui.results(el, { score, total: items.length, xp, mistakes, back: opt.back, onRetry: opt.onRetry });
    };
    RU.keyHandler = (e) => { if (state === 'done' && e.key === 'Enter' && e.target.tagName !== 'INPUT') { e.preventDefault(); next(); } };
    show();
  };
  RU.runTyping = runTyping;

  /* ================= Schreiben ================= */
  const write = (el, query) => {
    ui.setup(el, {
      title: 'Schreiben', subtitle: 'Tippe die Übersetzung. Ohne russische Tastatur? Kein Problem: Lautschrift-Eingabe (privet → привет) oder Bildschirmtastatur.', query,
      groups: [{ key: 'dir', label: 'Richtung', options: [{ id: 'de-ru', label: 'Deutsch → Russisch ✍️' }, { id: 'ru-de', label: 'Russisch → Deutsch' }] }],
      intro: `<div class="phon-help">${RU.icon('keyboard', 18)}<div><b>Lautschrift-Eingabe:</b> <code>sh</code>→ш <code>ch</code>→ч <code>zh</code>→ж <code>shch</code>→щ <code>ja</code>→я <code>ju</code>→ю <code>jo</code>→ё <code>y</code>→ы <code>'</code>→ь <code>eh</code>→э <code>c</code>→ц <code>h</code>/<code>x</code>→х <code>w</code>/<code>v</code>→в</div></div>`,
      onStart: (cfg) => {
        const words = ui.pickWords(cfg.topic, cfg.count);
        const ru = cfg.dir === 'de-ru';
        runTyping(el, words, {
          mode: 'write', lang: ru ? 'ru' : 'de', back: backFor(query), onRetry: () => write(el, query),
          label: (w) => `${RU.topicById[w.topic].icon} ${ru ? 'Schreibe auf Russisch' : 'Schreibe auf Deutsch'}`,
          prompt: (w) => ru ? `<div class="q-big">${U.esc(w.de)}</div>` : `<div class="q-big ru">${U.esc(w.ru)}</div><div class="q-sub">${ui.translit(w.ru)}${ui.speakBtn(w.ru)}</div>`,
          expected: (w) => (ru ? w.ru : w.de),
        });
      },
    });
  };

  /* ================= Hören ================= */
  const listen = (el, query) => {
    if (!RU.speech.supported) { el.innerHTML = ui.pageHead('Hören', '', '#/practice') + ui.empty('🔇', 'Keine Sprachausgabe', 'Dein Browser unterstützt leider keine Sprachausgabe. Probiere Chrome, Edge oder Safari.'); return; }
    ui.setup(el, {
      title: 'Hörverstehen', subtitle: 'Hör genau hin! Mit dem Lautsprecher-Knopf kannst du das Wort beliebig oft wiederholen.', query,
      intro: RU.speech.voices.length ? '' : `<div class="notice">${RU.icon('volume', 18)} Keine russische Stimme gefunden. Installiere in den Systemeinstellungen eine russische Stimme für die beste Qualität.</div>`,
      groups: [{ key: 'mode', label: 'Modus', options: [{ id: 'meaning', label: '🎧 Bedeutung wählen' }, { id: 'word', label: '👀 Wort erkennen' }, { id: 'dictation', label: '✍️ Diktat' }] }],
      onStart: (cfg) => {
        const words = ui.pickWords(cfg.topic, cfg.count);
        const speaker = (w) => `<button class="big-speaker" data-speak="${U.esc(w.ru)}" aria-label="Anhören">${RU.icon('volume', 42)}</button><button class="slow-btn" data-slow="${U.esc(w.ru)}">🐢 langsam</button>`;
        if (cfg.mode === 'dictation') {
          return runTyping(el, words, {
            mode: 'listen-dictation', lang: 'ru', back: backFor(query), onRetry: () => listen(el, query),
            label: () => 'Schreibe, was du hörst', prompt: speaker, expected: (w) => w.ru,
            onShow: (w) => setTimeout(() => RU.speak(w.ru), 300),
          });
        }
        const questions = words.map((w) => {
          const field = cfg.mode === 'meaning' ? 'de' : 'ru';
          const opts = [w, ...RU.distractors(w, 3, field)];
          return { label: cfg.mode === 'meaning' ? 'Was hast du gehört? Wähle die Bedeutung.' : 'Welches Wort hast du gehört?', prompt: speaker(w), options: opts.map((x) => U.esc(x[field])), optClass: field === 'ru' ? 'ru' : '', answer: 0, wordId: w.id, speakOnShow: w.ru, review: w, explain: cfg.mode === 'word' ? `= ${U.esc(w.de)}` : `= <span class="ru">${U.esc(w.ru)}</span>` };
        });
        ui.mcRound(el, { questions, back: backFor(query), mode: `listen-${cfg.mode}`, xpPer: 12, onRetry: () => listen(el, query) });
      },
    });
  };

  /* ================= Sprechen ================= */
  const speak = (el, query) => {
    const sr = RU.speech.recognitionSupported;
    ui.setup(el, {
      title: 'Aussprache-Training', subtitle: sr ? 'Hör dir das Wort an, drück auf das Mikrofon und sprich es nach.' : 'Hör zu, sprich laut nach und bewerte dich selbst.', query,
      intro: sr ? '' : `<div class="notice">${RU.icon('mic', 18)} Dein Browser unterstützt keine Spracherkennung (am besten klappt es in Chrome oder Edge). Du kannst trotzdem üben – mit Selbstbewertung.</div>`,
      groups: [{ key: 'kind', label: 'Was üben?', options: [{ id: 'words', label: 'Wörter' }, { id: 'phrases', label: 'Sätze & Phrasen' }] }],
      counts: [5, 10, 15],
      onStart: (cfg) => {
        const items = cfg.kind === 'phrases' ? U.sample(RU.phrases, cfg.count) : ui.pickWords(cfg.topic, cfg.count);
        runSpeak(el, items, query, sr);
      },
    });
  };

  const runSpeak = (el, items, query, sr) => {
    RU.markMode('speak');
    let i = 0, score = 0, xp = 0, tries = 0;
    const mistakes = [];
    const show = () => {
      tries = 0;
      const it = items[i];
      el.innerHTML = `
      <div class="session">
        <div class="session-top">
          <a class="icon-btn" href="${backFor(query)}" aria-label="Beenden">${RU.icon('x')}</a>
          <div class="progress"><span style="width:${(i / items.length) * 100}%"></span></div>
          <div class="muted small">${i + 1}/${items.length}</div>
        </div>
        <div class="q-card speak-card">
          <div class="q-label">Sprich nach:</div>
          <div class="q-big ru">${U.esc(it.ru)}</div>
          ${ui.translit(it.ru)}
          <div class="muted">${U.esc(it.de)}</div>
          <div class="speak-actions">
            <button class="btn ghost" data-speak="${U.esc(it.ru)}">${RU.icon('volume', 18)} Anhören</button>
            <button class="btn ghost" id="slow">🐢 Langsam</button>
          </div>
        </div>
        <div class="mic-zone">
          ${sr ? `<button class="mic-btn" id="mic" aria-label="Aufnehmen">${RU.icon('mic', 40)}</button><div class="mic-status muted">Tippe auf das Mikrofon und sprich</div>`
               : `<div class="self-rate"><p class="muted">Hast du es richtig ausgesprochen?</p><div class="row"><button class="btn soft red" id="sr-no">😕 Noch nicht</button><button class="btn soft green" id="sr-yes">😊 Ja, klang gut!</button></div></div>`}
        </div>
        <div class="feedback" aria-live="polite"></div>
      </div>`;
      el.querySelector('#slow').onclick = () => RU.speak(it.ru, { rate: 0.5 });
      if (RU.state.settings.autoplay) setTimeout(() => RU.speak(it.ru), 300);
      if (sr) el.querySelector('#mic').onclick = record;
      else {
        el.querySelector('#sr-yes').onclick = () => result(true, null);
        el.querySelector('#sr-no').onclick = () => result(false, null);
      }
    };
    const record = async () => {
      const it = items[i], btn = el.querySelector('#mic'), st = el.querySelector('.mic-status');
      if (btn.classList.contains('rec')) return;
      RU.speech.stop();
      btn.classList.add('rec'); st.textContent = 'Ich höre zu … 🎙️';
      try {
        const alts = await RU.speech.listen();
        btn.classList.remove('rec');
        if (!alts.length) { st.textContent = 'Nichts gehört – versuch es nochmal.'; return; }
        const target = U.normalize(it.ru);
        const ok = alts.some((a) => { const n = U.normalize(a); return n === target || n.includes(target) || (target.length >= 4 && U.levenshtein(n, target) <= Math.max(1, Math.floor(target.length / 8))); });
        tries++;
        if (ok) result(true, alts[0]);
        else {
          RU.sfx('wrong');
          st.innerHTML = `Ich habe <b class="ru">„${U.esc(alts[0])}“</b> verstanden. ${tries >= 2 ? '' : 'Versuch es nochmal!'}`;
          if (tries >= 2) {
            el.querySelector('.feedback').innerHTML = `<div class="row center"><button class="btn ghost" id="again">${RU.icon('refresh', 16)} Nochmal</button><button class="btn primary" id="skipw">Weiter ${RU.icon('right', 16)}</button></div>`;
            el.querySelector('#again').onclick = () => { el.querySelector('.feedback').innerHTML = ''; record(); };
            el.querySelector('#skipw').onclick = () => result(false, alts[0]);
          }
        }
      } catch (err) {
        btn.classList.remove('rec');
        st.innerHTML = err === 'not-allowed' ? 'Mikrofon-Zugriff verweigert. Erlaube den Zugriff in deinem Browser.' : 'Spracherkennung nicht verfügbar. Versuch es erneut.';
      }
    };
    const result = (ok, heard) => {
      const it = items[i];
      if (it.id && RU.wordById[it.id]) RU.srs.answer(it.id, ok);
      if (ok) {
        score++; RU.state.stats.spoken++; const gain = tries <= 1 ? 15 : 10; xp += gain; RU.addXP(gain); RU.sfx('correct');
        el.querySelector('.mic-zone').innerHTML = `<div class="big-check">${RU.icon('check', 48)}</div><div class="center"><b>${U.pick(['Отлично!', 'Прекрасно!', 'Здорово!'])}</b> ${heard ? `<span class="muted">Erkannt: <span class="ru">${U.esc(heard)}</span></span>` : ''}</div>`;
      } else mistakes.push({ ru: it.ru, de: it.de });
      RU.save(); RU.checkAchievements();
      RU.later(() => { i++; if (i < items.length) show(); else ui.results(el, { score, total: items.length, xp, mistakes, back: backFor(query), onRetry: () => speak(el, query) }); }, ok ? 1300 : 200);
    };
    RU.keyHandler = (e) => { if (e.key === ' ' && sr) { e.preventDefault(); el.querySelector('#mic')?.click(); } };
    show();
  };

  RU.views.practice = {
    title: 'Üben',
    render(el, parts, query) {
      const m = parts[0];
      if (m === 'flashcards') return flashcards(el, query);
      if (m === 'quiz') return quiz(el, query);
      if (m === 'write') return write(el, query);
      if (m === 'listen') return listen(el, query);
      if (m === 'speak') return speak(el, query);
      hub(el);
    },
  };
})();
