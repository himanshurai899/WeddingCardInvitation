import { useState, useEffect, useMemo } from 'react';
import { Send, Link as LinkIcon, Plus, X, Check, Undo2, Search, MessageSquare, Play, Square, SkipForward, Pencil, UserMinus } from 'lucide-react';
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

// For guests not on WhatsApp: short, English only (Hindi turns an SMS into the 70-character kind), same fill-ins
const DEFAULT_SMS = `Namaste {name}, with the blessings of our elders Himanshu & Samiksha are getting married on 25 Nov 2026 in Vadodara. We would love to have you with us.
Your invitation: {link}
Venue: {map}
Rai & Yadav families`;

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

// WhatsApp restricts a number that sends the same text to many chats quickly. Send all pauses after every
// BATCH WhatsApp sends, and the greeting changes from guest to guest (always the same one for the same guest).
const BATCH = 15;
const BREAK_MIN = 10;
const GREETINGS = [['Namaste', 'नमस्ते'], ['Pranam', 'प्रणाम'], ['Sadar Pranam', 'सादर प्रणाम'], ['Namaskar', 'नमस्कार']];
const greeting = (g) => GREETINGS[Math.abs([...(g.id ?? '')].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0)) % GREETINGS.length];
const ADD = { plusone: 'plus one', family: 'family member', friends: 'friend' };

const box =
  'rounded-lg border px-3 py-2 text-sm outline-none bg-[#F5F3F8] border-[rgba(15,6,18,0.10)] text-[#0F0612] dark:bg-[#2A1842] dark:border-[rgba(201,168,76,0.16)] dark:text-[#F0EBF7] focus:ring-2 focus:ring-violet-500';

