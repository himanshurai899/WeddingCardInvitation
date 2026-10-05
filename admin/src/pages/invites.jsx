import { useState, useEffect } from 'react';
import { Send, Link as LinkIcon, Trash2, Upload, Contact } from 'lucide-react';
import { Button } from '@admin/components/ui/Button';
import { Select } from '@admin/components/ui/Select';
import { wedding, mapsUrl } from '../../../src/config/wedding';
import { inviteUrl, parseContacts, normalizePhone, PARTIES } from '../../../src/lib/guests';

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

const box =
  'rounded-lg border px-3 py-2 text-sm outline-none bg-[#F5F3F8] border-[rgba(15,6,18,0.10)] text-[#0F0612] dark:bg-[#2A1842] dark:border-[rgba(201,168,76,0.16)] dark:text-[#F0EBF7] focus:ring-2 focus:ring-violet-500';

const Admin = () => {
  const [guests, setGuests] = useStored('guestList', []);
  const [message, setMessage] = useStored('guestMessage2', DEFAULT_MESSAGE);
  const [newParty, setNewParty] = useState('solo');
  const [note, setNote] = useState('');
  const [copied, setCopied] = useState('');


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
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <LinkIcon size={22} aria-hidden /> Invite Links
        </h1>
        <p className="page-subtitle">
          Personal links for the invitation card, sent over WhatsApp. Saved in this browser only. {guests.length} guests,{' '}
          {sentCount} invited.
        </p>
      </div>

      <section className="card p-5 flex flex-col gap-3">
        <h2 className="font-semibold">Add guests</h2>
        <Select
          label="Invite new guests as"
          value={newParty}
          onChange={(e) => setNewParty(e.target.value)}
          options={Object.entries(PARTIES).map(([value, v]) => ({ value, label: v.label }))}
          className="max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          <label className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium cursor-pointer bg-violet-600 text-white hover:bg-violet-700">
            <Upload size={16} /> Import CSV or VCF
            <input type="file" accept=".csv,.vcf,text/csv,text/vcard,text/x-vcard" onChange={onFile} className="hidden" />
          </label>
          {'contacts' in navigator && (
            <Button onClick={pickContacts}>
              <Contact size={16} /> Pick from phone contacts
            </Button>
          )}
        </div>
        <form onSubmit={onAdd} className="flex flex-wrap gap-2" noValidate>
          <input name="name" aria-label="Name" placeholder="Name, e.g. Sharma Ji" className={`${box} flex-1 min-w-[10rem]`} />
          <input
            name="phone"
            type="tel"
            aria-label="Phone"
            placeholder="Phone, e.g. 98765 43210"
            className={`${box} flex-1 min-w-[10rem]`}
          />
          <Button type="submit" variant="outline">
            Add
          </Button>
        </form>
        {note && (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }} role="status">
            {note}
          </p>
        )}
      </section>

      <section className="card p-5 flex flex-col gap-2">
        <h2 className="font-semibold">Message</h2>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Filled in for each guest: {'{name}'} {'{hname}'} (name in Hindi greeting) {'{venue}'} {'{map}'} {'{link}'}
        </p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-label="Message"
          rows={16}
          className={`${box} resize-y`}
        />
      </section>

      <section className="flex flex-col gap-2">
        {guests.length === 0 && (
          <p className="text-center py-6" style={{ color: 'var(--text-muted)' }}>
            No guests yet. Import a file or add one above.
          </p>
        )}
        {guests.map((g) => (
          <div key={g.phone} className="card px-4 py-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <div className="flex-1 min-w-[9rem]">
              <p className="font-semibold break-words">{g.name}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                +{g.phone}
                {g.sent && ' · invited'}
              </p>
            </div>
            <select
              value={g.party ?? 'solo'}
              onChange={(e) => setParty(g.phone, e.target.value)}
              aria-label={`Invitation for ${g.name}`}
              className={box}
            >
              {Object.entries(PARTIES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
            <a
              href={`https://wa.me/${g.phone}?text=${encodeURIComponent(text(g))}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => mark(g.phone, true)}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-[#128c4a] text-white hover:opacity-90"
            >
              <Send size={16} /> {g.sent ? 'Send again' : 'WhatsApp'}
            </a>
            <Button variant="outline" onClick={() => copy(g)}>
              <LinkIcon size={16} /> {copied === g.phone ? 'Copied' : 'Copy link'}
            </Button>
            <Button
              variant="ghost"
              aria-label={`Remove ${g.name}`}
              onClick={() => setGuests(guests.filter((x) => x.phone !== g.phone))}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Admin;
