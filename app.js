import { db } from './db.js';
import { readTags } from './id3.js';
import { ytKey, loadApi, parseYouTubeId, cleanMeta, ytSearch, ytTitle, thumb } from './youtube.js';

/* =========================================================
   Hilfsfunktionen
   ========================================================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (t) => {
  if (!isFinite(t) || t < 0) t = 0;
  const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = Math.floor(t % 60);
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`;
};
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
const hash = (s) => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) | 0; return Math.abs(h); };
const shuffleArr = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const collator = new Intl.Collator('de', { numeric: true, sensitivity: 'base' });
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

const P = (d, f) => `<svg viewBox="0 0 24 24"${f ? ' class="f"' : ''}>${d}</svg>`;
const I = {
  home: P('<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>'),
  search: P('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
  library: P('<path d="M4 4v16M9 4v16M14 4l6 16"/>'),
  play: P('<path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"/>', 1),
  pause: P('<rect x="6" y="4" width="4" height="16" rx="1.2"/><rect x="14" y="4" width="4" height="16" rx="1.2"/>', 1),
  next: P('<path d="M5 5.2v13.6a.8.8 0 0 0 1.2.7L16 13v5.5a1 1 0 0 0 2 0v-13a1 1 0 0 0-2 0V11L6.2 4.5a.8.8 0 0 0-1.2.7z"/>', 1),
  prev: P('<path d="M19 5.2v13.6a.8.8 0 0 1-1.2.7L8 13v5.5a1 1 0 0 1-2 0v-13a1 1 0 0 1 2 0V11l9.8-6.5a.8.8 0 0 1 1.2.7z"/>', 1),
  shuffle: P('<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>'),
  repeat: P('<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>'),
  heart: P('<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>'),
  heartF: P('<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>', 1),
  more: P('<circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/>', 1),
  plus: P('<path d="M12 5v14M5 12h14"/>'),
  down: P('<path d="m6 9 6 6 6-6"/>'),
  back: P('<path d="m15 18-6-6 6-6"/>'),
  queue: P('<path d="M3 6h13M3 12h13M3 18h8M18 15v6l4-3z"/>'),
  upload: P('<path d="M12 16V4M6 10l6-6 6 6M4 20h16"/>'),
  trash: P('<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>'),
  download: P('<path d="M12 4v12M6 10l6 6 6-6M4 20h16"/>'),
  check: P('<path d="m5 12 5 5L20 7"/>'),
  music: P('<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>'),
  x: P('<path d="M18 6 6 18M6 6l12 12"/>'),
  edit: P('<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>'),
  next1: P('<path d="M3 12h13M12 6l6 6-6 6M21 5v14"/>'),
  addq: P('<path d="M3 6h13M3 12h9M3 18h9M18 13v8M14 17h8"/>'),
  listplus: P('<path d="M3 6h13M3 12h13M3 18h7M17 15v6M14 18h6"/>'),
  disc: P('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/>'),
  moon: P('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'),
  link: P('<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>'),
  shrink: P('<path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/>'),
  expand: P('<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>'),
  yt: P('<rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="m10 9 5 3-5 3z" fill="currentColor"/>'),
  key: P('<circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 9.8-9.8M17 6l3 3M15 8l2 2"/>'),
  globe: P('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
};
const EQ = '<span class="eq"><i></i><i></i><i></i></span>';

/* =========================================================
   Zustand
   ========================================================= */
const S = {
  tracks: new Map(),   // id -> Track (gespeichert oder flüchtig)
  audio: new Map(),    // id -> Blob (offline verfügbare Audiodaten)
  playlists: [],
  queue: [],
  order: null,         // ursprüngliche Reihenfolge, wenn Zufall aktiv
  index: -1,
  shuffle: false,
  repeat: 'off',       // off | all | one
  recent: [],
  context: '',
  searchQ: '',
  sort: 'added',
  sleepAt: 0,
  sleepEnd: false,
  video: 'big',        // YouTube-Video groß | klein
};
const LS_KEY = 'klang:state:v1';
const audio = $('#audio');

const savedTracks = () => [...S.tracks.values()].filter((t) => t.saved);
const cur = () => S.tracks.get(S.queue[S.index]);

function addTrack(t) {
  const ex = S.tracks.get(t.id);
  if (ex) return ex;
  S.tracks.set(t.id, t);
  return t;
}

async function persistTrack(t) {
  t.saved = true;
  await db.put('tracks', t);
}

function saveState() {
  try {
    const ids = new Set([...S.queue, ...(S.order || []), ...S.recent]);
    const eph = [...ids].map((id) => S.tracks.get(id)).filter((t) => t && !t.saved);
    localStorage.setItem(LS_KEY, JSON.stringify({
      queue: S.queue, order: S.order, index: S.index, time: E.time || 0, video: S.video,
      shuffle: S.shuffle, repeat: S.repeat, recent: S.recent, context: S.context, sort: S.sort, eph,
    }));
  } catch { /* Speicher voll oder privat */ }
}

function loadState() {
  let st;
  try { st = JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch { st = null; }
  if (!st) return;
  (st.eph || []).forEach(addTrack);
  const ok = (id) => S.tracks.has(id);
  S.queue = (st.queue || []).filter(ok);
  S.order = st.order ? st.order.filter(ok) : null;
  S.index = Math.min(Math.max(0, st.index ?? 0), S.queue.length - 1);
  S.shuffle = !!st.shuffle && !!S.order;
  S.repeat = ['off', 'all', 'one'].includes(st.repeat) ? st.repeat : 'off';
  S.recent = (st.recent || []).filter(ok);
  S.context = st.context || '';
  S.sort = st.sort || 'added';
  S.video = st.video === 'small' ? 'small' : 'big';
  if (cur()) loadIndex(S.index, { autoplay: false, at: st.time || 0 });
}

/* =========================================================
   Cover
   ========================================================= */
function artHTML(t, cls = 'art-s') {
  const src = t?.coverData || t?.coverUrl;
  if (src) return `<div class="art ${cls}"><img src="${esc(src)}" alt="" loading="lazy" decoding="async" onerror="this.remove()"></div>`;
  const h = hash(t?.album || t?.title || 'x') % 360;
  return `<div class="art ph ${cls}" style="--h:${h}">${I.music}</div>`;
}

function collectionArt(ids, cls, name) {
  const covers = [];
  const seen = new Set();
  for (const id of ids) {
    const t = S.tracks.get(id);
    const src = t?.coverData || t?.coverUrl;
    if (src && !seen.has(src)) { seen.add(src); covers.push(t); }
    if (covers.length === 4) break;
  }
  if (covers.length === 4) return `<div class="art mosaic ${cls}">${covers.map((t) => artHTML(t, '')).join('')}</div>`;
  if (covers.length) return artHTML(covers[0], cls);
  return `<div class="art ph ${cls}" style="--h:${hash(name) % 360}">${I.music}</div>`;
}

function loadImage(blob) {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); res(img); };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('Bild')); };
    img.src = url;
  });
}

