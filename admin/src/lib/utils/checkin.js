export function buildQrPayload(record) {
  return JSON.stringify({ id: record.id, guest: record.guestName, event: record.eventName });
}
export function calculateCheckInStats(records) {
  const total = records.length;
  const checkedIn = records.filter((r) => r.status === 'CHECKED_IN').length;
  const pending = records.filter((r) => r.status === 'PENDING').length;
  const absent = records.filter((r) => r.status === 'ABSENT').length;
  const progressPct = total === 0 ? 0 : Math.round((checkedIn / total) * 100);
  return { total, checkedIn, pending, absent, progressPct };
}
