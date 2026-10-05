import { prisma } from '../../../db.js';
export async function PUT(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  try {
    const contact = await prisma.emergencyContact.update({
      where: { id },
      data: { category: body.category, name: body.name, phone: body.phone, address: body.address, notes: body.notes },
    });
    return Response.json(contact);
  } catch {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }
}
export async function DELETE(_, { params }) {
  const { id } = await params;
  try {
    await prisma.emergencyContact.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }
}
