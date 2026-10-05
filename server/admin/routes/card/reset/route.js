import { defaults, saveContent } from '../../../card-content.js';
import { syncCardData } from '../../../card-sync.js';

// Back to the proof copy in src/config/wedding.js
export async function POST() {
  const saved = await saveContent(defaults());
  await syncCardData(saved.content);
  return Response.json(saved);
}
