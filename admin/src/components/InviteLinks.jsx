import { useState, useEffect, useMemo } from 'react';
import { Send, Link as LinkIcon, Plus, X, Check, Undo2, Search } from 'lucide-react';
import { Button } from '@admin/components/ui/Button';
import { Badge } from '@admin/components/ui/Badge';
import { cn } from '@admin/lib/utils/cn';
import { wedding, mapsUrl } from '../../../src/config/wedding';
import { inviteUrl, invitedAs, normalizePhone, PARTIES } from '../../../src/lib/guests';

const DEFAULT_MESSAGE = `🙏 नमस्ते {hname},

बड़ों के आशीर्वाद और ईश्वर की कृपा से हमारे आँगन में शहनाइयाँ गूँजने वाली हैं। हिमांशु और समीक्षा का शुभ विवाह 25 नवंबर 2026 को वडोदरा में है, और आपके बिना यह उत्सव अधूरा रहेगा।

Namaste {name},

With the blessings of our elders, Himanshu & Samiksha begin their life together on 25 November 2026 in Vadodara. Our celebration would not feel complete without you.

💌 निमंत्रण / Your invitation, made just for you:
{link}

📍 स्थान / Venue:
{venue}
{map}

आपके स्नेह की प्रतीक्षा में,
With love and gratitude,
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

// Sets Invitation Sent, the same flag the Guests page shows
const putSent = (ids, value = true) =>
  ids.forEach((id) =>
    fetch(`/api/admin/guests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invitationSent: value }),
    }).catch(() => {}),
  );
const nameKey = (n) => (n ?? '').trim().toLowerCase();
const ADD = { plusone: 'plus one', family: 'family member', friends: 'friend' };

const box =
  'rounded-lg border px-3 py-2 text-sm outline-none bg-[#F5F3F8] border-[rgba(15,6,18,0.10)] text-[#0F0612] dark:bg-[#2A1842] dark:border-[rgba(201,168,76,0.16)] dark:text-[#F0EBF7] focus:ring-2 focus:ring-violet-500';

