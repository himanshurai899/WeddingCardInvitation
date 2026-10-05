import { prisma } from '../../../db.js';
import { ok, err, serverErr, getWeddingId } from '../../../http.js';
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const result = await prisma.task.updateMany({
      where: { id, weddingId: getWeddingId() },
      data: {
        name: body.name,
        owner: body.owner,
        deadline: body.deadline ? new Date(body.deadline) : null,
        priority: body.priority,
        status: body.status,
        notes: body.notes,
      },
    });
    if (result.count === 0) return err('Task not found', 404);
    return ok({ success: true });
  } catch (e) {
    return serverErr(e);
  }
}
export async function DELETE(_, { params }) {
  try {
    const { id } = await params;
    await prisma.task.deleteMany({ where: { id, weddingId: getWeddingId() } });
    return ok({ success: true });
  } catch (e) {
    return serverErr(e);
  }
}
