// The invitation card (src/config/wedding.js) holds the correct wedding details. This copies them into the admin
// database: the wedding row, the functions, the ritual timings, the invitation text and the family contacts.
// Records the host added by hand are left alone; only the sample records the old Vivah seed made are replaced.
import { wedding as w } from '../../src/config/wedding.js';
import { prisma } from './db.js';
import { WEDDING_ID } from './http.js';

const day = (iso) => new Date(`${iso}T12:00:00+05:30`);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export const upsertWedding = () => {
  const data = {
    name: `${w.groom.name} & ${w.bride.name} Vivah 2026`,
    date: new Date(w.calendar.start),
    venue: `${w.venue.name}, ${w.venue.address}`,
    groomName: w.groom.fullName,
    brideName: w.bride.fullName,
    city: 'Vadodara',
    state: 'Gujarat',
  };
  return prisma.wedding.upsert({ where: { id: WEDDING_ID }, update: data, create: { id: WEDDING_ID, ...data } });
};

// "6:00 to 8:00 PM" -> ['18:00', '20:00'];  "10:00 AM to 2:00 PM, lunch from 12:30" -> ['10:00', '14:00'];  "During the vivah" -> []
const times = (text) => {
  const tokens = [...text.split(',')[0].matchAll(/(\d{1,2}):(\d{2})\s*(AM|PM)?/gi)];
  return tokens
    .map((m, i) => {
      const meridiem = (m[3] ?? tokens.slice(i + 1).find((t) => t[3])?.[3] ?? '').toUpperCase();
      const hour = (Number(m[1]) % 12) + (meridiem === 'PM' ? 12 : 0);
      return `${String(hour).padStart(2, '0')}:${m[2]}`;
    })
    .slice(0, 2);
};

// The guest functions, then the wedding night and bidaai, in the order the card prints them
const events = () => {
  const venue = `${w.venue.name}, Bhayli`;
  const guestFunctions = w.functions.filter((f) => ['haldi', 'mehendi', 'tilak', 'garba'].includes(f.key));
  const night = w.weddingDay.filter((s) => /^\d/.test(s.time) || s.name === 'Bidaai');
  return [
    ...guestFunctions.map((f) => ({ ...f, key: f.key, type: 'PRE_WEDDING', main: false })),
    ...night.map((s) => ({
      ...s,
      key: slug(s.name),
      date: s.name === 'Bidaai' ? '2026-11-26' : '2026-11-25',
      venue: s.name === 'Baraat' ? s.route.label : s.name === 'Bidaai' ? w.home.label : venue,
      type: s.name === 'Bidaai' ? 'POST_WEDDING' : 'WEDDING',
      main: Boolean(s.highlight),
    })),
  ];
};

// Rituals the old seed already made: their timings and people now follow the card
const ritualFixes = {
  'ritual-tilak': {
    scheduledDate: day('2026-11-24'),
    scheduledTime: '10:00',
    responsiblePerson: `${w.bride.parents.split(' & ')[0]} (bride's father)`,
    priestNotes: 'Tilak & Lunch at the Rai family home, Yogi Nagar. 10:00 AM to 2:00 PM, lunch from 12:30.',
  },
  'ritual-haldi-ubtan-ceremony': {
    scheduledDate: day('2026-11-22'),
    scheduledTime: '10:00',
    responsiblePerson: 'Ladies of the Rai family',
    priestNotes: 'With Mandap Muhurat, at the Rai family home, Yogi Nagar. 10:00 AM to 12:00 PM.',
  },
  'ritual-jaimala-varmala': {
    scheduledDate: day('2026-11-25'),
    scheduledTime: '21:00',
    responsiblePerson: 'Both families',
    priestNotes: `At ${w.venue.name}, from 9:00 PM.`,
  },
  'ritual-kanyadaan': {
    scheduledDate: day('2026-11-25'),
    scheduledTime: '23:00',
    responsiblePerson: `${w.bride.parents} (bride's parents)`,
    priestNotes: 'During the vivah, which begins at 11:00 PM. Panditji guides.',
  },
  'ritual-saat-phere-saptapadi': {
    scheduledDate: day('2026-11-25'),
    scheduledTime: '23:00',
    responsiblePerson: 'Panditji',
    priestNotes: 'During the vivah, which begins at 11:00 PM.',
  },
  'ritual-sindoor-daan': {
    scheduledDate: day('2026-11-25'),
    scheduledTime: '23:00',
    responsiblePerson: 'Himanshu (groom), guided by Panditji',
    priestNotes: 'During the vivah, which begins at 11:00 PM.',
  },
  'ritual-vidaai-bride-s-farewell': {
    scheduledDate: day('2026-11-26'),
    scheduledTime: '06:00',
    responsiblePerson: 'Both families',
    priestNotes: 'Bidaai at first light, before Samiksha leaves for the Rai home in Yogi Nagar.',
  },
};

