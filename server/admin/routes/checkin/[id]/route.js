import { prisma } from '../../../db.js';
import { ok, err, serverErr, getWeddingId } from '../../../http.js';
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const result = await prisma.checkIn.updateMany({
      where: { id, weddingId: getWeddingId() },
      data: {
        status: body.status,
        arrivalTime: body.status === 'CHECKED_IN' ? new Date() : null,
        notes: body.notes,
      },
    });
    if (result.count === 0) return err('Check-in record not found', 404);
    return ok({ success: true });
  } catch (e) {
    return serverErr(e);
  }
}
export async function DELETE(_, { params }) {
  try {
    const { id } = await params;
    await prisma.checkIn.deleteMany({ where: { id, weddingId: getWeddingId() } });
    return ok({ success: true });
  } catch (e) {
    return serverErr(e);
  }
}
