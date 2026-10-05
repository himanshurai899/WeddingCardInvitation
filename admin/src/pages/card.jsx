import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, ExternalLink, Heart, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import { Button } from '@admin/components/ui/Button';
import { ConfirmDialog } from '@admin/components/ui/ConfirmDialog';
import { PageLoader } from '@admin/components/ui/Spinner';
import { useToastContext } from '@admin/components/ui/Toast';
import { applyContent } from '../../../src/config/wedding';

// The invitation card's text, edited as a form generated from the content itself: whatever the card file has
// (names, families, venue, functions, the wedding night, dress code...) shows up here, with nothing listed by hand.

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const label = (key) => key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());
// Every key any item has, so optional ones (highlight, route, tithi...) can be filled in on items that lack them
const itemShape = (arr) => (arr.every(isObject) && arr.length ? Object.assign({}, ...arr) : arr[0]);
const blank = (shape) =>
  Array.isArray(shape) ? [] : isObject(shape) ? {} : typeof shape === 'boolean' ? false : typeof shape === 'number' ? 0 : '';

// Inside list items an empty field means "leave it out", which is how the card hides a line
const prune = (v) => {
  if (Array.isArray(v)) return v.map(prune);
  if (!isObject(v)) return v;
  return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, prune(x)]));
};
const pruneItem = (v) => {
  if (!isObject(v)) return prune(v);
  const out = {};
  for (const [k, x] of Object.entries(v)) {
    const p = isObject(x) ? pruneItem(x) : prune(x);
    const empty = p === '' || p === false || (Array.isArray(p) && !p.length) || (isObject(p) && !Object.keys(p).length);
    if (!empty) out[k] = p;
  }
  return out;
};
const clean = (content) =>
  Object.fromEntries(
    Object.entries(content).map(([k, v]) => [k, Array.isArray(v) ? v.map(pruneItem) : prune(v)]),
  );

const input =
  'w-full rounded-lg border px-3 py-2 text-sm outline-none bg-[#F5F3F8] border-[rgba(15,6,18,0.10)] text-[#0F0612] dark:bg-[#2A1842] dark:border-[rgba(201,168,76,0.16)] dark:text-[#F0EBF7] focus:ring-2 focus:ring-violet-500';
const caption = 'text-xs font-semibold uppercase tracking-wide text-[#5B4A6E] dark:text-[#B8A8D4]';

function Field({ name, value, shape, onChange }) {
  const v = value === undefined ? blank(shape) : value;
  if (Array.isArray(v)) return <ListField name={name} value={v} shape={Array.isArray(shape) ? shape : v} onChange={onChange} />;
  if (isObject(v)) {
    const keys = [...new Set([...Object.keys(isObject(shape) ? shape : {}), ...Object.keys(v)])];
    return (
      <fieldset className="rounded-lg border p-3 space-y-3" style={{ borderColor: 'var(--border)' }}>
        {name && <legend className={`${caption} px-1`}>{name}</legend>}
        {keys.map((k) => (
          <Field key={k} name={label(k)} value={v[k]} shape={shape?.[k]} onChange={(x) => onChange({ ...v, [k]: x })} />
        ))}
      </fieldset>
    );
  }
  if (typeof v === 'boolean') {
    return (
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={v} onChange={(e) => onChange(e.target.checked)} /> {name}
      </label>
    );
  }
  const long = String(v).length > 70 || String(v).includes('\n');
  return (
    <label className="block space-y-1">
      {name && <span className={caption}>{name}</span>}
      {long ? (
        <textarea className={`${input} resize-y`} rows={3} value={v} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          className={input}
          type={typeof shape === 'number' ? 'number' : 'text'}
          value={v}
          onChange={(e) => onChange(typeof shape === 'number' ? Number(e.target.value) : e.target.value)}
        />
      )}
    </label>
  );
}

