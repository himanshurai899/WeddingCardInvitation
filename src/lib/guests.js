import { wedding } from '../config/wedding.js';

// The guest named in the link, e.g. https://your-site.vercel.app/?guest=Sharma%20Ji&party=family
// party: 'solo' (just them), 'plusone' (them and a guest) or 'family' (them and their family)
export const PARTIES = {
  solo: { label: 'Just them', en: '', hi: '', seats: 1 },
  plusone: { label: 'Plus one', en: ' & Guest', hi: ' एवं अतिथि', seats: 2 },
  family: { label: 'Family', en: ' & Family', hi: ' सपरिवार', seats: 4 },
};

const query = typeof window === 'undefined' ? new URLSearchParams() : new URLSearchParams(window.location.search);
export const guestName = query.get('guest')?.trim().slice(0, 40) ?? '';
export const party = query.get('party') in PARTIES ? query.get('party') : 'solo';
// What the card says: "Sharma Ji & Family"
export const guest = guestName && guestName + PARTIES[party].en;

export const inviteUrl = (name, p = 'solo') =>
  `${wedding.siteUrl}/?guest=${encodeURIComponent(name.trim())}${p === 'solo' ? '' : `&party=${p}`}`;

// Digits only, with country code. A bare 10-digit number is taken as Indian. Returns '' if it can't be a phone.
export const normalizePhone = (raw) => {
  const d = String(raw ?? '').replace(/\D/g, '').replace(/^0+/, '');
  const full = d.length === 10 ? `91${d}` : d;
  return full.length >= 11 && full.length <= 15 ? full : '';
};

const parseCsv = (text) => {
  const rows = [[]];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ',' || c === '\n') {
      rows.at(-1).push(cell.trim());
      cell = '';
      if (c === '\n') rows.push([]);
    } else if (c !== '\r') cell += c;
  }
  rows.at(-1).push(cell.trim());
  return rows.filter((r) => r.some(Boolean));
};

const fromCsv = (text) => {
  const rows = parseCsv(text);
  if (!rows.length) return [];
  // A first row with no phone-like cell is a header (Google and Outlook exports have one)
  const head = rows[0].map((h) => h.toLowerCase());
  const hasHeader = !rows[0].some((c) => c.replace(/\D/g, '').length >= 7);
  const find = (re) => head.findIndex((h) => re.test(h));
  let nameCols = [0];
  let phoneCol = 1;
  if (hasHeader) {
    const full = find(/^(full |display )?name$/);
    nameCols = full >= 0 ? [full] : [find(/^(first|given) name$/), find(/^(last|family) name$/)].filter((i) => i >= 0);
    phoneCol = head.findIndex((h) => /phone|mobile|tel|whatsapp/.test(h) && !/label|type/.test(h));
  }
  return rows.slice(hasHeader ? 1 : 0).map((r) => ({
    name: nameCols.map((i) => r[i]).filter(Boolean).join(' '),
    phone: r[phoneCol],
  }));
};

// vCard export (iPhone Contacts, Android): the first number of each contact
const fromVcf = (text) => text.split(/BEGIN:VCARD/i).slice(1).map((card) => ({
  name: /^FN[^:\n]*:(.*)$/m.exec(card)?.[1].trim(),
  phone: /^(?:item\d+\.)?TEL[^:\n]*:(.*)$/m.exec(card)?.[1],
}));

// Contacts from a .csv or .vcf file's text, as [{ name, phone }] with clean phones.
// `skipped` counts rows with no name or no usable number.
export const parseContacts = (text, fileName = '') => {
  const raw = /\.vcf$/i.test(fileName) || /^\s*BEGIN:VCARD/i.test(text) ? fromVcf(text) : fromCsv(text);
  const guests = raw
    .map((g) => ({ name: (g.name ?? '').trim(), phone: normalizePhone(g.phone) }))
    .filter((g) => g.name && g.phone);
  return { guests, skipped: raw.length - guests.length };
};
