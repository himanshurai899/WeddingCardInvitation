// Print-ready QR code for the physical wedding card, with the H & S monogram in the middle.
//
//   npm run qr                                   (uses the live site address)
//   npm run qr -- https://some-other-address.app
//
// Writes qr/wedding-qr.svg (vector, best for the printer) and qr/wedding-qr.png (2000 px).
// Error correction is "H": the code carries enough spare data to still scan with the
// monogram sitting on top of it, and after the card gets a little worn.
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import QRCode from 'qrcode';
import { Resvg } from '@resvg/resvg-js';
import { glyphs } from './qr-glyphs.mjs';

const require = createRequire(import.meta.url);
const { getPositions } = require('qrcode/lib/core/alignment-pattern');

const url = process.argv[2] ?? 'https://himanshu-samiksha-vivah.vercel.app';
if (!/^https?:\/\//.test(url)) {
  console.error('Usage: npm run qr -- https://your-site.vercel.app');
  process.exit(1);
}

// Everything the scanner reads stays dark maroon on cream. Gold is only used for
// decoration, because a phone camera sees gold as "light".
const colors = {
  paper: '#fffaf0',
  dot: '#47101a',
  eye: '#5c1420',
  eyeBall: '#7b1e2b',
  medallion: '#5c1420',
  gold: '#e0b45f',
  goldSoft: '#c9a24b',
  letters: '#f7e2a8',
  amp: '#e8821e',
};

const qr = QRCode.create(url, { errorCorrectionLevel: 'H' });
const n = qr.modules.size;
const dark = (r, c) => qr.modules.get(r, c) === 1;

const quiet = 4; // blank border scanners need around the code, in modules
const size = n + quiet * 2;
const mid = n / 2;

// Centre medallion. Keep it under ~10% of the code so error correction has plenty to spare.
const medallionR = n * 0.155;
const clearR = medallionR + 0.7;

const f = (v) => +v.toFixed(3);

// Rounded rectangle with its own radius per corner: [top-left, top-right, bottom-right, bottom-left].
function roundRect(x, y, w, h, [tl, tr, br, bl]) {
  return [
    `M${f(x + tl)} ${f(y)}H${f(x + w - tr)}`,
    `A${tr} ${tr} 0 0 1 ${f(x + w)} ${f(y + tr)}V${f(y + h - br)}`,
    `A${br} ${br} 0 0 1 ${f(x + w - br)} ${f(y + h)}H${f(x + bl)}`,
    `A${bl} ${bl} 0 0 1 ${f(x)} ${f(y + h - bl)}V${f(y + tl)}`,
    `A${tl} ${tl} 0 0 1 ${f(x + tl)} ${f(y)}Z`,
  ].join('');
}

// Leaf-shaped finder "eyes": round on the corner facing out and the corner facing in,
// nearly square on the other two.
function leaf(x, y, s, round, tip, flip) {
  const radii = flip ? [tip, round, tip, round] : [round, tip, round, tip];
  return roundRect(x, y, s, s, radii);
}

const finders = [
  { r: 0, c: 0, flip: false },
  { r: 0, c: n - 7, flip: true },
  { r: n - 7, c: 0, flip: true },
];
const inFinder = (r, c) => finders.some((e) => r >= e.r - 1 && r <= e.r + 7 && c >= e.c - 1 && c <= e.c + 7);

const alignments = getPositions(qr.version).filter(([r, c]) => !inFinder(r, c));
const inAlignment = (r, c) => alignments.some(([ar, ac]) => Math.abs(r - ar) <= 2 && Math.abs(c - ac) <= 2);

const inMedallion = (r, c) => Math.hypot(c + 0.5 - mid, r + 0.5 - mid) < clearR;
if (alignments.some(([r, c]) => inMedallion(r, c))) {
  console.error('This address makes a bigger QR whose centre marker sits under the monogram. Use a shorter URL.');
  process.exit(1);
}

// Data dots
const dots = [];
for (let r = 0; r < n; r++) {
  for (let c = 0; c < n; c++) {
    if (!dark(r, c) || inFinder(r, c) || inAlignment(r, c) || inMedallion(r, c)) continue;
    dots.push(`M${c + 0.5 - 0.46} ${r + 0.5}a0.46 0.46 0 1 0 0.92 0a0.46 0.46 0 1 0 -0.92 0`);
  }
}

// Finder eyes: 7×7 ring around a 3×3 centre
const eyeRings = finders
  .map(({ r, c, flip }) => leaf(c, r, 7, 2.8, 0.5, flip) + leaf(c + 1, r + 1, 5, 1.9, 0.25, flip))
  .join('');
