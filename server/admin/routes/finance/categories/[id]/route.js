import { prisma } from '../../../../db.js';
import { ok, err, serverErr, getWeddingId } from '../../../../http.js';
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const result = await prisma.budgetCategory.updateMany({
      where: { id, weddingId: getWeddingId() },
      data: {
        plannedBudget: Number(body.plannedBudget ?? 0),
        actualCost: Number(body.actualCost ?? 0),
        paidAmount: Number(body.paidAmount ?? 0),
      },
    });
    if (result.count === 0) return err('Category not found', 404);
    return ok({ success: true });
  } catch (e) {
    return serverErr(e);
  }
}
export async function DELETE(_, { params }) {
  try {
    const { id } = await params;
    await prisma.budgetCategory.deleteMany({ where: { id, weddingId: getWeddingId() } });
    return ok({ success: true });
  } catch (e) {
    return serverErr(e);
  }
}
