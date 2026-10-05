import { prisma } from '../../../db.js';
import { ok, err, serverErr, getWeddingId } from '../../../http.js';
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const result = await prisma.travelRecord.updateMany({
      where: { id, weddingId: getWeddingId() },
      data: {
        guestName: body.guestName,
        arrivalDate: body.arrivalDate ? new Date(body.arrivalDate) : null,
        arrivalTime: body.arrivalTime,
        transportType: body.transportType,
        pnrBookingId: body.pnrBookingId,
        pickupNeeded: body.pickupNeeded,
        pickupCoordinator: body.pickupCoordinator,
        vehicleNumber: body.vehicleNumber,
        status: body.status,
      },
    });
    if (result.count === 0) return err('Travel record not found', 404);
    return ok({ success: true });
  } catch (e) {
    return serverErr(e);
  }
}
export async function DELETE(_, { params }) {
  try {
    const { id } = await params;
    await prisma.travelRecord.deleteMany({ where: { id, weddingId: getWeddingId() } });
    return ok({ success: true });
  } catch (e) {
    return serverErr(e);
  }
}
