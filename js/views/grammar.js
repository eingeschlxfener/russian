/* Grammatik-Lektionen */
(function () {
  const RU = window.RU, U = RU.util, ui = RU.ui;

  const list = (el) => {
    const done = Object.values(RU.state.grammar).filter((v) => v >= 70).length;
    el.innerHTML = `
      ${ui.pageHead('Grammatik', 'Kurze, klare Lektionen mit Beispielen und Übungen. Ab 70 % gilt eine Lektion als abgeschlossen.', '', `<div class="head-progress">${ui.ring(done / RU.grammar.length, 52, 6, 'var(--gold)', `<b>${done}</b>`)}<small>von ${RU.grammar.length}<br>geschafft</small></div>`)}
      <div class="lesson-list">
        ${RU.grammar.map((g, i) => {
          const best = RU.state.grammar[g.id];
          return `<a class="lesson-card ${best >= 70 ? 'done' : ''}" href="#/grammar/${g.id}">
            <span class="lesson-num">${best >= 70 ? RU.icon('check', 20) : i + 1}</span>
            <span class="lesson-icon">${g.icon}</span>
            <div class="lesson-body"><b>${U.esc(g.title)}</b><small class="muted">${U.esc(g.summary)}</small></div>
            <div class="lesson-meta"><span class="tag">${g.level}</span>${best != null ? `<small class="muted">Beste: ${best}%</small>` : ''}</div>
          </a>`;
        }).join('')}
      </div>`;
  };

  const lesson = (el, id) => {
    const idx = RU.grammar.findIndex((g) => g.id === id);
    const g = RU.grammar[idx];
    if (!g) return RU.go('#/grammar');
    const nextL = RU.grammar[idx + 1];
    const best = RU.state.grammar[g.id];
    el.innerHTML = `
      ${ui.pageHead(`${g.icon} ${U.esc(g.title)}`, U.esc(g.summary), '#/grammar', `<span class="tag">${g.level}</span>`)}
      <article class="card lesson-content">${g.content}</article>
      <div class="lesson-cta card">
        <div><b>Bereit für die Übung?</b><p class="muted">${g.quiz.length} Fragen${best != null ? ` · Dein Bestwert: ${best}%` : ''}</p></div>
        <button class="btn primary lg" id="start-quiz">${RU.icon('play', 18)} Übung starten</button>
      </div>
      ${nextL ? `<a class="next-lesson" href="#/grammar/${nextL.id}">Nächste Lektion: <b>${nextL.icon} ${U.esc(nextL.title)}</b> ${RU.icon('right', 16)}</a>` : ''}`;
    // Russische Wörter in der Lektion anklickbar machen (vorlesen)
    el.querySelectorAll('.lesson-content .ru').forEach((s) => { s.classList.add('clickable'); s.title = 'Anhören'; s.addEventListener('click', () => RU.speak(s.textContent)); });
    el.querySelector('#start-quiz').onclick = () => runQuiz(el, g);
  };

  const runQuiz = (el, g) => {
    const questions = U.shuffle(g.quiz).map((q) => ({
      label: `${g.icon} ${g.title}`, prompt: `<div class="q-grammar">${q.q}</div>`, options: q.o.map(U.esc), answer: 0,
      optClass: /[а-яё]/i.test(q.o[0]) ? 'ru' : '', explain: q.e, review: { ru: q.q.replace(/<[^>]+>/g, ''), de: q.o[0] },
    }));
    ui.mcRound(el, {
      questions, xpPer: 10, back: `#/grammar/${g.id}`, mode: 'grammar', onRetry: () => runQuiz(el, g),
      onFinish: (r) => {
        const pct = Math.round((r.score / r.total) * 100);
        const prev = RU.state.grammar[g.id];
        if (prev == null || pct > prev) RU.state.grammar[g.id] = pct;
        if (pct >= 70 && (prev == null || prev < 70)) { RU.addXP(25); RU.toast(`📐 Lektion „${g.title}“ abgeschlossen! +25 XP`, 'green'); }
        RU.save(); RU.checkAchievements();
      },
    });
  };

  RU.views.grammar = {
    title: 'Grammatik',
    render(el, parts) { if (parts[0]) lesson(el, parts[0]); else list(el); },
  };
})();
