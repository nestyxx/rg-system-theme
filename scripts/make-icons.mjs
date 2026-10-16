// Génère les icônes de l'extension (PNG 16/32/48/128) en Node pur (zlib), sans dépendance.
// Motif : carré arrondi encre (#16233f) + disque de marque (#0b6e8f) cerclé de blanc — la « pastille de statut » du thème.
//   node scripts/make-icons.mjs   ->  src/extension/icons/icon-<taille>.png
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'src', 'extension', 'icons');
mkdirSync(out, { recursive: true });

const INK = [22, 35, 63];
const BRAND = [11, 110, 143];
const WHITE = [255, 255, 255];

const crcTable = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
};

// Couverture (0..1) du pixel (x,y) par chaque forme, échantillonnée en 4×4
function render(size) {
  const S = 4;
  const px = Buffer.alloc(size * size * 4);
  const r = size * 0.22; // rayon des coins
  const cx = size / 2;
  const cy = size / 2;
  const rDisc = size * 0.3;
  const rRing = size * 0.355;
  const inRound = (x, y) => {
    const dx = Math.max(r - x, 0, x - (size - r));
    const dy = Math.max(r - y, 0, y - (size - r));
    return dx * dx + dy * dy <= r * r;
  };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let a = 0, R = 0, G = 0, B = 0;
      for (let sy = 0; sy < S; sy++) {
        for (let sx = 0; sx < S; sx++) {
          const fx = x + (sx + 0.5) / S;
          const fy = y + (sy + 0.5) / S;
          if (!inRound(fx, fy)) continue;
          const d = Math.hypot(fx - cx, fy - cy);
          const col = d <= rDisc ? BRAND : d <= rRing ? WHITE : INK;
          a++; R += col[0]; G += col[1]; B += col[2];
        }
      }
      const i = (y * size + x) * 4;
      if (a) { px[i] = Math.round(R / a); px[i + 1] = Math.round(G / a); px[i + 2] = Math.round(B / a); }
      px[i + 3] = Math.round((a / (S * S)) * 255);
    }
  }
  return px;
}

function png(size) {
  const px = render(size);
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    px.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // profondeur
  ihdr[9] = 6; // RGBA
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

for (const size of [16, 32, 48, 128]) {
  writeFileSync(path.join(out, `icon-${size}.png`), png(size));
  console.log('OK  icon-' + size + '.png');
}
