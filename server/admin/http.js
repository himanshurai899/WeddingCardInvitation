export const WEDDING_ID = process.env.WEDDING_ID ?? 'vivah-2026';

export const getWeddingId = () => WEDDING_ID;

export const ok = (data, status = 200) => Response.json(data, { status });

export const err = (message, status = 400) => Response.json({ error: message }, { status });

export function serverErr(e) {
  console.error(e);
  const message = e instanceof Error ? e.message : 'Internal server error';
  return Response.json({ error: message }, { status: 500 });
}
