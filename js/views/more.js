/* Werkzeuge, Erfolge, Einstellungen */
(function () {
  const RU = window.RU, U = RU.util, ui = RU.ui;

  /* ================= Werkzeuge ================= */
  RU.views.tools = {
    title: 'Werkzeuge',
    render(el) {
      el.innerHTML = `
        ${ui.pageHead('Werkzeuge', 'Transliteration in beide Richtungen und ein Vorlese-Werkzeug für beliebige Texte.')}
        <div class="grid-2">
          <div class="card tool">
            <div class="card-label">${RU.icon('swap', 16)} Lateinisch → Kyrillisch</div>
            <p class="muted small">Schreibe russische Wörter mit lateinischen Buchstaben – z. B. <code>privet</code>, <code>spasibo</code>, <code>shchi</code>, <code>ja ljublju tebja</code>.</p>
            <textarea id="lat" rows="3" placeholder="privet, kak dela?">privet, kak dela?</textarea>
            <div class="tool-out ru" id="cyr"></div>
            <div class="row gap"><button class="btn ghost sm" id="copy-cyr">Kopieren</button><button class="btn ghost sm" id="speak-cyr">${RU.icon('volume', 14)} Vorlesen</button></div>
          </div>
          <div class="card tool">
            <div class="card-label">${RU.icon('swap', 16)} Kyrillisch → Lateinisch</div>
            <div class="chips sm"><button class="chip active" data-st="de">Deutsche Umschrift</button><button class="chip" data-st="sci">Wissenschaftlich</button></div>
            <textarea id="cyrin" rows="3" class="ru" placeholder="Здравствуйте!">Здравствуйте! Меня зовут Наташа.</textarea>
            <div class="tool-out" id="latout"></div>
            <div class="row gap"><button class="btn ghost sm" id="speak-in">${RU.icon('volume', 14)} Vorlesen</button></div>
          </div>
        </div>
        <div class="card tool">
          <div class="card-label">${RU.icon('keyboard', 16)} Kyrillisch schreiben</div>
          <textarea id="free" rows="2" class="ru" placeholder="Schreibe hier mit der Bildschirmtastatur …"></textarea>
          <div id="freekb"></div>
          <div class="row gap"><button class="btn ghost sm" id="speak-free">${RU.icon('volume', 14)} Vorlesen</button><button class="btn ghost sm" id="slow-free">🐢 Langsam</button><button class="btn ghost sm" id="clear-free">${RU.icon('trash', 14)} Leeren</button></div>
        </div>
        <div class="card">
          <div class="card-label">${RU.icon('bulb', 16)} Lautschrift-Tabelle</div>
          <div class="phon-table">
            ${[['a', 'а'], ['b', 'б'], ['v / w', 'в'], ['g', 'г'], ['d', 'д'], ['e', 'е'], ['jo', 'ё'], ['zh', 'ж'], ['z', 'з'], ['i', 'и'], ['j', 'й'], ['k', 'к'], ['l', 'л'], ['m', 'м'], ['n', 'н'], ['o', 'о'], ['p', 'п'], ['r', 'р'], ['s', 'с'], ['t', 'т'], ['u', 'у'], ['f', 'ф'], ['h / x / kh', 'х'], ['c', 'ц'], ['ch', 'ч'], ['sh', 'ш'], ['shch', 'щ'], ["' '", 'ъ'], ['y', 'ы'], ["'", 'ь'], ['eh', 'э'], ['ju', 'ю'], ['ja / q', 'я']].map(([l, c]) => `<div><code>${l}</code><span class="ru">${c}</span></div>`).join('')}
          </div>
        </div>`;
      const lat = el.querySelector('#lat'), cyr = el.querySelector('#cyr');
      const up1 = () => { cyr.textContent = RU.latToCyr(lat.value); };
      lat.addEventListener('input', up1); up1();
      el.querySelector('#copy-cyr').onclick = () => { navigator.clipboard?.writeText(cyr.textContent).then(() => RU.toast('In die Zwischenablage kopiert ✓')); };
      el.querySelector('#speak-cyr').onclick = () => RU.speak(cyr.textContent);
      let style = RU.state.settings.translitStyle;
      const cin = el.querySelector('#cyrin'), lout = el.querySelector('#latout');
      const up2 = () => { lout.textContent = RU.translit(cin.value, style); };
      el.querySelectorAll('[data-st]').forEach((b) => { b.classList.toggle('active', b.dataset.st === style); b.onclick = () => { style = b.dataset.st; el.querySelectorAll('[data-st]').forEach((x) => x.classList.toggle('active', x === b)); up2(); }; });
      cin.addEventListener('input', up2); up2();
      el.querySelector('#speak-in').onclick = () => RU.speak(cin.value);
      const free = el.querySelector('#free');
      el.querySelector('#freekb').appendChild(ui.keyboard(free));
      el.querySelector('#speak-free').onclick = () => RU.speak(free.value);
      el.querySelector('#slow-free').onclick = () => RU.speak(free.value, { rate: 0.5 });
      el.querySelector('#clear-free').onclick = () => { free.value = ''; free.focus(); };
    },
  };

  /* ================= Erfolge ================= */
  RU.views.achievements = {
    title: 'Erfolge',
    render(el) {
      const s = RU.state, li = RU.levelInfo();
      const unlocked = RU.achievements.filter((a) => s.achievements[a.id]).length;
      const modes = Object.values(s.stats.modes).reduce((a, b) => a + b, 0);
      el.innerHTML = `
        ${ui.pageHead('Erfolge & Statistik', `${unlocked} von ${RU.achievements.length} Erfolgen freigeschaltet.`)}
        <div class="stats-row">
          <div class="stat card">${ui.ring(li.pct, 64, 7, 'var(--violet)', `<b>${li.level}</b>`)}<div><small>Level</small><b>${li.title}</b><span class="muted small">${s.xp} XP gesamt</span></div></div>
          <div class="stat card"><div class="stat-ico green">${RU.icon('check', 26)}</div><div><small>Richtige Antworten</small><b>${s.stats.correct}</b><span class="muted small">${s.stats.answers ? Math.round((s.stats.correct / s.stats.answers) * 100) : 0}% Trefferquote</span></div></div>
          <div class="stat card"><div class="stat-ico red">${RU.icon('flame', 26)}</div><div><small>Längste Serie</small><b>${U.plural(s.bestStreak || 0, 'Tag', 'Tage')}</b><span class="muted small">${s.stats.goals}× Tagesziel</span></div></div>
          <div class="stat card"><div class="stat-ico blue">${RU.icon('gamepad', 26)}</div><div><small>Runden gespielt</small><b>${modes}</b><span class="muted small">${s.stats.perfect} davon perfekt</span></div></div>
        </div>
        <h2 class="section-title">Wortschatz nach Lernstufe</h2>
        <div class="card">${srsChart()}</div>
        <h2 class="section-title">Abzeichen</h2>
        <div class="badge-grid">
          ${RU.achievements.map((a) => {
            const p = RU.achievementProgress(a), at = s.achievements[a.id];
            return `<div class="badge ${at ? 'unlocked' : ''}">
              <div class="badge-ico">${a.icon}</div>
              <b>${U.esc(a.title)}</b>
              <small>${U.esc(a.desc)}</small>
              ${at ? `<span class="badge-date">${new Date(at).toLocaleDateString('de-DE')}</span>` : `<div class="bar sm"><span style="width:${(p.v / p.max) * 100}%"></span></div><span class="badge-date">${p.v} / ${p.max}</span>`}
            </div>`;
          }).join('')}
        </div>`;
    },
  };
  const srsChart = () => {
    const counts = [0, 0, 0, 0, 0, 0, 0, 0];
    RU.words.forEach((w) => { const e = RU.state.srs[w.id]; counts[e ? e.b + 1 : 0]++; });
    const labels = ['Neu', 'Stufe 0', 'Stufe 1', 'Stufe 2', 'Stufe 3', 'Stufe 4', 'Stufe 5', 'Stufe 6'];
    const max = Math.max(...counts, 1);
    return `<div class="srs-chart">${counts.map((c, k) => `<div class="srs-col"><span class="srs-val">${c}</span><div class="srs-bar s${k}" style="height:${(c / max) * 100}%"></div><small>${labels[k]}</small></div>`).join('')}</div>
      <p class="muted small">Jede richtige Wiederholung hebt ein Wort eine Stufe höher. Ab Stufe 2 gilt es als <b>gelernt</b>, ab Stufe 5 als <b>gemeistert</b>.</p>`;
  };

  /* ================= Einstellungen ================= */
  RU.views.settings = {
    title: 'Einstellungen',
    render(el) {
      const S = RU.state.settings;
      const voices = RU.speech.voices;
      el.innerHTML = `
        ${ui.pageHead('Einstellungen', 'Passe die App an deine Bedürfnisse an. Dein Fortschritt wird automatisch in diesem Browser gespeichert.')}
        <div class="settings">
          <section class="card set-group">
            <h3>Darstellung</h3>
            <div class="set-row"><div><b>Farbschema</b><small>Hell, dunkel oder wie dein System</small></div>
              <div class="seg" data-key="theme">${[['auto', 'Auto'], ['light', 'Hell'], ['dark', 'Dunkel']].map(([v, l]) => `<button class="${S.theme === v ? 'active' : ''}" data-v="${v}">${l}</button>`).join('')}</div></div>
            <div class="set-row"><div><b>Umschrift anzeigen</b><small>Lateinische Lesehilfe unter russischen Wörtern</small></div>
              <label class="switch"><input type="checkbox" data-bool="translit" ${S.translit ? 'checked' : ''}><span></span></label></div>
            <div class="set-row"><div><b>Art der Umschrift</b><small>Deutsch (z. B. „Chruschtschow“) oder wissenschaftlich („Chruščëv“)</small></div>
              <div class="seg" data-key="translitStyle">${[['de', 'Deutsch'], ['sci', 'Wissensch.']].map(([v, l]) => `<button class="${S.translitStyle === v ? 'active' : ''}" data-v="${v}">${l}</button>`).join('')}</div></div>
          </section>
          <section class="card set-group">
            <h3>Lernen</h3>
            <div class="set-row"><div><b>Tagesziel</b><small>Wie viele XP möchtest du pro Tag sammeln?</small></div>
              <div class="seg" data-key="dailyGoal" data-num="1">${[[20, 'Locker'], [50, 'Normal'], [100, 'Ernst'], [200, 'Intensiv']].map(([v, l]) => `<button class="${S.dailyGoal === v ? 'active' : ''}" data-v="${v}">${l}<small>${v}</small></button>`).join('')}</div></div>
            <div class="set-row"><div><b>Lautschrift-Eingabe</b><small>Beim Schreiben „privet“ automatisch in „привет“ umwandeln</small></div>
              <label class="switch"><input type="checkbox" data-bool="phonetic" ${S.phonetic ? 'checked' : ''}><span></span></label></div>
          </section>
          <section class="card set-group">
            <h3>Ton & Sprache</h3>
            <div class="set-row"><div><b>Soundeffekte</b><small>Töne bei richtigen und falschen Antworten</small></div>
              <label class="switch"><input type="checkbox" data-bool="sound" ${S.sound ? 'checked' : ''}><span></span></label></div>
            <div class="set-row"><div><b>Automatisch vorlesen</b><small>Russische Wörter in Übungen automatisch abspielen</small></div>
              <label class="switch"><input type="checkbox" data-bool="autoplay" ${S.autoplay ? 'checked' : ''}><span></span></label></div>
            <div class="set-row"><div><b>Sprechtempo</b><small id="rate-val">${Math.round(S.rate * 100)}%</small></div>
              <input type="range" min="0.5" max="1.2" step="0.05" value="${S.rate}" id="rate"></div>
            <div class="set-row"><div><b>Stimme</b><small>${voices.length ? `${voices.length} russische Stimme(n) gefunden` : 'Keine russische Stimme gefunden – Systemstimme wird verwendet'}</small></div>
              <select id="voice"><option value="">Automatisch</option>${voices.map((v) => `<option ${S.voice === v.name ? 'selected' : ''}>${U.esc(v.name)}</option>`).join('')}</select></div>
            <div class="set-row"><div><b>Test</b><small>So klingt die Stimme</small></div><button class="btn ghost sm" data-speak="Привет! Как дела? Я учу русский язык.">${RU.icon('volume', 14)} Probehören</button></div>
          </section>
          <section class="card set-group">
            <h3>Fortschritt</h3>
            <div class="set-row"><div><b>Sichern</b><small>Lade deinen Fortschritt als Datei herunter</small></div><button class="btn ghost sm" id="export">${RU.icon('download', 14)} Exportieren</button></div>
            <div class="set-row"><div><b>Wiederherstellen</b><small>Fortschritt aus einer Datei laden</small></div><label class="btn ghost sm">${RU.icon('upload', 14)} Importieren<input type="file" accept="application/json" id="import" hidden></label></div>
            <div class="set-row danger"><div><b>Zurücksetzen</b><small>Löscht deinen gesamten Fortschritt unwiderruflich</small></div><button class="btn soft red sm" id="reset">${RU.icon('trash', 14)} Alles löschen</button></div>
          </section>
          <p class="muted small center">Привет! · Russisch spielerisch lernen · Alle Daten bleiben lokal in deinem Browser.</p>
        </div>`;
      el.querySelectorAll('.seg').forEach((seg) => seg.querySelectorAll('button').forEach((b) => b.onclick = () => {
        S[seg.dataset.key] = seg.dataset.num ? +b.dataset.v : b.dataset.v;
        seg.querySelectorAll('button').forEach((x) => x.classList.toggle('active', x === b));
        RU.save(); RU.applyTheme(); RU.updateChrome(); RU.sfx('click');
      }));
      el.querySelectorAll('[data-bool]').forEach((c) => c.onchange = () => { S[c.dataset.bool] = c.checked; RU.save(); RU.sfx('click'); });
      const rate = el.querySelector('#rate');
      rate.oninput = () => { S.rate = +rate.value; el.querySelector('#rate-val').textContent = `${Math.round(S.rate * 100)}%`; RU.save(); };
      rate.onchange = () => RU.speak('Скорость речи');
      el.querySelector('#voice').onchange = (e) => { S.voice = e.target.value; RU.save(); RU.speak('Привет!'); };
      el.querySelector('#export').onclick = () => {
        const blob = new Blob([JSON.stringify(RU.state, null, 2)], { type: 'application/json' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `privet-fortschritt-${U.dayStr()}.json`; a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      };
      el.querySelector('#import').onchange = (e) => {
        const f = e.target.files[0]; if (!f) return;
        f.text().then((t) => { const obj = JSON.parse(t); if (typeof obj.xp !== 'number') throw new Error(); RU.importState(obj); RU.applyTheme(); RU.toast('Fortschritt geladen ✓', 'green'); RU.rerender(); })
          .catch(() => RU.toast('Diese Datei konnte nicht gelesen werden.', 'red'));
      };
      el.querySelector('#reset').onclick = () => {
        const m = ui.modal(`<h2>Wirklich alles löschen?</h2><p class="muted">XP, Serie, Lernstufen aller Wörter und Erfolge gehen verloren. Tipp: Exportiere vorher deinen Fortschritt.</p><div class="row gap end"><button class="btn ghost" id="no">Abbrechen</button><button class="btn soft red" id="yes">Ja, löschen</button></div>`, 'sm');
        m.el.querySelector('#no').onclick = m.close;
        m.el.querySelector('#yes').onclick = () => { RU.resetState(); m.close(); RU.applyTheme(); RU.toast('Fortschritt zurückgesetzt.'); RU.go('#/home'); };
      };
    },
  };
})();
