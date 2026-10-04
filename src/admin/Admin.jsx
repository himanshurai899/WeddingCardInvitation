import { useState, useEffect } from 'react';
import { Send, Link as LinkIcon, Trash2, Upload, Contact } from 'lucide-react';
import { wedding, mapsUrl } from '../config/wedding';
import { inviteUrl, parseContacts, normalizePhone, PARTIES } from '../lib/guests';

const DEFAULT_MESSAGE = `🙏 नमस्ते {hname},

हिमांशु और समीक्षा का शुभ विवाह 25 नवंबर 2026 को वडोदरा में है। आपके आने से हमारी खुशी दोगुनी हो जाएगी। कृपया पधारें।

Namaste {name},

Himanshu & Samiksha are getting married on 25 November 2026 in Vadodara, and it would mean a lot to us to have you with us.

📍 स्थान / Venue:
{venue}
{map}

💌 निमंत्रण / Your invitation:
{link}

सप्रेम / With love,
राय एवं यादव परिवार / Rai & Yadav families`;

const venue = `${wedding.venue.nameHindi} (${wedding.venue.name}), ${wedding.venue.address}`;

// The list lives in this browser only (localStorage). It is never uploaded or bundled into the site.
const useStored = (key, initial) => {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? initial; } catch { return initial; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue];
};

const box = 'rounded-xl border border-maroon/25 bg-white px-3 py-2 text-[15px] outline-none focus:border-gold focus:ring-4 focus:ring-gold/25';
const btn = 'inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold';

