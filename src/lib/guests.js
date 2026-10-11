import { wedding } from '../config/wedding.js';

// The guest named in the link, e.g. https://your-site.vercel.app/?guest=Sharma%20Ji&party=family
// party: 'solo' (just them), 'plusone' (them and a guest), 'family' (them and their family) or 'friends' (their friend circle)
export const PARTIES = {
  solo: { label: 'Just them', en: '', hi: '', seats: 1 },
  plusone: { label: 'Plus one', en: ' & Guest', hi: ' एवं अतिथि', seats: 2 },
  family: { label: 'Family', en: ' & Family', hi: ' सपरिवार', seats: 4 },
  friends: { label: 'Friends', en: ' & Friends', hi: ' एवं मित्रगण', seats: 4 },
};

// Parties that can name who comes along: one plus one, or any number of family or friends
export const NAMED = ['plusone', 'family', 'friends'];
const cleanNames = (names) => [names ?? []].flat().map((n) => n.replaceAll(',', ' ').trim()).filter(Boolean);

// How the invitation addresses them: "Sharma Ji & Family", "Rahul & Priya" (a named plus one),
// "Nidhi, Ashok, Harshil & Khevana" (named friends), "Hit, Sneha & Family" / "Hit एवं Sneha सपरिवार"
// (named family; first names for both, so everyone fits), or "Rahul & Guest" / "Rahul & Friends" when no names are given
export const invitedAs = (name, p = 'solo', others = '', lang = 'en') => {
  let all = [name, ...(NAMED.includes(p) ? cleanNames(others) : [])];
  if (all.length === 1) return name + (PARTIES[p] ?? PARTIES.solo)[lang];
  if (p !== 'plusone') all = all.map((n) => n.trim().split(/\s+/)[0]);
  if (p === 'family' && lang === 'en') return `${all.join(', ')} & Family`;
  const list = `${all.slice(0, -1).join(', ')} ${lang === 'hi' ? 'एवं' : '&'} ${all.at(-1)}`;
  return p === 'family' ? `${list} सपरिवार` : list;
};

const query = typeof window === 'undefined' ? new URLSearchParams() : new URLSearchParams(window.location.search);
export const guestName = query.get('guest')?.trim().slice(0, 40) ?? '';
export const party = query.get('party') in PARTIES ? query.get('party') : 'solo';
// Who comes along, when the host knows: ?with=Priya, or one ?with= per family member or friend.
// Links sent earlier put friends in one comma list (?with=Amit,Riya), still read here.
const withAll = query.getAll('with').flatMap((v) => v.split(',')).map((n) => n.trim().slice(0, 40)).filter(Boolean);
export const withNames = party === 'plusone' ? withAll.slice(0, 1) : NAMED.includes(party) ? withAll : [];
export const plusOne = party === 'plusone' ? (withNames[0] ?? '') : '';
export const guest = guestName && invitedAs(guestName, party, withNames);

export const inviteUrl = (name, p = 'solo', withNames = '') => {
  const others = NAMED.includes(p) ? cleanNames(withNames) : [];
  return `${wedding.siteUrl}/?guest=${encodeURIComponent(name.trim())}${p === 'solo' ? '' : `&party=${p}`}` +
    // One &with= per name: a comma (%2C) in the link made WhatsApp cut it short after the first friend
    others.map((n) => `&with=${encodeURIComponent(n)}`).join('');
};

// Digits only, with country code. A bare 10-digit number is taken as Indian. Returns '' if it can't be a phone.
export const normalizePhone = (raw) => {
  const d = String(raw ?? '').replace(/\D/g, '').replace(/^0+/, '');
  const full = d.length === 10 ? `91${d}` : d;
  return full.length >= 11 && full.length <= 15 ? full : '';
};
