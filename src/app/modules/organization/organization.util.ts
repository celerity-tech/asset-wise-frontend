/**
 * Up to two uppercase initials from an organization name, used as the logo
 * fallback wherever the org has no image set. Mirrors the user-avatar initials
 * pattern so the two read as a family.
 */
export function orgMonogram(name: string | null | undefined): string {
  const trimmed = name?.trim();
  if (!trimmed) {
    return '·';
  }
  const parts = trimmed.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const second = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : '';
  return `${first}${second}`.toUpperCase() || trimmed[0].toUpperCase();
}