const Admin = () => {
  const [guests, setGuests] = useStored('guestList', []);
  const [message, setMessage] = useStored('guestMessage2', DEFAULT_MESSAGE);
  const [newParty, setNewParty] = useState('solo');
  const [note, setNote] = useState('');
  const [copied, setCopied] = useState('');

  useEffect(() => { document.title = 'Guest list'; }, []);

  const addGuests = (incoming, skipped = 0) => {
    const have = new Set(guests.map((g) => g.phone));
    const fresh = incoming.filter((g) => !have.has(g.phone) && have.add(g.phone));
    setGuests([...guests, ...fresh.map((g) => ({ ...g, party: newParty, sent: false }))]);
    setNote(`Added ${fresh.length}. ${incoming.length - fresh.length} already on the list, ${skipped} skipped (no name or number).`);
  };

  const onFile = async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    const { guests: found, skipped } = parseContacts(await file.text(), file.name);
    addGuests(found, skipped);
  };

  // Android Chrome only; iPhone users export contacts as .vcf or .csv instead
  const pickContacts = async () => {
    try {
      const picked = await navigator.contacts.select(['name', 'tel'], { multiple: true });
      const found = picked.map((c) => ({ name: c.name[0]?.trim(), phone: normalizePhone(c.tel[0]) })).filter((g) => g.name && g.phone);
      addGuests(found, picked.length - found.length);
    } catch { /* picker closed */ }
  };

  const onAdd = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get('name')).trim();
    const phone = normalizePhone(f.get('phone'));
    if (!name || !phone) return setNote('Enter a name and a valid phone number.');
    addGuests([{ name, phone }]);
    e.currentTarget.reset();
  };

  const text = (g) => {
    const p = PARTIES[g.party] ?? PARTIES.solo;
    return message
      .replaceAll('{name}', g.name + p.en)
      .replaceAll('{hname}', g.name + p.hi)
      .replaceAll('{venue}', venue)
      .replaceAll('{map}', mapsUrl)
      .replaceAll('{link}', inviteUrl(g.name, g.party));
  };
  const setParty = (phone, party) => setGuests(guests.map((g) => (g.phone === phone ? { ...g, party } : g)));
  const mark = (phone, sent) => setGuests(guests.map((g) => (g.phone === phone ? { ...g, sent } : g)));
  const copy = async (g) => {
    await navigator.clipboard.writeText(inviteUrl(g.name, g.party));
    setCopied(g.phone);
    setTimeout(() => setCopied(''), 1500);
  };

  const sentCount = guests.filter((g) => g.sent).length;

  return (
    <main className="min-h-screen bg-cream px-4 py-8">
      <div className="mx-auto max-w-2xl flex flex-col gap-6">
        <header>
          <h1 className="font-serif text-4xl font-bold text-maroon-deep">Guest list</h1>
          <p className="text-ink-soft text-sm mt-1">
            Saved in this browser only. {guests.length} guests, {sentCount} invited.
          </p>
        </header>

        <section className="luxury-card p-5 flex flex-col gap-3">
          <h2 className="font-bold text-maroon">Add guests</h2>
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            Invite new guests as
            <select value={newParty} onChange={(e) => setNewParty(e.target.value)} className={box}>
              {Object.entries(PARTIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </label>
          <div className="flex flex-wrap gap-2">
            <label className={`${btn} cursor-pointer bg-maroon text-cream`}>
              <Upload className="w-4 h-4" /> Import CSV or VCF
              <input type="file" accept=".csv,.vcf,text/csv,text/vcard,text/x-vcard" onChange={onFile} className="hidden" />
            </label>
            {'contacts' in navigator && (
              <button type="button" onClick={pickContacts} className={`${btn} bg-maroon text-cream`}>
                <Contact className="w-4 h-4" /> Pick from phone contacts
              </button>
            )}
          </div>
          <form onSubmit={onAdd} className="flex flex-wrap gap-2" noValidate>
            <input name="name" placeholder="Name, e.g. Sharma Ji" className={`${box} flex-1 min-w-[10rem]`} />
            <input name="phone" type="tel" placeholder="Phone, e.g. 98765 43210" className={`${box} flex-1 min-w-[10rem]`} />
            <button type="submit" className={`${btn} border border-maroon text-maroon`}>Add</button>
          </form>
          {note && <p className="text-sm text-ink-soft" role="status">{note}</p>}
        </section>

        <section className="luxury-card p-5 flex flex-col gap-2">
          <h2 className="font-bold text-maroon">Message</h2>
          <p className="text-xs text-ink-soft">
            Filled in for each guest: {'{name}'} {'{hname}'} (name in Hindi greeting) {'{venue}'} {'{map}'} {'{link}'}
          </p>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={16} className={`${box} resize-y`} />
        </section>

        <section className="flex flex-col gap-2">
          {guests.length === 0 && <p className="text-center text-ink-soft py-6">No guests yet. Import a file or add one above.</p>}
          {guests.map((g) => (
            <div key={g.phone} className="luxury-card px-4 py-3 flex flex-wrap items-center gap-x-3 gap-y-2">
              <div className="flex-1 min-w-[9rem]">
                <p className="font-bold text-ink break-words">{g.name}</p>
                <p className="text-xs text-ink-soft">+{g.phone}{g.sent && ' · invited'}</p>
              </div>
              <select
                value={g.party ?? 'solo'}
                onChange={(e) => setParty(g.phone, e.target.value)}
                aria-label={`Invitation for ${g.name}`}
                className={`${box} py-1.5 text-sm`}
              >
                {Object.entries(PARTIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <a
                href={`https://wa.me/${g.phone}?text=${encodeURIComponent(text(g))}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => mark(g.phone, true)}
                className={`${btn} bg-[#128c4a] text-white`}
              >
                <Send className="w-4 h-4" /> {g.sent ? 'Send again' : 'WhatsApp'}
              </a>
              <button type="button" onClick={() => copy(g)} className={`${btn} border border-maroon/40 text-maroon`}>
                <LinkIcon className="w-4 h-4" /> {copied === g.phone ? 'Copied' : 'Copy link'}
              </button>
              <button
                type="button"
                aria-label={`Remove ${g.name}`}
                onClick={() => setGuests(guests.filter((x) => x.phone !== g.phone))}
                className="p-2 text-maroon/60 hover:text-sindoor"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
};

export default Admin;