// Printed on the card under Mandap & Haldi (Haldi itself is already a seed ritual)
const haldiRituals = {
  मटिगमरा: 'Matigamra',
  उदरी: 'Udari',
  'मंडप मुहूर्त': 'Mandap Muhurat',
  'गणेश स्थापना': 'Ganesh Sthapana',
  'कलश स्थापना': 'Kalash Sthapana',
  कंगन: 'Kangan',
};

const invitationBlocks = () => {
  const family = (p, title) => ({
    section: 'FAMILY',
    title,
    primaryText: p.family,
    description: `${p.parents}\n${p.grandRelation} ${p.grandparents}\nResidence: ${p.home}\nNative place: ${p.native}`,
  });
  return [
    {
      section: 'HEADER',
      title: 'Wedding Invitation',
      primaryText: 'Shubh Vivah',
      description: `${w.groom.name} & ${w.bride.name} are getting married on 25 November 2026 in Vadodara. Come bless the couple!`,
    },
    {
      section: 'COUPLE',
      title: `${w.groom.name} weds ${w.bride.name}`,
      primaryText: `${w.groom.fullName} & ${w.bride.fullName}`,
      description: `${w.groom.name}: ${w.groom.relation} ${w.groom.parents}\n${w.bride.name}: ${w.bride.relation} ${w.bride.parents}`,
    },
    family(w.groom, 'Family of the Groom'),
    family(w.bride, 'Family of the Bride'),
    ...w.functions.map((f) => ({
      section: 'EVENT',
      title: f.name,
      date: day(f.date),
      time: f.time,
      primaryText: f.venue,
      description: f.about,
    })),
    {
      section: 'FOOTER',
      title: 'Contact Us',
      primaryText: w.groom.family,
      contact: w.phones.map((p) => `+91 ${p}`).join('\n'),
      description: w.maithili,
    },
  ].map((b, i) => ({ ...b, sortOrder: i + 1 }));
};

// The two numbers printed on the card, in the order the card names Ramshlok Rai and Asha Devi Rai
const familyContacts = [
  { name: 'Ramshlok Rai (Father, Groom)', phone: `+91 ${w.phones[0]}` },
  { name: 'Asha Devi Rai (Mother, Groom)', phone: `+91 ${w.phones[1]}` },
];

export async function syncCardData() {
  const { id: weddingId } = await upsertWedding();

  // Functions
  await prisma.event.deleteMany({ where: { weddingId, id: { startsWith: 'event-' } } });
  for (const e of events()) {
    const [startTime, endTime] = times(e.time);
    const data = {
      name: e.name,
      eventType: e.type,
      date: day(e.date),
      venue: e.venue,
      startTime: startTime ?? null,
      endTime: endTime ?? null,
      notes: `${[e.hindi, e.tithi].filter(Boolean).join(' · ')}\n${e.about}`,
      isMainFunction: e.main,
    };
    const id = `card-${e.key}`;
    await prisma.event.upsert({ where: { id }, update: data, create: { id, weddingId, ...data } });
  }

  // Rituals
  await prisma.ritual.deleteMany({
    where: { weddingId, id: { in: ['ritual-matkor-mitti-puja', 'ritual-griha-pravesh-home-welcome'] } },
  });
  for (const [id, data] of Object.entries(ritualFixes)) await prisma.ritual.updateMany({ where: { id, weddingId }, data });
  for (const [hindi, name] of Object.entries(haldiRituals)) {
    const id = `card-ritual-${slug(name)}`;
    const data = {
      name: `${name} (${hindi})`,
      description: 'Part of Mandap & Haldi at the Rai family home, Yogi Nagar.',
      responsiblePerson: 'Rai family',
      scheduledDate: day('2026-11-22'),
      scheduledTime: '10:00',
    };
    await prisma.ritual.upsert({ where: { id }, update: data, create: { id, weddingId, ...data } });
  }

  // Invitation text
  await prisma.invitationBlock.deleteMany({
    where: { weddingId, OR: [{ id: { startsWith: 'inv-' } }, { id: { startsWith: 'card-inv-' } }] },
  });
  await prisma.invitationBlock.createMany({
    data: invitationBlocks().map((b) => ({ ...b, id: `card-inv-${b.sortOrder}`, weddingId })),
  });

  // WhatsApp: the card has a Garba Night, not a Sangeet
  await prisma.whatsAppTemplate.deleteMany({ where: { weddingId, id: 'wa-sangeet-night-invitation' } });

  // Family contacts (the sample ones named other people)
  await prisma.emergencyContact.deleteMany({
    where: {
      weddingId,
      OR: ['Suresh Kumar', 'Mohan Verma', 'Ramakant'].map((n) => ({ name: { contains: n } })),
    },
  });
  for (const c of familyContacts) {
    const exists = await prisma.emergencyContact.findFirst({ where: { weddingId, name: c.name } });
    if (!exists) {
      await prisma.emergencyContact.create({ data: { weddingId, category: '👨‍👩‍👧 Family', address: w.groom.home, ...c } });
    }
  }
}
