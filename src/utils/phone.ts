// Canonical form of a phone number, mirroring PhoneNumbers.Normalize on the
// backend: digits only (plus a leading "+"), so "059-586 0351" and
// "0595860351" count as the same number. Blank → null.
export const normalizePhone = (phone: string | null | undefined): string | null => {
  const trimmed = (phone ?? "").trim();
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return null;
  return trimmed.startsWith("+") ? `+${digits}` : digits;
};

// True when another account (not `exceptUserId`) already has this number.
// A quick check against the list the page already loaded; the backend and the
// database's unique index remain the source of truth.
export const isPhoneTaken = (
  phone: string,
  users: { id: number; phoneNumber?: string | null }[],
  exceptUserId?: number,
): boolean => {
  const normalized = normalizePhone(phone);
  if (!normalized) return false;
  return users.some((u) => u.id !== exceptUserId && normalizePhone(u.phoneNumber) === normalized);
};
