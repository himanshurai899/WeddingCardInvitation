import { prisma } from '../../../db.js';
import { ok, serverErr, getWeddingId } from '../../../http.js';
import { budgetCategories } from '../../../budget.js';
export async function GET() {
  try {
    // Actual and paid include the vendors (their final amounts and advances), as vendorCost and vendorPaid
    return ok(await budgetCategories(getWeddingId()));
  } catch (e) {
    return serverErr(e);
  }
}
export async function POST(req) {
  try {
    const body = await req.json();
    const cat = await prisma.budgetCategory.create({
      data: {
        weddingId: getWeddingId(),
        category: body.category,
        plannedBudget: Number(body.plannedBudget ?? 0),
        actualCost: Number(body.actualCost ?? 0),
        paidAmount: Number(body.paidAmount ?? 0),
      },
    });
    return ok(cat, 201);
  } catch (e) {
    return serverErr(e);
  }
}
