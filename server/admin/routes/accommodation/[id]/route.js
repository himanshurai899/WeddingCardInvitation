import { prisma } from '../../../db.js';
import { ok, err, serverErr, getWeddingId } from '../../../http.js';
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const result = await prisma.hotel.updateMany({
      where: { id, weddingId: getWeddingId() },
      data: {
        name: body.name,
        type: body.type,
        address: body.address,
        contactPerson: body.contactPerson,
        phone: body.phone,
        roomsAvailable: Number(body.roomsAvailable ?? 0),
        roomsAllocated: Number(body.roomsAllocated ?? 0),
        checkInDate: body.checkInDate ? new Date(body.checkInDate) : null,
        checkOutDate: body.checkOutDate ? new Date(body.checkOutDate) : null,
        costPerNight: body.costPerNight ? Number(body.costPerNight) : null,
      },
    });
    if (result.count === 0) return err('Hotel not found', 404);
    return ok({ success: true });
  } catch (e) {
    return serverErr(e);
  }
}
export async function DELETE(_, { params }) {
  try {
    const { id } = await params;
    await prisma.hotel.deleteMany({ where: { id, weddingId: getWeddingId() } });
    return ok({ success: true });
  } catch (e) {
    return serverErr(e);
  }
}
