// Run: node scripts/check-guests.mjs
import assert from 'node:assert/strict';
import { parseContacts, normalizePhone, inviteUrl } from '../src/lib/guests.js';

assert.equal(normalizePhone('+91 94283-00002'), '919428300002');
assert.equal(normalizePhone('09428300002'), '919428300002');
assert.equal(normalizePhone('+1 (415) 555-0132'), '14155550132');
assert.equal(normalizePhone('12345'), '');

// plain two columns, no header, quoted comma in the name
let r = parseContacts('"Sharma, Ji",98765 43210\nVerma Ji,+91 99999 11111\nBad Row,abc');
assert.deepEqual(r.guests.map((g) => g.phone), ['919876543210', '919999911111']);
assert.equal(r.guests[0].name, 'Sharma, Ji');
assert.equal(r.skipped, 1);

// Google Contacts style header
r = parseContacts('First Name,Last Name,Phone 1 - Label,Phone 1 - Value\nAsha,Rai,Mobile,98283 00002\n');
assert.deepEqual(r.guests, [{ name: 'Asha Rai', phone: '919828300002' }]);

// vCard
r = parseContacts('BEGIN:VCARD\r\nVERSION:3.0\r\nFN:Neeraj Yadav\r\nTEL;TYPE=CELL:+91 98989 12345\r\nEND:VCARD\r\n', 'contacts.vcf');
assert.deepEqual(r.guests, [{ name: 'Neeraj Yadav', phone: '919898912345' }]);

assert.match(inviteUrl('Sharma Ji'), /\/\?guest=Sharma%20Ji$/);
assert.match(inviteUrl('Sharma Ji', 'family'), /\/\?guest=Sharma%20Ji&party=family$/);
console.log('guests ok');
