// Every name, date, venue and line of copy on the card lives here.
// Details follow the printed card (Himanshu & Samiksha.cdr). Lines marked VERIFY need a final check.

const home = {
  label: 'Rai family home, Yogi Nagar',
  address: 'B-144, Yogi Nagar Township, Near Ambika Nagar, Gotri, Vadodara 390021',
  mapsQuery: 'Yogi Nagar Township, Near Ambika Nagar, Gotri, Vadodara 390021',
};

export const wedding = {
  groom: {
    name: 'Himanshu',
    nameHindi: 'चि. हिमांशु',
    fullName: 'Himanshu Rai',
    relation: 'Elder son of',
    parents: 'Shri Ramshlok Rai & Smt. Asha Devi Rai',
    grandparents: 'Smt. Laheshari Devi & Late Shri Ramyatan Rai',
    home: 'Gotri, Vadodara',
    native: 'Kanhenapur, P.O. Lai, Dist. Patna, Bihar 801112',
    family: 'Rai Parivar',
    familyHindi: 'राय',
    address: home,
  },
  bride: {
    name: 'Samiksha',
    nameHindi: 'चि.सौ.कां. समीक्षा',
    fullName: 'Samiksha Yadav',
    relation: 'Daughter of',
    parents: 'Shri Rampukar Yadav & Smt. Mithilesh Yadav',
    home: 'Gadarwara, Madhya Pradesh',
    native: 'Sankhmohan, Dist. Samastipur, Bihar',
    family: 'Yadav Parivar',
    familyHindi: 'यादव',
    address: {
      label: 'Yadav family home, Gadarwara',
      address: 'Gayatri Nagar, MPEB Colony, Gadarwara, M.P. 487551',
      // Google's plus code for Gayatri Nagar (Pipariya Road, by MPEB Colony), so every Maps app lands on the same spot
      mapsQuery: 'WQ9C+CM2 Gayatri Nagar, Gadarwara, Madhya Pradesh 487551',
    },
  },

  // Shubh vivah, used by the countdown
  muhurat: '2026-11-25T23:00:00+05:30',
  // What "Save the Date" puts in the guest's calendar: baraat until well into the vivah
  calendar: {
    start: '2026-11-25T16:00:00+05:30',
    end: '2026-11-26T01:00:00+05:30',
    summary: 'Baraat leaves at 4:00 PM, dwar puja 6 to 8 PM, jaimala 9 PM, dinner from 9:30 PM, vivah from 11:00 PM.',
  },
  city: 'Vadodara, Gujarat',

  venue: {
    name: 'Purshottam Party Plot',
    nameHindi: 'पुरुषोत्तम पार्टी प्लॉट',
    address: 'Millennium Northway, opp. Navrachna University, behind Kabir Road, Bhayli, Vadodara 391410',
    mapsQuery: 'Purshottam Party Plot, Bhayli, Vadodara',
  },
  home,

  // Numbers printed on the card (Ramshlok Rai and Asha Devi Rai)
  phones: ['94283 00002', '94298 30002'],

  // Printed on the card, in the card's own words
  swagatatur: ['रामअयोध्या यादव', 'गणेश सिंह यादव', 'रणजीत सिंह यादव', 'रणवीर सिंह यादव'],
  darshanabhilashi: [
    'हरेन्द्र सिंह', 'अर्जुन सिंह', 'अखिलेश यादव', 'केशव सिंह',
    'हितेष राय', 'कृष्ण यादव', 'जीत यादव',
    'आरुष लय', // VERIFY: printed as "लय"; probably meant "राय"
    'मिथिलेश यादव', 'नीरज यादव',
  ],
  vineet: ['आशा देवी राय', 'रामश्लोक राय'],
  doha: ['आते हैं जिस भाव से, भक्तों के भगवान।', 'उसी भाव से आप भी, दर्शन दें श्रीमान्॥'],

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

  // Mahadev and Parvati artwork: free illustrations from Pixabay (Pixabay Content License,
  // free to use with no attribution needed), resized to webp in public/art/.
  art: {
    cover: { src: '/art/shiva-parvati-stars.webp', alt: 'Mahadev and Parvati together under a sky full of stars' },
    sunset: { src: '/art/shiva-parvati-sunset.webp', alt: 'Mahadev and Parvati against the setting sun' },
    night: { src: '/art/shiva-parvati-temple.webp', alt: 'Mahadev and Parvati in a lamp-lit temple at night' },
    nandi: { src: '/art/shiva-nandi.webp', alt: 'Mahadev and Nandi on the misty hills' },
    finale: { src: '/art/shiva-parvati-valley.webp', alt: 'Mahadev and Parvati face to face in the Himalayas' },
  },

  // Guest functions in order, as printed under "मांगलिक कार्यक्रम". Empty `time` or `venue` hides
  // that line. `mapsQuery` turns the venue into a directions link (`route` into a route from home
  // to the venue); `rituals` lists everything in the block.
  functions: [
    {
      key: 'haldi',
      name: 'Mandap & Haldi',
      short: 'Mandap & Haldi',
      hindi: 'मंडप मुहूर्त एवं हल्दी',
      date: '2026-11-22',
      tithi: 'कार्तिक शुक्ल त्रयोदशी',
      time: '10:00 AM to 12:00 PM',
      venue: home.label,
      mapsQuery: home.mapsQuery,
      rituals: ['मटिगमरा', 'उदरी', 'मंडप मुहूर्त', 'गणेश स्थापना', 'कलश स्थापना', 'हल्दी', 'कंगन'],
      about: "One packed morning at home. The mandap goes up, Ganesh ji and the kalash are set in place, and then the ladies get to the haldi (and the teasing). Wear something you don't mind getting yellow.",
    },
    {
      key: 'mehendi',
      name: 'Mehendi',
      short: 'Mehendi',
      hindi: 'मेहंदी',
      date: '2026-11-23',
      tithi: 'कार्तिक शुक्ल चतुर्दशी',
      time: '4:00 PM to 6:00 PM',
      venue: home.label,
      mapsQuery: home.mapsQuery,
      about: 'Mehendi for all the ladies, with the dholak going and plenty of folk songs. They say the darker it gets, the more you are loved.',
    },
    {
      key: 'tilak',
      name: 'Tilak & Lunch',
      short: 'Tilak',
      hindi: 'शुभ तिलकोत्सव',
      date: '2026-11-24',
      tithi: 'कार्तिक पूर्णिमा',
      time: '10:00 AM to 2:00 PM, lunch from 12:30',
      venue: home.label,
      mapsQuery: home.mapsQuery,
      about: "Samiksha's family comes over to put tilak on Himanshu and bless him. Then we all sit down to lunch together.",
    },
    {
      key: 'sangeet',
      name: 'Sangeet',
      short: 'Sangeet',
      hindi: 'संगीत',
      date: '2026-11-24',
      tithi: 'कार्तिक पूर्णिमा',
      time: '7:00 PM onwards',
      venue: home.label,
      mapsQuery: home.mapsQuery,
      about: 'Songs, dholak and a lot of dancing on the evening before the wedding. Come ready to join in!',
    },
    {
      key: 'baraat',
      name: 'Baraat',
      hindi: 'बारात प्रस्थान',
      date: '2026-11-25',
      tithi: 'मार्गशीर्ष कृष्ण प्रतिपदा',
      time: '4:00 PM onwards',
      venue: 'Rai family home, Yogi Nagar to Purshottam Party Plot, Bhayli',
      route: { from: home.mapsQuery, to: 'Purshottam Party Plot, Bhayli, Vadodara' },
      about: 'The baraat leaves home at 4 PM with the band baaja and dances its way to the venue. Join us at Yogi Nagar, or meet us at the party plot.',
    },
    {
      key: 'vivah',
      name: 'Shubh Vivah',
      hindi: 'शुभ विवाह',
      date: '2026-11-25',
      tithi: 'मार्गशीर्ष कृष्ण प्रतिपदा',
      time: 'Dwar puja 6:00 PM, vivah from 11:00 PM',
      venue: 'Purshottam Party Plot, Bhayli',
      mapsQuery: 'Purshottam Party Plot, Bhayli, Vadodara',
      highlight: true,
      about: 'Dwar puja, jaimala, dinner, and then the pheras late into the night. The big one!',
    },
  ],

  // 25 November, the wedding night, then bidaai the next morning
  weddingDay: [
    { time: '4:00 PM', name: 'Baraat', hindi: 'बारात प्रस्थान', route: { from: home.mapsQuery, to: 'Purshottam Party Plot, Bhayli, Vadodara', label: 'Rai family home, Yogi Nagar to Purshottam Party Plot' }, about: 'Himanshu sets off from home with the baraat. Expect band baaja and a lot of dancing all the way to the venue.' },
    { time: '6:00 to 8:00 PM', name: 'Dwar Puja', hindi: 'द्वार पूजा', about: "The baraat reaches the gate and Samiksha's family welcomes Himanshu with aarti." },
    { time: '9:00 PM onwards', name: 'Jaimala', hindi: 'जयमाला', about: 'Garlands are exchanged, and both sides try to lift their own higher.' },
    { time: '9:30 PM onwards', name: 'Dinner', hindi: 'भोजन समारंभ', about: "Dinner is served. Please don't leave without eating!" },
    { time: '11:00 PM onwards', name: 'Shubh Vivah', hindi: 'शुभ विवाह', about: 'Panditji begins the vivah under the mandap. It goes on late into the night.', highlight: true },
    { time: 'During the vivah', name: 'Kanyadaan', hindi: 'कन्यादान', about: "Samiksha's parents place her hand in Himanshu's. Keep a hanky ready for this one." },
    { time: 'During the vivah', name: 'Saat Phere', hindi: 'सात फेरे', about: 'Seven rounds around the agni, and a promise with every round.', highlight: true },
    { time: 'During the vivah', name: 'Sindoor Daan', hindi: 'सिंदूर दान', about: "Himanshu fills Samiksha's maang with sindoor. In Bihar, this is the moment they're married.", highlight: true },
    { time: '6:00 AM, Thu 26 Nov', name: 'Bidaai', hindi: 'बिदाई', about: "At first light Samiksha leaves for her new home in Yogi Nagar, throwing rice back over her head to wish her parents' home well. Everyone cries." },
  ],

  // Suggestions only, change them freely. `tone` picks the card colour.
  dressCode: [
    { event: 'Haldi', label: 'Haldi Yellow', note: "Yellow, obviously. Pick something you won't mind getting haldi on.", chips: ['#f2b705', '#fcd34d', '#fde68a', '#fdba74', '#fef3c7'], tone: 'haldi' },
    { event: 'Mehendi', label: 'Shades of Green', note: 'Greens, with a bit of gold or mirror work if you like.', chips: ['#3f6212', '#65a30d', '#a3e635', '#d9f99d', '#c9a24b'], tone: 'mehendi' },
    { event: 'Tilak', label: 'Light Pastels', note: "It's a daytime puja, so something light and comfortable.", chips: ['#fcd5b5', '#f8d1d1', '#cde7c6', '#fbe7a6', '#d7d3f0'], tone: 'pastel' },
    { event: 'Sangeet', label: 'Shimmer & Glitter', note: 'Sequins, mirror work, anything that catches the light. You will be dancing.', chips: ['#7e22ce', '#db2777', '#c9a24b', '#f472b6', '#1e1b4b'], tone: 'sangeet' },
    { event: 'Shubh Vivah', label: 'Traditional', note: 'Sarees, lehengas, sherwanis, kurtas. A Bhagalpuri silk would be perfect.', chips: ['#7b1e2b', '#b91c1c', '#c9a24b', '#e8821e', '#f7e2a8'], tone: 'vivah' },
  ],
};

// Dates are stored as IST calendar days; noon avoids any timezone rollover
export const formatDate = (isoDay, options) =>
  new Date(`${isoDay}T12:00:00+05:30`).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', ...options });

export const coupleShort = `${wedding.groom.name} & ${wedding.bride.name}`;

export const directionsUrl = (query) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;

export const routeUrl = ({ from, to }) =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}`;

export const telUrl = (phone) => `tel:+91${phone.replace(/\D/g, '')}`;

export const mapsUrl = directionsUrl(wedding.venue.mapsQuery);
export const mapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(wedding.venue.mapsQuery)}&z=15&output=embed`;
