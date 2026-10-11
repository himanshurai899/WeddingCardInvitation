import { useState, useEffect, useMemo } from 'react';
import { Send, Link as LinkIcon, Plus, X } from 'lucide-react';
import { Button } from '@admin/components/ui/Button';
import { Badge } from '@admin/components/ui/Badge';
import { cn } from '@admin/lib/utils/cn';
import { wedding, mapsUrl } from '../../../src/config/wedding';
import { inviteUrl, invitedAs, normalizePhone, PARTIES } from '../../../src/lib/guests';

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

// Ticks Invitation Sent, the same flag the Guests page shows
const putSent = (ids) =>
  ids.forEach((id) =>
    fetch(`/api/admin/guests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invitationSent: true }),
    }).catch(() => {}),
  );
const nameKey = (n) => (n ?? '').trim().toLowerCase();

const box =
  'rounded-lg border px-3 py-2 text-sm outline-none bg-[#F5F3F8] border-[rgba(15,6,18,0.10)] text-[#0F0612] dark:bg-[#2A1842] dark:border-[rgba(201,168,76,0.16)] dark:text-[#F0EBF7] focus:ring-2 focus:ring-violet-500';

// The Invite tab of the Guest Sorter: everyone sorted into the Guest List, each with their own link
const InviteLinks = () => {
  const [dbGuests, setDbGuests] = useState(null);
  // Invite type and names, by Guest List id. Saved in this browser only.
  const [settings, setSettings] = useStored('inviteSettings', {});
  const [message, setMessage] = useStored('guestMessage2', DEFAULT_MESSAGE);
  const [copied, setCopied] = useState('');
  const [show, setShow] = useState('all');

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

  // Friend circles: a friend picked or typed with the same name as someone in the Guest List folds that
  // guest into the circle, so the whole circle gets one invite. Hosts never fold into another circle.
  const isHost = (g) => g.party === 'friends' && (g.friends ?? []).some((f) => f.trim());
  const byName = new Map(guests.filter((g) => !isHost(g)).map((g) => [nameKey(g.name), g]));
  const hostOf = {};
  guests.filter(isHost).forEach((h) =>
    h.friends.forEach((f) => {
      const m = byName.get(nameKey(f));
      if (m && !hostOf[m.id]) hostOf[m.id] = h;
    }),
  );
  const membersOf = (h) => guests.filter((m) => hostOf[m.id]?.id === h.id);
  const invited = (g) => g.sent || Boolean(hostOf[g.id]?.sent);

  const tick = (ids) => {
    if (!ids.length) return;
    setDbGuests((list) => list.map((d) => (ids.includes(d.id) ? { ...d, invitationSent: true } : d)));
    putSent(ids);
  };
  // Friends linked to a circle whose invite already went out count as invited too
  const unsynced = guests.filter((m) => !m.sent && hostOf[m.id]?.sent).map((m) => m.id).join();
  useEffect(() => {
    if (!unsynced) return;
    const ids = unsynced.split(',');
    setDbGuests((list) => list.map((d) => (ids.includes(d.id) ? { ...d, invitationSent: true } : d)));
    putSent(ids);
  }, [unsynced]);

  // Who comes along: the plus one's name, or the list of friends
  const others = (g) => (g.party === 'friends' ? g.friends : g.plusOne);
  const link = (g) => inviteUrl(g.name, g.party, others(g));
  const text = (g) =>
    message
      .replaceAll('{name}', invitedAs(g.name, g.party, others(g)))
      .replaceAll('{hname}', invitedAs(g.name, g.party, others(g), 'hi'))
      .replaceAll('{venue}', venue)
      .replaceAll('{map}', mapsUrl)
      .replaceAll('{link}', link(g));
  const update = (id, change) => setSettings({ ...settings, [id]: { ...settings[id], ...change } });
  const setFriends = (g, friends) => update(g.id, { friends });
  // Sending marks the guest and everyone in their friend circle as invited
  const markSent = (g) => tick([g, ...membersOf(g)].filter((x) => !x.sent).map((x) => x.id));
  const copy = async (g) => {
    await navigator.clipboard.writeText(link(g));
    setCopied(g.id);
    setTimeout(() => setCopied(''), 1500);
  };

  // Counts are people; the list shows one row per invite (a circle's friends sit on the host's row)
  const sentCount = guests.filter(invited).length;
  const rows = guests.filter((g) => !hostOf[g.id]);
  const shown = show === 'all' ? rows : rows.filter((g) => g.sent === (show === 'sent'));

  return (
    <div className="space-y-6 max-w-3xl">
      <p className="text-sm text-ink-dim">
        Personal links for the invitation card, sent over WhatsApp, for everyone in the Guest List. To add people, sort
        them on the Sort tab and press Add to Guest List.
      </p>

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
        <div className="flex flex-wrap gap-2" role="group" aria-label="Show guests">
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
        {shown.map((g) => (
          <div key={g.id} className="card px-4 py-3 flex flex-wrap items-center gap-x-3 gap-y-2">
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
            {g.party === 'plusone' && (
              <input
                value={g.plusOne ?? ''}
                onChange={(e) => update(g.id, { plusOne: e.target.value })}
                placeholder="Plus one's name (optional)"
                aria-label={`Plus one's name for ${g.name}`}
                className={`${box} w-48`}
              />
            )}
            {g.party === 'friends' && (
              <div className="basis-full order-last flex flex-wrap items-center gap-2">
                {(g.friends ?? []).map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1">
                    <input
                      value={f}
                      onChange={(e) => setFriends(g, g.friends.map((x, j) => (j === i ? e.target.value : x)))}
                      autoFocus={!f}
                      list="invite-guest-names"
                      placeholder="Pick or type a name"
                      aria-label={`Friend ${i + 1} of ${g.name}`}
                      className={cn(box, 'w-44', byName.has(nameKey(f)) && 'border-emerald-500 dark:border-emerald-500')}
                    />
                    <Button
                      variant="ghost"
                      aria-label={`Remove friend ${i + 1} of ${g.name}`}
                      onClick={() => setFriends(g, g.friends.filter((_, j) => j !== i))}
                    >
                      <X size={14} />
                    </Button>
                  </span>
                ))}
                <Button variant="outline" onClick={() => setFriends(g, [...(g.friends ?? []), ''])}>
                  <Plus size={16} /> Add friend
                </Button>
                {membersOf(g).length > 0 && (
                  <p className="basis-full text-xs" style={{ color: 'var(--text-muted)' }}>
                    From the Guest List, invited with {g.name}: {membersOf(g).map((m) => m.name).join(', ')}
                  </p>
                )}
              </div>
            )}
            {g.phone && (
              <a
                href={`https://wa.me/${g.phone}?text=${encodeURIComponent(text(g))}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => markSent(g)}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-[#128c4a] text-white hover:opacity-90"
              >
                <Send size={16} /> {g.sent ? 'Send again' : 'WhatsApp'}
              </a>
            )}
            <Button variant="outline" onClick={() => copy(g)}>
              <LinkIcon size={16} /> {copied === g.id ? 'Copied' : 'Copy link'}
            </Button>
          </div>
        ))}
      </section>
    </div>
  );
};

export default InviteLinks;
