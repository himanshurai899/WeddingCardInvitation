import { useEffect, useState } from 'react';
import { Image, ExternalLink, Play, X, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { PageLoader } from '@admin/components/ui/Spinner';
import { cn } from '@admin/lib/utils/cn';

// Photos live in the Google Drive folder (see galleryFolder in the card config). Drive serves resized copies,
// so the grid stays light; a tap opens a large one, with a link to the full-size file.
const thumb = (id, width) => `https://drive.google.com/thumbnail?id=${id}&sz=w${width}`;
const fileUrl = (id) => `https://drive.google.com/file/d/${id}/view`;
const folderUrl = (id) => `https://drive.google.com/drive/folders/${id}`;

// A page visit takes the kept copy (re-read from Drive every 6 hours); Sync asks Drive directly and updates it
const fetchGallery = (fresh) =>
  fetch(fresh ? `/api/gallery?fresh=${Date.now()}` : '/api/gallery')
    .then((r) => r.json())
    .catch((e) => ({ albums: [], error: String(e.message ?? e) }));

export default function GalleryPage() {
  const [data, setData] = useState(null);
  const [album, setAlbum] = useState(0);
  const [open, setOpen] = useState(null); // index of the photo shown large
  const [syncedAt, setSyncedAt] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const show = (d) => {
    setData(d);
    setAlbum((a) => Math.min(a, Math.max(0, d.albums.length - 1))); // an album may have gone
    setSyncedAt(d.syncedAt ? new Date(d.syncedAt) : null);
  };
  useEffect(() => {
    fetchGallery().then(show);
  }, []);
  const sync = () => {
    setSyncing(true);
    fetchGallery(true)
      .then(show)
      .finally(() => setSyncing(false));
  };

  const photos = data?.albums[album]?.photos ?? [];
  const shown = open === null ? null : photos[open];
  const step = (by) => setOpen((i) => (i + by + photos.length) % photos.length);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!data) return <PageLoader />;
  const total = data.albums.reduce((s, a) => s + a.photos.length, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Image size={20} className="text-violet-600" /> Photo Gallery
          </h1>
          <p className="text-sm text-gray-500">
            Photos from the wedding folder on Google Drive. Add them there, then press Sync.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {syncedAt && (
            <span className="text-xs text-gray-500">
              Synced {syncedAt.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}
            </span>
          )}
          <button
            type="button"
            onClick={sync}
            disabled={syncing}
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw size={15} className={cn(syncing && 'animate-spin')} /> {syncing ? 'Syncing…' : 'Sync'}
          </button>
          {data.folder && (
            <a
              href={folderUrl(data.folder)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-violet-300 px-3 py-2 text-sm font-medium text-violet-700 hover:bg-violet-50"
            >
              <ExternalLink size={15} /> Open Drive folder
            </a>
          )}
        </div>
      </div>

      {data.configured === false && (
        <div className="card p-5 text-sm space-y-2">
          <p className="font-semibold">One step left: an API key so the site can read the Drive folder.</p>
          <ol className="list-decimal pl-5 space-y-1 text-gray-600">
            <li>In Google Cloud Console, create a project and enable the Google Drive API.</li>
            <li>Under APIs &amp; Services → Credentials, create an API key (it starts with AIza) and restrict it to the Drive API.</li>
            <li>In Vercel, Settings → Environment Variables, add GOOGLE_DRIVE_API_KEY with that key, then redeploy.</li>
          </ol>
        </div>
      )}

      {data.error && (
        <p className="card p-4 text-sm text-red-600" role="alert">
          Couldn't read the Drive folder. Check it's shared as "Anyone with the link" and the API key is allowed to use
          the Drive API. ({data.error})
        </p>
      )}

      {data.configured && !data.error && total === 0 && (
        <div className="card p-10 text-center text-sm text-gray-500">
          The folder is empty. Make a folder per function inside it (Haldi, Garba, Wedding…) and add photos; each
          folder becomes an album here.
        </div>
      )}

      {total > 0 && (
        <>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Albums">
            {data.albums.map((a, i) => (
              <button
                key={a.id}
                type="button"
                role="tab"
                aria-selected={album === i}
                onClick={() => setAlbum(i)}
                className={cn(
                  'inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-sm font-semibold border cursor-pointer transition-colors',
                  album === i ? 'bg-violet-600 text-white border-transparent' : 'border-gray-200 text-gray-600 hover:text-gray-900',
                )}
              >
                {a.name}
                <span className={cn('min-w-5 px-1.5 rounded-full text-xs leading-5', album === i ? 'bg-white/25' : 'bg-gray-100')}>
                  {a.photos.length}
                </span>
              </button>
            ))}
          </div>

          {photos.length === 0 ? (
            <p className="card p-8 text-center text-sm text-gray-500">No photos in this album yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {photos.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setOpen(i)}
                  className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                  aria-label={`Open ${p.name}`}
                >
                  <img
                    src={thumb(p.id, 500)}
                    alt={p.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  {p.video && (
                    <span className="absolute inset-0 grid place-items-center bg-black/25 text-white">
                      <Play size={28} fill="currentColor" aria-hidden />
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {shown && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={shown.name}
          onClick={() => setOpen(null)}
        >
          <div className="flex items-center gap-3 p-3 text-white text-sm" onClick={(e) => e.stopPropagation()}>
            <span className="flex-1 truncate opacity-80">
              {open + 1} / {photos.length} · {shown.name}
            </span>
            <a href={fileUrl(shown.id)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              <ExternalLink size={15} /> Full size
            </a>
            <button type="button" onClick={() => setOpen(null)} aria-label="Close" className="p-1 cursor-pointer">
              <X size={22} />
            </button>
          </div>
          <div className="flex-1 min-h-0 flex items-center justify-center gap-2 px-2 pb-4" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => step(-1)} aria-label="Previous" className="p-2 text-white/80 hover:text-white cursor-pointer">
              <ChevronLeft size={32} />
            </button>
            {shown.video ? (
              <iframe
                src={`https://drive.google.com/file/d/${shown.id}/preview`}
                title={shown.name}
                allow="autoplay; fullscreen"
                className="h-full w-full max-w-5xl rounded-lg bg-black"
              />
            ) : (
              <img
                key={shown.id}
                src={thumb(shown.id, 2000)}
                alt={shown.name}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain rounded-lg"
              />
            )}
            <button type="button" onClick={() => step(1)} aria-label="Next" className="p-2 text-white/80 hover:text-white cursor-pointer">
              <ChevronRight size={32} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
