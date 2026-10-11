import { prisma } from './db.js';

// Which Finance category each kind of vendor is paid from
export const VENDOR_BUDGET = {
  PHOTOGRAPHER: 'Photography & Videography',
  VIDEOGRAPHER: 'Photography & Videography',
  CATERER: 'Food & Catering',
  DECORATOR: 'Decorations & Flowers',
  FLOWER: 'Decorations & Flowers',
  TENT: 'Decorations & Flowers',
  DJ: 'Entertainment (DJ/Band)',
  BAND: 'Entertainment (DJ/Band)',
  MAKEUP: 'Clothing & Attire',
  MEHENDI: 'Clothing & Attire',
  PRIEST: 'Rituals & Puja Samagri',
  TRANSPORT: 'Travel & Transportation',
  EVENT_PLANNER: 'Miscellaneous',
  OTHER: 'Miscellaneous',
};

// A vendor's cost is its final amount. A finalized vendor with no final amount yet counts its negotiated
// amount or quotation, as on the Vendors page. Rejected vendors cost nothing.
const vendorCost = (v) => v.finalAmount ?? (v.status === 'FINALIZED' ? (v.negotiatedAmount ?? v.quotation ?? 0) : 0);
const budgetOf = (v) => VENDOR_BUDGET[v.category] ?? 'Miscellaneous';

// Vendors as Expense Ledger rows: the final amount is the amount and the advance is what's paid.
// Worked out from the vendors on every read and never saved, so the ledger can't fall behind the Vendors page.
export const vendorEntries = (vendors) =>
  vendors
    .filter((v) => v.status !== 'REJECTED')
    .map((v) => ({
      id: `vendor-${v.id}`,
      vendorId: v.id,
      date: v.createdAt,
      category: budgetOf(v),
      description: v.name,
      paidTo: v.contactPerson || v.name,
      amount: vendorCost(v),
      paidAmount: v.advancePaid ?? 0,
      paymentMode: 'VENDOR',
    }))
    .filter((e) => e.amount > 0 || e.paidAmount > 0);

// Each category's share of the vendors
export const vendorTotals = (vendors) => {
  const totals = {};
  for (const e of vendorEntries(vendors)) {
    const t = (totals[e.category] ??= { vendorCost: 0, vendorPaid: 0 });
    t.vendorCost += e.amount;
    t.vendorPaid += e.paidAmount;
  }
  return totals;
};

// Adds the vendor share to the saved figures (expenses and anything typed in), so Finance always matches Vendors.
// The vendor share is worked out on every read, never saved, so editing a vendor can't leave Finance behind.
export const withVendors = (categories, totals) =>
  categories.map((c) => {
    const t = totals[c.category] ?? { vendorCost: 0, vendorPaid: 0 };
    return { ...c, ...t, actualCost: c.actualCost + t.vendorCost, paidAmount: c.paidAmount + t.vendorPaid };
  });

export async function budgetCategories(weddingId) {
  const totals = vendorTotals(await prisma.vendor.findMany({ where: { weddingId } }));
  // A vendor in a category that has no row yet gets one, so its money has somewhere to show
  const needed = Object.keys(totals);
  if (needed.length) {
    await prisma.budgetCategory.createMany({
      data: needed.map((category) => ({ weddingId, category })),
      skipDuplicates: true,
    });
  }
  const categories = await prisma.budgetCategory.findMany({ where: { weddingId }, orderBy: { category: 'asc' } });
  return withVendors(categories, totals);
}

// Moves an expense's amounts in or out of its category's saved figures (sign 1 adds, -1 takes away)
export const shiftCategory = (weddingId, expense, sign) =>
  expense?.category
    ? prisma.budgetCategory.updateMany({
        where: { weddingId, category: expense.category },
        data: {
          actualCost: { increment: sign * Number(expense.amount ?? 0) },
          paidAmount: { increment: sign * Number(expense.paidAmount ?? 0) },
        },
      })
    : null;
