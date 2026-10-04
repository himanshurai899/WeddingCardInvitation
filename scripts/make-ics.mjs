// Writes public/wedding.ics, the file the "Apple Calendar" button links to.
// Runs before every build (see "prebuild"); pass a URL to override the address put in the event notes.
import { writeFile } from 'node:fs/promises';
import { buildIcs } from '../src/lib/calendar.js';

const url = process.argv[2] ?? 'https://himanshu-samiksha-vivah.vercel.app/';
await writeFile('public/wedding.ics', buildIcs(url));
console.log(`public/wedding.ics written (notes link to ${url})`);
