// Keep missing or unsafe destinations out of the visitor's tab order.
export function linkHref(value, kind = 'web', base = 'https://portfolio.example/') {
  if (typeof value !== 'string' || !value.trim()) return null;
  const raw = value.trim();
  if (kind === 'email') {
    return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(raw) ? `mailto:${raw}` : null;
  }
  try {
    const url = new URL(raw, base);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}
