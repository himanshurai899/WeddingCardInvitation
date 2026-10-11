// Run: node scripts/check-budget.mjs
import assert from 'node:assert/strict';
import { vendorEntries, vendorTotals, withVendors } from '../server/admin/budget.js';

const totals = vendorTotals([
  { category: 'PHOTOGRAPHER', status: 'FINALIZED', finalAmount: 150000, advancePaid: 50000 },
  { category: 'VIDEOGRAPHER', status: 'NEGOTIATING', finalAmount: null, quotation: 90000, advancePaid: 0 },
  { category: 'CATERER', status: 'FINALIZED', finalAmount: null, negotiatedAmount: 400000, advancePaid: 100000 },
  { category: 'DJ', status: 'REJECTED', finalAmount: 60000, advancePaid: 10000 },
  { category: 'SOMETHING_NEW', status: 'SHORTLISTED', finalAmount: 5000, advancePaid: 0 },
]);
assert.deepEqual(totals['Photography & Videography'], { vendorCost: 150000, vendorPaid: 50000 }); // a quote alone isn't a cost
assert.deepEqual(totals['Food & Catering'], { vendorCost: 400000, vendorPaid: 100000 });
assert.equal(totals['Entertainment (DJ/Band)'], undefined); // rejected vendors don't count
assert.deepEqual(totals.Miscellaneous, { vendorCost: 5000, vendorPaid: 0 });

const [cat] = withVendors([{ category: 'Food & Catering', actualCost: 20000, paidAmount: 5000 }], totals);
assert.equal(cat.actualCost, 420000);
assert.equal(cat.paidAmount, 105000);
// The ledger gets one row per counted vendor, in its Finance category
const rows = vendorEntries([
  { id: 'v1', name: 'Royal Caterers', contactPerson: 'Ajit', category: 'CATERER', status: 'FINALIZED', finalAmount: 400000, advancePaid: 100000 },
  { id: 'v2', name: 'Lens Studio', category: 'PHOTOGRAPHER', status: 'SHORTLISTED', quotation: 90000, advancePaid: 0 },
  { id: 'v3', name: 'DJ Beats', category: 'DJ', status: 'REJECTED', finalAmount: 60000, advancePaid: 10000 },
]);
assert.deepEqual(
  rows.map((r) => [r.vendorId, r.category, r.description, r.paidTo, r.amount, r.paidAmount]),
  [['v1', 'Food & Catering', 'Royal Caterers', 'Ajit', 400000, 100000]],
);
console.log('budget ok');
