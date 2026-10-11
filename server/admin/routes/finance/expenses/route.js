import { prisma } from '../../../db.js';
import { ok, serverErr, getWeddingId } from '../../../http.js';
import { shiftCategory, vendorEntries } from '../../../budget.js';
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') ?? undefined;
    const [expenses, vendors] = await Promise.all([
      prisma.expense.findMany({ where: { weddingId: getWeddingId(), ...(category && { category }) } }),
      prisma.vendor.findMany({ where: { weddingId: getWeddingId() } }),
    ]);
    // The ledger lists vendors too (marked with vendorId); they're edited on the Vendors page
    const rows = [...expenses, ...vendorEntries(vendors).filter((e) => !category || e.category === category)];
    return ok(rows.sort((a, b) => new Date(b.date) - new Date(a.date)));
  } catch (e) {
    return serverErr(e);
  }
}
export async function POST(req) {
  try {
    const body = await req.json();
    const expense = await prisma.expense.create({
      data: {
        weddingId: getWeddingId(),
        category: body.category,
        description: body.description,
        paidTo: body.paidTo,
        amount: Number(body.amount),
        paidAmount: Number(body.paidAmount ?? 0),
        paymentMode: body.paymentMode ?? 'CASH',
        date: body.date ? new Date(body.date) : new Date(),
        receipt: body.receipt,
      },
    });
    await shiftCategory(getWeddingId(), expense, 1);
    return ok(expense, 201);
  } catch (e) {
    return serverErr(e);
  }
}
