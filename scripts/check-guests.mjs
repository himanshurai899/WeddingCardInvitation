// Run: node scripts/check-guests.mjs
import assert from 'node:assert/strict';
import { normalizePhone, inviteUrl, invitedAs } from '../src/lib/guests.js';

assert.equal(normalizePhone('+91 94283-00002'), '919428300002');
assert.equal(normalizePhone('09428300002'), '919428300002');
assert.equal(normalizePhone('+1 (415) 555-0132'), '14155550132');
assert.equal(normalizePhone('12345'), '');

assert.match(inviteUrl('Sharma Ji'), /\/\?guest=Sharma%20Ji$/);
assert.match(inviteUrl('Sharma Ji', 'family'), /\/\?guest=Sharma%20Ji&party=family$/);
assert.match(inviteUrl('Rahul', 'plusone', 'Priya'), /&party=plusone&with=Priya$/);
assert.match(inviteUrl('Rahul', 'friends', ['Amit', ' ', 'Riya']), /&party=friends&with=Amit&with=Riya$/);
assert.doesNotMatch(inviteUrl('Nidhi Patel', 'friends', ['Ashok Nai', 'Harshil Thakkar', 'Khevana Thakkar']), /%2C/);
assert.equal(invitedAs('Rahul', 'plusone', 'Priya'), 'Rahul & Priya');
assert.equal(invitedAs('Rahul', 'friends', ['Amit', 'Riya', 'Neha']), 'Rahul, Amit, Riya & Neha');
assert.equal(
  invitedAs('Nidhi Patel', 'friends', ['Ashok Nai', 'Harshil Thakkar', 'Khevana Thakkar']),
  'Nidhi, Ashok, Harshil & Khevana',
);
assert.equal(invitedAs('Rahul Sharma', 'plusone', 'Priya Verma'), 'Rahul Sharma & Priya Verma');
assert.equal(invitedAs('Rahul', 'friends', ['Amit'], 'hi'), 'Rahul एवं Amit');
assert.equal(invitedAs('Rahul', 'friends', []), 'Rahul & Friends');
assert.equal(invitedAs('Rahul', 'family', ['ignored']), 'Rahul & Family');
console.log('guests ok');
