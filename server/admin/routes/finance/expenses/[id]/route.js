import { prisma } from '../../../../db.js';
import { ok, err, serverErr, getWeddingId } from '../../../../http.js';
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
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
    return ok({ success: true });
  } catch (e) {
    return serverErr(e);
  }
}
export async function DELETE(_, { params }) {
  try {
    const { id } = await params;
    await prisma.expense.deleteMany({ where: { id, weddingId: getWeddingId() } });
    return ok({ success: true });
  } catch (e) {
    return serverErr(e);
  }
}
