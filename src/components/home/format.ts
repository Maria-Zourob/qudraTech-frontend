/**
 * Render a stage/phase code ("01") using English digits,
 * keeping the leading zero.
 */
export function formatCode(code: string, locale: string): string {
  const n = Number(code);
  if (!Number.isFinite(n)) return code;

  return new Intl.NumberFormat('en', {
    minimumIntegerDigits: Math.max(2, code.length),
    useGrouping: false,
  }).format(n);
}