function ListField({ name, value, shape, onChange }) {
  const item = itemShape(shape) ?? '';
  const set = (i, x) => onChange(value.map((old, j) => (j === i ? x : old)));
  const move = (i, d) => {
    const next = [...value];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  const add = () => {
    const fresh = isObject(item) && 'key' in item ? { key: `item-${Date.now()}` } : blank(Array.isArray(item) ? [] : item);
    onChange([...value, fresh]);
  };
  const simple = !isObject(item);
  return (
    <div className="space-y-2">
      {name && <span className={caption}>{name}</span>}
      {value.map((x, i) => (
        <div key={i} className={simple ? 'flex items-start gap-1' : 'rounded-lg border p-3 space-y-2'} style={{ borderColor: 'var(--border)' }}>
          {!simple && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{x.name ?? x.event ?? x.label ?? `#${i + 1}`}</span>
              <ItemButtons i={i} count={value.length} move={move} remove={() => onChange(value.filter((_, j) => j !== i))} />
            </div>
          )}
          <div className={simple ? 'flex-1' : ''}>
            <Field value={x} shape={item} onChange={(y) => set(i, y)} />
          </div>
          {simple && <ItemButtons i={i} count={value.length} move={move} remove={() => onChange(value.filter((_, j) => j !== i))} />}
        </div>
      ))}
      <Button size="sm" variant="ghost" onClick={add}>
        <Plus size={14} /> Add
      </Button>
    </div>
  );
}

const ItemButtons = ({ i, count, move, remove }) => (
  <div className="flex shrink-0">
    <Button size="sm" variant="ghost" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
      <ArrowUp size={14} />
    </Button>
    <Button size="sm" variant="ghost" aria-label="Move down" disabled={i === count - 1} onClick={() => move(i, 1)}>
      <ArrowDown size={14} />
    </Button>
    <Button size="sm" variant="ghost" aria-label="Remove" onClick={remove}>
      <Trash2 size={14} />
    </Button>
  </div>
);

export default function CardPage() {
  const { toast } = useToastContext();
  const [data, setData] = useState(null);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const take = (d) => {
    setData((prev) => ({ ...prev, ...d }));
    setDraft(d.content);
    applyContent(d.content);
  };

  useEffect(() => {
    fetch('/api/admin/card')
      .then((r) => r.json())
      .then(take);
  }, []);

  const send = async (url, method, body) => {
    setSaving(true);
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error ?? 'Save failed');
      take(d);
      toast({ message: 'Saved. Guests see it within a minute; functions and invitation text are synced.', variant: 'success' });
    } catch (e) {
      toast({ message: e.message, variant: 'error' });
    } finally {
      setSaving(false);
      setConfirmReset(false);
    }
  };

  if (!draft) return <PageLoader />;
  const dirty = JSON.stringify(draft) !== JSON.stringify(data.content);
  const simple = Object.keys(draft).filter((k) => !isObject(draft[k]) && !Array.isArray(draft[k]));
  const groups = Object.keys(draft).filter((k) => !simple.includes(k));

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Heart size={22} aria-hidden /> Invitation Card
          </h1>
          <p className="page-subtitle">
            Everything guests read on the card. {data.updatedAt ? `Last saved ${new Date(data.updatedAt).toLocaleString('en-IN')}.` : 'Showing the card file (not edited yet).'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="/" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost">
              <ExternalLink size={14} /> View card
            </Button>
          </a>
          <Button variant="outline" onClick={() => setConfirmReset(true)}>
            <RotateCcw size={14} /> Reset to card file
          </Button>
          <Button onClick={() => send('/api/admin/card', 'PUT', JSON.stringify(clean(draft)))} loading={saving} disabled={!dirty}>
            <Save size={14} /> {dirty ? 'Save' : 'Saved'}
          </Button>
        </div>
      </div>

      <section className="card p-5 space-y-3">
        <h2 className="font-semibold">General</h2>
        {simple.map((k) => (
          <Field key={k} name={label(k)} value={draft[k]} shape={data.defaults[k]} onChange={(x) => setDraft({ ...draft, [k]: x })} />
        ))}
      </section>

      {groups.map((k) => (
        <details key={k} className="card p-5 group">
          <summary className="font-semibold cursor-pointer">{label(k)}</summary>
          <div className="pt-4">
            <Field value={draft[k]} shape={data.defaults[k]} onChange={(x) => setDraft({ ...draft, [k]: x })} />
          </div>
        </details>
      ))}

      <ConfirmDialog
        open={confirmReset}
        title="Reset to the card file?"
        message="Replaces every edit here with the proof copy in src/config/wedding.js."
        confirmLabel="Reset"
        loading={saving}
        onConfirm={() => send('/api/admin/card/reset', 'POST')}
        onClose={() => setConfirmReset(false)}
      />
    </div>
  );
}