async function processCover(blob) {
  try {
    const img = await loadImage(blob);
    const s = Math.min(512, Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas');
    c.width = c.height = s;
    const x = c.getContext('2d');
    const r = Math.max(s / img.naturalWidth, s / img.naturalHeight);
    const w = img.naturalWidth * r, h = img.naturalHeight * r;
    x.drawImage(img, (s - w) / 2, (s - h) / 2, w, h);
    const p = document.createElement('canvas');
    p.width = p.height = 1;
    const px = p.getContext('2d');
    px.drawImage(c, 0, 0, 1, 1);
    const d = px.getImageData(0, 0, 1, 1).data;
    return { coverData: c.toDataURL('image/jpeg', 0.86), color: `rgb(${d[0]},${d[1]},${d[2]})` };
  } catch {
    return null;
  }
}

const trackColor = (t) => t?.color || `hsl(${hash(t?.album || t?.title || 'x') % 360} 45% 32%)`;

/* =========================================================
   Import eigener Dateien
   ========================================================= */
const AUDIO_EXT = /\.(mp3|m4a|mp4|aac|flac|wav|ogg|oga|opus|webm|aif|aiff)$/i;
const MIME = { mp3: 'audio/mpeg', m4a: 'audio/mp4', mp4: 'audio/mp4', aac: 'audio/aac', flac: 'audio/flac', wav: 'audio/wav', ogg: 'audio/ogg', oga: 'audio/ogg', opus: 'audio/ogg', webm: 'audio/webm', aif: 'audio/aiff', aiff: 'audio/aiff' };

function probeDuration(blob) {
  return new Promise((res) => {
    const a = document.createElement('audio');
    a.preload = 'metadata';
    const url = URL.createObjectURL(blob);
    let done = false;
    const finish = (d) => {
      if (done) return;
      done = true;
      URL.revokeObjectURL(url);
      a.removeAttribute('src');
      res(isFinite(d) ? d : 0);
    };
    a.onloadedmetadata = () => finish(a.duration);
    a.onerror = () => finish(0);
    setTimeout(() => finish(0), 6000);
    a.src = url;
  });
}

async function importFiles(fileList) {
  const files = [...fileList].filter((f) => f.type.startsWith('audio/') || AUDIO_EXT.test(f.name));
  if (!files.length) return toast('Keine Audiodateien gefunden');
  let n = 0;
  const ids = [];
  for (const f of files) {
    toast(`Importiere ${n + 1} von ${files.length} …`, 60000);
    try {
      const ext = (f.name.match(/\.([^.]+)$/) || [])[1]?.toLowerCase();
      const type = f.type || MIME[ext] || 'audio/mpeg';
      // Daten kopieren, damit iOS die Datei nicht später verliert
      const blob = new Blob([await f.arrayBuffer()], { type });
      const tags = await readTags(blob);
      const base = f.name.replace(/\.[^.]+$/, '').replace(/_/g, ' ').trim();
      let title = tags.title, artist = tags.artist;
      if (!title) {
        const parts = base.replace(/^\d{1,3}[\s.\-_]+/, '').split(' - ');
        if (parts.length > 1) { artist = artist || parts[0].trim(); title = parts.slice(1).join(' - ').trim(); }
        else title = parts[0] || base;
      }
      const cover = tags.cover ? await processCover(tags.cover) : null;
      const duration = await probeDuration(blob);
      const id = uid();
      const t = {
        id, source: 'local', title, artist: artist || '', album: tags.album || '',
        duration, addedAt: Date.now(), liked: false, offline: true, saved: true,
        coverData: cover?.coverData || '', color: cover?.color || '',
      };
      await db.put('audio', { id, blob });
      await db.put('tracks', t);
      S.audio.set(id, blob);
      S.tracks.set(id, t);
      ids.push(id);
      n++;
    } catch (e) {
      console.warn('Import fehlgeschlagen', f.name, e);
    }
  }
  if (navigator.storage?.persist) navigator.storage.persist().catch(() => {});
  toast(n ? `${plural(n, 'Song', 'Songs')} hinzugefügt` : 'Import fehlgeschlagen');
  render();
  return ids;
}

/* =========================================================
   Internet Archive (freie, legale Musik)
   ========================================================= */
const IA = 'https://archive.org';
const IA_COLL = '(collection:etree OR collection:netlabels OR collection:opensource_audio OR collection:audio_music OR collection:78rpm OR collection:oldtimeradio OR collection:audio_bookspoetry OR collection:georgeblood)';
const iaCache = new Map();

async function iaSearch(q) {
  const clean = q.replace(/[+\-!(){}[\]^"~*?:\\/&|]/g, ' ').trim();
  if (!clean) return [];
  const key = 's:' + clean.toLowerCase();
  if (iaCache.has(key)) return iaCache.get(key);
  const p = new URLSearchParams();
  p.set('q', `(${clean}) AND mediatype:audio AND ${IA_COLL}`);
  ['identifier', 'title', 'creator', 'year'].forEach((f) => p.append('fl[]', f));
  p.append('sort[]', 'downloads desc');
  p.set('rows', '40');
  p.set('page', '1');
  p.set('output', 'json');
  const r = await fetch(`${IA}/advancedsearch.php?${p}`);
  if (!r.ok) throw new Error('Suche fehlgeschlagen');
  const j = await r.json();
  const docs = (j.response?.docs || []).map((d) => ({
    id: d.identifier,
    title: Array.isArray(d.title) ? d.title[0] : d.title || d.identifier,
    creator: Array.isArray(d.creator) ? d.creator.join(', ') : d.creator || '',
    year: d.year || '',
    cover: `${IA}/services/img/${encodeURIComponent(d.identifier)}`,
  }));
  iaCache.set(key, docs);
  return docs;
}

function parseLen(v) {
  if (v == null) return 0;
  const s = String(v);
  if (s.includes(':')) return s.split(':').reduce((a, b) => a * 60 + (parseFloat(b) || 0), 0);
  return parseFloat(s) || 0;
}

async function iaAlbum(id) {
  const key = 'a:' + id;
  if (iaCache.has(key)) return iaCache.get(key);
  const r = await fetch(`${IA}/metadata/${encodeURIComponent(id)}`);
  if (!r.ok) throw new Error('Album nicht gefunden');
  const j = await r.json();
  const m = j.metadata || {};
  const one = (v) => (Array.isArray(v) ? v[0] : v) || '';
  const album = one(m.title) || id;
  const creator = Array.isArray(m.creator) ? m.creator.join(', ') : m.creator || '';
  const files = j.files || [];

  let audioFiles = files.filter((f) => /\.mp3$/i.test(f.name));
  if (!audioFiles.length) audioFiles = files.filter((f) => /\.(m4a|ogg|flac)$/i.test(f.name));
  const best = new Map();
  for (const f of audioFiles) {
    const base = f.name.replace(/(_vbr|_64kb|_128kb|_256kb)?\.[^.]+$/i, '').toLowerCase();
    const score = /VBR/i.test(f.format) ? 4 : /256/.test(f.format) ? 3 : f.source === 'original' ? 2 : /128/.test(f.format) ? 1 : 0;
    const prev = best.get(base);
    if (!prev || score > prev.score) best.set(base, { f, score });
  }
  const list = [...best.values()].map((x) => x.f);
  const trackNo = (f) => parseInt(String(f.track || '').split('/')[0], 10);
  list.sort((a, b) => {
    const ta = trackNo(a), tb = trackNo(b);
    if (!isNaN(ta) && !isNaN(tb) && ta !== tb) return ta - tb;
    return collator.compare(a.name, b.name);
  });
  const cover = `${IA}/services/img/${encodeURIComponent(id)}`;
  const tracks = list.map((f) => {
    const name = f.name.split('/').pop().replace(/\.[^.]+$/, '').replace(/_/g, ' ');
    return addTrack({
      id: `ia:${id}/${f.name}`,
      source: 'ia',
      iaId: id,
      url: `${IA}/download/${encodeURIComponent(id)}/${f.name.split('/').map(encodeURIComponent).join('/')}`,
      title: f.title || name,
      artist: f.artist || f.creator || creator || 'Unbekannt',
      album,
      coverUrl: cover,
      duration: parseLen(f.length),
      liked: false,
      offline: false,
      saved: false,
    });
  });
  const res = { id, album, creator, year: one(m.year) || one(m.date).slice(0, 4), cover, ids: tracks.map((t) => t.id) };
  iaCache.set(key, res);
  return res;
}

/* =========================================================
   Wiedergabe
   ========================================================= */
let objURL = null;
let pendingSeek = 0;
let errStreak = 0;
let lastSave = 0;

/* Zwei Wiedergabe-Arten: <audio> für eigene/freie Songs, YouTube-Player für YouTube */
let mode = 'audio';
let ytP = null;
let ytReadyP = null;
let ytState = -1;
let ytLoadedId = '';
let ytHidden = false;

const E = {
  get paused() { return mode === 'yt' ? !(ytState === 1 || ytState === 3) : audio.paused; },
  get time() { return mode === 'yt' ? (ytP?.getCurrentTime?.() || 0) : audio.currentTime; },
  get duration() {
    if (mode === 'yt') { const d = ytP?.getDuration?.(); return d > 0 ? d : (cur()?.duration || 0); }
    return audio.duration;
  },
  get loaded() { return mode === 'yt' ? !!ytLoadedId : !!audio.currentSrc; },
  play() {
    if (mode === 'yt') {
      if (ytHidden) { ytHidden = false; showVideo(true); }
      ytP?.playVideo?.();
    } else playSafe();
  },
  pause() { if (mode === 'yt') ytP?.pauseVideo?.(); else audio.pause(); },
  seek(t) {
    if (mode === 'yt') ytP?.seekTo?.(t, true);
    else audio.currentTime = t;
    updatePositionState();
  },
};

function clearAudio() {
  const old = objURL;
  objURL = null;
  audio.pause();
  audio.removeAttribute('src');
  audio.load();
  if (old) URL.revokeObjectURL(old);
}

function setSource(t, autoplay, at) {
  if (t.source === 'yt') {
    if (mode !== 'yt') clearAudio();
    mode = 'yt';
    ytLoad(t.ytId, autoplay, at);
    return true;
  }
  if (mode === 'yt') stopYT();
  mode = 'audio';
  const old = objURL;
  objURL = null;
  const blob = S.audio.get(t.id);
  if (blob) {
    objURL = URL.createObjectURL(blob);
    audio.src = objURL;
  } else if (t.url) {
    audio.src = t.url;
  } else {
    return false;
  }
  if (old) URL.revokeObjectURL(old);
  return true;
}

function playSafe() {
  const p = audio.play();
  if (p && p.catch) p.catch((e) => { if (e.name !== 'AbortError') console.warn(e); syncPlayState(); });
}

function loadIndex(i, { autoplay = true, at = 0 } = {}) {
  if (!S.queue.length) return;
  S.index = Math.max(0, Math.min(i, S.queue.length - 1));
  const t = cur();
  if (!t || !setSource(t, autoplay, at)) {
    toast('Song nicht verfügbar');
    return;
  }
  pendingSeek = mode === 'yt' ? 0 : at;
  if (autoplay) {
    if (mode === 'audio') playSafe();
    S.recent = [t.id, ...S.recent.filter((x) => x !== t.id)].slice(0, 30);
  }
  updateNowPlaying();
  saveState();
}

/* ---------- YouTube-Player ---------- */
function ensureYT() {
  if (ytReadyP) return ytReadyP;
  ytReadyP = loadApi().then((YT) => new Promise((resolve, reject) => {
    const tm = setTimeout(() => reject(new Error('Zeitüberschreitung')), 20000);
    ytP = new YT.Player('yt-frame', {
      width: '100%',
      height: '100%',
      host: 'https://www.youtube-nocookie.com',
      playerVars: { playsinline: 1, rel: 0, autoplay: 0, enablejsapi: 1, origin: location.origin },
      events: {
        onReady: () => { clearTimeout(tm); resolve(ytP); },
        onStateChange: onYTState,
        onError: onYTError,
      },
    });
  })).catch((e) => {
    ytReadyP = null;
    ytP = null;
    $('#yt-box').innerHTML = '<div id="yt-frame"></div>';
    throw e;
  });
  return ytReadyP;
}

async function ytLoad(id, autoplay, at = 0) {
  ytLoadedId = id;
  ytState = -1;
  ytHidden = false;
  showVideo(true);
  try {
    await ensureYT();
  } catch {
    if (mode === 'yt') toast('YouTube ist gerade nicht erreichbar');
    return;
  }
  if (mode !== 'yt' || cur()?.ytId !== id) return;
  const o = { videoId: id, startSeconds: Math.floor(at) || 0 };
  if (autoplay) ytP.loadVideoById(o);
  else ytP.cueVideoById(o);
}

function stopYT() {
  try { ytP?.stopVideo?.(); } catch { /* ignorieren */ }
  ytLoadedId = '';
  ytState = -1;
  showVideo(false);
}

function onYTState(e) {
  if (mode !== 'yt') return;
  ytState = e.data;
  const t = cur();
  if (e.data === 1 && t) {
    errStreak = 0;
    const d = ytP.getDuration?.();
    let dirty = false;
    if (d > 0 && Math.abs((t.duration || 0) - d) > 1) { t.duration = d; dirty = true; }
    if (t.needsTitle) {
      const vd = ytP.getVideoData?.();
      if (vd?.title) {
        const m = cleanMeta(vd.title, vd.author);
        t.title = m.title;
        t.artist = m.artist || t.artist;
        delete t.needsTitle;
        dirty = true;
        updateNowPlaying();
        render();
      }
    }
    if (dirty && t.saved) db.put('tracks', t).catch(() => {});
  }
  if (e.data === 0) onEnded();
  if (e.data === 2) saveState();
  syncPlayState();
  updateProgress();
}

function onYTError(e) {
  if (mode !== 'yt') return;
  errStreak++;
  ytState = -1;
  syncPlayState();
  toast(e.data === 101 || e.data === 150
    ? 'Dieses Video darf nur auf YouTube selbst laufen – überspringe'
    : 'Video kann nicht abgespielt werden – überspringe');
  if (errStreak < S.queue.length) setTimeout(() => next(true), 900);
}

setInterval(() => { if (mode === 'yt' && ytLoadedId) onTick(); }, 500);

/* ---------- Video-Fenster ---------- */
const ytWrap = $('#yt-wrap');
const ytBox = $('#yt-box');
const BAR_H = 36;

function showVideo(on) {
  ytWrap.hidden = !on;
  document.body.classList.toggle('has-video', on);
  updateVideoButtons();
  layoutVideo();
}

function offsetIn(el, root) {
  let x = 0, y = 0, n = el;
  while (n && n !== root) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

function layoutVideo() {
  if (ytWrap.hidden) { document.body.style.setProperty('--videoh', '0px'); return; }
  const big = S.video !== 'small';
  const open = player.classList.contains('open');
  const vw = document.documentElement.clientWidth;
  let x, y, w, h;
  if (open) {
    const r = offsetIn($('#p-art'), player);
    const pad = 18;
    const ah = Math.max(200, r.h - pad * 2);
    w = big ? Math.max(200, r.w) : 200;
    h = big ? Math.max(200, Math.min(ah, Math.round(w * 9 / 16))) : 200;
    x = r.x + (r.w - w) / 2;
    y = r.y + pad + (ah - h) / 2;
  } else {
    w = big ? Math.min(vw - 16, 440) : 200;
    h = big ? Math.max(200, Math.round(w * 9 / 16)) : 200;
    const miniTop = document.body.classList.contains('has-mini')
      ? mini.getBoundingClientRect().top
      : $('#tabs').getBoundingClientRect().top;
    x = vw - w - 8;
    y = miniTop - 8 - h - BAR_H;
  }
  ytWrap.classList.toggle('floating', !open);
  ytWrap.style.left = `${Math.round(x)}px`;
  ytWrap.style.top = `${Math.round(y)}px`;
  ytWrap.style.width = `${Math.round(w)}px`;
  ytBox.style.height = `${Math.round(h)}px`;
  document.body.style.setProperty('--videoh', open ? '0px' : `${h + BAR_H + 8}px`);
}
window.addEventListener('resize', layoutVideo);

function setVideoSize(size) {
  S.video = size;
  saveState();
  updateVideoButtons();
  layoutVideo();
}

function updateVideoButtons() {
  const isYT = cur()?.source === 'yt';
  const big = S.video !== 'small';
  const b = $('#p-video');
  b.hidden = !isYT;
  b.innerHTML = (big ? I.shrink : I.expand) + `<span>${big ? 'Video klein' : 'Video groß'}</span>`;
  $('#yt-size').innerHTML = big ? I.shrink : I.expand;
  $('#yt-size').setAttribute('aria-label', big ? 'Video verkleinern' : 'Video vergrößern');
}

function playList(ids, start = 0, { shuffle = false, context = '' } = {}) {
  if (!ids?.length) return;
  S.context = context || S.context;
  if (shuffle) S.shuffle = true;
  if (S.shuffle) {
    S.order = [...ids];
    const first = shuffle ? ids[Math.floor(Math.random() * ids.length)] : ids[start];
    const rest = [...ids];
    rest.splice(rest.indexOf(first), 1);
    S.queue = [first, ...shuffleArr(rest)];
    S.index = 0;
  } else {
    S.order = null;
    S.queue = [...ids];
    S.index = start;
  }
  errStreak = 0;
  loadIndex(S.index);
}

function toggle() {
  if (!cur()) {
    const all = sortedLibrary();
    if (all.length) playList(all, 0, { context: 'Alle Songs' });
    return;
  }
  if (E.paused) {
    if (!E.loaded) loadIndex(S.index);
    else E.play();
  } else {
    E.pause();
  }
}

function next(auto = false) {
  if (!S.queue.length) return;
  if (S.index < S.queue.length - 1) return loadIndex(S.index + 1);
  if (S.repeat === 'all') return loadIndex(0);
  if (auto) {
    // Ende der Warteschlange
    loadIndex(0, { autoplay: false });
    return;
  }
  loadIndex(0);
}

function prev() {
  if (E.time > 3 || S.index <= 0) {
    E.seek(0);
    if (E.paused) E.play();
    return;
  }
  loadIndex(S.index - 1);
}

function setShuffle(on) {
  const id = S.queue[S.index];
  S.shuffle = on;
  if (on) {
    S.order = [...S.queue];
    const rest = S.queue.filter((_, i) => i !== S.index);
    S.queue = id ? [id, ...shuffleArr(rest)] : shuffleArr(rest);
    S.index = 0;
  } else if (S.order) {
    S.queue = S.order;
    S.order = null;
    S.index = Math.max(0, S.queue.indexOf(id));
  }
  updateModeButtons();
  saveState();
  toast(on ? 'Zufallswiedergabe an' : 'Zufallswiedergabe aus');
}

function cycleRepeat() {
  S.repeat = S.repeat === 'off' ? 'all' : S.repeat === 'all' ? 'one' : 'off';
  updateModeButtons();
  saveState();
  toast({ off: 'Wiederholen aus', all: 'Alle wiederholen', one: 'Song wiederholen' }[S.repeat]);
}

function playNext(id) {
  if (!cur()) return playList([id], 0);
  S.queue.splice(S.index + 1, 0, id);
  if (S.order) {
    const oi = S.order.indexOf(S.queue[S.index]);
    S.order.splice(oi + 1, 0, id);
  }
  saveState();
  toast('Wird als Nächstes gespielt');
}

function addToQueue(id) {
  if (!cur()) return playList([id], 0);
  S.queue.push(id);
  if (S.order) S.order.push(id);
  saveState();
  toast('Zur Warteschlange hinzugefügt');
}

function removeFromQueue(i) {
  if (i === S.index) return;
  const [id] = S.queue.splice(i, 1);
  if (i < S.index) S.index--;
  if (S.order) {
    const oi = S.order.indexOf(id);
    if (oi > -1) S.order.splice(oi, 1);
  }
  saveState();
}

/* Gemeinsame Ereignisse */
function onEnded() {
  if (S.sleepEnd) {
    S.sleepEnd = false;
    updateSleepButton();
    toast('Sleep-Timer: Wiedergabe beendet');
    if (S.index < S.queue.length - 1) loadIndex(S.index + 1, { autoplay: false });
    return;
  }
  if (S.repeat === 'one') {
    E.seek(0);
    E.play();
    return;
  }
  next(true);
}

function onTick() {
  updateProgress();
  if (S.sleepAt && Date.now() >= S.sleepAt) {
    S.sleepAt = 0;
    E.pause();
    updateSleepButton();
    toast('Sleep-Timer: Wiedergabe pausiert');
  }
  const now = Date.now();
  if (now - lastSave > 5000) { lastSave = now; saveState(); }
}

/* Audio-Ereignisse */
audio.addEventListener('ended', () => { if (mode === 'audio') onEnded(); });
audio.addEventListener('playing', () => { errStreak = 0; });
audio.addEventListener('play', syncPlayState);
audio.addEventListener('pause', () => { syncPlayState(); saveState(); });
audio.addEventListener('loadedmetadata', () => {
  if (pendingSeek && pendingSeek < audio.duration) audio.currentTime = pendingSeek;
  pendingSeek = 0;
  const t = cur();
  if (t && isFinite(audio.duration) && Math.abs((t.duration || 0) - audio.duration) > 1) {
    t.duration = audio.duration;
    if (t.saved) db.put('tracks', t).catch(() => {});
  }
  updateProgress();
  updatePositionState();
});
audio.addEventListener('timeupdate', () => { if (mode === 'audio') onTick(); });
audio.addEventListener('seeked', updatePositionState);
audio.addEventListener('ratechange', updatePositionState);
audio.addEventListener('error', () => {
  if (mode !== 'audio' || !audio.getAttribute('src')) return;
  const t = cur();
  errStreak++;
  syncPlayState();
  if (!navigator.onLine && t && !S.audio.has(t.id)) {
    toast('Offline – dieser Song ist nicht heruntergeladen');
  } else {
    toast(`„${t?.title || 'Song'}“ kann nicht abgespielt werden`);
  }
  if (errStreak < S.queue.length) setTimeout(() => next(true), 700);
});

/* Sperrbildschirm / Benachrichtigung / Kopfhörer-Tasten */
function setupMediaSession() {
  if (!('mediaSession' in navigator)) return;
  const ms = navigator.mediaSession;
  const h = (a, fn) => { try { ms.setActionHandler(a, fn); } catch { /* nicht unterstützt */ } };
  h('play', () => { if (!E.loaded) loadIndex(S.index); else E.play(); });
  h('pause', () => E.pause());
  h('stop', () => E.pause());
  h('previoustrack', prev);
  h('nexttrack', () => next(false));
  h('seekbackward', (d) => E.seek(Math.max(0, E.time - (d.seekOffset || 10))));
  h('seekforward', (d) => E.seek(Math.min(E.duration || 0, E.time + (d.seekOffset || 10))));
  h('seekto', (d) => E.seek(d.seekTime));
}

function updateMediaMetadata(t) {
  if (!('mediaSession' in navigator) || !window.MediaMetadata) return;
  const src = t.coverData || t.coverUrl;
  const artwork = src
    ? [{ src, sizes: '512x512', ...(t.coverData ? { type: 'image/jpeg' } : {}) }]
    : [{ src: new URL('icons/icon-512.png', location.href).href, sizes: '512x512', type: 'image/png' }];
  try {
    navigator.mediaSession.metadata = new MediaMetadata({ title: t.title, artist: t.artist || '', album: t.album || '', artwork });
  } catch { /* ignorieren */ }
}

function updatePositionState() {
  const ms = navigator.mediaSession;
  if (!ms?.setPositionState) return;
  const d = E.duration;
  if (!isFinite(d) || d <= 0) return;
  try { ms.setPositionState({ duration: d, playbackRate: mode === 'audio' ? audio.playbackRate || 1 : 1, position: Math.min(E.time, d) }); } catch { /* ignorieren */ }
}

/* =========================================================
   Player-Oberfläche
   ========================================================= */
const mini = $('#mini');
const player = $('#player');
const seek = $('#p-seek');
let seeking = false;

function updateNowPlaying() {
  const t = cur();
  document.body.classList.toggle('has-mini', !!t);
  if (!t) return;
  $('#m-art').innerHTML = artHTML(t, '');
  $('#m-title').textContent = t.title;
  $('#m-artist').textContent = t.artist || 'Unbekannt';
  $('#p-art').innerHTML = t.source === 'yt' ? '' : artHTML(t, '');
  $('#p-title').textContent = t.title;
  $('#p-artist').textContent = t.artist || 'Unbekannt';
  $('#p-ctx').textContent = S.context || t.album || 'Warteschlange';
  const c = trackColor(t);
  player.style.setProperty('--pc', c);
  mini.style.setProperty('--mini-bg', `color-mix(in srgb, ${c} 55%, #1c1a23)`);
  document.title = `${t.title} · ${t.artist || 'Klang'}`;
  updateLikeButtons();
  updateModeButtons();
  updateMediaMetadata(t);
  syncPlayState();
  updateProgress();
  markPlaying();
  updateVideoButtons();
  layoutVideo();
}

function markPlaying() {
  const id = S.queue[S.index];
  $$('.row[data-id]').forEach((r) => r.classList.toggle('playing', r.dataset.id === id));
}

function syncPlayState() {
  const paused = E.paused;
  document.body.classList.toggle('paused', paused);
  const icon = paused ? I.play : I.pause;
  $('#m-play').innerHTML = icon;
  $('#p-play').innerHTML = icon;
  $('#m-play').setAttribute('aria-label', paused ? 'Abspielen' : 'Pause');
  $('#p-play').setAttribute('aria-label', paused ? 'Abspielen' : 'Pause');
  $$('[data-act="play-all"]').forEach((b) => {
    const mine = b.dataset.ctx && b.dataset.ctx === S.context && !paused;
    b.innerHTML = mine ? I.pause : I.play;
  });
  if ('mediaSession' in navigator) navigator.mediaSession.playbackState = paused ? 'paused' : 'playing';
  updatePositionState();
}

function updateProgress() {
  const d = E.duration || cur()?.duration || 0;
  const c = E.time || pendingSeek || 0;
  const pct = d ? (c / d) * 100 : 0;
  $('#m-bar').style.width = pct + '%';
  if (!seeking) {
    seek.max = d || 100;
    seek.value = c;
    seek.style.setProperty('--pct', pct + '%');
    $('#p-cur').textContent = fmt(c);
  }
  $('#p-dur').textContent = fmt(d);
}

function updateLikeButtons() {
  const t = cur();
  const liked = !!t?.liked;
  for (const b of [$('#m-like'), $('#p-like')]) {
    b.innerHTML = liked ? I.heartF : I.heart;
    b.classList.toggle('liked', liked);
    b.setAttribute('aria-pressed', liked);
  }
}

function updateModeButtons() {
  $('#p-shuffle').classList.toggle('on', S.shuffle);
  const r = $('#p-repeat');
  r.classList.toggle('on', S.repeat !== 'off');
  r.innerHTML = I.repeat + (S.repeat === 'one' ? '<span class="badge">1</span>' : '');
}

function updateSleepButton() {
  const b = $('#p-sleep');
  let label = '';
  if (S.sleepEnd) label = 'Songende';
  else if (S.sleepAt) label = Math.max(1, Math.round((S.sleepAt - Date.now()) / 60000)) + ' Min';
  b.innerHTML = I.moon + (label ? `<span>${label}</span>` : '');
  b.classList.toggle('on', !!label);
}
setInterval(() => { if (S.sleepAt) updateSleepButton(); }, 30000);

seek.addEventListener('input', () => {
  seeking = true;
  const d = Number(seek.max) || 1;
  seek.style.setProperty('--pct', (seek.value / d) * 100 + '%');
  $('#p-cur').textContent = fmt(seek.value);
});
seek.addEventListener('change', () => {
  seeking = false;
  if (!E.loaded && cur()) {
    pendingSeek = Number(seek.value);
    return;
  }
  E.seek(Number(seek.value));
});

function openPlayer() {
  if (!cur() || player.classList.contains('open')) return;
  player.classList.add('open');
  player.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  history.pushState({ player: 1 }, '');
  layoutVideo();
}
// Geht einen Verlaufsschritt zurück und wartet, bis das passiert ist
function popHistory() {
  return new Promise((res) => {
    let tm;
    const done = () => { window.removeEventListener('popstate', done); clearTimeout(tm); res(); };
    window.addEventListener('popstate', done);
    tm = setTimeout(done, 500);
    history.back();
  });
}
function closePlayer(fromPop = false) {
  if (!player.classList.contains('open')) return Promise.resolve();
  player.classList.remove('open');
  player.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  layoutVideo();
  if (!fromPop && history.state?.player) return popHistory();
  return Promise.resolve();
}
window.addEventListener('popstate', () => {
  const st = history.state || {};
  if (sheetOpen && !st.sheet) closeSheet(true);
  if (player.classList.contains('open') && !st.player && !st.sheet) closePlayer(true);
});

// Player nach unten wischen zum Schließen
(() => {
  let y0 = null, dy = 0;
  player.addEventListener('touchstart', (e) => {
    if (e.target.closest('input,.controls')) return;
    y0 = e.touches[0].clientY; dy = 0;
    player.classList.add('dragging');
  }, { passive: true });
  player.addEventListener('touchmove', (e) => {
    if (y0 == null) return;
    dy = Math.max(0, e.touches[0].clientY - y0);
    player.style.transform = `translateY(${dy}px)`;
  }, { passive: true });
  const end = () => {
    if (y0 == null) return;
    player.classList.remove('dragging');
    player.style.transform = '';
    if (dy > 120) closePlayer();
    y0 = null;
  };
  player.addEventListener('touchend', end);
  player.addEventListener('touchcancel', end);
})();

/* =========================================================
   Sheets, Dialoge, Toast
   ========================================================= */
const sheet = $('#sheet');
const backdrop = $('#sheet-backdrop');
let sheetOpen = false;
let sheetResolve = null;

function openSheet(html) {
  sheet.innerHTML = `<div class="grab"></div>${html}`;
  sheet.scrollTop = 0;
  if (!sheetOpen) history.pushState({ sheet: 1 }, '');
  sheetOpen = true;
  requestAnimationFrame(() => { sheet.classList.add('open'); backdrop.classList.add('open'); });
}
function closeSheet(fromPop = false) {
  if (!sheetOpen) return Promise.resolve();
  sheetOpen = false;
  sheet.classList.remove('open');
  backdrop.classList.remove('open');
  if (sheetResolve) { const r = sheetResolve; sheetResolve = null; r(null); }
  if (!fromPop && history.state?.sheet) return popHistory();
  return Promise.resolve();
}
backdrop.addEventListener('click', () => closeSheet());

let sheetActions = [];
function menu({ head = '', items }) {
  sheetActions = items.filter(Boolean);
  openSheet(head + sheetActions.map((it, i) =>
    `<button class="sheet-item ${it.danger ? 'danger' : ''} ${it.on ? 'on' : ''}" data-act="sheet-item" data-i="${i}">${it.icon || ''}<span>${esc(it.label)}</span></button>`
  ).join(''));
}

function trackHead(t) {
  return `<div class="sheet-head">${artHTML(t, 'art-s')}<div style="min-width:0"><div class="t">${esc(t.title)}</div><div class="a">${esc(t.artist || 'Unbekannt')}</div></div></div>`;
}

function promptSheet({ title, value = '', placeholder = '', ok = 'Speichern', type = 'text', extra = '', desc = '', required = true }) {
  return new Promise((resolve) => {
    openSheet(`<form class="sheet-form" id="prompt-form">
      <h3>${esc(title)}</h3>${desc}
      <input type="${type}" id="prompt-input" value="${esc(value)}" placeholder="${esc(placeholder)}" autocomplete="off" ${required ? 'required' : ''}>
      ${extra}
      <div class="actions"><button type="button" class="btn ghost" data-act="sheet-cancel">Abbrechen</button><button class="btn primary">${esc(ok)}</button></div>
    </form>`);
    sheetResolve = resolve;
    const form = $('#prompt-form');
    const input = $('#prompt-input');
    setTimeout(() => { input.focus(); input.select(); }, 280);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const vals = Object.fromEntries($$('input', form).map((i) => [i.id, i.value.trim()]));
      sheetResolve = null;
      closeSheet().then(() => resolve(extra ? vals : vals['prompt-input']));
    });
  });
}

function confirmSheet(title, text, ok = 'Löschen') {
  return new Promise((resolve) => {
    openSheet(`<div class="sheet-form"><h3>${esc(title)}</h3><p>${esc(text)}</p>
      <div class="actions"><button class="btn ghost" data-act="sheet-cancel">Abbrechen</button><button class="btn primary" id="confirm-ok">${esc(ok)}</button></div></div>`);
    sheetResolve = resolve;
    $('#confirm-ok').addEventListener('click', () => { sheetResolve = null; closeSheet().then(() => resolve(true)); });
  });
}

let toastTimer;
function toast(msg, ms = 2400) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), ms);
}

