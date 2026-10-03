# Himanshu & Samiksha · Shubh Vivah

Digital wedding card for 25 November 2026, Vadodara. A QR code on the printed card
opens this site: guests tap **Open Invitation**, the Shiv and Shakti doors swing open,
and the page walks through the rasmein, the wedding night, the Saat Phere, the venue and the RSVP.

Built with React + Vite + Tailwind + framer-motion. The card is themed on Mahadev and Parvati:
Shiva's night blue of Kailash next to Parvati's sindoor and gold. Mahadev and Parvati appear only as a
sunset silhouette, one realistic night scene and a small Nandi silhouette. All are free images from
[Pixabay](https://pixabay.com/service/license-summary/) (free to use, no attribution needed), resized into `public/art/`. The small symbols (trishul and damru, the
crescent, rudraksha, the Kailash range, the bel patra toran) are SVG in `src/components/art/`.
The site is laid out for phones first (checked on an iPhone 15 and an iPhone SE) and spreads into
two and three columns on tablets and laptops.

## Edit the details

Everything guests see (names, parents, dates, times, venues, dress code, WhatsApp number)
lives in **`src/config/wedding.js`**. Lines marked `VERIFY` still need your confirmation.

- **Music:** add a track at `public/music/shehnai.mp3` (keep it under ~2 MB). Until then the music button stays hidden.
- **RSVP:** replies go to the WhatsApp number in `rsvpWhatsApp` (currently 94081 01002).
- **Couple image:** the hero uses `public/art/couple.webp` (upscaled 4x from the image you shared).
  Swap in any other image by changing `images.couple`, or set it to `''` to go back to the drawing.
- **Pictures:** Mahadev and Parvati are listed under `art` in the config (cover, wedding night, families).
  Drop a new webp into `public/art/` and point the entry at it to swap one.
- **Save the Date:** adds the wedding to Apple or Google Calendar, with the site link in the event notes.
- **Personal links:** `https://your-site.vercel.app/?guest=Sharma%20Ji` greets that guest by name on the cover.

## Run locally

```bash
npm install
npm run dev
```

## Deploy on Vercel (free tier)

1. Push this folder to a GitHub repository.
2. On vercel.com → **Add New Project** → import the repo. Vercel detects Vite; keep the defaults
   (build `npm run build`, output `dist`) and deploy.
3. Optionally rename the project (Settings → Domains) to get a nicer address such as `himanshu-samiksha.vercel.app`.
4. In `index.html`, add the `og:image` line with your final address so WhatsApp shows the preview card, and redeploy.

## QR code for the printed card

```bash
npm run qr
```

This writes `qr/wedding-qr.svg` (vector, send this one to the printer) and `qr/wedding-qr.png` (2000 px),
pointing at <https://himanshu-samiksha-vivah.vercel.app>. The code is drawn in the card's maroon and gold,
with round dots, leaf-shaped corners and an H & S medallion in the middle. To point it somewhere else,
pass the address: `npm run qr -- https://another-address.app`.
Print it at least 2.5 × 2.5 cm, and scan a printed proof on both an Android and an iPhone before the full run.
Settle the final URL first: the QR can't change once the cards are printed.

---

Card concept adapted from Sneha Paulraj's wedding card; styling inspired by the Shweta & Narendra invitation.
