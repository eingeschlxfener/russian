/* Wiederverwendbare UI-Bausteine: Icons, Setup-Screen, Quiz-Runde, Ergebnis, Tastatur, Modal */
(function () {
  'use strict';
  const RU = window.RU, U = RU.util;
  const ui = (RU.ui = {});

  /* ---------------- Icons (Linien-Icons) ---------------- */
  const P = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    letters: '<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
    cards: '<rect x="3" y="7" width="14" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    headphones: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',
    mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3"/>',
    gamepad: '<rect x="2" y="6" width="20" height="12" rx="6"/><path d="M6 12h4M8 10v4"/><circle cx="15" cy="11" r=".8"/><circle cx="18" cy="13" r=".8"/>',
    layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
    hash: '<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    swap: '<path d="m17 2 4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="m7 22-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    volume: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',
    flame: '<path d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 2-5 3-6 0 2 1 3 2 3 0-4-1-6 1-9z"/>',
    bolt: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    left: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    right: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    bulb: '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>',
    keyboard: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 13h.01M18 13h.01M10 13h4M7 16h10"/>',
    play: '<path d="m7 4 13 8-13 8z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
    star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    sparkles: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    more: '<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    skip: '<path d="m5 4 10 8-10 8zM19 5v14"/>',
  };
  RU.icon = (name, size = 20, cls = '') => `<svg class="ico ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ''}</svg>`;

  /* ---------------- Kleine Bausteine ---------------- */
  ui.speakBtn = (text, cls = '', size = 18) => `<button class="icon-btn speak ${cls}" type="button" data-speak="${U.esc(text)}" title="Anhören" aria-label="Anhören">${RU.icon('volume', size)}</button>`;
  ui.translit = (ru, cls = '') => (RU.state.settings.translit ? `<div class="translit ${cls}">${U.esc(RU.translit(ru))}</div>` : '');
  ui.ring = (pct, size = 64, stroke = 7, color = 'var(--red)', inner = '') => {
    const r = (size - stroke) / 2, c = 2 * Math.PI * r, off = c * (1 - U.clamp(pct, 0, 1));
    return `<div class="ring" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="var(--track)" stroke-width="${stroke}" fill="none"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="${color}" stroke-width="${stroke}" fill="none" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${off}" transform="rotate(-90 ${size / 2} ${size / 2})"/></svg><div class="ring-inner">${inner}</div></div>`;
  };
  ui.pageHead = (title, sub = '', back = '', extra = '') => `
    <header class="page-head">
      ${back ? `<a class="icon-btn back" href="${back}" aria-label="Zurück">${RU.icon('left')}</a>` : ''}
      <div class="page-head-text"><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div>
      ${extra ? `<div class="page-head-extra">${extra}</div>` : ''}
    </header>`;
  ui.levelDots = (b) => `<span class="dots" title="Lernstufe ${Math.max(0, b)}/6">${[1, 2, 3, 4, 5, 6].map((i) => `<i class="${b >= i ? 'on' : ''}"></i>`).join('')}</span>`;
  ui.empty = (icon, title, text, action = '') => `<div class="empty"><div class="empty-ico">${icon}</div><h3>${title}</h3><p>${text}</p>${action}</div>`;

  /* ---------------- Modal ---------------- */
  ui.modal = (html, cls = '') => {
    const wrap = U.html(`<div class="modal-wrap"><div class="modal ${cls}" role="dialog" aria-modal="true"><button class="icon-btn modal-close" aria-label="Schließen">${RU.icon('x')}</button>${html}</div></div>`);
    document.body.appendChild(wrap);
    requestAnimationFrame(() => wrap.classList.add('open'));
    const close = () => { wrap.classList.remove('open'); setTimeout(() => wrap.remove(), 200); document.removeEventListener('keydown', onKey); };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    wrap.addEventListener('click', (e) => { if (e.target === wrap || e.target.closest('.modal-close')) close(); });
    RU.onCleanup(close);
    return { el: wrap.querySelector('.modal'), close };
  };

  /* ---------------- Kyrillische Bildschirmtastatur ---------------- */
  const KB_ROWS = ['йцукенгшщзхъ', 'фывапролджэ', 'ячсмитьбюё'];
  ui.keyboard = (input, opts = {}) => {
    const el = U.html(`<div class="vkbd ${opts.compact ? 'compact' : ''}">
      ${KB_ROWS.map((r, i) => `<div class="vkbd-row">${[...r].map((c) => `<button type="button" class="vkey" data-k="${c}">${c}</button>`).join('')}${i === 2 ? `<button type="button" class="vkey wide" data-k="⌫" aria-label="Löschen">⌫</button>` : ''}</div>`).join('')}
      ${opts.compact ? '' : `<div class="vkbd-row"><button type="button" class="vkey" data-k="-">-</button><button type="button" class="vkey space" data-k=" ">Leertaste</button><button type="button" class="vkey" data-k="?">?</button></div>`}
    </div>`);
    el.addEventListener('mousedown', (e) => e.preventDefault());
    el.addEventListener('click', (e) => {
      const b = e.target.closest('.vkey'); if (!b) return;
      const k = b.dataset.k;
      if (opts.onKey) return opts.onKey(k);
      if (!input) return;
      const s = input.selectionStart ?? input.value.length, en = input.selectionEnd ?? input.value.length;
      if (k === '⌫') {
        if (s === en && s > 0) input.setRangeText('', s - 1, s, 'end'); else input.setRangeText('', s, en, 'end');
      } else input.setRangeText(k, s, en, 'end');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      RU.sfx('tick');
    });
    return el;
  };
  /** Lateinische Eingabe automatisch in Kyrillisch umwandeln */
  ui.attachPhonetic = (input, isOn) => {
    input.addEventListener('input', () => {
      if (!isOn()) return;
      const v = input.value, conv = RU.latToCyr(v);
      if (conv !== v) { input.value = conv; input.setSelectionRange(conv.length, conv.length); }
    });
  };

  /* ---------------- Setup-Bildschirm für Übungen ---------------- */
  ui.topicChips = (selected, opts = {}) => {
    const special = [
      { id: 'all', icon: '🌍', name: 'Alle Wörter', n: RU.words.length },
      { id: 'due', icon: '⏰', name: 'Fällig', n: RU.srs.dueWords().length },
      { id: 'weak', icon: '🩹', name: 'Schwache Wörter', n: RU.srs.weakWords().length },
      { id: 'new', icon: '✨', name: 'Neue Wörter', n: RU.srs.newWords().length },
    ];
    const list = (opts.special === false ? [] : special).concat(RU.topics.map((t) => ({ id: t.id, icon: t.icon, name: t.name, n: t.list.length })));
    return `<div class="chips topic-chips">${list.map((t) => `<button type="button" class="chip ${t.id === selected ? 'active' : ''}" data-topic="${t.id}" ${t.n === 0 ? 'disabled' : ''}><span>${t.icon}</span>${U.esc(t.name)}<small>${t.n}</small></button>`).join('')}</div>`;
  };

  ui.setup = (el, cfg) => {
    const state = { topic: cfg.query?.topic || cfg.defaultTopic || 'all', count: cfg.defaultCount || 10 };
    (cfg.groups || []).forEach((g) => { state[g.key] = cfg.query?.[g.key] || g.value || g.options[0].id; });
    if (RU.pool(state.topic).length === 0) state.topic = 'all';
    const render = () => {
      el.innerHTML = `
      ${ui.pageHead(cfg.title, cfg.subtitle, cfg.back || '#/practice')}
      <div class="setup card">
        ${cfg.intro ? `<div class="setup-intro">${cfg.intro}</div>` : ''}
        ${cfg.showTopic === false ? '' : `<div class="setup-group"><label>Thema</label>${ui.topicChips(state.topic)}</div>`}
        ${(cfg.groups || []).map((g) => `<div class="setup-group"><label>${g.label}</label><div class="chips">${g.options.map((o) => `<button type="button" class="chip ${state[g.key] === o.id ? 'active' : ''}" data-group="${g.key}" data-val="${o.id}">${o.label}</button>`).join('')}</div></div>`).join('')}
        ${cfg.counts === false ? '' : `<div class="setup-group"><label>Anzahl</label><div class="chips">${(cfg.counts || [5, 10, 20]).map((n) => `<button type="button" class="chip ${state.count === n ? 'active' : ''}" data-count="${n}">${n}</button>`).join('')}</div></div>`}
        <div class="setup-foot">
          <div class="muted small">${cfg.showTopic === false ? '' : `${RU.pool(state.topic).length} Wörter im Pool`}</div>
          <button class="btn primary lg" id="start-btn">${RU.icon('play', 18)} Los geht's</button>
        </div>
      </div>`;
      el.querySelectorAll('[data-topic]').forEach((b) => b.onclick = () => { state.topic = b.dataset.topic; RU.sfx('click'); render(); });
      el.querySelectorAll('[data-group]').forEach((b) => b.onclick = () => { state[b.dataset.group] = b.dataset.val; RU.sfx('click'); render(); });
      el.querySelectorAll('[data-count]').forEach((b) => b.onclick = () => { state.count = +b.dataset.count; RU.sfx('click'); render(); });
      el.querySelector('#start-btn').onclick = () => cfg.onStart({ ...state });
    };
    RU.keyHandler = (e) => { if (e.key === 'Enter' && e.target.tagName !== 'INPUT') { e.preventDefault(); el.querySelector('#start-btn')?.click(); } };
    render();
  };

  /** Wörter für eine Runde wählen: fällige/schwache zuerst */
  ui.pickWords = (topic, count, filter) => {
    let pool = RU.pool(topic);
    if (filter) pool = pool.filter(filter);
    if (!pool.length) pool = RU.words.filter(filter || (() => true));
    const now = Date.now();
    const scored = U.shuffle(pool).map((w) => { const e = RU.state.srs[w.id]; let p = Math.random(); if (e && e.due <= now) p += 2; if (e && e.w > e.c) p += 1; return [p, w]; });
    scored.sort((a, b) => b[0] - a[0]);
    return scored.slice(0, count).map((x) => x[1]);
  };

  /* ---------------- Multiple-Choice-Runde ---------------- */
  ui.mcRound = (el, cfg) => {
    const qs = cfg.questions;
    let i = 0, score = 0, combo = 0, maxCombo = 0, xpTotal = 0, locked = false;
    const mistakes = [];
    if (cfg.mode) RU.markMode(cfg.mode);

    const show = () => {
      locked = false;
      const q = qs[i];
      if (!q.order) { q.order = U.shuffle(q.options.map((_, k) => k)); }
      el.innerHTML = `
      <div class="session">
        <div class="session-top">
          <a class="icon-btn" href="${cfg.back || '#/home'}" aria-label="Beenden">${RU.icon('x')}</a>
          <div class="progress"><span style="width:${(i / qs.length) * 100}%"></span></div>
          <div class="combo ${combo >= 2 ? 'on' : ''}">${RU.icon('flame', 16)} ${combo}</div>
        </div>
        <div class="q-card ${q.cls || ''}">
          ${q.label ? `<div class="q-label">${q.label}</div>` : ''}
          <div class="q-prompt">${q.prompt}</div>
          ${q.sub || ''}
        </div>
        <div class="options ${q.options.length > 4 ? 'many' : ''}">
          ${q.order.map((k, n) => `<button class="opt ${q.optClass || ''}" data-k="${k}"><kbd>${n + 1}</kbd><span>${q.options[k]}</span></button>`).join('')}
        </div>
        <div class="feedback" aria-live="polite"></div>
        <div class="session-count muted small">${i + 1} / ${qs.length}</div>
      </div>`;
      el.querySelectorAll('.opt').forEach((b) => b.onclick = () => choose(+b.dataset.k, b));
      if (q.speakOnShow) setTimeout(() => RU.speak(q.speakOnShow), 250);
    };

    const choose = (k, btn) => {
      if (locked) return; locked = true;
      const q = qs[i], ok = k === q.answer;
      el.querySelectorAll('.opt').forEach((b) => { b.disabled = true; if (+b.dataset.k === q.answer) b.classList.add('correct'); });
      RU.state.stats.answers++;
      if (q.wordId) RU.srs.answer(q.wordId, ok);
      const fb = el.querySelector('.feedback');
      if (ok) {
        score++; combo++; maxCombo = Math.max(maxCombo, combo);
        RU.state.stats.correct++;
        const gain = (cfg.xpPer || 10) + Math.min(combo - 1, 5) * 2;
        xpTotal += gain; RU.addXP(gain);
        RU.sfx('correct');
        btn.classList.add('pulse');
        if (q.speakAfter && RU.state.settings.autoplay) RU.speak(q.speakAfter);
        if (q.explain) {
          fb.innerHTML = `<div class="fb good">${RU.icon('check', 18)} <div><b>Richtig!</b> ${q.explain}</div></div><button class="btn primary" id="next">Weiter ${RU.icon('right', 16)}</button>`;
          fb.querySelector('#next').onclick = next;
          const cur = i; RU.later(() => { if (i === cur) next(); }, 1800);
        } else { const cur = i; RU.later(() => { if (i === cur) next(); }, q.speakAfter ? 1000 : 700); }
      } else {
        combo = 0; btn.classList.add('wrong', 'shake');
        RU.sfx('wrong');
        if (q.review) mistakes.push(q.review);
        fb.innerHTML = `<div class="fb bad">${RU.icon('x', 18)} <div><b>Leider falsch.</b> Richtig: <span class="${q.optClass || ''}">${q.options[q.answer]}</span>${q.explain ? `<br><span class="muted">${q.explain}</span>` : ''}</div></div><button class="btn primary" id="next">Weiter ${RU.icon('right', 16)}</button>`;
        fb.querySelector('#next').onclick = next;
        if (q.speakAfter && RU.state.settings.autoplay) RU.speak(q.speakAfter);
      }
      RU.save();
      requestAnimationFrame(() => fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
    };

    const next = () => {
      i++;
      if (i < qs.length) show();
      else finish();
    };
    const finish = () => {
      RU.keyHandler = null;
      if (score === qs.length) { RU.state.stats.perfect++; RU.save(); RU.checkAchievements(); }
      const bonus = score === qs.length ? 15 : 0;
      if (bonus) { RU.addXP(bonus); xpTotal += bonus; }
      cfg.onFinish && cfg.onFinish({ score, total: qs.length, mistakes });
      ui.results(el, { score, total: qs.length, xp: xpTotal, mistakes, maxCombo, onRetry: cfg.onRetry, back: cfg.back, title: cfg.title });
    };

    RU.keyHandler = (e) => {
      if (e.target.tagName === 'INPUT') return;
      const n = parseInt(e.key, 10);
      if (!locked && n >= 1 && n <= qs[i].options.length) { const b = el.querySelectorAll('.opt')[n - 1]; b && b.click(); }
      else if (e.key === 'Enter' || e.key === ' ') { const nb = el.querySelector('#next'); if (nb) { e.preventDefault(); nb.click(); } }
    };
    show();
  };

  /* ---------------- Ergebnis-Bildschirm ---------------- */
  ui.results = (el, r) => {
    const pct = r.total ? Math.round((r.score / r.total) * 100) : 0;
    const msg = pct === 100 ? ['Идеально!', 'Perfekt – keine Fehler!'] : pct >= 80 ? ['Отлично!', 'Ausgezeichnet gemacht!'] : pct >= 50 ? ['Хорошо!', 'Gut gemacht – weiter so!'] : ['Не сдавайся!', 'Nicht aufgeben – Übung macht den Meister.'];
    RU.sfx(pct >= 50 ? 'level' : 'end');
    if (pct >= 80) setTimeout(() => RU.confetti(), 150);
    el.innerHTML = `
    <div class="results">
      <div class="results-hero">
        ${ui.ring(pct / 100, 150, 12, pct >= 80 ? 'var(--green)' : pct >= 50 ? 'var(--gold)' : 'var(--red)', `<b>${pct}%</b><small>${r.score}/${r.total}</small>`)}
        <h2 class="display">${msg[0]}</h2>
        <p class="muted">${msg[1]}</p>
      </div>
      <div class="results-stats">
        <div class="stat-pill gold">${RU.icon('bolt', 18)}<b>+${r.xp || 0}</b><span>XP</span></div>
        ${r.maxCombo != null ? `<div class="stat-pill red">${RU.icon('flame', 18)}<b>${r.maxCombo}</b><span>Beste Serie</span></div>` : ''}
        ${(r.extra || []).map((x) => `<div class="stat-pill blue">${x.icon || ''}<b>${x.value}</b><span>${x.label}</span></div>`).join('')}
      </div>
      ${r.mistakes && r.mistakes.length ? `
        <div class="card mistakes">
          <h3>Zum Wiederholen</h3>
          <ul>${r.mistakes.map((m) => `<li><span class="ru">${U.esc(m.ru)}</span>${ui.speakBtn(m.ru, 'sm', 16)}<span class="arrow">→</span><span>${U.esc(m.de)}</span></li>`).join('')}</ul>
        </div>` : ''}
      <div class="results-actions">
        ${r.onRetry ? `<button class="btn primary lg" id="retry">${RU.icon('refresh', 18)} Nochmal</button>` : ''}
        <a class="btn ghost lg" href="${r.back || '#/home'}">Fertig</a>
      </div>
    </div>`;
    const rb = el.querySelector('#retry');
    if (rb) rb.onclick = r.onRetry;
    RU.keyHandler = (e) => { if (e.key === 'Enter' && rb) { e.preventDefault(); rb.click(); } };
  };
})();
