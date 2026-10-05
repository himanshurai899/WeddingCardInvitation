import { prisma } from '../../../db.js';
import { ok, err, serverErr, getWeddingId } from '../../../http.js';
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const result = await prisma.ritual.updateMany({
      where: { id, weddingId: getWeddingId() },
      data: {
        name: body.name,
        description: body.description,
        requiredItems: body.requiredItems ?? [],
        responsiblePerson: body.responsiblePerson,
        budget: body.budget ? Number(body.budget) : null,
        status: body.status,
        scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : null,
        scheduledTime: body.scheduledTime,
        priestNotes: body.priestNotes,
      },
    });
    if (result.count === 0) return err('Ritual not found', 404);
    return ok({ success: true });
  } catch (e) {
    return serverErr(e);
  }
}
export async function DELETE(_, { params }) {
  try {
    const { id } = await params;
    await prisma.ritual.deleteMany({ where: { id, weddingId: getWeddingId() } });
    return ok({ success: true });
  } catch (e) {
    return serverErr(e);
  }
}
