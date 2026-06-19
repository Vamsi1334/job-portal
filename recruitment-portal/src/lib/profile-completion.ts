import type { AuthUser } from '@/types';

function hasContentRows(rows?: readonly unknown[]): boolean {
  if (!Array.isArray(rows)) return false;
  return rows.some(
    (row) =>
      row &&
      typeof row === 'object' &&
      Object.values(row as Record<string, unknown>).some(
        (v) => typeof v === 'string' && v.trim() !== '',
      ),
  );
}

/**
 * Each item is one equally-weighted part of a complete profile. Kept as a list
 * so the label of what is still missing can be derived from the same source.
 */
function checklist(user: AuthUser) {
  const social = user.social ?? {};
  return [
    { label: 'name', done: Boolean(user.firstName && user.lastName) },
    { label: 'a headline', done: Boolean(user.headline?.trim()) },
    { label: 'an about summary', done: Boolean(user.about?.trim()) },
    { label: 'a phone number', done: Boolean(user.phone?.trim()) },
    {
      label: 'a preferred location',
      done: Boolean(user.preferredLocation?.trim() || user.location?.trim()),
    },
    { label: 'your current company', done: Boolean(user.currentCompany?.trim()) },
    { label: 'skills', done: (user.skills ?? []).some((s) => s && s.trim() !== '') },
    { label: 'work experience', done: hasContentRows(user.experience) },
    { label: 'education', done: hasContentRows(user.education) },
    {
      label: 'a social link',
      done: Boolean(social.linkedin || social.github || social.portfolio || social.twitter),
    },
  ];
}

/** Percentage (0–100) of the profile that has been filled in. */
export function getProfileCompletion(user: AuthUser | null): number {
  if (!user) return 0;
  const items = checklist(user);
  const done = items.filter((i) => i.done).length;
  return Math.round((done / items.length) * 100);
}

/** The first few things still missing, for a friendly hint. */
export function getMissingProfileItems(user: AuthUser | null, limit = 2): string[] {
  if (!user) return [];
  return checklist(user)
    .filter((i) => !i.done)
    .map((i) => i.label)
    .slice(0, limit);
}