const eyeBalls = finders.map(({ r, c, flip }) => leaf(c + 2, r + 2, 3, 1.25, 0.2, flip)).join('');

// Smaller alignment marker(s), drawn as a soft ring with a dot
const alignRings = alignments
  .map(([r, c]) => roundRect(c - 2, r - 2, 5, 5, [1.6, 1.6, 1.6, 1.6]) + roundRect(c - 1, r - 1, 3, 3, [0.9, 0.9, 0.9, 0.9]))
  .join('');
const alignDots = alignments
  .map(([r, c]) => `M${c - 0.05} ${r + 0.5}a0.55 0.55 0 1 0 1.1 0a0.55 0.55 0 1 0 -1.1 0`)
  .join('');

// Monogram: H & S, with a smaller marigold ampersand, as on the site's favicon
function monogram() {
  const layout = (capH) => {
    const k = capH / -glyphs.H.bb[1];
    const gap = capH * 0.04;
    const parts = [
      { g: glyphs.H, k, fill: colors.letters, lift: 0 },
      { g: glyphs.amp, k: k * 0.6, fill: colors.amp, lift: capH * 0.12 },
      { g: glyphs.S, k, fill: colors.letters, lift: 0 },
    ];
    const width = parts.reduce((w, p) => w + (p.g.bb[2] - p.g.bb[0]) * p.k, 0) + gap * (parts.length - 1);
    return { capH, gap, parts, width };
  };
  // As tall as looks right, but never wider than the space inside the dotted ring
  const unit = layout(1);
  const { capH, gap, parts, width } = layout(Math.min(medallionR * 0.62, (medallionR * 1.32) / unit.width));
  let x = mid - width / 2;
  const baseline = mid + capH / 2;
  return parts
    .map((p) => {
      const tx = x - p.g.bb[0] * p.k;
      x += (p.g.bb[2] - p.g.bb[0]) * p.k + gap;
      return `<path transform="translate(${f(tx)} ${f(baseline - p.lift)}) scale(${f(p.k)})" fill="${p.fill}" d="${p.g.d}"/>`;
    })
    .join('\n    ');
}

const frameInset = 1.1;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-quiet} ${-quiet} ${size} ${size}" width="${size * 20}" height="${size * 20}">
  <title>H &amp; S wedding invitation QR: ${url}</title>
  <rect x="${-quiet}" y="${-quiet}" width="${size}" height="${size}" rx="2.4" fill="${colors.paper}"/>
  <rect x="${f(-quiet + frameInset)}" y="${f(-quiet + frameInset)}" width="${f(size - frameInset * 2)}" height="${f(size - frameInset * 2)}" rx="1.6" fill="none" stroke="${colors.goldSoft}" stroke-width="0.16"/>
  <rect x="${f(-quiet + frameInset + 0.45)}" y="${f(-quiet + frameInset + 0.45)}" width="${f(size - frameInset * 2 - 0.9)}" height="${f(size - frameInset * 2 - 0.9)}" rx="1.2" fill="none" stroke="${colors.goldSoft}" stroke-width="0.07" stroke-dasharray="0.08 0.32" stroke-linecap="round"/>
  <path fill="${colors.dot}" d="${dots.join('')}"/>
  <path fill="${colors.eye}" fill-rule="evenodd" d="${eyeRings}${alignRings}"/>
  <path fill="${colors.eyeBall}" d="${eyeBalls}${alignDots}"/>
  <g>
    <circle cx="${mid}" cy="${mid}" r="${f(medallionR)}" fill="${colors.medallion}"/>
    <circle cx="${mid}" cy="${mid}" r="${f(medallionR * 0.88)}" fill="none" stroke="${colors.gold}" stroke-width="0.2"/>
    <circle cx="${mid}" cy="${mid}" r="${f(medallionR * 0.79)}" fill="none" stroke="${colors.gold}" stroke-width="0.09" stroke-dasharray="0.05 0.28" stroke-linecap="round"/>
    ${monogram()}
  </g>
</svg>
`;

await mkdir('qr', { recursive: true });
await writeFile('qr/wedding-qr.svg', svg);
const png = new Resvg(svg, { fitTo: { mode: 'width', value: 2000 } }).render().asPng();
await writeFile('qr/wedding-qr.png', png);

console.log(`QR for ${url}`);
console.log('  qr/wedding-qr.svg  (send this to the printer)');
console.log('  qr/wedding-qr.png');
console.log('Print it at least 2.5 cm × 2.5 cm and test-scan a proof before the full print run.');
