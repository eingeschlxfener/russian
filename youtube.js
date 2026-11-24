// YouTube: offizieller IFrame-Player + YouTube Data API (eigener, kostenloser Schlüssel)

const KEY_LS = 'klang:ytkey';

export const ytKey = {
  get() { try { return localStorage.getItem(KEY_LS) || ''; } catch { return ''; } },
  set(v) { try { v ? localStorage.setItem(KEY_LS, v) : localStorage.removeItem(KEY_LS); } catch { /* ignorieren */ } },
};

let apiPromise = null;
export function loadApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { if (prev) prev(); resolve(window.YT); };
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.async = true;
    s.onerror = () => { apiPromise = null; s.remove(); reject(new Error('YouTube nicht erreichbar')); };
    document.head.appendChild(s);
  });
  return apiPromise;
}

export function parseYouTubeId(input) {
  const s = String(input || '').trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s);
    const ok = (id) => (id && /^[\w-]{11}$/.test(id) ? id : null);
    if (u.hostname === 'youtu.be') return ok(u.pathname.slice(1, 12));
    if (/(^|\.)youtube(-nocookie)?\.com$/.test(u.hostname)) {
      if (u.searchParams.get('v')) return ok(u.searchParams.get('v'));
      const m = u.pathname.match(/\/(embed|shorts|live|v)\/([\w-]{11})/);
      if (m) return m[2];
    }
  } catch { /* keine URL */ }
  return null;
}

const decodeEntities = (s) => {
  const t = document.createElement('textarea');
  t.innerHTML = s;
  return t.value;
};

// "Interpret - Titel (Official Video)" -> { artist, title }
export function cleanMeta(rawTitle, channel) {
  const full = decodeEntities(rawTitle || '');
  let artist = decodeEntities(channel || '').replace(/\s*-\s*Topic$/i, '').replace(/VEVO$/i, '').trim();
  let title = full
    .replace(/\s*[([]\s*(official|offiziell|lyrics?|audio|video|hd|hq|4k|visuali[sz]er|music video|musikvideo|clip officiel)[^)\]]*[)\]]/gi, '')
    .replace(/\s*\|\s*.*$/, '')
    .trim();
  const m = title.match(/^(.+?)\s+[-–—]\s+(.+)$/);
  if (m) { artist = m[1].trim(); title = m[2].trim(); }
  return { title: title || full, artist };
}

const isoDur = (s) => {
  const m = String(s || '').match(/P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return (+m[1] || 0) * 86400 + (+m[2] || 0) * 3600 + (+m[3] || 0) * 60 + (+m[4] || 0);
};

export const thumb = (id) => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;

const cache = new Map();
export async function ytSearch(q, key) {
  const ck = q.toLowerCase();
  if (cache.has(ck)) return cache.get(ck);
  const p = new URLSearchParams({
    part: 'snippet', type: 'video', videoEmbeddable: 'true', videoCategoryId: '10',
    maxResults: '25', q, key,
  });
  const r = await fetch(`https://www.googleapis.com/youtube/v3/search?${p}`);
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    const err = new Error(j.error?.message || 'YouTube-Suche fehlgeschlagen');
    err.reason = j.error?.errors?.[0]?.reason || j.error?.status || '';
    throw err;
  }
  const items = (j.items || []).filter((i) => i.id?.videoId);
  const durs = {};
  if (items.length) {
    try {
      const p2 = new URLSearchParams({ part: 'contentDetails', id: items.map((i) => i.id.videoId).join(','), key });
      const r2 = await fetch(`https://www.googleapis.com/youtube/v3/videos?${p2}`);
      const j2 = await r2.json();
      for (const v of j2.items || []) durs[v.id] = isoDur(v.contentDetails?.duration);
    } catch { /* Dauer ist optional */ }
  }
  const res = items.map((i) => ({
    videoId: i.id.videoId,
    ...cleanMeta(i.snippet?.title, i.snippet?.channelTitle),
    duration: durs[i.id.videoId] || 0,
  }));
  cache.set(ck, res);
  return res;
}

export async function ytTitle(id) {
  try {
    const u = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent('https://www.youtube.com/watch?v=' + id)}`;
    const r = await fetch(u);
    if (!r.ok) return null;
    const j = await r.json();
    return cleanMeta(j.title, j.author_name);
  } catch {
    return null;
  }
}
