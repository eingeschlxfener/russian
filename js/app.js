/* Router, Navigation, Theme – startet die App */
(function () {
  'use strict';
  const RU = window.RU, U = RU.util;

  /* ---------------- Aufräumen beim Seitenwechsel ---------------- */
  let cleanups = [];
  RU.onCleanup = (fn) => cleanups.push(fn);
  RU.keyHandler = null;
  RU.later = (fn, ms) => { const id = setTimeout(fn, ms); cleanups.push(() => clearTimeout(id)); return id; };
  RU.every = (fn, ms) => { const id = setInterval(fn, ms); cleanups.push(() => clearInterval(id)); return id; };

  /* ---------------- Navigation ---------------- */
  const NAV = [
    { group: 'Lernen', items: [
      ['home', 'home', 'Start'], ['alphabet', 'letters', 'Alphabet'], ['vocab', 'book', 'Vokabeln'],
      ['grammar', 'layers', 'Grammatik'], ['numbers', 'hash', 'Zahlen'], ['phrases', 'chat', 'Phrasen'],
    ] },
    { group: 'Üben', items: [
      ['practice/flashcards', 'cards', 'Karteikarten'], ['practice/quiz', 'target', 'Quiz'], ['practice/write', 'pen', 'Schreiben'],
      ['practice/listen', 'headphones', 'Hören'], ['practice/speak', 'mic', 'Sprechen'],
    ] },
    { group: 'Spielen', items: [['games', 'gamepad', 'Spiele']] },
    { group: 'Mehr', items: [['tools', 'swap', 'Werkzeuge'], ['achievements', 'trophy', 'Erfolge'], ['settings', 'sliders', 'Einstellungen']] },
  ];
  const BOTTOM = [['home', 'home', 'Start'], ['vocab', 'book', 'Lernen'], ['practice', 'target', 'Üben'], ['games', 'gamepad', 'Spiele'], ['menu', 'menu', 'Mehr']];

  const buildNav = () => {
    U.$('#nav').innerHTML = NAV.map((g) => `
      <div class="nav-group">
        <div class="nav-label">${g.group}</div>
        ${g.items.map(([r, ic, label]) => `<a class="nav-link" href="#/${r}" data-route="${r}">${RU.icon(ic)}<span>${label}</span>${r === 'practice/flashcards' ? '<em class="nav-badge" id="due-badge"></em>' : ''}</a>`).join('')}
      </div>`).join('');
    U.$('#bottom-nav').innerHTML = BOTTOM.map(([r, ic, label]) => r === 'menu'
      ? `<button class="bn-link" id="bn-menu">${RU.icon(ic)}<span>${label}</span></button>`
      : `<a class="bn-link" href="#/${r}" data-route="${r}">${RU.icon(ic)}<span>${label}</span></a>`).join('');
    U.$('#bn-menu').onclick = () => document.body.classList.toggle('nav-open');
    U.$('#menu-btn').onclick = () => document.body.classList.toggle('nav-open');
    U.$('#scrim').onclick = () => document.body.classList.remove('nav-open');
  };

  /* ---------------- Kopfzeile / Status ---------------- */
  RU.updateChrome = () => {
    const s = RU.state, li = RU.levelInfo(), today = RU.todayXP(), goal = s.settings.dailyGoal, streak = RU.currentStreak();
    const chipStreak = U.$('#chip-streak'), chipXp = U.$('#chip-xp'), chipGoal = U.$('#chip-goal');
    if (chipStreak) { chipStreak.innerHTML = `${RU.icon('flame', 18)}<b>${streak}</b>`; chipStreak.classList.toggle('on', s.streak.last === U.dayStr()); chipStreak.title = `${streak} Tage Serie`; }
    if (chipXp) { chipXp.innerHTML = `${RU.icon('bolt', 18)}<b>${s.xp}</b>`; chipXp.title = `${s.xp} XP gesamt`; }
    if (chipGoal) { chipGoal.innerHTML = RU.ui.ring(today / goal, 30, 4, today >= goal ? 'var(--green)' : 'var(--gold)', today >= goal ? RU.icon('check', 14) : ''); chipGoal.title = `Tagesziel: ${Math.min(today, goal)}/${goal} XP`; }
    const side = U.$('#side-level');
    if (side) side.innerHTML = `
      <div class="sl-top"><span class="sl-badge">${li.level}</span><div><b>${li.title}</b><small>${li.titleDe} · Level ${li.level}</small></div></div>
      <div class="bar"><span style="width:${li.pct * 100}%"></span></div>
      <small class="muted">${li.into} / ${li.need} XP bis Level ${li.level + 1}</small>`;
    const due = RU.srs.dueWords().length, badge = U.$('#due-badge');
    if (badge) { badge.textContent = due || ''; badge.style.display = due ? '' : 'none'; }
  };

  /* ---------------- Theme ---------------- */
  RU.applyTheme = () => {
    const t = RU.state.settings.theme;
    if (t === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', t);
    const dark = t === 'dark' || (t === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
    U.$('#theme-btn').innerHTML = RU.icon(dark ? 'sun' : 'moon');
    U.$('meta[name="theme-color"]').setAttribute('content', dark ? '#0e0f17' : '#f5f2ec');
  };
  const toggleTheme = () => {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark' || (!document.documentElement.hasAttribute('data-theme') && matchMedia('(prefers-color-scheme: dark)').matches);
    RU.state.settings.theme = dark ? 'light' : 'dark';
    RU.save(); RU.applyTheme();
  };

  /* ---------------- Router ---------------- */
  const parse = () => {
    const h = location.hash.replace(/^#\/?/, '') || 'home';
    const [path, qs] = h.split('?');
    return { parts: path.split('/').filter(Boolean), query: Object.fromEntries(new URLSearchParams(qs || '')), path };
  };
  const route = () => {
    cleanups.forEach((f) => { try { f(); } catch (e) { /* ignore */ } });
    cleanups = [];
    RU.keyHandler = null;
    RU.speech.stop();
    document.body.classList.remove('nav-open');
    const r = parse();
    const key = r.parts[0] || 'home';
    const view = RU.views[key] || RU.views.home;
    const el = U.$('#view');
    el.innerHTML = '';
    el.classList.remove('enter'); void el.offsetWidth; el.classList.add('enter');
    try { view.render(el, r.parts.slice(1), r.query); }
    catch (e) { console.error(e); el.innerHTML = RU.ui.empty('😵', 'Да... etwas ist schiefgelaufen', U.esc(e.message), '<a class="btn primary" href="#/home">Zur Startseite</a>'); }
    U.$('#page-title').textContent = view.title || '';
    document.title = `${view.title ? view.title + ' · ' : ''}Привет! Russisch lernen`;
    U.$$('[data-route]').forEach((a) => {
      const rt = a.dataset.route;
      a.classList.toggle('active', r.path === rt || (rt !== 'home' && r.path.startsWith(rt + '/')) || (key === rt) || (a.classList.contains('bn-link') && rt === 'vocab' && ['alphabet', 'grammar', 'numbers', 'phrases'].includes(key)));
    });
    window.scrollTo(0, 0);
    RU.updateChrome();
  };
  RU.go = (hash) => { if (location.hash === hash) route(); else location.hash = hash; };
  RU.rerender = route;

  /* ---------------- Globale Events ---------------- */
  document.addEventListener('click', (e) => {
    const sp = e.target.closest('[data-speak]');
    if (sp) { e.preventDefault(); e.stopPropagation(); sp.classList.add('speaking'); RU.speak(sp.dataset.speak).then(() => sp.classList.remove('speaking')); return; }
    const slow = e.target.closest('[data-slow]');
    if (slow) { e.preventDefault(); RU.speak(slow.dataset.slow, { rate: 0.5 }); }
  }, true);
  document.addEventListener('keydown', (e) => { if (RU.keyHandler && !e.metaKey && !e.ctrlKey && !e.altKey) RU.keyHandler(e); });
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => RU.applyTheme());

  /* ---------------- Start ---------------- */
  const boot = () => {
    buildNav();
    RU.speech.init();
    RU.applyTheme();
    U.$('#theme-btn').onclick = toggleTheme;
    window.addEventListener('hashchange', route);
    route();
    RU.checkAchievements();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
