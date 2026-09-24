// Every name, date, venue and line of copy on the card lives here.
// Lines marked VERIFY still need a final check before the card goes out.

const home = {
  label: 'Rai family home, Gotri',
  address: 'B/144 Yoginagar Township, Near Swaminarayan High School, Gotri, Vadodara 390021',
  mapsQuery: 'B/144 Yoginagar Township, Near Swaminarayan High School, Gotri, Vadodara 390021',
};

export const wedding = {
  groom: {
    name: 'Himanshu',
    fullName: 'Himanshu Rai',
    parents: 'Shri Ramshlok Rai & Smt. Asha Devi',
    home: 'Gotri, Vadodara',
    family: 'Rai Parivar',
    familyHindi: 'राय',
    address: home,
  },
  bride: {
    name: 'Samiksha',
    fullName: 'Samiksha Yadav',
    parents: '', // VERIFY: add Samiksha's parents
    home: '',
    family: 'Yadav Parivar',
    familyHindi: 'यादव',
  },

  // Shubh muhurat, used by the countdown
  muhurat: '2026-11-25T20:00:00+05:30',
  // What "Save the Date" puts in the guest's calendar: baraat to the end of the pheras
  calendar: {
    start: '2026-11-25T17:00:00+05:30',
    end: '2026-11-25T23:30:00+05:30',
  },
  city: 'Vadodara, Gujarat',

  venue: {
    name: 'Purshottam Party Plot',
    address: 'Millennium Northway, Kabir Rd, opp. Navrachna University, Bhayli, Vadodara, Gujarat 391410',
    mapsQuery: 'Purshottam Party Plot, Bhayli, Vadodara',
  },
  home,

  engagement: { date: '2026-02-09', place: 'Surbhi Hotel, Gadarwada' },

  // "Bal Manuhar", the kids' request printed on North Indian wedding cards
  balManuhar: {
    hindi: 'मेरे भैया की शादी में ज़रूर-ज़रूर आना!',
    english: "You have to come to my bhaiya's wedding. No excuses!",
    from: 'The kids of the family',
  },

  // RSVPs arrive on this WhatsApp number (digits only, with country code)
  rsvpWhatsApp: '919408101002',

  // Drop a shehnai or vivah geet track at public/music/shehnai.mp3.
  // The music button hides itself until the file is there.
  music: '/music/shehnai.mp3',

  // Optional: your own artwork instead of the drawn SVGs. Put the file in public/art/.
  // The couple image sits inside the gold arch; a light background blends away.
  // couple.webp is the shared image upscaled 4x (Real-ESRGAN) with its background whitened.
  images: {
    couple: '/art/couple.webp',
  },

  // Indian miniature paintings from The Met's Open Access collection (public domain, free to use)
  paintings: {
    elephantCover: '/art/elephant-alam.webp', // Portrait of the Elephant 'Alam Guman, Mughal, ca. 1640
    elephantFamilies: '/art/elephant-adil.webp', // Sultan Muhammad 'Adil Shah riding an elephant, Bijapur, ca. 1645
    baraat: {
      src: '/art/baraat.webp',
      caption: 'Maharana Jagat Singh II in a wedding procession, Udaipur, 1738 to 1740',
    },
    night: {
      src: '/art/night-procession.webp',
      caption: 'Wedding procession of Sultan Muhammad Quli Qutb Shah, Golconda, about 1650',
    },
    finale: {
      src: '/art/yamuna.webp',
      caption: 'Krishna and the gopis by the Yamuna, Tehri Garhwal, about 1775',
    },
  },

  // Guest functions in order. `image` is the painting shown beside it; without one, `icon`
  // picks a drawing (mandap, haldi, mehendi, tilak, vivah, sangeet, matkor, reception).
  // Empty `time` or `venue` hides that line.
  // `mapsQuery` turns the venue into a directions link.
  functions: [
    {
      key: 'mandap',
      name: 'Mandap Muhurat',
      hindi: 'मंडप मुहूर्त',
      date: '2026-11-22',
      time: '', // VERIFY: add the muhurat time
      venue: '', // VERIFY: add the venue (home?)
      icon: 'mandap',
      image: '/art/v-mandap-muhurat.webp',
      about: 'The mandap goes up with a small puja. This is where all the wedding rituals begin.',
    },
    {
      key: 'haldi',
      name: 'Haldi',
      hindi: 'हल्दी',
      date: '2026-11-22',
      time: '', // VERIFY: add the time
      venue: home.label,
      mapsQuery: home.mapsQuery,
      icon: 'haldi',
      image: '/art/v-haldi.webp',
      about: "The ladies of the house put haldi on Himanshu and sing while they're at it (mostly teasing him). Wear something you don't mind getting yellow.",
    },
    {
      key: 'mehendi',
      name: 'Mehendi',
      hindi: 'मेहंदी',
      date: '2026-11-23',
      time: '2:00 PM onwards',
      venue: "Bride's home",
      icon: 'mehendi',
      image: '/art/v-mehendi.webp',
      about: 'Mehendi for Samiksha and any lady who wants it, with the dholak going and folk songs all afternoon. They say the darker it gets, the more she is loved.',
    },
    {
      key: 'tilak',
      name: 'Tilak & Lunch',
      hindi: 'तिलक',
      date: '2026-11-24',
      time: '10:00 AM, lunch after', // VERIFY: time carried over from the Vivah planner
      venue: home.label,
      mapsQuery: home.mapsQuery,
      icon: 'tilak',
      image: '/art/v-tilak.webp',
      about: "Samiksha's family comes over to put tilak on Himanshu and bless him. Then we all sit down to lunch together.",
    },
    {
      key: 'vivah',
      name: 'Shubh Vivah',
      hindi: 'शुभ विवाह',
      date: '2026-11-25',
      time: 'Baraat 5:00 PM, pheras from 8:00 PM',
      venue: 'Purshottam Party Plot, Bhayli',
      mapsQuery: 'Purshottam Party Plot, Bhayli, Vadodara',
      icon: 'vivah',
      highlight: true,
      about: 'Baraat, jaimala, pheras and sindoor daan. The big night!',
    },
  ],

  // 25 November, the wedding night
  weddingDay: [
    { time: '5:00 PM', name: 'Baraat', hindi: 'बारात', image: '/art/v-baraat.webp', about: 'Himanshu heads out with the band baaja. Expect a lot of dancing on the road.' },
    { time: '7:30 PM', name: 'Jaimala', hindi: 'जयमाला', about: 'Garlands are exchanged, and both sides try to lift their own higher.' },
    { time: '8:00 PM', name: 'Mandap Ceremony', hindi: 'मंडप', image: '/art/v-mandap.webp', about: 'The shubh muhurat. Panditji starts the mantras and the rituals begin.' },
    { time: '9:00 PM', name: 'Kanyadaan', hindi: 'कन्यादान', image: '/art/v-kanyadaan.webp', about: "Samiksha's parents place her hand in Himanshu's. Keep a hanky ready for this one." },
    { time: '9:30 PM', name: 'Saat Phere', hindi: 'सात फेरे', image: '/art/v-saath.webp', about: 'Seven rounds around the agni, and a promise with every round.', highlight: true },
    { time: '10:30 PM', name: 'Sindoor Daan', hindi: 'सिंदूर दान', image: '/art/v-sindoor.webp', about: "Himanshu fills Samiksha's maang with sindoor. In Bihar, this is the moment they're married.", highlight: true },
    { time: '11:45 PM', name: 'Vidaai', hindi: 'विदाई', image: '/art/v-vidaai.webp', about: 'Samiksha throws rice back over her head as she leaves, wishing her parents\' home well. Everyone cries.' },
  ],

  // Suggestions only, change them freely
  dressCode: [
    { event: 'Haldi', label: 'Haldi Yellow', note: "Yellow, obviously. Pick something you won't mind getting haldi on.", chips: ['#f2b705', '#fcd34d', '#fde68a', '#fdba74', '#fef3c7'], sunny: true },
    { event: 'Mehendi', label: 'Shades of Green', note: 'Greens, with a bit of gold or mirror work if you like.', chips: ['#3f6212', '#65a30d', '#a3e635', '#d9f99d', '#c9a24b'], glitter: true },
    { event: 'Tilak', label: 'Light Pastels', note: "It's a daytime puja, so something light and comfortable.", chips: ['#fcd5b5', '#f8d1d1', '#cde7c6', '#fbe7a6', '#d7d3f0'] },
    { event: 'Shubh Vivah', label: 'Traditional', note: 'Sarees, lehengas, sherwanis, kurtas. A Bhagalpuri silk would be perfect.', chips: ['#7b1e2b', '#b91c1c', '#c9a24b', '#e8821e', '#f7e2a8'], feature: true },
  ],
};

// Dates are stored as IST calendar days; noon avoids any timezone rollover
export const formatDate = (isoDay, options) =>
  new Date(`${isoDay}T12:00:00+05:30`).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', ...options });

export const coupleShort = `${wedding.groom.name} & ${wedding.bride.name}`;

export const directionsUrl = (query) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;

export const mapsUrl = directionsUrl(wedding.venue.mapsQuery);
export const mapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(wedding.venue.mapsQuery)}&z=15&output=embed`;
