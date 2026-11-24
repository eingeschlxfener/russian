// Liest Titel, Interpret, Album und Cover aus ID3v2 (2.2/2.3/2.4) bzw. ID3v1-Tags.

const be32 = (b, i) => ((b[i] << 24) | (b[i + 1] << 16) | (b[i + 2] << 8) | b[i + 3]) >>> 0;
const synch = (b, i) => ((b[i] & 0x7f) << 21) | ((b[i + 1] & 0x7f) << 14) | ((b[i + 2] & 0x7f) << 7) | (b[i + 3] & 0x7f);

function unsync(b) {
  const out = new Uint8Array(b.length);
  let j = 0;
  for (let i = 0; i < b.length; i++) {
    out[j++] = b[i];
    if (b[i] === 0xff && b[i + 1] === 0x00) i++;
  }
  return out.subarray(0, j);
}

function decode(bytes, enc) {
  try {
    if (enc === 0) return new TextDecoder('iso-8859-1').decode(bytes);
    if (enc === 3) return new TextDecoder('utf-8').decode(bytes);
    if (enc === 2) return new TextDecoder('utf-16be').decode(bytes);
    if (bytes[0] === 0xfe && bytes[1] === 0xff) return new TextDecoder('utf-16be').decode(bytes.subarray(2));
    return new TextDecoder('utf-16le').decode(bytes);
  } catch {
    return '';
  }
}

function text(body) {
  const s = decode(body.subarray(1), body[0]);
  return s.split('\0').map((x) => x.trim()).filter(Boolean).join(', ');
}

function picture(body, v22) {
  const enc = body[0];
  let i = 1;
  let mime;
  if (v22) {
    const f = String.fromCharCode(body[1], body[2], body[3]).toUpperCase();
    mime = f === 'PNG' ? 'image/png' : 'image/jpeg';
    i = 4;
  } else {
    let j = i;
    while (j < body.length && body[j] !== 0) j++;
    mime = decode(body.subarray(i, j), 0).toLowerCase() || 'image/jpeg';
    i = j + 1;
  }
  const type = body[i++];
  if (enc === 1 || enc === 2) {
    while (i + 1 < body.length && !(body[i] === 0 && body[i + 1] === 0)) i += 2;
    i += 2;
  } else {
    while (i < body.length && body[i] !== 0) i++;
    i++;
  }
  if (!mime.includes('/')) mime = 'image/' + mime.replace('jpg', 'jpeg');
  if (i >= body.length) return null;
  return { type, blob: new Blob([body.slice(i)], { type: mime }) };
}

const MAP = {
  TIT2: 'title', TT2: 'title',
  TPE1: 'artist', TP1: 'artist',
  TALB: 'album', TAL: 'album',
};

async function readV2(file) {
  const head = new Uint8Array(await file.slice(0, 10).arrayBuffer());
  if (head[0] !== 0x49 || head[1] !== 0x44 || head[2] !== 0x33) return null; // "ID3"
  const ver = head[3];
  const flags = head[5];
  const size = synch(head, 6);
  let data = new Uint8Array(await file.slice(10, 10 + size).arrayBuffer());
  if (flags & 0x80 && ver < 4) data = unsync(data);

  let pos = 0;
  if (flags & 0x40) {
    if (ver === 3) pos = 4 + be32(data, 0);
    else if (ver === 4) pos = synch(data, 0);
  }

  const out = {};
  const pics = [];
  const idLen = ver === 2 ? 3 : 4;
  const hdrLen = ver === 2 ? 6 : 10;

  while (pos + hdrLen <= data.length) {
    const id = String.fromCharCode(...data.subarray(pos, pos + idLen));
    if (!/^[A-Z0-9]+$/.test(id)) break;
    let sz;
    if (ver === 2) sz = (data[pos + 3] << 16) | (data[pos + 4] << 8) | data[pos + 5];
    else if (ver === 4) sz = synch(data, pos + 4);
    else sz = be32(data, pos + 4);
    const fflags = ver === 2 ? 0 : data[pos + 9];
    const start = pos + hdrLen;
    pos = start + sz;
    if (sz <= 0 || start + sz > data.length) continue;
    let body = data.subarray(start, start + sz);

    if (ver === 3 && fflags & 0xc0) continue; // komprimiert/verschlüsselt
    if (ver === 4) {
      if (fflags & 0x0c) continue;
      if (fflags & 0x02) body = unsync(body);
      if (fflags & 0x01) body = body.subarray(4);
    }

    if (MAP[id]) {
      const v = text(body);
      if (v && !out[MAP[id]]) out[MAP[id]] = v;
    } else if (id === 'APIC' || id === 'PIC') {
      const p = picture(body, ver === 2);
      if (p) pics.push(p);
    }
  }
  const front = pics.find((p) => p.type === 3) || pics[0];
  if (front) out.cover = front.blob;
  return out;
}

async function readV1(file) {
  if (file.size < 128) return null;
  const b = new Uint8Array(await file.slice(file.size - 128).arrayBuffer());
  if (b[0] !== 0x54 || b[1] !== 0x41 || b[2] !== 0x47) return null; // "TAG"
  const f = (a, z) => decode(b.subarray(a, z), 0).replace(/\0.*$/s, '').trim();
  return { title: f(3, 33), artist: f(33, 63), album: f(63, 93) };
}

export async function readTags(file) {
  let tags = {};
  try { tags = (await readV2(file)) || {}; } catch { tags = {}; }
  if (!tags.title || !tags.artist) {
    try {
      const v1 = await readV1(file);
      if (v1) for (const k of ['title', 'artist', 'album']) if (!tags[k] && v1[k]) tags[k] = v1[k];
    } catch { /* ignorieren */ }
  }
  return tags;
}