/* =========================================================
   Bibliothek-Aktionen
   ========================================================= */
async function toggleLike(id) {
  const t = S.tracks.get(id);
  if (!t) return;
  t.liked = !t.liked;
  t.likedAt = Date.now();
  await persistTrack(t);
  updateLikeButtons();
  toast(t.liked ? 'Zu Lieblingssongs hinzugefügt' : 'Aus Lieblingssongs entfernt');
  if (currentRoute().name === 'liked' || currentRoute().name === 'home') render();
}

async function createPlaylist(name, ids = []) {
  const p = { id: uid(), name, trackIds: [...ids], createdAt: Date.now() };
  for (const id of ids) {
    const t = S.tracks.get(id);
    if (t && !t.saved) await persistTrack(t);
  }
  await db.put('playlists', p);
  S.playlists.push(p);
  return p;
}

async function addToPlaylist(pid, ids) {
  const p = S.playlists.find((x) => x.id === pid);
  if (!p) return;
  let added = 0;
  for (const id of ids) {
    if (p.trackIds.includes(id)) continue;
    const t = S.tracks.get(id);
    if (t && !t.saved) await persistTrack(t);
    p.trackIds.push(id);
    added++;
  }
  await db.put('playlists', p);
  toast(added ? `Zu „${p.name}“ hinzugefügt` : 'Schon in der Playlist');
}

