/* Kern: Hilfsfunktionen, Zustand, XP, Wiederholungssystem, Sprache, Sound, Effekte */
(function () {
  'use strict';
  const RU = (window.RU = window.RU || {});
  const D = window.RU_DATA;
  RU.views = RU.views || {};

  /* ---------------- Hilfsfunktionen ---------------- */
  const U = (RU.util = {});
  U.$ = (s, r = document) => r.querySelector(s);
  U.$$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  U.esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  U.shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  U.sample = (a, n) => U.shuffle(a).slice(0, n);
  U.pick = (a) => a[Math.floor(Math.random() * a.length)];
  U.randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  U.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  U.dayStr = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  U.dayDiff = (a, b) => Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 86400000);
  U.hash = (str) => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  U.html = (str) => { const t = document.createElement('template'); t.innerHTML = str.trim(); return t.content.firstElementChild; };
  U.plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  U.fmtTime = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  U.normalize = (s) => String(s ?? '')
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/́/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[.,!?…;:«»"„“”'’`¿¡]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const DE_ARTICLES = /^(der|die|das|den|dem|ein|eine|einen|einem|einer)\s+/;
  U.alternatives = (s) => String(s).split(/\s*[\/,;]\s*/).map((x) => U.normalize(x).replace(DE_ARTICLES, '')).filter(Boolean);

  U.levenshtein = (a, b) => {
    const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, i) => i);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  };

  /** Prüft eine getippte Antwort. Rückgabe: 'exact' | 'close' | false */
  U.check = (input, target) => {
    const inp = U.normalize(input).replace(DE_ARTICLES, '');
    if (!inp) return false;
    const alts = U.alternatives(target);
    const full = U.normalize(target).replace(DE_ARTICLES, '');
    if (alts.includes(inp) || inp === full) return 'exact';
    for (const a of alts.concat(full)) {
      if (a.length >= 5 && U.levenshtein(inp, a) <= 1) return 'close';
    }
    return false;
  };

  /* ---------------- Transliteration ---------------- */
  const VOWELS = 'аеёиоуыэюя';
  const TR_DE = { а: 'a', б: 'b', в: 'w', г: 'g', д: 'd', е: 'e', ё: 'jo', ж: 'sch', з: 's', и: 'i', й: 'j', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'ch', ц: 'z', ч: 'tsch', ш: 'sch', щ: 'schtsch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'ju', я: 'ja' };
  const TR_SCI = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'ë', ж: 'ž', з: 'z', и: 'i', й: 'j', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'ch', ц: 'c', ч: 'č', ш: 'š', щ: 'šč', ъ: 'ʺ', ы: 'y', ь: 'ʹ', э: 'ė', ю: 'ju', я: 'ja' };

  RU.translit = (text, style) => {
    style = style || RU.state.settings.translitStyle;
    const map = style === 'sci' ? TR_SCI : TR_DE;
    const s = String(text);
    let out = '';
    for (let i = 0; i < s.length; i++) {
      const ch = s[i], lo = ch.toLowerCase();
      if (!(lo in map)) { out += ch; continue; }
      const prev = (s[i - 1] || ' ').toLowerCase();
      const next = (s[i + 1] || ' ').toLowerCase();
      let t = map[lo];
      if (style !== 'sci') {
        const atStart = !/[а-яё]/.test(prev);
        if (lo === 'е' && (atStart || VOWELS.includes(prev) || prev === 'ь' || prev === 'ъ')) t = 'je';
        if (lo === 'ё' && 'жчшщ'.includes(prev)) t = 'o';
        if (lo === 'с' && VOWELS.includes(prev) && VOWELS.includes(next)) t = 'ss';
      }
      if (ch !== lo && t) t = t[0].toUpperCase() + t.slice(1);
      out += t;
    }
    return out;
  };

  /* Lateinische Eingabe → Kyrillisch (phonetisch) */
  const LAT = { a: 'а', b: 'б', v: 'в', w: 'в', g: 'г', d: 'д', e: 'е', z: 'з', i: 'и', j: 'й', k: 'к', l: 'л', m: 'м', n: 'н', o: 'о', p: 'п', r: 'р', s: 'с', t: 'т', u: 'у', f: 'ф', h: 'х', x: 'х', c: 'ц', y: 'ы', q: 'я', "'": 'ь', '#': 'ъ' };
  const COMBO = { 'сh': 'ш', 'зh': 'ж', 'цh': 'ч', 'кh': 'х', 'еh': 'э', 'йa': 'я', 'йu': 'ю', 'йo': 'ё', 'ыa': 'я', 'ыu': 'ю', 'ыo': 'ё', "ь'": 'ъ' };
  RU.latToCyr = (str) => {
    let out = '';
    for (const ch of String(str)) {
      const lo = ch.toLowerCase();
      const isUp = ch !== lo;
      const prev = out.slice(-1);
      const key = prev.toLowerCase() + lo;
      if (prev && COMBO[key]) {
        const prevUp = prev !== prev.toLowerCase();
        out = out.slice(0, -1) + (prevUp ? COMBO[key].toUpperCase() : COMBO[key]);
        if (/шч$/i.test(out)) out = out.slice(0, -2) + (/Ш/.test(out.slice(-2)) ? 'Щ' : 'щ');
      } else if (LAT[lo]) {
        out += isUp ? LAT[lo].toUpperCase() : LAT[lo];
      } else out += ch;
    }
    return out;
  };

  /* ---------------- Daten aufbereiten ---------------- */
  const parseLines = (txt) => txt.trim().split('\n').map((l) => l.trim()).filter(Boolean).map((l) => { const [ru, de] = l.split('|'); return { ru: ru.trim(), de: de.trim() }; });
  RU.topics = D.topics.map((t) => ({ ...t, list: [] }));
  RU.words = [];
  RU.topicById = {};
  RU.topics.forEach((t) => {
    RU.topicById[t.id] = t;
    parseLines(t.words).forEach((w, i) => {
      const word = { id: `${t.id}-${i}`, ru: w.ru, de: w.de, topic: t.id };
      t.list.push(word);
      RU.words.push(word);
    });
  });
  RU.wordById = Object.fromEntries(RU.words.map((w) => [w.id, w]));
  RU.phraseCats = D.phraseCategories.map((c) => ({ ...c, list: parseLines(c.phrases).map((p, i) => ({ ...p, id: `${c.id}-${i}`, cat: c.id })) }));
  RU.phrases = RU.phraseCats.flatMap((c) => c.list);
  RU.sentences = parseLines(D.sentences);
  RU.alphabet = D.alphabet;
  RU.grammar = D.grammar;

  /* ---------------- Zustand / Speicherung ---------------- */
  const KEY = 'privet-state-v1';
  const defaults = () => ({
    version: 1,
    created: Date.now(),
    name: '',
    xp: 0,
    streak: { count: 0, last: null },
    bestStreak: 0,
    history: {},
    srs: {},
    letters: [],
    grammar: {},
    favorites: [],
    achievements: {},
    stats: { answers: 0, correct: 0, perfect: 0, spoken: 0, goals: 0, modes: {}, games: {} },
    settings: { theme: 'auto', rate: 0.85, voice: '', sound: true, translit: true, translitStyle: 'de', dailyGoal: 50, autoplay: true, phonetic: true },
  });
  const merge = (def, src) => {
    if (!src || typeof src !== 'object' || Array.isArray(def)) return src ?? def;
    const out = { ...def };
    for (const k of Object.keys(src)) out[k] = def[k] && typeof def[k] === 'object' && !Array.isArray(def[k]) ? merge(def[k], src[k]) : src[k];
    return out;
  };
  RU.loadState = () => {
    try { const raw = localStorage.getItem(KEY); return raw ? merge(defaults(), JSON.parse(raw)) : defaults(); } catch (e) { return defaults(); }
  };
  RU.state = RU.loadState();
  RU.save = () => { try { localStorage.setItem(KEY, JSON.stringify(RU.state)); } catch (e) { /* privat-Modus */ } };
  RU.resetState = () => { RU.state = defaults(); RU.save(); };
  RU.importState = (obj) => { RU.state = merge(defaults(), obj); RU.save(); };

  RU.game = (id) => (RU.state.stats.games[id] ||= {});
  RU.markMode = (mode) => { RU.state.stats.modes[mode] = (RU.state.stats.modes[mode] || 0) + 1; RU.save(); RU.checkAchievements(); };

  /* ---------------- Level & XP ---------------- */
  const TITLES = [
    [1, 'Новичок', 'Neuling'], [3, 'Ученик', 'Lehrling'], [6, 'Студент', 'Student'], [10, 'Знаток', 'Kenner'],
    [15, 'Мастер', 'Meister'], [21, 'Профессор', 'Professor'], [30, 'Легенда', 'Legende'],
  ];
  RU.xpFor = (l) => 50 * l * (l - 1);
  RU.levelInfo = (xp = RU.state.xp) => {
    let l = 1; while (xp >= RU.xpFor(l + 1)) l++;
    const cur = RU.xpFor(l), next = RU.xpFor(l + 1);
    const t = TITLES.filter((x) => l >= x[0]).pop();
    return { level: l, cur, next, into: xp - cur, need: next - cur, pct: (xp - cur) / (next - cur), title: t[1], titleDe: t[2] };
  };
  RU.todayXP = () => RU.state.history[U.dayStr()] || 0;
  RU.currentStreak = () => {
    const s = RU.state.streak; if (!s.last) return 0;
    return U.dayDiff(s.last, U.dayStr()) <= 1 ? s.count : 0;
  };

  RU.addXP = (n, opts = {}) => {
    n = Math.round(n); if (n <= 0) return;
    const s = RU.state, today = U.dayStr();
    const lvlBefore = RU.levelInfo().level;
    const goalBefore = (s.history[today] || 0) >= s.settings.dailyGoal;
    s.xp += n;
    s.history[today] = (s.history[today] || 0) + n;
    if (s.streak.last !== today) {
      const diff = s.streak.last ? U.dayDiff(s.streak.last, today) : 99;
      s.streak.count = diff === 1 ? s.streak.count + 1 : 1;
      s.streak.last = today;
      s.bestStreak = Math.max(s.bestStreak || 0, s.streak.count);
      if (s.streak.count > 1) RU.toast(`🔥 ${s.streak.count} Tage in Folge! Weiter so!`, 'gold');
    }
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 4) s.stats.night = true;
    if (hour >= 4 && hour < 7) s.stats.early = true;
    RU.save();
    if (!opts.silent) RU.xpPop(n);
    if (!goalBefore && s.history[today] >= s.settings.dailyGoal) {
      s.stats.goals++; RU.save();
      RU.toast('🎯 Tagesziel erreicht! Отлично!', 'green');
      RU.sfx('level'); RU.confetti();
    }
    const lvlAfter = RU.levelInfo().level;
    if (lvlAfter > lvlBefore) {
      const li = RU.levelInfo();
      RU.toast(`⭐ Level ${lvlAfter} erreicht! Du bist jetzt „${li.title}“ (${li.titleDe}).`, 'violet');
      RU.sfx('level'); RU.confetti(160);
    }
    RU.updateChrome && RU.updateChrome();
    RU.checkAchievements();
  };

  /* ---------------- Wiederholungssystem (Leitner) ---------------- */
  const DAY = 86400000;
  const INTERVALS = [0, 1, 2, 4, 8, 16, 32];
  RU.srs = {
    get: (id) => RU.state.srs[id],
    ensure: (id) => (RU.state.srs[id] ||= { b: 0, due: 0, c: 0, w: 0, last: null }),
    /** Ergebnis aus Quiz / Schreiben / Hören etc. */
    answer(id, ok) {
      if (!id) return;
      const e = this.ensure(id), today = U.dayStr(), now = Date.now();
      if (ok) {
        e.c++;
        if (e.last !== today || e.b === 0) { e.b = Math.min(6, e.b + 1); e.due = now + INTERVALS[e.b] * DAY; }
      } else {
        e.w++; e.b = Math.max(0, e.b - 1); e.due = now;
      }
      e.last = today;
      RU.save();
    },
    /** Bewertung aus Karteikarten: 0 nochmal, 1 schwer, 2 gut, 3 leicht */
    rate(id, grade) {
      const e = this.ensure(id), now = Date.now();
      if (grade === 0) { e.w++; e.b = 0; e.due = now + 60000; }
      else if (grade === 1) { e.c++; e.b = Math.max(1, e.b); e.due = now + Math.max(0.5, INTERVALS[e.b] / 2) * DAY; }
      else { e.c++; e.b = Math.min(6, e.b + (grade === 3 ? 2 : 1)); e.due = now + INTERVALS[e.b] * DAY; }
      e.last = U.dayStr();
      RU.save();
    },
    dueWords: () => { const now = Date.now(); return RU.words.filter((w) => { const e = RU.state.srs[w.id]; return e && e.due <= now; }); },
    weakWords: () => RU.words.filter((w) => { const e = RU.state.srs[w.id]; return e && (e.w > e.c * 0.5 || e.b <= 1) && e.w > 0; }),
    newWords: () => RU.words.filter((w) => !RU.state.srs[w.id]),
    level: (id) => (RU.state.srs[id] ? RU.state.srs[id].b : -1),
    learnedCount: (list = RU.words) => list.filter((w) => (RU.state.srs[w.id]?.b || 0) >= 2).length,
    masteredCount: (list = RU.words) => list.filter((w) => (RU.state.srs[w.id]?.b || 0) >= 5).length,
  };

  /** Wortauswahl für Übungen */
  RU.pool = (topic) => {
    if (!topic || topic === 'all') return RU.words;
    if (topic === 'due') return RU.srs.dueWords();
    if (topic === 'weak') return RU.srs.weakWords();
    if (topic === 'new') return RU.srs.newWords();
    return RU.topicById[topic]?.list || RU.words;
  };
  /** Falsche Antwortmöglichkeiten – bevorzugt aus dem gleichen Thema */
  RU.distractors = (word, n, field) => {
    const used = new Set([U.normalize(word[field])]);
    const out = [];
    const take = (list) => { for (const w of U.shuffle(list)) { if (out.length >= n) break; const k = U.normalize(w[field]); if (!used.has(k)) { used.add(k); out.push(w); } } };
    take(RU.topicById[word.topic]?.list || []);
    take(RU.words);
    return out;
  };

  /* ---------------- Sprachausgabe & -erkennung ---------------- */
  RU.speech = {
    voices: [],
    supported: 'speechSynthesis' in window,
    init() {
      if (!this.supported) return;
      const load = () => { this.voices = speechSynthesis.getVoices().filter((v) => /^ru/i.test(v.lang)); };
      load();
      speechSynthesis.addEventListener?.('voiceschanged', load);
    },
    voice() {
      const pref = RU.state.settings.voice;
      return this.voices.find((v) => v.name === pref) || this.voices.find((v) => /google/i.test(v.name)) || this.voices[0] || null;
    },
    speak(text, opts = {}) {
      if (!this.supported || !text) return Promise.resolve();
      const clean = String(text).replace(/[…]/g, '').replace(/\(.*?\)/g, '');
      speechSynthesis.cancel();
      return new Promise((resolve) => {
        const u = new SpeechSynthesisUtterance(clean);
        u.lang = 'ru-RU';
        const v = this.voice(); if (v) u.voice = v;
        u.rate = opts.rate || RU.state.settings.rate;
        u.onend = u.onerror = () => resolve();
        speechSynthesis.speak(u);
        setTimeout(resolve, 8000);
      });
    },
    stop() { if (this.supported) speechSynthesis.cancel(); },
    recognitionSupported: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
    listen() {
      return new Promise((resolve, reject) => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) return reject(new Error('unsupported'));
        const r = new SR();
        r.lang = 'ru-RU'; r.interimResults = false; r.maxAlternatives = 5;
        let done = false;
        r.onresult = (e) => { done = true; resolve(Array.from(e.results[0]).map((a) => a.transcript)); };
        r.onerror = (e) => { done = true; reject(e.error || e); };
        r.onend = () => { if (!done) resolve([]); };
        r.start();
        RU.onCleanup && RU.onCleanup(() => { try { r.abort(); } catch (_) {} });
      });
    },
  };
  RU.speak = (t, o) => RU.speech.speak(t, o);

  /* ---------------- Soundeffekte (WebAudio, keine Dateien) ---------------- */
  let actx = null;
  const tone = (freq, dur, type = 'sine', gain = 0.12, delay = 0) => {
    actx ||= new (window.AudioContext || window.webkitAudioContext)();
    const t0 = actx.currentTime + delay;
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(actx.destination);
    o.start(t0); o.stop(t0 + dur + 0.05);
  };
  RU.sfx = (name) => {
    if (!RU.state.settings.sound) return;
    try {
      switch (name) {
        case 'correct': tone(660, 0.12, 'triangle'); tone(990, 0.18, 'triangle', 0.12, 0.09); break;
        case 'wrong': tone(200, 0.22, 'sawtooth', 0.06); tone(150, 0.25, 'sawtooth', 0.05, 0.1); break;
        case 'level': [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.22, 'triangle', 0.1, i * 0.09)); break;
        case 'flip': tone(420, 0.06, 'sine', 0.06); break;
        case 'click': tone(800, 0.04, 'square', 0.03); break;
        case 'pop': tone(520, 0.08, 'sine', 0.1); tone(780, 0.08, 'sine', 0.08, 0.05); break;
        case 'tick': tone(1200, 0.03, 'square', 0.025); break;
        case 'end': [784, 659, 523].forEach((f, i) => tone(f, 0.2, 'triangle', 0.08, i * 0.1)); break;
      }
    } catch (e) { /* Audio nicht verfügbar */ }
  };

  /* ---------------- Toasts, XP-Pop, Konfetti ---------------- */
  RU.toast = (msg, color = 'ink') => {
    const box = document.getElementById('toasts'); if (!box) return;
    const el = U.html(`<div class="toast ${color}">${msg}</div>`);
    box.appendChild(el);
    setTimeout(() => el.classList.add('out'), 3400);
    setTimeout(() => el.remove(), 3900);
  };
  RU.xpPop = (n) => {
    const target = document.getElementById('chip-xp'); if (!target) return;
    const r = target.getBoundingClientRect();
    const el = U.html(`<div class="xp-pop">+${n} XP</div>`);
    el.style.left = `${r.left + r.width / 2}px`; el.style.top = `${r.bottom + 4}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1100);
  };
  RU.confetti = (count = 110) => {
    const c = document.getElementById('confetti'); if (!c || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = c.getContext('2d');
    const W = (c.width = innerWidth), H = (c.height = innerHeight);
    const colors = ['#e5383b', '#2f5bea', '#f2a516', '#14a37f', '#7b4dff', '#ffffff'];
    const parts = Array.from({ length: count }, () => ({
      x: W / 2 + (Math.random() - 0.5) * W * 0.3, y: H * 0.35, vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 14 - 4,
      s: 5 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, c: U.pick(colors), shape: Math.random() < 0.5,
    }));
    let frame = 0;
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      parts.forEach((p) => {
        p.vy += 0.35; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
        if (p.shape) ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); else { ctx.beginPath(); ctx.arc(0, 0, p.s / 2.5, 0, 7); ctx.fill(); }
        ctx.restore();
      });
      if (++frame < 160) requestAnimationFrame(tick); else ctx.clearRect(0, 0, W, H);
    };
    tick();
  };

  /* ---------------- Erfolge ---------------- */
  const g = (id) => RU.state.stats.games[id] || {};
  RU.achievements = [
    { id: 'first', icon: '🌱', title: 'Erste Schritte', desc: 'Sammle deine ersten XP.', check: (s) => [s.xp, 1] },
    { id: 'xp500', icon: '⚡', title: 'Fleißig', desc: 'Sammle 500 XP.', check: (s) => [s.xp, 500] },
    { id: 'xp2000', icon: '💎', title: 'Unaufhaltsam', desc: 'Sammle 2.000 XP.', check: (s) => [s.xp, 2000] },
    { id: 'xp10000', icon: '👑', title: 'Царь', desc: 'Sammle 10.000 XP.', check: (s) => [s.xp, 10000] },
    { id: 'streak3', icon: '🔥', title: 'Am Ball', desc: '3 Tage in Folge lernen.', check: (s) => [s.bestStreak || 0, 3] },
    { id: 'streak7', icon: '🗓️', title: 'Eine Woche', desc: '7 Tage in Folge lernen.', check: (s) => [s.bestStreak || 0, 7] },
    { id: 'streak30', icon: '🏔️', title: 'Eiserner Wille', desc: '30 Tage in Folge lernen.', check: (s) => [s.bestStreak || 0, 30] },
    { id: 'goal', icon: '🎯', title: 'Ziel erreicht', desc: 'Erreiche dein Tagesziel.', check: (s) => [s.stats.goals, 1] },
    { id: 'goal10', icon: '🏹', title: 'Zielstrebig', desc: 'Erreiche 10-mal dein Tagesziel.', check: (s) => [s.stats.goals, 10] },
    { id: 'letters10', icon: '🔤', title: 'Buchstabensammler', desc: 'Lerne 10 Buchstaben.', check: (s) => [s.letters.length, 10] },
    { id: 'letters33', icon: '📜', title: 'Кириллица!', desc: 'Lerne alle 33 Buchstaben.', check: (s) => [s.letters.length, 33] },
    { id: 'words25', icon: '📗', title: 'Wortschatz', desc: 'Lerne 25 Wörter.', check: () => [RU.srs.learnedCount(), 25] },
    { id: 'words100', icon: '📚', title: 'Bücherwurm', desc: 'Lerne 100 Wörter.', check: () => [RU.srs.learnedCount(), 100] },
    { id: 'words300', icon: '🧠', title: 'Lexikon', desc: 'Lerne 300 Wörter.', check: () => [RU.srs.learnedCount(), 300] },
    { id: 'master50', icon: '🥇', title: 'Meisterhaft', desc: 'Meistere 50 Wörter (höchste Stufe).', check: () => [RU.srs.masteredCount(), 50] },
    { id: 'perfect', icon: '💯', title: 'Perfektionist', desc: 'Beende eine Runde ohne Fehler.', check: (s) => [s.stats.perfect, 1] },
    { id: 'perfect10', icon: '🌟', title: 'Fehlerlos', desc: '10 fehlerfreie Runden.', check: (s) => [s.stats.perfect, 10] },
    { id: 'answers500', icon: '✅', title: 'Antwortmaschine', desc: 'Beantworte 500 Fragen richtig.', check: (s) => [s.stats.correct, 500] },
    { id: 'grammar3', icon: '📐', title: 'Grammatik-Fan', desc: 'Schließe 3 Grammatik-Lektionen ab.', check: (s) => [Object.values(s.grammar).filter((v) => v >= 70).length, 3] },
    { id: 'grammarAll', icon: '🎓', title: 'Grammatik-Profi', desc: 'Schließe alle Grammatik-Lektionen ab.', check: (s) => [Object.values(s.grammar).filter((v) => v >= 70).length, RU.grammar.length] },
    { id: 'speaker', icon: '🎤', title: 'Redner', desc: 'Sprich 10 Wörter richtig aus.', check: (s) => [s.stats.spoken, 10] },
    { id: 'memory', icon: '🧩', title: 'Gutes Gedächtnis', desc: 'Gewinne ein Memory-Spiel.', check: () => [g('memory').wins || 0, 1] },
    { id: 'blitz25', icon: '⏱️', title: 'Blitzschnell', desc: 'Erreiche 25 Punkte im Zeitrennen.', check: () => [g('blitz').best || 0, 25] },
    { id: 'hangman5', icon: '🎈', title: 'Ballonfahrer', desc: 'Gewinne 5 Runden „Luftballons“.', check: () => [g('hangman').wins || 0, 5] },
    { id: 'rain20', icon: '🌧️', title: 'Regenmacher', desc: 'Erreiche 20 Punkte im Wortregen.', check: () => [g('rain').best || 0, 20] },
    { id: 'anagram10', icon: '🔀', title: 'Buchstabenjongleur', desc: 'Löse 10 Buchstabensalate.', check: () => [g('anagram').solved || 0, 10] },
    { id: 'sentence10', icon: '🧱', title: 'Satzbaumeister', desc: 'Baue 10 Sätze richtig.', check: () => [g('sentence').solved || 0, 10] },
    { id: 'explorer', icon: '🧭', title: 'Entdecker', desc: 'Probiere 8 verschiedene Übungen & Spiele aus.', check: (s) => [Object.keys(s.stats.modes).length, 8] },
    { id: 'night', icon: '🦉', title: 'Nachteule', desc: 'Lerne nach 22 Uhr.', check: (s) => [s.stats.night ? 1 : 0, 1] },
    { id: 'early', icon: '🐦', title: 'Frühaufsteher', desc: 'Lerne vor 7 Uhr morgens.', check: (s) => [s.stats.early ? 1 : 0, 1] },
  ];
  RU.achievementProgress = (a) => { const [v, max] = a.check(RU.state); return { v: Math.min(v, max), max, done: v >= max }; };
  RU.checkAchievements = () => {
    const s = RU.state; let changed = false;
    for (const a of RU.achievements) {
      if (s.achievements[a.id]) continue;
      if (RU.achievementProgress(a).done) {
        s.achievements[a.id] = Date.now(); changed = true;
        setTimeout(() => { RU.toast(`<span class="toast-badge">${a.icon}</span><span><b>Erfolg freigeschaltet!</b><br>${U.esc(a.title)}</span>`, 'gold'); RU.sfx('level'); }, 400);
      }
    }
    if (changed) { RU.save(); RU.updateChrome && RU.updateChrome(); }
  };

  /* ---------------- Zahlen in Worten ---------------- */
  const N_UNITS = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
  const N_UNITS_F = ['', 'одна', 'две', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
  const N_TEENS = ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'];
  const N_TENS = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'];
  const N_HUND = ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'];
  const triple = (n, fem) => {
    const out = []; const h = Math.floor(n / 100), t = Math.floor((n % 100) / 10), u = n % 10;
    if (h) out.push(N_HUND[h]);
    if (t === 1) out.push(N_TEENS[u]);
    else { if (t) out.push(N_TENS[t]); if (u) out.push((fem ? N_UNITS_F : N_UNITS)[u]); }
    return out;
  };
  RU.numberWords = (n) => {
    n = Math.floor(Math.abs(n));
    if (n === 0) return 'ноль';
    const parts = [];
    const mil = Math.floor(n / 1e6), th = Math.floor((n % 1e6) / 1000), rest = n % 1000;
    const form = (x, one, few, many) => { const t = x % 100, u = x % 10; if (t >= 11 && t <= 14) return many; if (u === 1) return one; if (u >= 2 && u <= 4) return few; return many; };
    if (mil) parts.push(...triple(mil, false), form(mil, 'миллион', 'миллиона', 'миллионов'));
    if (th) parts.push(...triple(th, true), form(th, 'тысяча', 'тысячи', 'тысяч'));
    if (rest) parts.push(...triple(rest, false));
    return parts.join(' ');
  };
})();
