import { loadContent } from '../../card-content.js';
import { syncCardData } from '../../card-sync.js';

// Copies the invitation card's details into the admin data again (functions, ritual timings, invitation text, family)
export async function POST() {
  try {
    await syncCardData(await loadContent());
    return Response.json({ success: true, message: 'Admin data updated from the invitation card' });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : 'Sync failed' }, { status: 500 });
  }
}