function choosePlaylist(ids) {
  const head = `<div class="queue-label">Zu Playlist hinzufügen</div>`;
  menu({
    head,
    items: [
      { icon: I.plus, label: 'Neue Playlist', run: async () => {
        const name = await promptSheet({ title: 'Neue Playlist', placeholder: 'Name der Playlist', ok: 'Erstellen' });
        if (!name) return;
        await createPlaylist(name, ids);
        toast(`„${name}“ erstellt`);
        render();
      } },
      ...S.playlists.map((p) => ({ icon: I.listplus, label: p.name, run: () => addToPlaylist(p.id, ids).then(render) })),
    ],
  });
}

async function downloadTrack(t) {
  if (!t.url) return;
  toast('Wird heruntergeladen …', 60000);
  try {
    const r = await fetch(t.url);
    if (!r.ok) throw new Error(r.status);
    const blob = await r.blob();
    await db.put('audio', { id: t.id, blob });
    S.audio.set(t.id, blob);
    t.offline = true;
    await persistTrack(t);
    toast('Offline verfügbar');
    render();
  } catch (e) {
    console.warn(e);
    toast('Download nicht möglich');
  }
}

async function deleteTrack(t) {
  const ok = await confirmSheet('Song löschen?', `„${t.title}“ wird aus deiner Bibliothek und allen Playlists entfernt.`);
  if (!ok) return;
  await db.del('tracks', t.id);
  await db.del('audio', t.id);
  S.audio.delete(t.id);
  for (const p of S.playlists) {
    if (p.trackIds.includes(t.id)) {
      p.trackIds = p.trackIds.filter((x) => x !== t.id);
      await db.put('playlists', p);
    }
  }
  S.recent = S.recent.filter((x) => x !== t.id);
  const wasCurrent = S.queue[S.index] === t.id;
  const before = S.queue.slice(0, S.index).filter((x) => x === t.id).length;
  S.queue = S.queue.filter((x) => x !== t.id);
  if (S.order) S.order = S.order.filter((x) => x !== t.id);
  S.index -= before;
  if (t.source === 'local') S.tracks.delete(t.id);
  else { t.saved = false; t.offline = false; t.liked = false; }
  if (wasCurrent) {
    if (S.queue.length) loadIndex(Math.min(S.index, S.queue.length - 1), { autoplay: !E.paused });
    else { if (mode === 'yt') stopYT(); else clearAudio(); S.index = -1; updateNowPlaying(); }
  }
  saveState();
  toast('Gelöscht');
  render();
}

