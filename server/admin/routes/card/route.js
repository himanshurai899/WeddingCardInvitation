import { defaults, loadContent, saveContent } from '../../card-content.js';
import { syncCardData } from '../../card-sync.js';
import { prisma } from '../../db.js';

export async function GET() {
  const row = await prisma.cardContent.findUnique({ where: { id: 'card' }, select: { updatedAt: true } });
  return Response.json({ content: await loadContent(), defaults: defaults(), updatedAt: row?.updatedAt ?? null });
}

// Saves the card and carries it into the planner (functions, ritual timings, invitation text, family contacts)
export async function PUT(req) {
  const saved = await saveContent(await req.json());
  await syncCardData(saved.content);
  return Response.json(saved);
}
