// Traditional Indian miniature paintings from The Met's Open Access collection
// (public domain), shown the way they'd hang in a haveli: gold-framed or in an arched jharokha.

export const FramedPainting = ({ src, alt, caption, className = '', eager = false }) => (
  <figure className={className}>
    <div className="rounded-sm bg-gradient-to-br from-gold-bright via-gold to-gold-dark p-[5px] shadow-[0_12px_30px_rgba(92,20,32,.25)]">
      <div className="border-[3px] border-maroon-deep">
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className="block w-full h-auto"
        />
      </div>
    </div>
    {caption && (
      <figcaption className="mt-2 text-center text-[11px] italic leading-snug text-ink-soft">{caption}</figcaption>
    )}
  </figure>
);

export const Vignette = ({ src, alt = '', className = '', fit = 'cover' }) => (
  <div className={`relative aspect-[4/5] overflow-hidden rounded-t-full bg-cream-card border-[3px] border-gold shadow-[0_8px_20px_rgba(92,20,32,.2)] ${className}`}>
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`absolute inset-0 w-full h-full ${fit === 'contain' ? 'object-contain mix-blend-multiply p-1' : 'object-cover'}`}
    />
    <span className="pointer-events-none absolute inset-[5px] rounded-t-full border border-gold-pale/70" aria-hidden="true" />
  </div>
);
