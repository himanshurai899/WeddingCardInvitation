import { prisma } from '../../../db.js';
import { ok, serverErr, getWeddingId } from '../../../http.js';
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') ?? undefined;
    const expenses = await prisma.expense.findMany({
      where: { weddingId: getWeddingId(), ...(category && { category }) },
      orderBy: { date: 'desc' },
    });
    return ok(expenses);
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
    // Update budget category actual cost
    if (body.category) {
      await prisma.budgetCategory.updateMany({
        where: { weddingId: getWeddingId(), category: body.category },
        data: {
          actualCost: { increment: Number(body.amount) },
          paidAmount: { increment: Number(body.paidAmount ?? 0) },
        },
      });
    }
    return ok(expense, 201);
  } catch (e) {
    return serverErr(e);
  }
}
