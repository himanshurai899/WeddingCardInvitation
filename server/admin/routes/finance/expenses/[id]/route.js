import { prisma } from '../../../../db.js';
import { ok, err, serverErr, getWeddingId } from '../../../../http.js';
import { shiftCategory } from '../../../../budget.js';
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const before = await prisma.expense.findFirst({ where: { id, weddingId: getWeddingId() } });
    if (!before) return err('Expense not found', 404);
    const result = await prisma.expense.updateMany({
      where: { id, weddingId: getWeddingId() },
      data: {
        category: body.category,
        description: body.description,
        paidTo: body.paidTo,
        amount: Number(body.amount),
        paidAmount: Number(body.paidAmount ?? 0),
        paymentMode: body.paymentMode,
        date: body.date ? new Date(body.date) : undefined,
      },
    });
    if (result.count === 0) return err('Expense not found', 404);
    // Take the old amounts out of the old category and put the new ones in, so the totals stay true
    const after = await prisma.expense.findFirst({ where: { id, weddingId: getWeddingId() } });
    await shiftCategory(getWeddingId(), before, -1);
    await shiftCategory(getWeddingId(), after, 1);
    return ok({ success: true });
  } catch (e) {
    return serverErr(e);
  }
}
export async function DELETE(_, { params }) {
  try {
    const { id } = await params;
    const before = await prisma.expense.findFirst({ where: { id, weddingId: getWeddingId() } });
    await prisma.expense.deleteMany({ where: { id, weddingId: getWeddingId() } });
    await shiftCategory(getWeddingId(), before, -1);
    return ok({ success: true });
  } catch (e) {
    return serverErr(e);
  }
}
