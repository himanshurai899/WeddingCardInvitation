import { prisma } from '../../../db.js';
import { ok, serverErr, getWeddingId } from '../../../http.js';
export async function GET() {
  try {
    const count = await prisma.guest.count({ where: { weddingId: getWeddingId() } });
    return ok({ count });
  } catch (e) {
    return serverErr(e);
  }
}
