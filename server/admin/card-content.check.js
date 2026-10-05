// Run: node server/admin/card-content.check.js  (checks that a bad save can't break the card)
import assert from 'node:assert/strict';
import { content } from '../../src/config/wedding.js';
import { conform } from './card-content.js';

const tpl = { name: 'x', list: ['a'], items: [{ key: 'k', name: 'n' }, { key: 'k', highlight: true }], pairs: [['a', 'b']] };
// wrong types fall back, missing top-level keys are filled, optional item keys stay optional, junk keys are dropped
assert.deepEqual(conform({ name: 5, junk: 1, items: [{ name: 'only' }, 'bad'] }, tpl), {
  name: 'x', list: ['a'], items: [{ name: 'only' }, {}], pairs: [['a', 'b']],
});
assert.deepEqual(conform({ list: ['b', 3], items: [{ key: 'z', highlight: 'yes' }] }, tpl).list, ['b']);
assert.deepEqual(conform({ items: [{ key: 'z', highlight: 'yes' }] }, tpl).items, [{ key: 'z', highlight: true }]);
assert.deepEqual(conform({ pairs: [['c', 'd', 4]] }, tpl).pairs, [['c', 'd']]);
// the real card file survives a round trip untouched
assert.deepEqual(conform(structuredClone(content), content), content);
console.log('card-content ok');
