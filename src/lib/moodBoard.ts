const STORAGE_KEY = "aviora_mood_board";

export interface MoodBoardItem {
  slug: string;
  title: string;
  sku: string | null;
  productType: string;
}

function safeParse(raw: string | null): MoodBoardItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getMoodBoard(): MoodBoardItem[] {
  if (typeof window === "undefined") return [];
  try {
    return safeParse(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

function save(items: MoodBoardItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("aviora-mood-board-change"));
  } catch {
    // localStorage unavailable (private window, blocked site data) — the
    // board just won't persist for this viewer, which is an acceptable
    // degradation rather than a hard failure.
  }
}

export function isInMoodBoard(slug: string): boolean {
  return getMoodBoard().some((i) => i.slug === slug);
}

export function toggleMoodBoard(item: MoodBoardItem): boolean {
  const current = getMoodBoard();
  const exists = current.some((i) => i.slug === item.slug);
  const next = exists ? current.filter((i) => i.slug !== item.slug) : [...current, item];
  save(next);
  return !exists;
}

export function removeFromMoodBoard(slug: string) {
  save(getMoodBoard().filter((i) => i.slug !== slug));
}

export function clearMoodBoard() {
  save([]);
}