// The Invite tab of the Guest Sorter: everyone sorted into the Guest List, each with their own link
const InviteLinks = () => {
  const [dbGuests, setDbGuests] = useState(null);
  // Invite type and names, by Guest List id. Saved in this browser only.
  const [settings, setSettings] = useStored('inviteSettings', {});
  const [message, setMessage] = useStored('guestMessage3', DEFAULT_MESSAGE);
  const [copied, setCopied] = useState('');
  const [show, setShow] = useState('all');
  const [query, setQuery] = useState('');
  // Guests whose WhatsApp was opened but not yet confirmed as sent. Kept in this browser so a reload doesn't lose them.
  const [pending, setPending] = useStored('invitePending', []);

  useEffect(() => {
    fetch('/api/admin/guests')
      .then((r) => r.json())
      .then((d) => setDbGuests(Array.isArray(d) ? d : []))
      .catch(() => setDbGuests([]));
  }, []);

  // The earlier standalone list (by phone), so types and friends set there carry over
  const oldByPhone = useMemo(() => {
    try {
      return Object.fromEntries((JSON.parse(localStorage.getItem('guestList')) ?? []).map((g) => [g.phone, g]));
    } catch {
      return {};
    }
  }, []);

  const guests = (dbGuests ?? []).map((d) => {
    const phone = normalizePhone(d.mobile);
    const prev = oldByPhone[phone] ?? {};
    return {
      id: d.id,
      // The sorter saves a one-word name as both name and family name
      name: d.name === d.familyName ? d.name : `${d.name} ${d.familyName}`.trim(),
      phone,
      party: prev.party ?? 'solo',
      plusOne: prev.plusOne,
      friends: prev.friends,
      ...settings[d.id],
      sent: d.invitationSent || Boolean(prev.sent),
    };
  });

  // Who comes along, by name: the plus one, family members or friends. One list per guest, kept when the type
  // changes; a plus one saved before this as a single name still counts.
  const names = (g) =>
    g.party === 'solo' ? [] : (g.friends ?? (g.plusOne ? [g.plusOne] : [])).slice(0, g.party === 'plusone' ? 1 : undefined);

  // Circles: a name picked or typed that matches someone in the Guest List folds that guest into the host's
  // invite, so the whole family or friend circle gets one invite. Hosts never fold into another circle.
  const isHost = (g) => names(g).some((f) => f.trim());
  const byName = new Map(guests.filter((g) => !isHost(g)).map((g) => [nameKey(g.name), g]));
  const hostOf = {};
  guests.filter(isHost).forEach((h) =>
    names(h).forEach((f) => {
      const m = byName.get(nameKey(f));
      if (m && !hostOf[m.id]) hostOf[m.id] = h;
    }),
  );
  const membersOf = (h) => guests.filter((m) => hostOf[m.id]?.id === h.id);
  const invited = (g) => g.sent || Boolean(hostOf[g.id]?.sent);

  const tick = (ids, value = true) => {
    if (!ids.length) return;
    setDbGuests((list) => list.map((d) => (ids.includes(d.id) ? { ...d, invitationSent: value } : d)));
    putSent(ids, value);
  };
  // Friends linked to a circle whose invite already went out count as invited too
  const unsynced = guests.filter((m) => !m.sent && hostOf[m.id]?.sent).map((m) => m.id).join();
  useEffect(() => {
    if (!unsynced) return;
    const ids = unsynced.split(',');
    setDbGuests((list) => list.map((d) => (ids.includes(d.id) ? { ...d, invitationSent: true } : d)));
    putSent(ids);
  }, [unsynced]);

  const link = (g) => inviteUrl(g.name, g.party, names(g));
  const text = (g) =>
    message
      .replaceAll('{name}', invitedAs(g.name, g.party, names(g)))
      .replaceAll('{hname}', invitedAs(g.name, g.party, names(g), 'hi'))
      .replaceAll('{venue}', venue)
      .replaceAll('{map}', mapsUrl)
      .replaceAll('{link}', link(g));
  const update = (id, change) => setSettings({ ...settings, [id]: { ...settings[id], ...change } });
  const setNames = (g, friends) => update(g.id, { friends });
  // Opening WhatsApp only flags the guest as waiting for confirmation; nothing is marked invited until they confirm
  const openedWhatsApp = (g) => setPending((p) => (p.includes(g.id) ? p : [...p, g.id]));
  const clearPending = (g) => setPending((p) => p.filter((id) => id !== g.id));
  // Confirming marks the guest and everyone in their circle as invited
  const confirmSent = (g) => {
    tick([g, ...membersOf(g)].filter((x) => !x.sent).map((x) => x.id));
    clearPending(g);
  };
  // Undo puts the guest and their circle back to not invited
  const revert = (g) => {
    tick([g, ...membersOf(g)].filter((x) => x.sent).map((x) => x.id), false);
    clearPending(g);
  };
  const copy = async (g) => {
    await navigator.clipboard.writeText(link(g));
    setCopied(g.id);
    setTimeout(() => setCopied(''), 1500);
  };

  // Counts are people; the list shows one row per invite (a circle's friends sit on the host's row)
  const sentCount = guests.filter(invited).length;
  const rows = guests.filter((g) => !hostOf[g.id]);
  const q = query.trim().toLowerCase();
  const shown = (show === 'all' ? rows : rows.filter((g) => g.sent === (show === 'sent'))).filter(
    (g) => !q || g.name.toLowerCase().includes(q) || g.phone.includes(q),
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(320px,420px)_minmax(0,1fr)] items-start">
      <p className="text-sm text-ink-dim lg:col-span-2">
        Personal links for the invitation card, sent over WhatsApp, for everyone in the Guest List. Press WhatsApp, send
        the message, then come back and confirm it was sent. To add people, sort them on the Sort tab and press Add to
        Guest List.
      </p>

      <section className="card p-5 flex flex-col gap-2 lg:sticky lg:top-20">
        <h2 className="font-semibold">Message</h2>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Filled in for each guest: {'{name}'} {'{hname}'} (name in Hindi greeting) {'{venue}'} {'{map}'} {'{link}'}
        </p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-label="Message"
          rows={18}
          className={`${box} resize-y`}
        />
      </section>

      <section className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Show guests">
          {[
            ['all', 'All', guests.length],
            ['sent', 'Invited', sentCount],
            ['pending', 'Not yet invited', guests.length - sentCount],
          ].map(([key, label, n]) => (
            <button
              key={key}
              type="button"
              aria-pressed={show === key}
              onClick={() => setShow(key)}
              className={cn(
                'inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-sm font-semibold border cursor-pointer transition-colors',
                show === key
                  ? 'bg-purple-600 text-white border-transparent'
                  : 'border-[var(--border)] text-ink-muted hover:text-vivah-ink',
              )}
            >
              {label}
              <span
                className={cn(
                  'min-w-5 px-1.5 rounded-full text-xs leading-5 text-center',
                  show === key ? 'bg-white/25' : 'bg-[var(--surface-2)]',
                )}
              >
                {n.toLocaleString('en-IN')}
              </span>
            </button>
          ))}
          <div className="relative ml-auto w-full sm:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or number"
              aria-label="Search guests"
              className={cn(box, 'w-full h-10 pl-9')}
            />
          </div>
        </div>
        {/* Friend names to pick from: guests not already in a circle */}
        <datalist id="invite-guest-names">
          {guests
            .filter((g) => !isHost(g) && !hostOf[g.id])
            .map((g) => (
              <option key={g.id} value={g.name} />
            ))}
        </datalist>
        {!dbGuests && (
          <p className="text-center py-6" style={{ color: 'var(--text-muted)' }}>
            Loading guests…
          </p>
        )}
        {dbGuests && shown.length === 0 && (
          <p className="text-center py-6" style={{ color: 'var(--text-muted)' }}>
            {guests.length ? 'No one here.' : 'No one in the Guest List yet. Sort contacts on the Sort tab and press Add to Guest List.'}
          </p>
        )}
        <div className="grid gap-3 xl:grid-cols-2">
        {shown.map((g) => (
          <div key={g.id} className="card px-4 py-3 flex flex-wrap items-center gap-x-3 gap-y-2 content-start">
            <div className="flex-1 min-w-[9rem]">
              <p className="font-semibold break-words flex flex-wrap items-center gap-2">
                {g.name}
                {g.sent ? <Badge color="green">Invited</Badge> : <Badge>Not yet</Badge>}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {g.phone ? `+${g.phone}` : 'No mobile number'}
              </p>
            </div>
            <select
              value={g.party ?? 'solo'}
              onChange={(e) => update(g.id, { party: e.target.value })}
              aria-label={`Invitation for ${g.name}`}
              className={box}
            >
              {Object.entries(PARTIES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
            {g.party !== 'solo' && (
              <div className="basis-full order-last flex flex-wrap items-center gap-2">
                {names(g).map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1">
                    <input
                      value={f}
                      onChange={(e) => setNames(g, names(g).map((x, j) => (j === i ? e.target.value : x)))}
                      autoFocus={!f}
                      list="invite-guest-names"
                      placeholder="Pick or type a name"
                      aria-label={`${ADD[g.party]} ${i + 1} for ${g.name}`}
                      className={cn(box, 'w-44', byName.has(nameKey(f)) && 'border-emerald-500 dark:border-emerald-500')}
                    />
                    <Button
                      variant="ghost"
                      aria-label={`Remove ${f || 'this name'} from ${g.name}'s invite`}
                      onClick={() => setNames(g, names(g).filter((_, j) => j !== i))}
                    >
                      <X size={14} />
                    </Button>
                  </span>
                ))}
                {!(g.party === 'plusone' && names(g).length) && (
                  <Button variant="outline" onClick={() => setNames(g, [...names(g), ''])}>
                    <Plus size={16} /> Add {ADD[g.party]}
                  </Button>
                )}
                {membersOf(g).length > 0 && (
                  <p className="basis-full text-xs" style={{ color: 'var(--text-muted)' }}>
                    From the Guest List, invited with {g.name}: {membersOf(g).map((m) => m.name).join(', ')}
                  </p>
                )}
              </div>
            )}
            <div className="basis-full order-last flex flex-wrap items-center gap-2">
              {g.phone && (
                <a
                  href={`https://api.whatsapp.com/send?phone=${g.phone}&text=${encodeURIComponent(text(g))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => !g.sent && openedWhatsApp(g)}
                  className="inline-flex items-center gap-2 h-10 rounded-lg px-4 text-sm font-medium bg-[#128c4a] text-white hover:opacity-90 cursor-pointer"
                >
                  <Send size={16} /> {g.sent ? 'Send again' : 'WhatsApp'}
                </a>
              )}
              <Button variant="outline" onClick={() => copy(g)}>
                <LinkIcon size={16} /> {copied === g.id ? 'Copied' : 'Copy link'}
              </Button>
              {g.sent && (
                <Button variant="ghost" onClick={() => revert(g)} aria-label={`Mark ${g.name} as not invited`}>
                  <Undo2 size={16} /> Mark not invited
                </Button>
              )}
            </div>
            {!g.sent && pending.includes(g.id) && (
              <div
                role="group"
                aria-label={`Confirm invite to ${g.name}`}
                className="basis-full order-last flex flex-wrap items-center gap-2 rounded-lg px-3 py-2 bg-amber-50 text-amber-900 dark:bg-amber-900/20 dark:text-amber-200"
              >
                <span className="text-sm font-medium flex-1 min-w-[10rem]">Did you send the invite?</span>
                <Button onClick={() => confirmSent(g)}>
                  <Check size={16} /> Yes, invited
                </Button>
                <Button variant="outline" onClick={() => clearPending(g)}>
                  Not sent
                </Button>
              </div>
            )}
          </div>
        ))}
        </div>
      </section>
    </div>
  );
};

export default InviteLinks;
