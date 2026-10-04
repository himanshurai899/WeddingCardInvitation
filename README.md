# Himanshu & Samiksha · Shubh Vivah

Digital wedding card for 25 November 2026, Vadodara. A QR code on the printed card
opens this site: guests tap **Open Invitation**, the Shiv and Shakti doors swing open,
and the page walks through the rasmein, the wedding night, the Saat Phere, the venue and the RSVP.

Built with React + Vite + Tailwind + framer-motion. The card is themed on Mahadev and Parvati:
Shiva's night blue of Kailash next to Parvati's sindoor and gold. Mahadev and Parvati appear only as a
sunset silhouette and a small Nandi silhouette (Pixabay), plus two old paintings from Wikimedia Commons, both public domain: a Raja Ravi Varma oleograph of Shiva, Parvati and Nandi for the Wedding Week, and M. V. Dhurandhar's torchlit "Shiva's wedding procession" for the Wedding Night. The Mithila touch is the machhli (fish pair), the Madhubani band and a Maithili welcome line (`maithili` in the config). The free images are from
[Pixabay](https://pixabay.com/service/license-summary/) (free to use, no attribution needed), resized into `public/art/`. The small symbols (trishul and damru, the
crescent, rudraksha, the Kailash range, the bel patra toran) are SVG in `src/components/art/`.
The site is laid out for phones first (checked on an iPhone 15 and an iPhone SE) and spreads into
two and three columns on tablets and laptops.

## Two looks: Shiv-Parvati or Ram-Sita

The card ships with two themes. Shiv-Parvati is the default. Ram-Sita swaps the pictures (a Ravi Varma Ram darbar on
the cover, a Madhubani Ram and Sita jaimala for the wedding week, Dhurandhar's Ram baraat for the wedding night, the
Janaki Mandir of Janakpur behind the hosts), the gate words (राम / सीता with a dhanush), the opening verse and the
crest (a rising sun instead of the crescent). Everything else, including your names, dates and venues, stays the same.

- **Preview either one:** add `?theme=ram` or `?theme=shiv` to the address. A guest link can carry it too, for example
  `?guest=Sharma%20Ji&theme=ram`.
- **Make Ram-Sita the card everyone gets:** change `DEFAULT_THEME` to `'ram'` at the top of `src/config/wedding.js`.
  The WhatsApp preview picture (`public/og.jpg`) is the Shiv cover, so say so if you want it redone for Ram.
- **Credits:** the Madhubani painting (Janakpur Art) and the Janaki Mandir photo (Rajesh Dhungana) are CC BY-SA 4.0,
  so the footer names them whenever the Ram theme is showing. Keep that line if you keep those pictures.

## Edit the details

Everything guests see (names, parents, dates, times, venues, dress code, WhatsApp number)
lives in **`src/config/wedding.js`**. Lines marked `VERIFY` still need your confirmation.

- **Music:** add a track at `public/music/shehnai.mp3` (keep it under ~2 MB). Until then the music button stays hidden.
- **RSVP:** replies go to the WhatsApp number in `rsvpWhatsApp` (currently 94081 01002).
- **Couple image:** the hero uses `public/art/couple.webp` (upscaled 4x from the image you shared).
  Swap in any other image by changing `images.couple`, or set it to `''` to go back to the drawing.
- **Pictures:** Mahadev and Parvati are listed under `art` in the config (cover, week, night, families).
  Drop a new webp into `public/art/` and point the entry at it to swap one.
- **Save the Date:** adds the wedding to Apple or Google Calendar, with the site link in the event notes.
- **Personal links:** `https://your-site.vercel.app/?guest=Sharma%20Ji` greets that guest by name on the cover and in the closing blessing, and pre-fills their name in the RSVP.
- **Guest list (`/admin`):** import a CSV or a contacts `.vcf` (iPhone: share contacts from the Contacts app; Google Contacts: export as CSV), or on Android Chrome pick from phone contacts. Each guest is invited as just them, plus one, or family (the card then reads "Sharma Ji & Family" and the RSVP guest count starts at 4), and gets a personal link plus a WhatsApp button with a Hindi and English message that includes the venue and a Maps link (edit it on the page). The list is stored in that browser only. Set `siteUrl` in the config to your final address first.

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