async function removeOffline(t) {
  await db.del('audio', t.id);
  S.audio.delete(t.id);
  t.offline = false;
  await persistTrack(t);
  toast('Download entfernt');
  render();
}

function trackMenu(id, plId) {
  const t = S.tracks.get(id);
  if (!t) return;
  const pl = plId && plId !== 'liked' ? S.playlists.find((p) => p.id === plId) : null;
  menu({
    head: trackHead(t),
    items: [
      { icon: t.liked ? I.heartF : I.heart, label: t.liked ? 'Aus Lieblingssongs entfernen' : 'Zu Lieblingssongs', on: t.liked, run: () => toggleLike(id) },
      { icon: I.listplus, label: 'Zu Playlist hinzufügen', run: () => setTimeout(() => choosePlaylist([id]), 320) },
      { icon: I.next1, label: 'Als Nächstes spielen', run: () => playNext(id) },
      { icon: I.addq, label: 'Zur Warteschlange', run: () => addToQueue(id) },
      t.iaId && { icon: I.disc, label: 'Zum Album', run: async () => { await closePlayer(); go(`#album/${encodeURIComponent(t.iaId)}`); } },
      t.source === 'yt' && { icon: I.yt, label: 'Auf YouTube öffnen', run: () => window.open(`https://www.youtube.com/watch?v=${encodeURIComponent(t.ytId)}`, '_blank', 'noopener') },
      t.source === 'ia' && !t.offline && { icon: I.download, label: 'Offline verfügbar machen', run: () => downloadTrack(t) },
      t.source === 'ia' && t.offline && { icon: I.x, label: 'Download entfernen', run: () => removeOffline(t) },
      pl && { icon: I.x, label: 'Aus dieser Playlist entfernen', run: async () => {
        pl.trackIds = pl.trackIds.filter((x) => x !== id);
        await db.put('playlists', pl);
        render();
      } },
      t.saved && { icon: I.trash, label: 'Aus Bibliothek löschen', danger: true, run: () => setTimeout(() => deleteTrack(t), 320) },
    ],
  });
}

function playlistMenu(p) {
  menu({
    head: `<div class="queue-label">${esc(p.name)}</div>`,
    items: [
      { icon: I.edit, label: 'Umbenennen', run: () => setTimeout(async () => {
        const name = await promptSheet({ title: 'Playlist umbenennen', value: p.name });
        if (!name) return;
        p.name = name;
        await db.put('playlists', p);
        render();
      }, 320) },
      p.trackIds.length && { icon: I.addq, label: 'Zur Warteschlange', run: () => { p.trackIds.forEach((id) => S.queue.push(id)); if (S.order) S.order.push(...p.trackIds); if (!cur()) loadIndex(0); toast('Zur Warteschlange hinzugefügt'); saveState(); } },
      { icon: I.trash, label: 'Playlist löschen', danger: true, run: () => setTimeout(async () => {
        if (!(await confirmSheet('Playlist löschen?', `„${p.name}“ wird gelöscht. Deine Songs bleiben erhalten.`))) return;
        await db.del('playlists', p.id);
        S.playlists = S.playlists.filter((x) => x !== p);
        go('#library');
      }, 320) },
    ],
  });
}

async function addLink() {
  const vals = await promptSheet({
    title: 'Song per Link hinzufügen',
    type: 'url',
    placeholder: 'https://…/song.mp3',
    ok: 'Hinzufügen',
    extra: '<input type="text" id="link-title" placeholder="Titel (optional)"><input type="text" id="link-artist" placeholder="Interpret (optional)">',
  });
  if (!vals || !vals['prompt-input']) return;
  const url = vals['prompt-input'];
  const name = decodeURIComponent(url.split('/').pop().split('?')[0] || 'Stream').replace(/\.[^.]+$/, '');
  const t = {
    id: 'url:' + uid(), source: 'url', url,
    title: vals['link-title'] || name, artist: vals['link-artist'] || '', album: '',
    duration: 0, addedAt: Date.now(), liked: false, offline: false,
  };
  S.tracks.set(t.id, t);
  await persistTrack(t);
  toast('Hinzugefügt');
  render();
}

function queueSheet() {
  const curT = cur();
  if (!curT) return;
  const upcoming = S.queue.slice(S.index + 1);
  const row = (t, i, removable) => `<div class="row" data-act="queue-jump" data-i="${i}" data-id="${esc(t.id)}">
      ${artHTML(t)}<div class="meta"><div class="t">${esc(t.title)}</div><div class="a">${esc(t.artist || 'Unbekannt')}</div></div>
      ${removable ? `<button class="icon-btn more" data-act="queue-remove" data-i="${i}" aria-label="Entfernen">${I.x}</button>` : ''}</div>`;
  openSheet(`<div class="queue-label">Läuft gerade</div>
    <div class="list">${row(curT, S.index, false)}</div>
    <div class="queue-label">Als Nächstes${upcoming.length ? ` · ${upcoming.length}` : ''}</div>
    <div class="list">${upcoming.length ? upcoming.map((id, k) => row(S.tracks.get(id), S.index + 1 + k, true)).join('') : '<div class="empty">Nichts weiter in der Warteschlange</div>'}</div>`);
  markPlaying();
}

