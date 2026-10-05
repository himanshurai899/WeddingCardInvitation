import { prisma } from '../../../db.js';
import { ok, err, serverErr, getWeddingId } from '../../../http.js';
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const result = await prisma.whatsAppTemplate.updateMany({
      where: { id, weddingId: getWeddingId() },
      data: {
        name: body.name,
        category: body.category,
        message: body.message,
        variables: body.variables ?? [],
        active: body.active,
      },
    });
    if (result.count === 0) return err('Template not found', 404);
    return ok({ success: true });
  } catch (e) {
    return serverErr(e);
  }
}
export async function DELETE(_, { params }) {
  try {
    const { id } = await params;
    await prisma.whatsAppTemplate.deleteMany({ where: { id, weddingId: getWeddingId() } });
    return ok({ success: true });
  } catch (e) {
    return serverErr(e);
  }
}
