/* Spiele: Memory, Buchstabensalat, Zeitrennen, Luftballons, Wortregen, Satzbau */
(function () {
  const RU = window.RU, U = RU.util, ui = RU.ui;

  const GAMES = [
    { id: 'memory', icon: '🧩', title: 'Memory', desc: 'Finde die Paare aus russischem Wort und Übersetzung.', color: 'violet', stat: (g) => g.best ? `Bestzeit ${U.fmtTime(g.best)}` : '' },
    { id: 'blitz', icon: '⏱️', title: 'Zeitrennen', desc: '60 Sekunden: Stimmt die Übersetzung oder nicht? Schnell!', color: 'red', stat: (g) => g.best ? `Rekord ${g.best}` : '' },
    { id: 'rain', icon: '🌧️', title: 'Wortregen', desc: 'Wörter fallen vom Himmel – übersetze sie, bevor sie unten ankommen.', color: 'blue', stat: (g) => g.best ? `Rekord ${g.best}` : '' },
    { id: 'hangman', icon: '🎈', title: 'Luftballons', desc: 'Errate das Wort Buchstabe für Buchstabe, bevor alle Ballons platzen.', color: 'gold', stat: (g) => g.wins ? `${g.wins} gewonnen` : '' },
    { id: 'anagram', icon: '🔀', title: 'Buchstabensalat', desc: 'Bringe die durcheinandergewirbelten Buchstaben in die richtige Reihenfolge.', color: 'green', stat: (g) => g.solved ? `${g.solved} gelöst` : '' },
    { id: 'sentence', icon: '🧱', title: 'Satzbau', desc: 'Baue aus den Wortbausteinen einen korrekten russischen Satz.', color: 'violet', stat: (g) => g.solved ? `${g.solved} gelöst` : '' },
  ];

  const hub = (el) => {
    el.innerHTML = `
      ${ui.pageHead('Spiele', 'Lernen, ohne dass es sich wie Lernen anfühlt. Jedes Spiel bringt XP!')}
      <div class="game-grid">
        ${GAMES.map((g) => { const st = g.stat(RU.state.stats.games[g.id] || {}); return `
          <a class="game-card ${g.color}" href="#/games/${g.id}">
            <div class="gc-art">${g.icon}</div>
            <div class="gc-body"><b>${g.title}</b><p>${g.desc}</p>${st ? `<span class="tag">${RU.icon('trophy', 12)} ${st}</span>` : ''}</div>
          </a>`; }).join('')}
      </div>`;
  };

  /** Einfacher Start-Bildschirm für Spiele */
  const intro = (el, g, query, onStart, opts = {}) => {
    ui.setup(el, {
      title: `${g.icon} ${g.title}`, subtitle: g.desc, back: '#/games', query, counts: opts.counts || false,
      showTopic: opts.showTopic !== false, groups: opts.groups, defaultCount: opts.defaultCount,
      onStart: (cfg) => { RU.markMode(`game-${g.id}`); onStart(cfg); },
    });
  };
  const gameById = (id) => GAMES.find((g) => g.id === id);
  const finishGame = (el, id, r) => ui.results(el, { ...r, back: '#/games' });

  /* ================= Memory ================= */
  const memory = (el, query) => intro(el, gameById('memory'), query, (cfg) => {
    const pairs = +cfg.size;
    const words = ui.pickWords(cfg.topic, pairs, (w) => w.ru.length <= 16 && w.de.length <= 20);
    const cards = U.shuffle(words.flatMap((w) => [{ w, side: 'ru' }, { w, side: 'de' }]));
    let open = [], matched = 0, moves = 0, lock = false, start = Date.now(), timerId;
    el.innerHTML = `
      <div class="game-head">
        <a class="icon-btn" href="#/games" aria-label="Beenden">${RU.icon('x')}</a>
        <div class="game-stats"><span>${RU.icon('clock', 16)} <b id="mtime">0:00</b></span><span>Züge <b id="mmoves">0</b></span><span>Paare <b id="mpairs">0/${pairs}</b></span></div>
      </div>
      <div class="memory-grid size-${pairs}">
        ${cards.map((c, i) => `<button class="mem-card" data-i="${i}"><span class="mem-inner"><span class="mem-back">?</span><span class="mem-front ${c.side === 'ru' ? 'ru' : ''}">${U.esc(c.side === 'ru' ? c.w.ru : c.w.de)}</span></span></button>`).join('')}
      </div>`;
    timerId = RU.every(() => { const t = el.querySelector('#mtime'); if (t) t.textContent = U.fmtTime((Date.now() - start) / 1000); }, 500);
    el.querySelectorAll('.mem-card').forEach((b) => b.onclick = () => {
      const i = +b.dataset.i, c = cards[i];
      if (lock || b.classList.contains('open') || b.classList.contains('done')) return;
      b.classList.add('open'); RU.sfx('flip');
      if (c.side === 'ru') RU.speak(c.w.ru);
      open.push([b, c]);
      if (open.length === 2) {
        moves++; el.querySelector('#mmoves').textContent = moves;
        const [[b1, c1], [b2, c2]] = open; open = [];
        if (c1.w.id === c2.w.id) {
          matched++; RU.srs.answer(c1.w.id, true);
          setTimeout(() => { b1.classList.add('done'); b2.classList.add('done'); RU.sfx('correct'); }, 250);
          el.querySelector('#mpairs').textContent = `${matched}/${pairs}`;
          if (matched === pairs) {
            clearInterval(timerId);
            const secs = Math.round((Date.now() - start) / 1000);
            const g = RU.game('memory'); g.wins = (g.wins || 0) + 1; if (!g.best || secs < g.best) g.best = secs;
            const xp = 15 + pairs * 2 + Math.max(0, 20 - (moves - pairs) * 2);
            RU.addXP(xp);
            setTimeout(() => finishGame(el, 'memory', { score: pairs, total: moves, xp, onRetry: () => memory(el, query), extra: [{ label: 'Zeit', value: U.fmtTime(secs), icon: RU.icon('clock', 18) }, { label: 'Züge', value: moves, icon: '🃏' }] }), 900);
          }
        } else {
          lock = true;
          setTimeout(() => { b1.classList.add('miss'); b2.classList.add('miss'); RU.sfx('wrong'); }, 350);
          setTimeout(() => { b1.classList.remove('open', 'miss'); b2.classList.remove('open', 'miss'); lock = false; }, 1100);
        }
      }
    });
  }, { groups: [{ key: 'size', label: 'Größe', options: [{ id: '6', label: '6 Paare' }, { id: '8', label: '8 Paare' }, { id: '10', label: '10 Paare' }] }] });

  /* ================= Zeitrennen ================= */
  const blitz = (el, query) => intro(el, gameById('blitz'), query, (cfg) => {
    const pool = RU.pool(cfg.topic).length >= 4 ? RU.pool(cfg.topic) : RU.words;
    const DURATION = 60;
    let score = 0, combo = 0, maxCombo = 0, left = DURATION, cur = null, ended = false, total = 0;
    const end0 = Date.now();
    let endAt = end0 + DURATION * 1000;
    el.innerHTML = `
      <div class="game-head">
        <a class="icon-btn" href="#/games" aria-label="Beenden">${RU.icon('x')}</a>
        <div class="game-stats"><span>Punkte <b id="bscore">0</b></span><span class="combo on">${RU.icon('flame', 16)} <b id="bcombo">0</b></span></div>
      </div>
      <div class="timer-bar"><span id="tbar"></span></div>
      <div class="blitz-card">
        <div class="ru q-big" id="bru"></div>
        <div class="blitz-eq">=</div>
        <div class="q-big" id="bde"></div>
      </div>
      <div class="blitz-btns">
        <button class="blitz-btn no" id="bno">${RU.icon('x', 28)}<span>Falsch</span><kbd>←</kbd></button>
        <button class="blitz-btn yes" id="byes">${RU.icon('check', 28)}<span>Richtig</span><kbd>→</kbd></button>
      </div>`;
    const next = () => {
      const w = U.pick(pool), truth = Math.random() < 0.5;
      const shown = truth ? w : RU.distractors(w, 1, 'de')[0];
      cur = { w, truth };
      el.querySelector('#bru').textContent = w.ru;
      el.querySelector('#bde').textContent = shown.de;
      const card = el.querySelector('.blitz-card'); card.classList.remove('pop'); void card.offsetWidth; card.classList.add('pop');
    };
    const answer = (yes) => {
      if (ended) return;
      total++;
      const ok = yes === cur.truth, card = el.querySelector('.blitz-card');
      card.classList.remove('good', 'bad'); void card.offsetWidth; card.classList.add(ok ? 'good' : 'bad');
      if (ok) { score++; combo++; maxCombo = Math.max(maxCombo, combo); RU.sfx('correct'); if (combo % 5 === 0) { endAt += 3000; RU.toast('+3 Sekunden Bonus! ⏱️', 'green'); } }
      else { combo = 0; endAt -= 2000; RU.sfx('wrong'); }
      RU.srs.answer(cur.w.id, ok);
      el.querySelector('#bscore').textContent = score; el.querySelector('#bcombo').textContent = combo;
      next();
    };
    el.querySelector('#bno').onclick = () => answer(false);
    el.querySelector('#byes').onclick = () => answer(true);
    RU.keyHandler = (e) => { if (e.key === 'ArrowLeft') answer(false); if (e.key === 'ArrowRight') answer(true); };
    const tick = RU.every(() => {
      left = Math.max(0, (endAt - Date.now()) / 1000);
      const bar = el.querySelector('#tbar'); if (bar) { bar.style.width = `${Math.min(100, (left / DURATION) * 100)}%`; bar.classList.toggle('low', left < 10); }
      if (left <= 0 && !ended) {
        ended = true; clearInterval(tick); RU.keyHandler = null;
        const g = RU.game('blitz'); const rec = score > (g.best || 0); if (rec) g.best = score;
        const xp = score * 2 + (rec ? 10 : 0); RU.addXP(xp);
        if (rec && score > 0) RU.toast('🏆 Neuer Rekord!', 'gold');
        finishGame(el, 'blitz', { score, total: Math.max(total, 1), xp, maxCombo, onRetry: () => blitz(el, query), extra: [{ label: 'Rekord', value: g.best, icon: RU.icon('trophy', 18) }] });
      }
    }, 100);
    next();
  });

  /* ================= Wortregen ================= */
  const rain = (el, query) => intro(el, gameById('rain'), query, (cfg) => {
    const pool = RU.pool(cfg.topic).length >= 4 ? RU.pool(cfg.topic) : RU.words;
    let score = 0, lives = 3, speed = 34, y = 0, cur = null, alive = true, last = performance.now(), busy = false, raf;
    const missed = [];
    el.innerHTML = `
      <div class="game-head">
        <a class="icon-btn" href="#/games" aria-label="Beenden">${RU.icon('x')}</a>
        <div class="game-stats"><span>Punkte <b id="rscore">0</b></span><span class="hearts" id="rlives"></span></div>
      </div>
      <div class="rain-area" id="rarea"><div class="rain-word ru" id="rword"></div><div class="rain-ground"></div></div>
      <div class="options rain-opts" id="ropts"></div>`;
    const area = el.querySelector('#rarea'), wordEl = el.querySelector('#rword');
    const drawLives = () => { el.querySelector('#rlives').innerHTML = [0, 1, 2].map((k) => `<i class="${k < lives ? 'on' : ''}">${RU.icon('heart', 18)}</i>`).join(''); };
    const next = () => {
      const w = U.pick(pool);
      const opts = U.shuffle([w, ...RU.distractors(w, 3, 'de')]);
      cur = { w, opts }; y = 0; busy = false;
      wordEl.textContent = w.ru; wordEl.className = 'rain-word ru';
      wordEl.style.left = `${U.randInt(8, 52)}%`;
      el.querySelector('#ropts').innerHTML = opts.map((o, k) => `<button class="opt" data-k="${k}"><kbd>${k + 1}</kbd><span>${U.esc(o.de)}</span></button>`).join('');
      el.querySelectorAll('#ropts .opt').forEach((b) => b.onclick = () => pick(+b.dataset.k));
    };
    const lose = (reason) => {
      lives--; drawLives(); RU.sfx('wrong'); missed.push(cur.w); RU.srs.answer(cur.w.id, false);
      wordEl.classList.add(reason === 'ground' ? 'splash' : 'shake');
      el.querySelectorAll('#ropts .opt').forEach((b, k) => { b.disabled = true; if (cur.opts[k] === cur.w) b.classList.add('correct'); });
      busy = true;
      if (lives <= 0) return setTimeout(gameOver, 900);
      setTimeout(next, 1100);
    };
    const pick = (k) => {
      if (busy || !alive) return;
      if (cur.opts[k] === cur.w) {
        busy = true; score++; speed += 5; RU.sfx('pop'); RU.srs.answer(cur.w.id, true);
        el.querySelector('#rscore').textContent = score;
        wordEl.classList.add('burst'); RU.speak(cur.w.ru);
        setTimeout(next, 450);
      } else { el.querySelectorAll('#ropts .opt')[k].classList.add('wrong'); lose('wrong'); }
    };
    const loop = (t) => {
      if (!alive) return;
      const dt = Math.min(0.05, (t - last) / 1000); last = t;
      if (!busy && cur) {
        y += speed * dt;
        const max = area.clientHeight - wordEl.offsetHeight - 18;
        if (y >= max) { y = max; lose('ground'); }
        wordEl.style.transform = `translateY(${y}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    const gameOver = () => {
      alive = false; cancelAnimationFrame(raf); RU.keyHandler = null;
      const g = RU.game('rain'); const rec = score > (g.best || 0); if (rec) g.best = score;
      const xp = score * 3 + (rec ? 10 : 0); RU.addXP(xp);
      finishGame(el, 'rain', { score, total: score + missed.length, xp, mistakes: missed, onRetry: () => rain(el, query), extra: [{ label: 'Rekord', value: g.best, icon: RU.icon('trophy', 18) }] });
    };
    RU.onCleanup(() => { alive = false; cancelAnimationFrame(raf); });
    RU.keyHandler = (e) => { const n = parseInt(e.key, 10); if (n >= 1 && n <= 4) pick(n - 1); };
    drawLives(); next(); raf = requestAnimationFrame(loop);
  });

  /* ================= Luftballons (Wort raten) ================= */
  const BALLOON_COLORS = ['#e5383b', '#2f5bea', '#f2a516', '#14a37f', '#7b4dff', '#ff7aa8', '#00b4d8'];
  const hangman = (el, query) => intro(el, gameById('hangman'), query, (cfg) => {
    let wins = 0, played = 0, xpTotal = 0;
    const round = () => {
      const cands = RU.pool(cfg.topic).filter((w) => /^[а-яё]{3,12}$/i.test(w.ru));
      const w = U.pick(cands.length ? cands : RU.words.filter((x) => /^[а-яё]{4,12}$/i.test(x.ru)));
      const word = w.ru.toLowerCase(), guessed = new Set();
      let wrong = 0, over = false;
      const MAX = 7;
      el.innerHTML = `
        <div class="game-head">
          <a class="icon-btn" href="#/games" aria-label="Beenden">${RU.icon('x')}</a>
          <div class="game-stats"><span>Gewonnen <b>${wins}/${played}</b></span></div>
        </div>
        <div class="hang-wrap">
          <div class="balloons" id="balloons">${BALLOON_COLORS.map((c, k) => `<span class="balloon" style="--c:${c};--d:${k * 0.3}s;--r:${(k - 3) * 9}deg"></span>`).join('')}<span class="basket">🪆</span></div>
          <div class="hang-info">
            <div class="hint-chip">${RU.topicById[w.topic].icon} Bedeutung: <b>${U.esc(w.de)}</b></div>
            <div class="hang-word ru" id="hword"></div>
            <div class="muted small" id="hmsg">Rate einen Buchstaben!</div>
          </div>
        </div>
        <div class="hang-kb"></div>`;
      const kb = ui.keyboard(null, { compact: true, onKey: (k) => guess(k) });
      kb.querySelector('[data-k="⌫"]').remove();
      el.querySelector('.hang-kb').appendChild(kb);
      const draw = () => {
        el.querySelector('#hword').innerHTML = [...word].map((ch) => `<span class="${guessed.has(ch.replace('ё', 'е')) || guessed.has(ch) || over ? 'shown' : ''} ${over && !guessed.has(ch) ? 'missed' : ''}">${guessed.has(ch) || guessed.has(ch.replace('ё', 'е')) || over ? ch : ''}</span>`).join('');
      };
      const guess = (k) => {
        if (over || guessed.has(k)) return;
        guessed.add(k); if (k === 'е') guessed.add('ё');
        const btn = kb.querySelector(`[data-k="${k}"]`);
        if (word.includes(k) || (k === 'е' && word.includes('ё'))) { btn.classList.add('flash-good', 'used'); RU.sfx('pop'); }
        else {
          btn.classList.add('flash-bad', 'used'); wrong++; RU.sfx('wrong');
          const b = el.querySelectorAll('.balloon')[MAX - wrong]; if (b) b.classList.add('popped');
        }
        btn.disabled = true;
        const solved = [...word].every((ch) => guessed.has(ch));
        if (solved || wrong >= MAX) {
          over = true; played++;
          if (solved) {
            wins++; const g = RU.game('hangman'); g.wins = (g.wins || 0) + 1;
            const xp = 10 + (MAX - wrong) * 2; xpTotal += xp; RU.addXP(xp); RU.srs.answer(w.id, true); RU.sfx('level');
            el.querySelector('#balloons').classList.add('fly');
          } else RU.srs.answer(w.id, false);
          RU.speak(w.ru);
          el.querySelector('#hmsg').innerHTML = `${solved ? '<b class="good-text">Geschafft! 🎉</b>' : '<b class="bad-text">Alle Ballons geplatzt!</b>'} <button class="btn primary sm" id="hnext">Nächstes Wort ${RU.icon('right', 14)}</button> <button class="btn ghost sm" id="hend">Beenden</button>`;
          el.querySelector('#hnext').onclick = round;
          el.querySelector('#hend').onclick = () => finishGame(el, 'hangman', { score: wins, total: played, xp: xpTotal, onRetry: () => hangman(el, query) });
        }
        draw();
      };
      RU.keyHandler = (e) => {
        if (/^[а-яё]$/i.test(e.key)) guess(e.key.toLowerCase());
        else if (e.key === 'Enter') el.querySelector('#hnext')?.click();
      };
      draw();
    };
    round();
  });

  /* ================= Buchstabensalat ================= */
  const anagram = (el, query) => intro(el, gameById('anagram'), query, (cfg) => {
    const words = ui.pickWords(cfg.topic, cfg.count, (w) => /^[а-яё]{3,11}$/i.test(w.ru));
    let i = 0, score = 0, xp = 0;
    const mistakes = [];
    const round = () => {
      const w = words[i], target = [...w.ru.toLowerCase()];
      let letters; do { letters = U.shuffle(target.map((ch, k) => ({ ch, k }))); } while (target.length > 2 && letters.map((l) => l.ch).join('') === target.join(''));
      const answer = []; let hints = 0, done = false;
      el.innerHTML = `
        <div class="session">
          <div class="session-top">
            <a class="icon-btn" href="#/games" aria-label="Beenden">${RU.icon('x')}</a>
            <div class="progress"><span style="width:${(i / words.length) * 100}%"></span></div>
            <div class="muted small">${i + 1}/${words.length}</div>
          </div>
          <div class="q-card"><div class="q-label">${RU.topicById[w.topic].icon} Bilde das russische Wort für</div><div class="q-big">${U.esc(w.de)}</div></div>
          <div class="ana-slots" id="slots"></div>
          <div class="ana-tiles" id="tiles"></div>
          <div class="row center gap">
            <button class="btn ghost sm" id="ahint">${RU.icon('bulb', 14)} Tipp</button>
            <button class="btn ghost sm" id="aclear">${RU.icon('refresh', 14)} Zurücksetzen</button>
            <button class="btn ghost sm" id="askip">${RU.icon('skip', 14)} Überspringen</button>
          </div>
          <div class="feedback"></div>
        </div>`;
      const draw = () => {
        el.querySelector('#slots').innerHTML = target.map((_, k) => `<button class="slot ru ${answer[k] ? 'filled' : ''}" data-k="${k}">${answer[k] ? answer[k].ch : ''}</button>`).join('');
        el.querySelector('#tiles').innerHTML = letters.map((l, k) => `<button class="ltile ru ${answer.includes(l) ? 'used' : ''}" data-k="${k}">${l.ch}</button>`).join('');
        el.querySelectorAll('.ltile').forEach((b) => b.onclick = () => place(letters[+b.dataset.k]));
        el.querySelectorAll('.slot').forEach((b) => b.onclick = () => { if (done) return; const k = +b.dataset.k; if (answer[k]) { answer.splice(k); draw(); } });
      };
      const place = (l) => {
        if (done || answer.includes(l) || answer.length >= target.length) return;
        answer.push(l); RU.sfx('tick'); draw();
        if (answer.length === target.length) check();
      };
      const check = () => {
        const ok = answer.map((l) => l.ch).join('') === target.join('');
        const slots = el.querySelector('#slots');
        if (ok) {
          done = true; score++; slots.classList.add('good'); RU.sfx('correct'); RU.speak(w.ru); RU.srs.answer(w.id, true);
          const g = RU.game('anagram'); g.solved = (g.solved || 0) + 1;
          const gain = Math.max(3, 12 - hints * 3); xp += gain; RU.addXP(gain);
          RU.later(nextWord, 1100);
        } else {
          slots.classList.add('shake', 'bad'); RU.sfx('wrong');
          setTimeout(() => slots.classList.remove('shake', 'bad'), 600);
        }
      };
      const nextWord = () => { i++; if (i < words.length) round(); else finishGame(el, 'anagram', { score, total: words.length, xp, mistakes, onRetry: () => anagram(el, query) }); };
      el.querySelector('#ahint').onclick = () => {
        if (done) return;
        let k = 0; while (k < answer.length && answer[k].ch === target[k]) k++;
        answer.splice(k);
        const l = letters.find((x) => x.ch === target[k] && !answer.includes(x));
        hints++; if (l) place(l); else draw();
      };
      el.querySelector('#aclear').onclick = () => { if (!done) { answer.length = 0; draw(); } };
      el.querySelector('#askip').onclick = () => {
        if (done) return; done = true; mistakes.push(w); RU.srs.answer(w.id, false);
        answer.length = 0; target.forEach((ch) => answer.push({ ch })); draw();
        el.querySelector('#slots').classList.add('revealed'); RU.speak(w.ru);
        RU.later(nextWord, 1500);
      };
      RU.keyHandler = (e) => {
        if (/^[а-яё]$/i.test(e.key)) { const l = letters.find((x) => x.ch === e.key.toLowerCase() && !answer.includes(x)); if (l) place(l); }
        else if (e.key === 'Backspace' && !done) { answer.pop(); draw(); }
      };
      draw();
    };
    round();
  }, { counts: [5, 8, 12], defaultCount: 8 });

  /* ================= Satzbau ================= */
  const sentence = (el, query) => intro(el, gameById('sentence'), query, (cfg) => {
    const list = U.sample(RU.sentences, cfg.count);
    let i = 0, score = 0, xp = 0;
    const mistakes = [];
    const round = () => {
      const s = list[i];
      const m = s.ru.match(/^(.*?)([.!?]*)$/);
      const tokens = m[1].split(' '), punct = m[2];
      let pool = U.shuffle(tokens.map((t, k) => ({ t, k })));
      if (pool.map((p) => p.t).join(' ') === tokens.join(' ') && tokens.length > 1) pool = pool.reverse();
      const answer = []; let done = false, hints = 0;
      el.innerHTML = `
        <div class="session">
          <div class="session-top">
            <a class="icon-btn" href="#/games" aria-label="Beenden">${RU.icon('x')}</a>
            <div class="progress"><span style="width:${(i / list.length) * 100}%"></span></div>
            <div class="muted small">${i + 1}/${list.length}</div>
          </div>
          <div class="q-card"><div class="q-label">Übersetze diesen Satz</div><div class="q-big">${U.esc(s.de)}</div></div>
          <div class="sb-answer" id="sba"></div>
          <div class="sb-pool" id="sbp"></div>
          <div class="row center gap">
            <button class="btn ghost sm" id="sbhint">${RU.icon('bulb', 14)} Tipp</button>
            <button class="btn ghost sm" id="sbskip">${RU.icon('skip', 14)} Lösung zeigen</button>
            <button class="btn primary" id="sbcheck" disabled>Prüfen</button>
          </div>
          <div class="feedback"></div>
        </div>`;
      const draw = () => {
        el.querySelector('#sba').innerHTML = answer.map((p, k) => `<button class="wchip ru" data-k="${k}">${U.esc(p.t)}</button>`).join('') + (answer.length === tokens.length ? `<span class="punct">${punct}</span>` : '') || '<span class="muted small">Tippe die Wörter in der richtigen Reihenfolge an</span>';
        el.querySelector('#sbp').innerHTML = pool.map((p, k) => `<button class="wchip ru ${answer.includes(p) ? 'used' : ''}" data-k="${k}">${U.esc(p.t)}</button>`).join('');
        el.querySelectorAll('#sba .wchip').forEach((b) => b.onclick = () => { if (!done) { answer.splice(+b.dataset.k, 1); RU.sfx('tick'); draw(); } });
        el.querySelectorAll('#sbp .wchip').forEach((b) => b.onclick = () => { const p = pool[+b.dataset.k]; if (!done && !answer.includes(p)) { answer.push(p); RU.sfx('tick'); draw(); } });
        el.querySelector('#sbcheck').disabled = answer.length !== tokens.length || done;
      };
      const finishRound = (ok) => {
        done = true;
        const fb = el.querySelector('.feedback');
        if (ok) {
          score++; const g = RU.game('sentence'); g.solved = (g.solved || 0) + 1;
          const gain = Math.max(4, 15 - hints * 4); xp += gain; RU.addXP(gain); RU.sfx('correct');
          el.querySelector('#sba').classList.add('good');
        } else { mistakes.push(s); RU.sfx('wrong'); el.querySelector('#sba').classList.add('bad'); }
        fb.innerHTML = `<div class="fb ${ok ? 'good' : 'bad'}">${RU.icon(ok ? 'check' : 'x', 18)}<div><b>${ok ? 'Правильно!' : 'Richtig wäre:'}</b> <span class="ru">${U.esc(s.ru)}</span> ${ui.speakBtn(s.ru, 'sm', 16)}</div></div><button class="btn primary" id="sbnext">Weiter ${RU.icon('right', 16)}</button>`;
        el.querySelector('#sbnext').onclick = nextRound;
        RU.speak(s.ru);
        draw();
      };
      const nextRound = () => { i++; if (i < list.length) round(); else finishGame(el, 'sentence', { score, total: list.length, xp, mistakes, onRetry: () => sentence(el, query) }); };
      el.querySelector('#sbcheck').onclick = () => finishRound(answer.map((p) => p.t).join(' ') === tokens.join(' '));
      el.querySelector('#sbhint').onclick = () => {
        if (done) return;
        let k = 0; while (k < answer.length && answer[k].t === tokens[k]) k++;
        answer.splice(k);
        const p = pool.find((x) => x.t === tokens[k] && !answer.includes(x)); if (p) { answer.push(p); hints++; }
        draw();
      };
      el.querySelector('#sbskip').onclick = () => { if (done) return; answer.length = 0; tokens.forEach((t) => answer.push(pool.find((p) => p.t === t && !answer.includes(p)))); finishRound(false); };
      RU.keyHandler = (e) => { if (e.key === 'Enter') { e.preventDefault(); (el.querySelector('#sbnext') || el.querySelector('#sbcheck:not([disabled])'))?.click(); } else if (e.key === 'Backspace' && !done) { answer.pop(); draw(); } };
      draw();
    };
    round();
  }, { showTopic: false, counts: [5, 8, 12], defaultCount: 5 });

  RU.views.games = {
    title: 'Spiele',
    render(el, parts, query) {
      const map = { memory, blitz, rain, hangman, anagram, sentence };
      if (map[parts[0]]) return map[parts[0]](el, query);
      hub(el);
    },
  };
})();