function sleepMenu() {
  const set = (min) => () => {
    S.sleepEnd = false;
    S.sleepAt = min ? Date.now() + min * 60000 : 0;
    updateSleepButton();
    toast(min ? `Stoppt in ${min} Minuten` : 'Sleep-Timer aus');
  };
  menu({
    head: '<div class="queue-label">Sleep-Timer</div>',
    items: [
      ...[5, 15, 30, 45, 60, 90].map((m) => ({ icon: I.moon, label: `${m} Minuten`, run: set(m) })),
      { icon: I.music, label: 'Ende des Songs', run: () => { S.sleepAt = 0; S.sleepEnd = true; updateSleepButton(); toast('Stoppt am Ende des Songs'); } },
      (S.sleepAt || S.sleepEnd) && { icon: I.x, label: 'Timer ausschalten', danger: true, run: () => { S.sleepEnd = false; set(0)(); } },
    ],
  });
}

/* =========================================================
   Ansichten
   ========================================================= */
const view = $('#view');
let lists = {};
let listSeq = 0;

function registerList(ids) {
  const key = 'l' + listSeq++;
  lists[key] = ids;
  return key;
}

function rowHTML(t, i, { numbers = false } = {}) {
  const playing = S.queue[S.index] === t.id;
  return `<div class="row${playing ? ' playing' : ''}" data-act="row" data-id="${esc(t.id)}" data-i="${i}">
    ${numbers ? `<div class="num">${i + 1}</div>` : artHTML(t)}
    <div class="meta"><div class="t">${esc(t.title)}</div>
    <div class="a">${EQ}${t.offline && t.source !== 'local' ? I.download : ''}${t.liked ? '<span class="liked">♥</span>' : ''}${esc(t.artist || 'Unbekannt')}</div></div>
    ${t.duration ? `<span class="dur">${fmt(t.duration)}</span>` : ''}
    <button class="icon-btn more" data-act="more" aria-label="Optionen für ${esc(t.title)}">${I.more}</button>
  </div>`;
}

function listHTML(ids, { ctx = '', pl = '', numbers = false } = {}) {
  const key = registerList(ids);
  const html = `<div class="list" data-list="${key}" data-ctx="${esc(ctx)}" data-pl="${esc(pl)}">${ids
    .map((id, i) => rowHTML(S.tracks.get(id), i, { numbers })).join('')}</div>`;
  return { key, html };
}

function sortedLibrary() {
  const arr = savedTracks();
  if (S.sort === 'title') arr.sort((a, b) => collator.compare(a.title, b.title));
  else if (S.sort === 'artist') arr.sort((a, b) => collator.compare(a.artist || '~', b.artist || '~') || collator.compare(a.album, b.album) || collator.compare(a.title, b.title));
  else arr.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
  return arr.map((t) => t.id);
}

const likedIds = () => savedTracks().filter((t) => t.liked).sort((a, b) => (b.likedAt || 0) - (a.likedAt || 0)).map((t) => t.id);

const GENRES = [
  ['Jazz', 'jazz', 30], ['Electronic', 'electronic', 200], ['Rock', 'rock', 0], ['Klassik', 'classical', 260],
  ['Hip-Hop', 'hip hop', 320], ['Ambient', 'ambient', 170], ['Blues', 'blues', 220], ['Lo-Fi', 'lofi', 290],
  ['Folk', 'folk', 90], ['Funk & Soul', 'funk soul', 15], ['Live-Konzerte', 'live concert', 45], ['Swing 78rpm', 'swing', 60],
];

function homeView() {
  const h = new Date().getHours();
  const greet = h < 5 ? 'Gute Nacht' : h < 11 ? 'Guten Morgen' : h < 18 ? 'Guten Tag' : 'Guten Abend';
  const lib = savedTracks();
  let html = `<h1>${greet}</h1>`;

  if (!lib.length) {
    html += `<div class="hero">
      <h2>Willkommen bei Klang</h2>
      <p>Füge deine eigenen Songs hinzu – sie werden auf dem Gerät gespeichert und laufen offline, ohne Werbung und auch bei gesperrtem Bildschirm. Oder entdecke freie Musik aus dem Internet Archive.</p>
      <div class="actions">
        <button class="btn primary" data-act="import">${I.upload}Songs importieren</button>
        <a class="btn" href="#search">${I.globe}Freie Musik entdecken</a>
      </div></div>`;
  } else {
    const tiles = [`<a href="#liked">${`<div class="art liked-art">${I.heartF}</div>`}<span>Lieblingssongs</span></a>`,
      `<a href="#library">${collectionArt(sortedLibrary(), '', 'Alle Songs')}<span>Alle Songs</span></a>`,
      ...S.playlists.slice(-4).reverse().map((p) => `<a href="#playlist/${p.id}">${collectionArt(p.trackIds, '', p.name)}<span>${esc(p.name)}</span></a>`)];
    html += `<div class="quick">${tiles.join('')}</div>`;
  }

  const recent = S.recent.filter((id) => S.tracks.has(id)).slice(0, 15);
  if (recent.length) {
    const key = registerList(recent);
    html += `<h2>Zuletzt gespielt</h2><div class="shelf" data-list="${key}" data-ctx="Zuletzt gespielt">${recent.map((id, i) => {
      const t = S.tracks.get(id);
      return `<div class="card" data-act="row" data-id="${esc(id)}" data-i="${i}">${artHTML(t, '')}<div class="t">${esc(t.title)}</div><div class="a">${esc(t.artist || 'Unbekannt')}</div></div>`;
    }).join('')}</div>`;
  }

  html += `<h2>Freie Musik entdecken</h2><div class="genre-grid">${GENRES.slice(0, 8).map(([label, q, hue]) =>
    `<button class="genre" style="--h:${hue}" data-act="genre" data-q="${esc(q)}">${esc(label)}</button>`).join('')}</div>`;
  view.innerHTML = html;
}

function libraryView() {
  const ids = sortedLibrary();
  const liked = likedIds();
  let html = `<div class="row-between"><h1>Bibliothek</h1><div class="head-actions">
    <button class="icon-btn" data-act="lib-add" aria-label="Hinzufügen">${I.plus}</button></div></div>
    <div class="list" style="margin-top:14px">
      <a class="lib-item" href="#liked"><div class="art liked-art">${I.heartF}</div><div><div class="t">Lieblingssongs</div><div class="a">Playlist · ${plural(liked.length, 'Song', 'Songs')}</div></div></a>
      ${S.playlists.map((p) => `<a class="lib-item" href="#playlist/${p.id}">${collectionArt(p.trackIds, '', p.name)}<div><div class="t">${esc(p.name)}</div><div class="a">Playlist · ${plural(p.trackIds.length, 'Song', 'Songs')}</div></div></a>`).join('')}
    </div>`;

  html += `<div class="toolbar"><h2>Alle Songs</h2>
    <select class="sort" id="sort" aria-label="Sortieren">
      <option value="added"${S.sort === 'added' ? ' selected' : ''}>Zuletzt hinzugefügt</option>
      <option value="title"${S.sort === 'title' ? ' selected' : ''}>Titel</option>
      <option value="artist"${S.sort === 'artist' ? ' selected' : ''}>Interpret</option>
    </select></div>`;

  if (ids.length) {
    const { key, html: lh } = listHTML(ids, { ctx: 'Alle Songs' });
    html += `<div class="detail-actions"><button class="play-fab" data-act="play-all" data-list="${key}" data-ctx="Alle Songs" aria-label="Alle abspielen">${I.play}</button>
      <button class="icon-btn" data-act="shuffle-all" data-list="${key}" data-ctx="Alle Songs" aria-label="Zufällig abspielen">${I.shuffle}</button></div>${lh}`;
  } else {
    html += `<div class="empty">Noch keine Songs.<br><br><button class="btn primary" data-act="import">${I.upload}Songs importieren</button></div>`;
  }
  html += `<div class="storage" id="storage"></div>`;
  view.innerHTML = html;
  $('#sort').addEventListener('change', (e) => { S.sort = e.target.value; saveState(); render(); });
  if (navigator.storage?.estimate) {
    navigator.storage.estimate().then(({ usage = 0, quota = 0 }) => {
      const mb = (b) => (b / 1048576 >= 1024 ? (b / 1073741824).toFixed(1) + ' GB' : Math.round(b / 1048576) + ' MB');
      const el = $('#storage');
      if (el) el.textContent = `${plural(ids.length, 'Song', 'Songs')} · ${mb(usage)} belegt${quota ? ` von ${mb(quota)}` : ''}`;
    }).catch(() => {});
  }
}

function collectionView({ title, sub, ids, ctx, pl = '', extraActions = '', artHtml, numbers = false }) {
  const { key, html: lh } = listHTML(ids, { ctx, pl, numbers });
  view.innerHTML = `<button class="icon-btn back" data-act="back" aria-label="Zurück">${I.back}</button>
    <div class="detail-head">${artHtml}<div><h1>${esc(title)}</h1><div class="sub">${sub}</div></div></div>
    <div class="detail-actions">
      ${ids.length ? `<button class="play-fab" data-act="play-all" data-list="${key}" data-ctx="${esc(ctx)}" aria-label="Abspielen">${I.play}</button>
      <button class="icon-btn" data-act="shuffle-all" data-list="${key}" data-ctx="${esc(ctx)}" aria-label="Zufällig">${I.shuffle}</button>` : ''}
      <span class="spacer"></span>${extraActions}
    </div>
    ${ids.length ? lh : '<div class="empty">Noch keine Songs hier.<br>Tippe bei einem Song auf ••• und wähle „Zu Playlist hinzufügen“.</div>'}`;
  syncPlayState();
}

