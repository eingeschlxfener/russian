/* Phrasebuch */
(function () {
  const RU = window.RU, U = RU.util, ui = RU.ui;

  const render = (el, query) => {
    let cat = query.cat || 'all', q = '';
    const favs = () => RU.state.favorites;
    const draw = () => {
      let items = cat === 'fav' ? RU.phrases.filter((p) => favs().includes(p.id)) : cat === 'all' ? RU.phrases : RU.phrases.filter((p) => p.cat === cat);
      if (q) { const n = U.normalize(q); items = items.filter((p) => U.normalize(p.ru).includes(n) || U.normalize(p.de).includes(n) || U.normalize(RU.translit(p.ru)).includes(n)); }
      el.querySelector('#plist').innerHTML = items.length ? items.map((p) => {
        const c = RU.phraseCats.find((x) => x.id === p.cat);
        return `<div class="phrase-card">
          <div class="pc-main">
            <div class="ru pc-ru">${U.esc(p.ru)}</div>
            ${ui.translit(p.ru)}
            <div class="pc-de">${U.esc(p.de)}</div>
          </div>
          <div class="pc-actions">
            ${ui.speakBtn(p.ru)}
            <button class="icon-btn slow" data-slow="${U.esc(p.ru)}" title="Langsam anhören">🐢</button>
            <button class="icon-btn fav ${favs().includes(p.id) ? 'on' : ''}" data-fav="${p.id}" title="Favorit">${RU.icon('star', 18)}</button>
          </div>
          <span class="pc-cat">${c.icon}</span>
        </div>`;
      }).join('') : ui.empty(cat === 'fav' ? '⭐' : '🔍', cat === 'fav' ? 'Noch keine Favoriten' : 'Nichts gefunden', cat === 'fav' ? 'Markiere Phrasen mit dem Stern, um sie hier zu sammeln.' : 'Versuche einen anderen Suchbegriff.');
      el.querySelectorAll('[data-fav]').forEach((b) => b.onclick = () => {
        const id = b.dataset.fav, f = favs(), k = f.indexOf(id);
        if (k >= 0) f.splice(k, 1); else f.push(id);
        RU.save(); RU.sfx('pop'); b.classList.toggle('on');
        if (cat === 'fav') draw();
      });
      el.querySelectorAll('[data-c]').forEach((b) => b.classList.toggle('active', b.dataset.c === cat));
    };
    el.innerHTML = `
      ${ui.pageHead('Phrasebuch', `${RU.phrases.length} nützliche Sätze für Reisen und Alltag – zum Anhören und Nachsprechen.`, '', `<a class="btn primary" href="#/phrases/quiz">${RU.icon('target', 16)} Phrasen-Quiz</a>`)}
      <div class="search-box">${RU.icon('search', 18)}<input id="psearch" type="search" placeholder="Phrase suchen …" autocomplete="off"></div>
      <div class="chips filter-chips">
        <button class="chip" data-c="all">Alle</button>
        <button class="chip" data-c="fav">⭐ Favoriten</button>
        ${RU.phraseCats.map((c) => `<button class="chip" data-c="${c.id}">${c.icon} ${c.name}</button>`).join('')}
      </div>
      <div class="phrase-list" id="plist"></div>`;
    el.querySelectorAll('[data-c]').forEach((b) => b.onclick = () => { cat = b.dataset.c; draw(); });
    el.querySelector('#psearch').addEventListener('input', (e) => { q = e.target.value; draw(); });
    draw();
  };

  const quiz = (el) => {
    ui.setup(el, {
      title: 'Phrasen-Quiz', subtitle: 'Welche russische Phrase passt?', back: '#/phrases', showTopic: false,
      groups: [{ key: 'dir', label: 'Richtung', options: [{ id: 'de-ru', label: 'Deutsch → Russisch' }, { id: 'ru-de', label: 'Russisch → Deutsch' }] }],
      onStart: (cfg) => {
        const items = U.sample(RU.phrases, cfg.count);
        const questions = items.map((p) => {
          const others = U.sample(RU.phrases.filter((x) => x !== p), 3);
          const opts = [p, ...others];
          return cfg.dir === 'de-ru'
            ? { label: 'Wie sagt man …', prompt: `<div class="q-big">${U.esc(p.de)}</div>`, options: opts.map((x) => U.esc(x.ru)), optClass: 'ru', answer: 0, speakAfter: p.ru, review: p }
            : { label: 'Was bedeutet …', prompt: `<div class="q-big ru">${U.esc(p.ru)}</div>`, sub: `<div class="q-sub">${ui.translit(p.ru)}${ui.speakBtn(p.ru)}</div>`, options: opts.map((x) => U.esc(x.de)), answer: 0, speakAfter: p.ru, review: p };
        });
        ui.mcRound(el, { questions, back: '#/phrases', mode: 'phrases-quiz', onRetry: () => quiz(el) });
      },
    });
  };

  RU.views.phrases = {
    title: 'Phrasen',
    render(el, parts, query) { if (parts[0] === 'quiz') quiz(el); else render(el, query); },
  };
})();
