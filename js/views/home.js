/* Startseite / Dashboard */
(function () {
  const RU = window.RU, U = RU.util, ui = RU.ui;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 5) return ['Доброй ночи!', 'Gute Nacht – noch fleißig?'];
    if (h < 11) return ['Доброе утро!', 'Guten Morgen!'];
    if (h < 17) return ['Добрый день!', 'Guten Tag!'];
    return ['Добрый вечер!', 'Guten Abend!'];
  };

  const heatmap = () => {
    const weeks = 18, hist = RU.state.history, goal = RU.state.settings.dailyGoal;
    const today = new Date(); today.setHours(12);
    const dow = (today.getDay() + 6) % 7; // Montag = 0
    const start = new Date(today); start.setDate(today.getDate() - dow - (weeks - 1) * 7);
    let cells = '';
    for (let w = 0; w < weeks; w++) {
      cells += '<div class="hm-col">';
      for (let d = 0; d < 7; d++) {
        const dt = new Date(start); dt.setDate(start.getDate() + w * 7 + d);
        const key = U.dayStr(dt), xp = hist[key] || 0, future = dt > today;
        const lvl = future ? -1 : xp === 0 ? 0 : xp < goal / 2 ? 1 : xp < goal ? 2 : xp < goal * 2 ? 3 : 4;
        cells += `<i class="hm l${lvl}" title="${dt.toLocaleDateString('de-DE')}: ${xp} XP"></i>`;
      }
      cells += '</div>';
    }
    const days = Object.keys(hist).filter((k) => hist[k] > 0).length;
    return `<div class="heatmap">${cells}</div><div class="hm-legend"><span class="muted small">${U.plural(days, 'Lerntag', 'Lerntage')} insgesamt</span><span class="hm-scale"><small>weniger</small><i class="hm l0"></i><i class="hm l1"></i><i class="hm l2"></i><i class="hm l3"></i><i class="hm l4"></i><small>mehr</small></span></div>`;
  };

  RU.views.home = {
    title: 'Start',
    render(el) {
      const s = RU.state, li = RU.levelInfo(), today = RU.todayXP(), goal = s.settings.dailyGoal, streak = RU.currentStreak();
      const due = RU.srs.dueWords().length, learned = RU.srs.learnedCount(), mastered = RU.srs.masteredCount();
      const [gRu, gDe] = greeting();
      const wotd = RU.words[U.hash(U.dayStr() + 'w') % RU.words.length];
      const wTopic = RU.topicById[wotd.topic];
      const phrase = RU.phrases[U.hash(U.dayStr() + 'p') % RU.phrases.length];

      let next;
      if (s.letters.length < 33 && s.xp < 150) next = { href: '#/alphabet', label: 'Alphabet lernen', text: 'Starte mit der kyrillischen Schrift – sie ist leichter, als sie aussieht!' };
      else if (due > 0) next = { href: '#/practice/flashcards?topic=due', label: `${due} Wörter wiederholen`, text: 'Deine Karteikarten warten – wiederhole jetzt, bevor du vergisst.' };
      else {
        const t = RU.topics.find((t) => RU.srs.learnedCount(t.list) < t.list.length * 0.8) || RU.topics[0];
        next = { href: `#/vocab/${t.id}`, label: `${t.icon} ${t.name}`, text: 'Lerne neue Wörter in deinem nächsten Thema.' };
      }

      const tiles = [
        ['#/alphabet', 'letters', 'Alphabet', '33 Buchstaben', 'red'],
        ['#/vocab', 'book', 'Vokabeln', `${RU.words.length} Wörter`, 'blue'],
        ['#/practice/flashcards', 'cards', 'Karteikarten', 'Clever wiederholen', 'violet'],
        ['#/practice/quiz', 'target', 'Quiz', 'Multiple Choice', 'gold'],
        ['#/practice/write', 'pen', 'Schreiben', 'Kyrillisch tippen', 'green'],
        ['#/practice/listen', 'headphones', 'Hören', 'Hörverstehen', 'blue'],
        ['#/practice/speak', 'mic', 'Sprechen', 'Aussprache', 'red'],
        ['#/games', 'gamepad', 'Spiele', '6 Minispiele', 'violet'],
        ['#/grammar', 'layers', 'Grammatik', `${RU.grammar.length} Lektionen`, 'gold'],
        ['#/numbers', 'hash', 'Zahlen', 'Zahlentrainer', 'green'],
        ['#/phrases', 'chat', 'Phrasen', 'Für den Alltag', 'red'],
        ['#/tools', 'swap', 'Werkzeuge', 'Transliteration', 'blue'],
      ];

      el.innerHTML = `
      <section class="hero">
        <div class="hero-text">
          <div class="eyebrow">${gDe}</div>
          <h1 class="display hero-title">${gRu}</h1>
          <p class="hero-sub">Du bist <b>${li.title}</b> <span class="muted">(${li.titleDe})</span> auf Level ${li.level}. ${streak > 1 ? `Schon <b>${streak} Tage</b> am Stück – stark!` : 'Jeder Tag zählt – leg los!'}</p>
          <div class="next-card">
            <div><small>Als Nächstes</small><b>${next.label}</b><span>${next.text}</span></div>
            <a class="btn primary" href="${next.href}">${RU.icon('play', 16)} Start</a>
          </div>
        </div>
        <div class="hero-art" aria-hidden="true">
          <span class="ha a">Ж</span><span class="ha b">Я</span><span class="ha c">Ы</span><span class="ha d">Щ</span><span class="ha e">Ё</span>
          <div class="hero-matryoshka">🪆</div>
        </div>
      </section>

      <section class="stats-row">
        <div class="stat card">
          ${ui.ring(li.pct, 64, 7, 'var(--violet)', `<b>${li.level}</b>`)}
          <div><small>Level</small><b>${s.xp} XP</b><span class="muted small">${li.need - li.into} XP bis Level ${li.level + 1}</span></div>
        </div>
        <div class="stat card">
          <div class="stat-ico red ${s.streak.last === U.dayStr() ? 'lit' : ''}">${RU.icon('flame', 28)}</div>
          <div><small>Serie</small><b>${U.plural(streak, 'Tag', 'Tage')}</b><span class="muted small">Rekord: ${s.bestStreak || 0}</span></div>
        </div>
        <div class="stat card">
          ${ui.ring(today / goal, 64, 7, today >= goal ? 'var(--green)' : 'var(--gold)', today >= goal ? RU.icon('check', 22) : `<b>${Math.round((today / goal) * 100)}%</b>`)}
          <div><small>Tagesziel</small><b>${Math.min(today, goal)} / ${goal} XP</b><span class="muted small">${today >= goal ? 'Geschafft! 🎉' : `Noch ${goal - today} XP`}</span></div>
        </div>
        <div class="stat card">
          <div class="stat-ico blue">${RU.icon('book', 26)}</div>
          <div><small>Wortschatz</small><b>${learned} gelernt</b><span class="muted small">${mastered} gemeistert · ${due} fällig</span></div>
        </div>
      </section>

      <section class="grid-2">
        <div class="card wotd" style="--accent:${wTopic.color}">
          <div class="card-label">${RU.icon('sparkles', 16)} Wort des Tages</div>
          <div class="wotd-main">
            <div>
              <div class="wotd-word ru">${U.esc(wotd.ru)}</div>
              ${ui.translit(wotd.ru)}
              <div class="wotd-de">${U.esc(wotd.de)}</div>
            </div>
            ${ui.speakBtn(wotd.ru, 'lg', 24)}
          </div>
          <div class="wotd-foot">
            <span class="tag">${wTopic.icon} ${wTopic.name}</span>
          </div>
          <div class="divider"></div>
          <div class="card-label">${RU.icon('chat', 16)} Satz des Tages</div>
          <div class="phrase-day"><span class="ru">${U.esc(phrase.ru)}</span>${ui.speakBtn(phrase.ru, 'sm', 16)}</div>
          <div class="muted">${U.esc(phrase.de)}</div>
        </div>
        <div class="card">
          <div class="card-label">${RU.icon('clock', 16)} Deine Aktivität</div>
          ${heatmap()}
          <div class="mini-stats">
            <div><b>${s.stats.correct}</b><small>richtige Antworten</small></div>
            <div><b>${s.letters.length}/33</b><small>Buchstaben</small></div>
            <div><b>${Object.keys(s.achievements).length}/${RU.achievements.length}</b><small>Erfolge</small></div>
          </div>
        </div>
      </section>

      <h2 class="section-title">Was möchtest du heute machen?</h2>
      <section class="tiles">
        ${tiles.map(([href, ic, t, sub, c]) => `<a class="tile ${c}" href="${href}"><span class="tile-ico">${RU.icon(ic, 24)}</span><b>${t}</b><small>${sub}</small></a>`).join('')}
      </section>`;
    },
  };
})();
