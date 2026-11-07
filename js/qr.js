/* ==========================================================================
 *  Acc Cell WebApp — pembuat QR Code mandiri (tanpa layanan luar).
 *  Mode byte (UTF-8), versi 1–40 otomatis, koreksi galat L/M/Q/H, pemilihan mask terbaik.
 *  Algoritme mengikuti standar ISO/IEC 18004 (pola referensi Project Nayuki, MIT).
 *  © Nabire Kreatif — template berlisensi
 * ========================================================================== */
(function () {
  'use strict';
  const ECC_LEN = [
    [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
    [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]];
  const NUM_BLOCKS = [
    [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
    [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
    [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
    [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81]];
  const ECL = { L: [0, 1], M: [1, 0], Q: [2, 3], H: [3, 2] };      // [indeks tabel, bit format]

  const rawModules = v => { let r = (16 * v + 128) * v + 64; if (v >= 2) { const n = Math.floor(v / 7) + 2; r -= (25 * n - 10) * n - 55; if (v >= 7) r -= 36; } return r; };
  const dataCodewords = (v, e) => Math.floor(rawModules(v) / 8) - ECC_LEN[e][v] * NUM_BLOCKS[e][v];
  function gmul(x, y) { let z = 0; for (let i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> i) & 1) * x; } return z & 255; }
  function rsDivisor(deg) { const r = new Array(deg).fill(0); r[deg - 1] = 1; let root = 1; for (let i = 0; i < deg; i++) { for (let j = 0; j < r.length; j++) { r[j] = gmul(r[j], root); if (j + 1 < r.length) r[j] ^= r[j + 1]; } root = gmul(root, 2); } return r; }
  function rsRemainder(data, div) { const r = new Array(div.length).fill(0); for (const b of data) { const f = b ^ r.shift(); r.push(0); div.forEach((c, i) => { r[i] ^= gmul(c, f); }); } return r; }
  function utf8(s) { const out = []; const e = unescape(encodeURIComponent(s)); for (let i = 0; i < e.length; i++) out.push(e.charCodeAt(i)); return out; }

  function encode(text, eclName) {
    const [e, fbits] = ECL[eclName || 'M'] || ECL.M, bytes = utf8(text);
    let ver = 1;
    for (; ver <= 40; ver++) { const cc = ver <= 9 ? 8 : 16; if (4 + cc + bytes.length * 8 <= dataCodewords(ver, e) * 8) break; }
    if (ver > 40) throw new Error('Teks terlalu panjang untuk QR');
    const bits = [], push = (val, n) => { for (let i = n - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
    push(4, 4); push(bytes.length, ver <= 9 ? 8 : 16); bytes.forEach(b => push(b, 8));
    const cap = dataCodewords(ver, e) * 8;
    push(0, Math.min(4, cap - bits.length)); push(0, (8 - bits.length % 8) % 8);
    for (let p = 0xEC; bits.length < cap; p ^= 0xEC ^ 0x11) push(p, 8);
    const data = []; for (let i = 0; i < bits.length; i += 8) { let b = 0; for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j]; data.push(b); }
    // ECC + interleave
    const nb = NUM_BLOCKS[e][ver], el = ECC_LEN[e][ver], raw = Math.floor(rawModules(ver) / 8), nShort = nb - raw % nb, shortLen = Math.floor(raw / nb), div = rsDivisor(el), blocks = [];
    for (let i = 0, k = 0; i < nb; i++) { const dat = data.slice(k, k + shortLen - el + (i < nShort ? 0 : 1)); k += dat.length; const ecc = rsRemainder(dat, div); if (i < nShort) dat.push(0); blocks.push(dat.concat(ecc)); }
    const cw = [];
    for (let i = 0; i < blocks[0].length; i++) blocks.forEach((b, j) => { if (i !== shortLen - el || j >= nShort) cw.push(b[i]); });
    // matriks
    const size = ver * 4 + 17, mod = [], fn = [];
    for (let y = 0; y < size; y++) { mod.push(new Array(size).fill(false)); fn.push(new Array(size).fill(false)); }
    const set = (x, y, d) => { mod[y][x] = d; fn[y][x] = true; };
    for (let i = 0; i < size; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
    [[3, 3], [size - 4, 3], [3, size - 4]].forEach(([cx, cy]) => { for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) { const d = Math.max(Math.abs(dx), Math.abs(dy)), x = cx + dx, y = cy + dy; if (x >= 0 && x < size && y >= 0 && y < size) set(x, y, d !== 2 && d !== 4); } });
    const al = []; if (ver > 1) { const n = Math.floor(ver / 7) + 2, step = ver === 32 ? 26 : Math.ceil((ver * 4 + 4) / (n * 2 - 2)) * 2; al.push(6); for (let pos = size - 7; al.length < n; pos -= step) al.splice(1, 0, pos); }
    al.forEach((ax, i) => al.forEach((ay, j) => { if ((i === 0 && j === 0) || (i === 0 && j === al.length - 1) || (i === al.length - 1 && j === 0)) return; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1); }));
    const formatBits = mask => { const d = (fbits << 3) | mask; let r = d; for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537); return ((d << 10) | r) ^ 0x5412; };
    const drawFormat = mask => {
      const b = formatBits(mask), bit = i => ((b >>> i) & 1) !== 0;
      for (let i = 0; i <= 5; i++) set(8, i, bit(i));
      set(8, 7, bit(6)); set(8, 8, bit(7)); set(7, 8, bit(8));
      for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i));
      for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(i));
      for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(i));
      set(8, size - 8, true);
    };
    drawFormat(0);
    if (ver >= 7) { let r = ver; for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1F25); const b = (ver << 12) | r; for (let i = 0; i < 18; i++) { const d = ((b >>> i) & 1) !== 0, a = size - 11 + i % 3, c = Math.floor(i / 3); set(a, c, d); set(c, a, d); } }
    let i = 0;
    for (let right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let v = 0; v < size; v++) for (let j = 0; j < 2; j++) {
        const x = right - j, up = ((right + 1) & 2) === 0, y = up ? size - 1 - v : v;
        if (!fn[y][x] && i < cw.length * 8) { mod[y][x] = ((cw[i >>> 3] >>> (7 - (i & 7))) & 1) !== 0; i++; }
      }
    }
    const MASK = [(x, y) => (x + y) % 2 === 0, (x, y) => y % 2 === 0, x => x % 3 === 0, (x, y) => (x + y) % 3 === 0, (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
      (x, y) => x * y % 2 + x * y % 3 === 0, (x, y) => (x * y % 2 + x * y % 3) % 2 === 0, (x, y) => ((x + y) % 2 + x * y % 3) % 2 === 0];
    const applyMask = m => { for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!fn[y][x] && MASK[m](x, y)) mod[y][x] = !mod[y][x]; };
    const penalty = () => {
      let p = 0, dark = 0;
      const lineScore = get => { for (let a = 0; a < size; a++) { let run = 1, s = ''; for (let b = 0; b < size; b++) { const c = get(a, b); s += c ? '1' : '0'; if (b && c === get(a, b - 1)) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1; }
        const re = /(?=(10111010000|00001011101))/g; while (re.exec(s)) { p += 40; re.lastIndex++; } } };
      lineScore((a, b) => mod[a][b]); lineScore((a, b) => mod[b][a]);
      for (let y = 0; y < size - 1; y++) for (let x = 0; x < size - 1; x++) { const c = mod[y][x]; if (c === mod[y][x + 1] && c === mod[y + 1][x] && c === mod[y + 1][x + 1]) p += 3; }
      mod.forEach(r => r.forEach(c => { if (c) dark++; }));
      p += Math.floor(Math.abs(dark * 20 - size * size * 10) / (size * size)) * 10;
      return p;
    };
    let best = 0, bestP = Infinity;
    for (let m = 0; m < 8; m++) { applyMask(m); drawFormat(m); const pp = penalty(); if (pp < bestP) { bestP = pp; best = m; } applyMask(m); }
    applyMask(best); drawFormat(best);
    return { size, modules: mod, version: ver };
  }

  /** SVG untuk ditampilkan (tajam di semua layar). */
  function svg(text, opt) {
    opt = opt || {}; const q = encode(text, opt.ecl || 'Q'), b = 4, n = q.size + b * 2;
    let d = '';
    q.modules.forEach((r, y) => r.forEach((c, x) => { if (c) d += 'M' + (x + b) + ' ' + (y + b) + 'h1v1h-1z'; }));
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + n + ' ' + n + '" shape-rendering="crispEdges" role="img" aria-label="QR Code"><rect width="' + n + '" height="' + n + '" fill="#fff"/><path d="' + d + '" fill="' + (opt.color || '#0B0B0C') + '"/></svg>';
  }
  /** Gambar QR ke canvas (opsional logo bulat di tengah). Mengembalikan Promise<canvas>. */
  function canvas(text, opt) {
    opt = opt || {};
    const q = encode(text, opt.ecl || 'Q'), b = 4, n = q.size + b * 2, px = Math.max(4, Math.floor((opt.size || 900) / n)), W = n * px;
    const c = document.createElement('canvas'); c.width = W; c.height = W; const x = c.getContext('2d');
    x.fillStyle = '#fff'; x.fillRect(0, 0, W, W); x.fillStyle = opt.color || '#0B0B0C';
    q.modules.forEach((r, yy) => r.forEach((d, xx) => { if (d) x.fillRect((xx + b) * px, (yy + b) * px, px, px); }));
    if (!opt.logo) return Promise.resolve(c);
    return new Promise(res => {
      const im = new Image(); if (/^https?:/i.test(opt.logo) && opt.logo.indexOf(location.origin) !== 0) im.crossOrigin = 'anonymous';
      im.onload = () => { const s = Math.round(W * 0.2), o = (W - s) / 2; x.fillStyle = '#fff'; x.beginPath(); x.arc(W / 2, W / 2, s / 2 + px, 0, Math.PI * 2); x.fill(); x.save(); x.beginPath(); x.arc(W / 2, W / 2, s / 2, 0, Math.PI * 2); x.clip(); x.drawImage(im, o, o, s, s); x.restore(); res(c); };
      im.onerror = () => res(c);
      im.src = opt.logo;
    });
  }
  window.QR = { encode, svg, canvas };
})();