const totalDur = (ids) => ids.reduce((a, id) => a + (S.tracks.get(id)?.duration || 0), 0);
const subLine = (ids) => {
  const d = totalDur(ids);
  return `${plural(ids.length, 'Song', 'Songs')}${d ? ' · ' + (d >= 3600 ? `${Math.floor(d / 3600)} Std. ${Math.round((d % 3600) / 60)} Min.` : `${Math.max(1, Math.round(d / 60))} Min.`) : ''}`;
};

function likedView() {
  const ids = likedIds();
  collectionView({ title: 'Lieblingssongs', sub: subLine(ids), ids, ctx: 'Lieblingssongs', pl: 'liked', artHtml: `<div class="art liked-art">${I.heartF}</div>` });
}

function playlistView(id) {
  const p = S.playlists.find((x) => x.id === id);
  if (!p) return go('#library');
  const ids = p.trackIds.filter((x) => S.tracks.has(x));
  collectionView({
    title: p.name, sub: subLine(ids), ids, ctx: p.name, pl: p.id,
    artHtml: collectionArt(ids, '', p.name),
    extraActions: `<button class="icon-btn" data-act="playlist-more" data-pl="${p.id}" aria-label="Playlist-Optionen">${I.more}</button>`,
  });
}

async function albumView(id) {
  view.innerHTML = `<button class="icon-btn back" data-act="back" aria-label="Zurück">${I.back}</button><div class="spinner"></div>`;
  try {
    const a = await iaAlbum(id);
    if (currentRoute().arg !== id) return;
    collectionView({
      title: a.album,
      sub: `${esc(a.creator)}${a.year ? ' · ' + esc(a.year) : ''} · ${subLine(a.ids)}<br><a href="https://archive.org/details/${encodeURIComponent(id)}" target="_blank" rel="noopener" style="text-decoration:underline">Internet Archive</a>`,
      ids: a.ids, ctx: a.album, numbers: true,
      artHtml: `<div class="art"><img src="${esc(a.cover)}" alt=""></div>`,
      extraActions: a.ids.length ? `<button class="btn ghost" data-act="save-album" data-id="${esc(id)}">${I.listplus}Speichern</button>` : '',
    });
  } catch (e) {
    console.warn(e);
    view.innerHTML = `<button class="icon-btn back" data-act="back" aria-label="Zurück">${I.back}</button>
      <div class="empty">Album konnte nicht geladen werden.<br>Bist du online?<br><br><button class="btn" data-act="retry">Erneut versuchen</button></div>`;
  }
}

function searchView() {
  view.innerHTML = `<h1>Suchen</h1>
    <form class="search-box" id="search-form" role="search">${I.search}
      <input type="search" id="q" placeholder="Songs, Interpreten, Alben" value="${esc(S.searchQ)}" enterkeyhint="search" autocomplete="off" autocapitalize="off" spellcheck="false">
      <button type="button" data-act="clear-search" aria-label="Leeren" ${S.searchQ ? '' : 'hidden'}>${I.x}</button>
    </form>
    <div id="results"></div>`;
  const q = $('#q');
  let timer, ytTimer;
  q.addEventListener('input', () => {
    S.searchQ = q.value;
    $('[data-act="clear-search"]').hidden = !q.value;
    clearTimeout(timer);
    clearTimeout(ytTimer);
    renderLocalResults();
    timer = setTimeout(renderRemoteResults, 450);
    // YouTube etwas später, um das Tageskontingent zu schonen
    ytTimer = setTimeout(renderYTResults, 1200);
  });
  $('#search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    q.blur();
    clearTimeout(timer);
    clearTimeout(ytTimer);
    renderRemoteResults();
    renderYTResults();
  });
  renderLocalResults();
  renderRemoteResults();
  renderYTResults();
}

function ytSetupCard(compact = false) {
  if (ytKey.get()) {
    return `<div class="yt-card"><p>${I.check} YouTube-Suche ist aktiv. Du kannst auch einen Link direkt einfügen.</p>
      <div class="actions"><button class="btn" data-act="yt-link">${I.link}Link einfügen</button><button class="btn ghost" data-act="yt-key">${I.key}Schlüssel ändern</button></div></div>`;
  }
  return `<div class="yt-card"><p>${compact ? '' : 'Fast jeden Song über YouTube finden: '}Richte einmalig einen kostenlosen YouTube-Schlüssel ein – oder füge einen YouTube-Link ein.</p>
    <div class="actions"><button class="btn primary" data-act="yt-key">${I.key}YouTube-Suche einrichten</button><button class="btn" data-act="yt-link">${I.link}Link einfügen</button></div></div>`;
}

function renderLocalResults() {
  const box = $('#results');
  if (!box) return;
  const q = S.searchQ.trim().toLowerCase();
  if (!q) {
    box.innerHTML = `<h2>YouTube</h2>${ytSetupCard()}
      <h2>Freie Musik entdecken</h2><div class="genre-grid">${GENRES.map(([label, gq, hue]) =>
      `<button class="genre" style="--h:${hue}" data-act="genre" data-q="${esc(gq)}">${esc(label)}</button>`).join('')}</div>
      <p class="note">Freie Musik stammt aus dem Internet Archive (Netlabels, Live-Mitschnitte, gemeinfreie Aufnahmen) – legal und ohne Werbung.</p>`;
    return;
  }
  const words = q.split(/\s+/);
  const hits = savedTracks().filter((t) => {
    const hay = `${t.title} ${t.artist} ${t.album}`.toLowerCase();
    return words.every((w) => hay.includes(w));
  }).slice(0, 50).map((t) => t.id);
  const local = hits.length ? `<h2>In deiner Bibliothek</h2>${listHTML(hits, { ctx: `Suche: ${S.searchQ}` }).html}` : '';
  const yt = ytKey.get() ? '<h2>YouTube</h2><div class="spinner"></div>' : `<h2>YouTube</h2>${ytSetupCard(true)}`;
  box.innerHTML = `<div id="local-res">${local}</div><div id="yt-res">${yt}</div><div id="remote-res"><h2>Freie Musik</h2><div class="spinner"></div></div>`;
}

async function renderYTResults() {
  const q = S.searchQ.trim();
  const key = ytKey.get();
  if (!q || !key || !$('#yt-res')) return;
  try {
    const res = await ytSearch(q, key);
    if (S.searchQ.trim() !== q || !$('#yt-res')) return;
    const ids = res.map((r) => addTrack({
      id: `yt:${r.videoId}`, source: 'yt', ytId: r.videoId,
      title: r.title, artist: r.artist, album: '', coverUrl: thumb(r.videoId),
      duration: r.duration, liked: false, offline: false, saved: false,
    }).id);
    $('#yt-res').innerHTML = `<h2>YouTube</h2>${ids.length
      ? listHTML(ids, { ctx: `YouTube: ${q}` }).html
      : '<div class="empty">Auf YouTube nichts gefunden.</div>'}`;
    markPlaying();
  } catch (e) {
    console.warn(e);
    if (!$('#yt-res')) return;
    const r = e.reason || '';
    let msg = navigator.onLine ? 'YouTube-Suche gerade nicht erreichbar.' : 'Du bist offline.';
    if (/quota/i.test(r)) msg = 'Das Tageslimit der YouTube-Suche ist erreicht. Morgen geht es wieder – Links einfügen klappt weiterhin.';
    else if (/key|INVALID_ARGUMENT|forbidden|PERMISSION|accessNotConfigured|API_KEY/i.test(r) || /API key/i.test(e.message)) msg = 'Der YouTube-Schlüssel funktioniert nicht. Prüfe, ob die „YouTube Data API v3“ aktiviert ist.';
    $('#yt-res').innerHTML = `<h2>YouTube</h2><div class="yt-card"><p>${esc(msg)}</p><div class="actions"><button class="btn" data-act="yt-key">${I.key}Schlüssel ändern</button><button class="btn" data-act="yt-link">${I.link}Link einfügen</button></div></div>`;
  }
}

async function ytKeySheet() {
  const v = await promptSheet({
    title: 'YouTube-Suche einrichten',
    desc: `<ol>
      <li>Öffne <a href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" target="_blank" rel="noopener">die Google Cloud Console</a> und melde dich mit deinem Google-Konto an.</li>
      <li>Lege ein Projekt an (z. B. „Klang“) und tippe bei <b>YouTube Data API v3</b> auf <b>Aktivieren</b>.</li>
      <li>Gehe zu <b>APIs &amp; Dienste → Anmeldedaten → Anmeldedaten erstellen → API-Schlüssel</b>.</li>
      <li>Kopiere den Schlüssel und füge ihn hier ein.</li>
    </ol><p style="text-align:left;margin:0 0 12px">Kostenlos, keine Kreditkarte nötig. Der Schlüssel bleibt nur auf diesem Gerät gespeichert. Leer lassen und speichern löscht ihn.</p>`,
    value: ytKey.get(),
    placeholder: 'AIza…',
    required: false,
  });
  if (v === null) return;
  ytKey.set(v);
  toast(v ? 'YouTube-Suche aktiviert' : 'Schlüssel gelöscht');
  if (currentRoute().name === 'search') render();
}

async function ytLinkSheet() {
  const v = await promptSheet({ title: 'YouTube-Link einfügen', type: 'url', placeholder: 'https://youtu.be/…', ok: 'Abspielen' });
  if (!v) return;
  const id = parseYouTubeId(v);
  if (!id) return toast('Das ist kein gültiger YouTube-Link');
  let t = S.tracks.get(`yt:${id}`);
  if (!t) {
    t = addTrack({
      id: `yt:${id}`, source: 'yt', ytId: id, title: 'YouTube-Video', artist: '', album: '',
      coverUrl: thumb(id), duration: 0, addedAt: Date.now(), liked: false, offline: false, saved: false, needsTitle: true,
    });
    const meta = await ytTitle(id);
    if (meta) { t.title = meta.title; t.artist = meta.artist; delete t.needsTitle; }
  }
  if (!t.saved) { t.addedAt = Date.now(); await persistTrack(t); }
  playList([t.id], 0, { context: 'YouTube' });
  toast('Zur Bibliothek hinzugefügt');
  render();
}

