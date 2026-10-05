import { prisma } from '../../db.js';
async function getWeddingId() {
  const w = await prisma.wedding.findFirst();
  return w?.id ?? null;
}
export async function GET() {
  const weddingId = await getWeddingId();
  if (!weddingId) return Response.json([]);
  const contacts = await prisma.emergencyContact.findMany({
    where: { weddingId },
    orderBy: [{ sortOrder: 'asc' }, { category: 'asc' }],
  });
  return Response.json(contacts);
}
export async function POST(req) {
  const weddingId = await getWeddingId();
  if (!weddingId) return Response.json({ error: 'No wedding found' }, { status: 400 });
  const body = await req.json();
  const contact = await prisma.emergencyContact.create({
    data: {
      weddingId,
      category: body.category ?? 'Other',
      name: body.name,
      phone: body.phone,
      address: body.address,
      notes: body.notes,
      sortOrder: body.sortOrder ?? 0,
    },
  });
  return Response.json(contact, { status: 201 });
}
