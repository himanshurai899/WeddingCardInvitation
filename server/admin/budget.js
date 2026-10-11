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

// Each category's share of the vendors: the final amount is its cost and the advance is paid.
// A finalized vendor with no final amount yet counts its negotiated amount or quotation, as on the Vendors page.
export const vendorTotals = (vendors) => {
  const totals = {};
  for (const v of vendors) {
    if (v.status === 'REJECTED') continue;
    const cost = v.finalAmount ?? (v.status === 'FINALIZED' ? (v.negotiatedAmount ?? v.quotation ?? 0) : 0);
    const t = (totals[VENDOR_BUDGET[v.category] ?? 'Miscellaneous'] ??= { vendorCost: 0, vendorPaid: 0 });
    t.vendorCost += cost;
    t.vendorPaid += v.advancePaid ?? 0;
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
