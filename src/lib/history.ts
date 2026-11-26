const KEY = "devpulse:recent";
const MAX = 6;

const EMPTY: string[] = [];
const listeners = new Set<() => void>();

let lastRaw: string | null = null;
let lastParsed: string[] = EMPTY;

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === lastRaw) return lastParsed;
    lastRaw = raw;
    const parsed = raw ? JSON.parse(raw) : [];
    lastParsed = Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : EMPTY;
    return lastParsed;
  } catch {
    return EMPTY;
  }
}

function notify() {
  listeners.forEach((l) => l());
}

export function addToHistory(username: string) {
  const next = [
    username,
    ...read().filter((n) => n.toLowerCase() !== username.toLowerCase()),
  ].slice(0, MAX);

  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage unavailable, skip silently
  }
  notify();
}

export function clearHistory() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // storage unavailable, skip silently
  }
  notify();
}

export function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function getHistorySnapshot() {
  return read();
}

export function getServerSnapshot() {
  return EMPTY;
}