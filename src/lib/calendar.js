import { wedding, coupleShort } from '../config/wedding';

// The address guests opened (the Vercel URL once deployed), written into the event notes
const siteUrl = () => `${window.location.origin}/`;

const title = `Shubh Vivah · ${coupleShort}`;
const location = `${wedding.venue.name}, ${wedding.venue.address}`;
const details = (url) =>
  `${wedding.groom.fullName} & ${wedding.bride.fullName} are getting married!\n` +
  `${wedding.calendar.summary}\n\n` +
  `Invitation: ${url}`;

const utcStamp = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

export const googleCalendarUrl = () => {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${utcStamp(new Date(wedding.calendar.start))}/${utcStamp(new Date(wedding.calendar.end))}`,
    location,
    details: details(siteUrl()),
    ctz: 'Asia/Kolkata',
  });
  return `https://calendar.google.com/calendar/render?${params}`;
};

// RFC 5545 text escaping and 75-octet line folding
const escapeText = (s) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
const fold = (line) => {
  const out = [];
  let rest = line;
  while (rest.length > 73) {
    out.push(rest.slice(0, 73));
    rest = ` ${rest.slice(73)}`;
  }
  out.push(rest);
  return out.join('\r\n');
};

export const buildIcs = () => {
  const url = siteUrl();
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Himanshu and Samiksha//Shubh Vivah//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:shubh-vivah-20261125@himanshu-samiksha',
    `DTSTAMP:${utcStamp(new Date())}`,
    `DTSTART:${utcStamp(new Date(wedding.calendar.start))}`,
    `DTEND:${utcStamp(new Date(wedding.calendar.end))}`,
    `SUMMARY:${escapeText(title)}`,
    `LOCATION:${escapeText(location)}`,
    `DESCRIPTION:${escapeText(details(url))}`,
    `URL:${url}`,
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeText(`${coupleShort}'s wedding is tomorrow`)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n');
};

const isAppleMobile = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

// iPhone Safari opens a text/calendar page straight into "Add to Calendar";
// everywhere else the .ics downloads and opens in the default calendar app.
export const addToAppleCalendar = () => {
  const ics = buildIcs();
  if (isAppleMobile()) {
    window.location.href = `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
    return;
  }
  const blobUrl = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = 'himanshu-samiksha-shubh-vivah.ics';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
};
