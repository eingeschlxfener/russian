/* Vokabeln: Themenübersicht und Wortlisten */
(function () {
  const RU = window.RU, U = RU.util, ui = RU.ui;

  const overview = (el) => {
    const total = RU.words.length, learned = RU.srs.learnedCount();
    el.innerHTML = `
    ${ui.pageHead('Vokabeln', `${total} Wörter in ${RU.topics.length} Themen. Wähle ein Thema und leg los!`, '', `<div class="head-progress">${ui.ring(learned / total, 52, 6, 'var(--blue)', `<b>${Math.round((learned / total) * 100)}%</b>`)}<small>${learned} von ${total}<br>gelernt</small></div>`)}
    <div class="search-box">${RU.icon('search', 18)}<input id="vsearch" type="search" placeholder="Wort suchen (deutsch oder russisch) …" autocomplete="off"></div>
    <div id="vresults"></div>
    <div class="topic-grid" id="tgrid">
      ${RU.topics.map((t) => {
        const l = RU.srs.learnedCount(t.list), m = RU.srs.masteredCount(t.list), pct = l / t.list.length;
        return `<a class="topic-card" href="#/vocab/${t.id}" style="--accent:${t.color}">
          <div class="tc-top"><span class="tc-icon">${t.icon}</span><span class="tag">${t.level}</span></div>
          <b>${U.esc(t.name)}</b>
          <small class="muted">${t.list.length} Wörter · ${m} gemeistert</small>
          <div class="bar"><span style="width:${pct * 100}%"></span></div>
          <div class="tc-sample ru">${t.list.slice(0, 3).map((w) => U.esc(w.ru)).join(' · ')}</div>
        </a>`;
      }).join('')}
    </div>`;
    const inp = el.querySelector('#vsearch'), res = el.querySelector('#vresults'), grid = el.querySelector('#tgrid');
    inp.addEventListener('input', () => {
      const q = U.normalize(inp.value);
      if (q.length < 2) { res.innerHTML = ''; grid.style.display = ''; return; }
      const qc = U.normalize(RU.latToCyr(inp.value));
      const hits = RU.words.filter((w) => U.normalize(w.ru).includes(q) || U.normalize(w.de).includes(q) || U.normalize(w.ru).includes(qc) || U.normalize(RU.translit(w.ru)).includes(q)).slice(0, 40);
      grid.style.display = 'none';
      res.innerHTML = hits.length ? `<div class="word-list">${hits.map(wordRow).join('')}</div>` : ui.empty('🔍', 'Nichts gefunden', 'Versuche ein anderes Wort.');
    });
  };

  const wordRow = (w) => {
    const b = RU.srs.level(w.id), t = RU.topicById[w.topic];
    return `<div class="word-row">
      ${ui.speakBtn(w.ru)}
      <div class="wr-ru"><span class="ru">${U.esc(w.ru)}</span>${ui.translit(w.ru)}</div>
      <div class="wr-de">${U.esc(w.de)}</div>
      <div class="wr-meta"><span class="wr-topic" title="${U.esc(t.name)}">${t.icon}</span>${ui.levelDots(b)}</div>
    </div>`;
  };

  const topicPage = (el, id) => {
    const t = RU.topicById[id];
    if (!t) return RU.go('#/vocab');
    const l = RU.srs.learnedCount(t.list), m = RU.srs.masteredCount(t.list);
    const acts = [
      ['flashcards', 'cards', 'Karteikarten', 'violet'], ['quiz', 'target', 'Quiz', 'gold'], ['write', 'pen', 'Schreiben', 'green'],
      ['listen', 'headphones', 'Hören', 'blue'], ['speak', 'mic', 'Sprechen', 'red'],
    ];
    el.innerHTML = `
    ${ui.pageHead(`${t.icon} ${U.esc(t.name)}`, `${t.list.length} Wörter · ${l} gelernt · ${m} gemeistert`, '#/vocab')}
    <div class="action-row five">
      ${acts.map(([r, ic, label, c]) => `<a class="action-card ${c}" href="#/practice/${r}?topic=${t.id}">${RU.icon(ic, 22)}<div><b>${label}</b></div></a>`).join('')}
    </div>
    <div class="action-row three">
      <a class="action-card soft" href="#/games/memory?topic=${t.id}">🧩<div><b>Memory</b></div></a>
      <a class="action-card soft" href="#/games/hangman?topic=${t.id}">🎈<div><b>Luftballons</b></div></a>
      <a class="action-card soft" href="#/games/anagram?topic=${t.id}">🔀<div><b>Buchstabensalat</b></div></a>
    </div>
    <div class="list-head">
      <h2 class="section-title">Wortliste</h2>
      <div class="list-tools">
        <button class="btn ghost sm" id="play-all">${RU.icon('play', 14)} Alle anhören</button>
        <button class="btn ghost sm" id="hide-de">${RU.icon('eye', 14)} Deutsch verbergen</button>
      </div>
    </div>
    <div class="word-list" id="wl">${t.list.map(wordRow).join('')}</div>`;
    let playing = false;
    el.querySelector('#play-all').onclick = async (e) => {
      if (playing) { playing = false; RU.speech.stop(); e.currentTarget.innerHTML = `${RU.icon('play', 14)} Alle anhören`; return; }
      playing = true; const btn = e.currentTarget; btn.innerHTML = `${RU.icon('x', 14)} Stopp`;
      RU.onCleanup(() => { playing = false; });
      const rows = el.querySelectorAll('.word-row');
      for (let i = 0; i < t.list.length && playing; i++) {
        rows.forEach((r) => r.classList.remove('hl')); rows[i].classList.add('hl');
        rows[i].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        await RU.speak(t.list[i].ru);
        await new Promise((r) => setTimeout(r, 450));
      }
      rows.forEach((r) => r.classList.remove('hl'));
      playing = false; if (btn.isConnected) btn.innerHTML = `${RU.icon('play', 14)} Alle anhören`;
    };
    el.querySelector('#hide-de').onclick = (e) => { el.querySelector('#wl').classList.toggle('hide-de'); e.currentTarget.classList.toggle('active'); };
    el.querySelector('#wl').addEventListener('click', (e) => { const r = e.target.closest('.hide-de .wr-de'); if (r) r.classList.toggle('show'); });
  };

  RU.views.vocab = {
    title: 'Vokabeln',
    render(el, parts) { if (parts[0]) topicPage(el, parts[0]); else overview(el); },
  };
})();