// The Invite tab of the Guest Sorter: everyone sorted into the Guest List, each with their own link
const InviteLinks = () => {
  const [dbGuests, setDbGuests] = useState(null);
  // Invite type and names, by Guest List id. Saved in this browser only.
  const [settings, setSettings] = useStored('inviteSettings', {});
  const [message, setMessage] = useStored('guestMessage3', DEFAULT_MESSAGE);
  const [smsMessage, setSmsMessage] = useStored('guestSms', DEFAULT_SMS);
  // Send all: the guests left to send to and where we are. Kept so a reload carries on from the same guest.
  const [queue, setQueue] = useStored('inviteQueue', null);
  const [smsOnly, setSmsOnly] = useStored('inviteSmsOnly', false);
  // Ticks once a second during a Send all break, for the countdown
  const [now, setNow] = useState(Date.now);
  const onBreak = queue?.breakUntil > now;
  useEffect(() => {
    if (!onBreak) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [onBreak]);
  const [copied, setCopied] = useState('');
  const [editing, setEditing] = useState(null);
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

  const allGuests = (dbGuests ?? []).map((d) => {
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
      // A name edited here (settings name) replaces this one in the link and the message
      ...settings[d.id],
      sent: d.invitationSent || Boolean(prev.sent),
    };
  });
  // Removed from the invite list (they stay in the Guest List), and can be put back from the Removed filter
  const guests = allGuests.filter((g) => !g.removed);
  const removed = allGuests.filter((g) => g.removed);

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

  const link = (g) => inviteUrl(g.name, g.party, names(g), g.prime);
  const fill = (template, g) =>
    template
      // A different greeting from guest to guest, so a run isn't hundreds of identical messages
      .replaceAll('Namaste {name}', `${greeting(g)[0]} {name}`)
      .replaceAll('नमस्ते {hname}', `${greeting(g)[1]} {hname}`)
      .replaceAll('{name}', invitedAs(g.name, g.party, names(g)))
      .replaceAll('{hname}', invitedAs(g.name, g.party, names(g), 'hi'))
      .replaceAll('{venue}', venue)
      .replaceAll('{map}', mapsUrl)
      .replaceAll('{link}', link(g));
  // Guests marked not on WhatsApp get the SMS instead. sms:NUMBER?&body= opens Messages prefilled on both iPhone and Android.
  // While WhatsApp has the number restricted, everyone goes by SMS
  const bySms = (g) => g.noWa || smsOnly;
  const sendUrl = (g) =>
    bySms(g)
      ? `sms:+${g.phone}?&body=${encodeURIComponent(fill(smsMessage, g))}`
      : `https://api.whatsapp.com/send?phone=${g.phone}&text=${encodeURIComponent(fill(message, g))}`;
  const sendProps = (g) => ({ href: sendUrl(g), ...(bySms(g) ? {} :{ target: '_blank', rel: 'noopener noreferrer' }) });
  const smsLength = fill(smsMessage, guests[0] ?? { name: 'Sharma Ji', party: 'solo' }).length;
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
  const copy = async (g, what = 'link') => {
    await navigator.clipboard.writeText(what === 'sms' ? fill(smsMessage, g) : link(g));
    setCopied(g.id + what);
    setTimeout(() => setCopied(''), 1500);
  };

  // Counts are people; the list shows one row per invite (a circle's friends sit on the host's row)
  const sentCount = guests.filter(invited).length;
  const rows = guests.filter((g) => !hostOf[g.id]);
  const q = query.trim().toLowerCase();
  const filters = { all: () => true, sent: (g) => g.sent, pending: (g) => !g.sent, nowa: (g) => g.noWa };
  const shown = (show === 'removed' ? removed : rows.filter(filters[show] ?? filters.all)).filter(
    (g) => !q || g.name.toLowerCase().includes(q) || g.phone.includes(q),
  );

  // Send all goes through everyone shown (so a filter or search narrows it) who is not invited yet and has a number.
  // Each one still needs a tap on Send in WhatsApp or Messages: a website can't send from your own number by itself.
  const toSend = shown.filter((g) => !g.sent && g.phone && !g.removed);
  const byId = new Map(guests.map((g) => [g.id, g]));
  const cur = queue && byId.get(queue.ids[queue.i]);
  const nextUp = queue && byId.get(queue.ids[queue.i + 1]);
  const advance = (opened = false, more = {}) =>
    setQueue((qu) => (qu && qu.i + 1 < qu.ids.length ? { ...qu, ...more, i: qu.i + 1, opened } : null));
  const openCur = () => {
    openedWhatsApp(cur);
    setQueue({ ...queue, opened: true });
  };
  // WhatsApp messages sent in this run, counting this one. SMS don't count towards the break.
  const waCount = cur ? (queue.waCount ?? 0) + (bySms(cur) ? 0 : 1) : 0;
  const breakDue = Boolean(cur && nextUp && !bySms(cur) && waCount % BATCH === 0);
  // One tap confirms this guest and opens the next one's chat
  const sentOpenNext = () => {
    confirmSent(cur);
    openedWhatsApp(nextUp);
    advance(true, { waCount });
  };
  // Every BATCH WhatsApp sends, confirm and wait instead of opening the next chat
  const sentTakeBreak = () => {
    confirmSent(cur);
    advance(false, { waCount, breakUntil: Date.now() + BREAK_MIN * 60000 });
    setNow(Date.now());
  };
  const left = Math.max(0, Math.ceil(((queue?.breakUntil ?? 0) - now) / 1000));
  const notOnWhatsApp = (g) => {
    update(g.id, { noWa: true });
    clearPending(g);
    if (cur?.id === g.id) setQueue({ ...queue, opened: false });
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-ink-dim">
        Personal links for the invitation card, sent over WhatsApp, for everyone in the Guest List. Set each guest up,
        then press Send all: it opens one chat after another, you press Send in WhatsApp, and one tap here marks them
        invited and opens the next. Guests not on WhatsApp get the SMS instead. To add people, sort them on the Sort tab and press Add to
        Guest List.
      </p>

      {/* Set once, so it folds away and the guests get the full width */}
      <details className="card p-5 group">
        <summary className="font-semibold cursor-pointer select-none">
          Messages: WhatsApp and SMS
          <span className="ml-2 text-xs font-normal" style={{ color: 'var(--text-muted)' }}>
            tap to edit
          </span>
        </summary>
        <div className="grid gap-x-6 gap-y-2 mt-3 lg:grid-cols-2 items-start">
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold">WhatsApp</h2>
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
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold">SMS, for guests not on WhatsApp</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Same fill-ins. Keep it short and in English: about {smsLength} characters, {Math.ceil(smsLength / 153)} SMS.
            </p>
            <textarea
              value={smsMessage}
              onChange={(e) => setSmsMessage(e.target.value)}
              aria-label="SMS message"
              rows={6}
              className={`${box} resize-y`}
            />
          </div>
        </div>
      </details>

      <section className="flex flex-col gap-2">
        {queue && dbGuests && !cur && (
          <div className="card px-4 py-3 flex items-center gap-2">
            <span className="flex-1 text-sm">The guest this run was on is no longer in the list.</span>
            <Button variant="outline" onClick={() => advance()}>Next</Button>
            <Button variant="ghost" onClick={() => setQueue(null)}>Stop</Button>
          </div>
        )}
        {cur && (
          <div
            role="group"
            aria-label="Send all"
            className="card px-4 py-3 flex flex-wrap items-center gap-2 border-2 border-[#128c4a]/50 sticky top-16 z-10"
          >
            <div className="basis-full flex flex-wrap items-baseline gap-x-2">
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                Sending {queue.i + 1} of {queue.ids.length}
              </span>
              <span className="font-semibold">{invitedAs(cur.name, cur.party, names(cur))}</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                +{cur.phone} · {bySms(cur) ? 'SMS' : 'WhatsApp'}
              </span>
            </div>
            {!queue.opened && onBreak && !bySms(cur) ? (
              <>
                <span className="text-sm flex-1 min-w-[12rem]">
                  Short break so WhatsApp doesn&apos;t flag the number. Next chat in{' '}
                  <b>{Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}</b>
                </span>
                <Button variant="ghost" onClick={() => setQueue({ ...queue, breakUntil: 0 })}>
                  Skip break
                </Button>
              </>
            ) : !queue.opened ? (
              <>
                <a
                  {...sendProps(cur)}
                  onClick={openCur}
                  className="inline-flex items-center gap-2 h-10 rounded-lg px-4 text-sm font-medium bg-[#128c4a] text-white hover:opacity-90 cursor-pointer"
                >
                  {bySms(cur) ? <MessageSquare size={16} /> : <Send size={16} />} {bySms(cur) ? 'Open SMS' : 'Open WhatsApp'}
                </a>
                <Button variant="outline" onClick={() => advance()}>
                  <SkipForward size={16} /> Skip
                </Button>
              </>
            ) : (
              <>
                <span className="basis-full text-sm">Pressed Send? Then:</span>
                {breakDue ? (
                  <Button onClick={sentTakeBreak}>
                    <Check size={16} /> Sent, take a {BREAK_MIN} min break
                  </Button>
                ) : nextUp ? (
                  <a
                    {...sendProps(nextUp)}
                    onClick={sentOpenNext}
                    className="inline-flex items-center gap-2 h-10 rounded-lg px-4 text-sm font-medium bg-[#128c4a] text-white hover:opacity-90 cursor-pointer"
                  >
                    <Check size={16} /> Sent, open {nextUp.name.split(' ')[0]}
                  </a>
                ) : (
                  <Button onClick={() => { confirmSent(cur); setQueue(null); }}>
                    <Check size={16} /> Sent, all done
                  </Button>
                )}
                <Button variant="outline" onClick={() => { clearPending(cur); advance(); }}>
                  Not sent, skip
                </Button>
                <a {...sendProps(cur)} className="text-sm underline cursor-pointer px-1">Open again</a>
              </>
            )}
            {bySms(cur) ? (
              <Button variant="ghost" onClick={() => copy(cur, 'sms')}>
                {copied === cur.id + 'sms' ? 'Copied' : 'Copy SMS'}
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => notOnWhatsApp(cur)}>
                Not on WhatsApp
              </Button>
            )}
            <Button variant="ghost" onClick={() => setQueue(null)} className="ml-auto">
              <Square size={14} /> Stop
            </Button>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Show guests">
          {[
            ['all', 'All', guests.length],
            ['sent', 'Invited', sentCount],
            ['pending', 'Not yet invited', guests.length - sentCount],
            ['nowa', 'Not on WhatsApp', rows.filter(filters.nowa).length],
            ...(removed.length || show === 'removed' ? [['removed', 'Removed', removed.length]] : []),
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
          {!queue && (
            <Button
              onClick={() => setQueue({ ids: toSend.map((g) => g.id), i: 0, opened: false })}
              disabled={!toSend.length}
            >
              <Play size={16} /> Send all ({toSend.length})
            </Button>
          )}
          <label className="inline-flex items-center gap-1.5 text-sm cursor-pointer">
            <input type="checkbox" checked={smsOnly} onChange={(e) => setSmsOnly(e.target.checked)} className="accent-amber-500" />
            WhatsApp restricted: send by SMS for now
          </label>
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
        <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
        {shown.map((g) => g.removed ? (
          <div key={g.id} className="card px-4 py-3 flex flex-wrap items-center gap-3">
            <p className="flex-1 min-w-[9rem] font-semibold break-words">
              {g.name}
              <span className="block text-xs font-normal" style={{ color: 'var(--text-muted)' }}>
                {g.phone ? `+${g.phone}` : 'No mobile number'} · not on the invite list
              </span>
            </p>
            <Button variant="outline" onClick={() => update(g.id, { removed: false })}>
              <Undo2 size={16} /> Put back
            </Button>
          </div>
        ) : (
          <div key={g.id} className="card px-4 py-3 flex flex-wrap items-center gap-x-3 gap-y-2 content-start">
            <div className="flex-1 min-w-[9rem]">
              <div className="font-semibold break-words flex flex-wrap items-center gap-2">
                {editing?.id === g.id ? (
                  <form
                    className="flex flex-wrap items-center gap-1"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (editing.value.trim()) update(g.id, { name: editing.value.trim().slice(0, 40) });
                      setEditing(null);
                    }}
                  >
                    <input
                      value={editing.value}
                      onChange={(e) => setEditing({ id: g.id, value: e.target.value })}
                      onKeyDown={(e) => e.key === 'Escape' && setEditing(null)}
                      autoFocus
                      maxLength={40}
                      aria-label={`Name on the invite for ${g.name}`}
                      className={cn(box, 'w-48 font-normal')}
                    />
                    <Button type="submit" aria-label="Save name"><Check size={16} /></Button>
                    <Button type="button" variant="ghost" aria-label="Cancel" onClick={() => setEditing(null)}><X size={16} /></Button>
                  </form>
                ) : (
                  <>
                    {g.name}
                    <button
                      type="button"
                      onClick={() => setEditing({ id: g.id, value: g.name })}
                      aria-label={`Edit the name on ${g.name}'s invite`}
                      className="opacity-60 hover:opacity-100 cursor-pointer"
                    >
                      <Pencil size={14} />
                    </button>
                  </>
                )}
                {g.sent ? <Badge color="green">Invited</Badge> : <Badge>Not yet</Badge>}
                {g.prime && <Badge color="yellow">Prime</Badge>}
                {g.noWa && <Badge color="orange">No WhatsApp</Badge>}
              </div>
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
            <label className="inline-flex items-center gap-1.5 text-sm cursor-pointer" title="Gold zari card that tells them they are on the Prime list">
              <input type="checkbox" checked={Boolean(g.prime)} onChange={(e) => update(g.id, { prime: e.target.checked })} className="accent-amber-500" />
              Prime
            </label>
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
                  {...sendProps(g)}
                  onClick={() => !g.sent && openedWhatsApp(g)}
                  className="inline-flex items-center gap-2 h-10 rounded-lg px-4 text-sm font-medium bg-[#128c4a] text-white hover:opacity-90 cursor-pointer"
                >
                  {bySms(g) ? <MessageSquare size={16} /> : <Send size={16} />} {g.sent ? 'Send again' : bySms(g) ? 'SMS' : 'WhatsApp'}
                </a>
              )}
              {g.phone && bySms(g) && (
                <Button variant="outline" onClick={() => copy(g, 'sms')}>
                  {copied === g.id + 'sms' ? 'Copied' : 'Copy SMS'}
                </Button>
              )}
              {g.phone && (
                <Button
                  variant="ghost"
                  onClick={() => (g.noWa ? update(g.id, { noWa: false }) : notOnWhatsApp(g))}
                  aria-label={g.noWa ? `${g.name} is on WhatsApp` : `${g.name} is not on WhatsApp`}
                >
                  {g.noWa ? 'On WhatsApp after all' : 'Not on WhatsApp'}
                </Button>
              )}
              <Button variant="outline" onClick={() => copy(g)}>
                <LinkIcon size={16} /> {copied === g.id + 'link' ? 'Copied' : 'Copy link'}
              </Button>
              {g.sent && (
                <Button variant="ghost" onClick={() => revert(g)} aria-label={`Mark ${g.name} as not invited`}>
                  <Undo2 size={16} /> Mark not invited
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => { update(g.id, { removed: true }); clearPending(g); }}
                aria-label={`Remove ${g.name} from the invite list`}
                className="ml-auto"
              >
                <UserMinus size={16} /> Remove
              </Button>
            </div>
            {!g.sent && pending.includes(g.id) && cur?.id !== g.id && (
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