async function renderRemoteResults() {
  const q = S.searchQ.trim();
  if (!q) return;
  const target = $('#remote-res');
  if (!target) return;
  try {
    const docs = await iaSearch(q);
    if (S.searchQ.trim() !== q || !$('#remote-res')) return;
    $('#remote-res').innerHTML = `<h2>Freie Musik</h2>${docs.length
      ? `<div class="grid">${docs.map((d) => `<a class="card" href="#album/${encodeURIComponent(d.id)}"><div class="art"><img src="${esc(d.cover)}" alt="" loading="lazy" onerror="this.remove()"></div><div class="t">${esc(d.title)}</div><div class="a">${esc([d.creator, d.year].filter(Boolean).join(' · ') || 'Album')}</div></a>`).join('')}</div>`
      : '<div class="empty">Nichts gefunden. Versuch es mit einem anderen Begriff oder Genre.</div>'}`;
  } catch (e) {
    console.warn(e);
    if ($('#remote-res')) $('#remote-res').innerHTML = `<h2>Freie Musik</h2><div class="empty">${navigator.onLine ? 'Die Suche ist gerade nicht erreichbar.' : 'Du bist offline.'}</div>`;
  }
}

/* =========================================================
   Router
   ========================================================= */
function currentRoute() {
  const h = location.hash.slice(1) || 'home';
  const [name, ...rest] = h.split('/');
  return { name, arg: decodeURIComponent(rest.join('/')) };
}
function go(hash) {
  if (location.hash === hash) render();
  else location.hash = hash;
}

let lastRouteKey = '';
function render() {
  const { name, arg } = currentRoute();
  lists = {};
  const tab = ['search', 'album'].includes(name) ? 'search' : ['library', 'liked', 'playlist'].includes(name) ? 'library' : 'home';
  $$('#tabs a').forEach((a) => a.classList.toggle('active', a.dataset.tab === tab));
  const routeKey = name + '/' + arg;
  const scroll = routeKey === lastRouteKey ? window.scrollY : 0;
  if (routeKey !== lastRouteKey) {
    view.classList.remove('view-enter');
    void view.offsetWidth;
    view.classList.add('view-enter');
  }
  lastRouteKey = routeKey;
  switch (name) {
    case 'search': searchView(); break;
    case 'library': libraryView(); break;
    case 'liked': likedView(); break;
    case 'playlist': playlistView(arg); break;
    case 'album': albumView(arg); break;
    default: homeView();
  }
  window.scrollTo(0, scroll);
  markPlaying();
  syncPlayState();
}
window.addEventListener('hashchange', () => { closeSheet(true); closePlayer(true); render(); });

/* =========================================================
   Klick-Aktionen
   ========================================================= */
const listOf = (el) => {
  const c = el.closest('[data-list]');
  return c ? { ids: lists[c.dataset.list] || [], ctx: c.dataset.ctx || el.dataset.ctx || '', pl: c.dataset.pl || '' } : { ids: [], ctx: '', pl: '' };
};

const actions = {
  row(el) {
    const { ids, ctx } = listOf(el);
    const i = Number(el.dataset.i);
    if (S.queue[S.index] === el.dataset.id && S.context === ctx && E.loaded) return toggle();
    playList(ids, i, { context: ctx });
  },
  more(el) {
    const row = el.closest('[data-id]');
    trackMenu(row.dataset.id, listOf(el).pl);
  },
  'play-all'(el) {
    const ids = lists[el.dataset.list] || [];
    if (S.context === el.dataset.ctx && ids.includes(S.queue[S.index])) return toggle();
    S.shuffle = false;
    playList(ids, 0, { context: el.dataset.ctx });
    updateModeButtons();
  },
  'shuffle-all'(el) {
    playList(lists[el.dataset.list] || [], 0, { shuffle: true, context: el.dataset.ctx });
    updateModeButtons();
  },
  toggle,
  next: () => next(false),
  prev,
  shuffle: () => setShuffle(!S.shuffle),
  repeat: cycleRepeat,
  'like-current': () => { const t = cur(); if (t) toggleLike(t.id); },
  'close-player': () => closePlayer(),
  'player-more': () => { const t = cur(); if (t) trackMenu(t.id); },
  queue: queueSheet,
  sleep: sleepMenu,
  'queue-jump'(el) { loadIndex(Number(el.dataset.i)); closeSheet(); },
  'queue-remove'(el) { removeFromQueue(Number(el.dataset.i)); queueSheet(); },
  async 'sheet-item'(el) {
    const it = sheetActions[Number(el.dataset.i)];
    await closeSheet();
    it?.run?.();
  },
  'sheet-cancel': () => closeSheet(),
  import: () => $('#file').click(),
  'lib-add'() {
    menu({
      head: '<div class="queue-label">Hinzufügen</div>',
      items: [
        { icon: I.upload, label: 'Songs vom Gerät importieren', run: () => $('#file').click() },
        { icon: I.plus, label: 'Neue Playlist', run: () => setTimeout(async () => {
          const name = await promptSheet({ title: 'Neue Playlist', placeholder: 'Name der Playlist', ok: 'Erstellen' });
          if (!name) return;
          const p = await createPlaylist(name);
          go(`#playlist/${p.id}`);
        }, 320) },
        { icon: I.yt, label: 'YouTube-Link einfügen', run: () => setTimeout(ytLinkSheet, 320) },
        { icon: I.key, label: 'YouTube-Suche einrichten', run: () => setTimeout(ytKeySheet, 320) },
        { icon: I.link, label: 'Song per Link (MP3-URL)', run: () => setTimeout(addLink, 320) },
        { icon: I.globe, label: 'Freie Musik entdecken', run: () => go('#search') },
      ],
    });
  },
  'playlist-more'(el) {
    const p = S.playlists.find((x) => x.id === el.dataset.pl);
    if (p) playlistMenu(p);
  },
  async 'save-album'(el) {
    const a = iaCache.get('a:' + el.dataset.id);
    if (!a) return;
    const ex = S.playlists.find((p) => p.name === a.album);
    if (ex) { await addToPlaylist(ex.id, a.ids); return; }
    await createPlaylist(a.album, a.ids);
    toast(`Als Playlist „${a.album}“ gespeichert`);
  },
  genre(el) {
    S.searchQ = el.dataset.q;
    go('#search');
  },
  'clear-search'() {
    S.searchQ = '';
    const q = $('#q');
    q.value = '';
    q.dispatchEvent(new Event('input'));
    q.focus();
  },
  back() {
    if (history.length > 1) history.back();
    else go('#home');
  },
  retry: () => render(),
  'yt-key': () => ytKeySheet(),
  'yt-link': () => ytLinkSheet(),
  'video-size': () => setVideoSize(S.video === 'small' ? 'big' : 'small'),
  'open-player': () => openPlayer(),
  'video-close'() {
    E.pause();
    ytHidden = true;
    showVideo(false);
  },
};

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (el && actions[el.dataset.act]) {
    e.preventDefault();
    e.stopPropagation();
    actions[el.dataset.act](el, e);
    return;
  }
  if (e.target.closest('#mini')) openPlayer();
});

mini.addEventListener('keydown', (e) => { if (e.key === 'Enter') openPlayer(); });

document.addEventListener('keydown', (e) => {
  if (e.target.closest('input, select, textarea')) return;
  if (e.key === 'Escape') { if (sheetOpen) closeSheet(); else closePlayer(); }
  if (e.code === 'Space') { e.preventDefault(); toggle(); }
  if (e.key === 'ArrowRight' && e.shiftKey) next(false);
  if (e.key === 'ArrowLeft' && e.shiftKey) prev();
});

$('#file').addEventListener('change', async (e) => {
  const files = e.target.files;
  if (files?.length) await importFiles(files);
  e.target.value = '';
});

// Drag & Drop am Computer
(() => {
  const drop = $('#drop');
  let depth = 0;
  document.addEventListener('dragenter', (e) => { if (e.dataTransfer?.types?.includes('Files')) { depth++; drop.classList.add('show'); } });
  document.addEventListener('dragleave', () => { if (--depth <= 0) { depth = 0; drop.classList.remove('show'); } });
  document.addEventListener('dragover', (e) => e.preventDefault());
  document.addEventListener('drop', (e) => {
    e.preventDefault();
    depth = 0;
    drop.classList.remove('show');
    if (e.dataTransfer?.files?.length) importFiles(e.dataTransfer.files);
  });
})();

// Statische Icons einsetzen
$$('[data-icon]').forEach((el) => { el.insertAdjacentHTML('afterbegin', I[el.dataset.icon] || ''); });

// Beim Verlassen Position sichern
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') saveState(); });
window.addEventListener('pagehide', saveState);

/* =========================================================
   Start
   ========================================================= */
async function init() {
  setupMediaSession();
  updateSleepButton();
  try {
    const [tracks, audios, playlists] = await Promise.all([db.all('tracks'), db.all('audio'), db.all('playlists')]);
    for (const t of tracks || []) S.tracks.set(t.id, { ...t, saved: true });
    for (const a of audios || []) S.audio.set(a.id, a.blob);
    S.playlists = (playlists || []).sort((a, b) => a.createdAt - b.createdAt);
  } catch (e) {
    console.error(e);
    toast('Speicher nicht verfügbar – privater Modus?');
  }
  loadState();
  updateModeButtons();
  updateNowPlaying();
  syncPlayState();
  render();

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch((e) => console.warn('SW', e));
  }
}

init();
