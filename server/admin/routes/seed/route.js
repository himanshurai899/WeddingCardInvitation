import { seedDatabase } from '../../seed.js';
export async function POST() {
  try {
    await seedDatabase();
    return Response.json({ success: true, message: 'Database seeded successfully' });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Seed failed';
    return Response.json({ error: msg }, { status: 500 });
  }
}
