function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[] = new Array(n + 1);
  for (let j = 0; j <= n; j++) dp[j] = j;

  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const temp = dp[j];
      dp[j] =
        a[i - 1] === b[j - 1]
          ? prev
          : 1 + Math.min(prev, dp[j], dp[j - 1]);
      prev = temp;
    }
  }
  return dp[n];
}

/**
 * Returns the closest match to `query` from `candidates` if it's within a
 * reasonable edit-distance threshold relative to word length, else undefined.
 * Powers the Menu search empty state's "Did you mean…" suggestion.
 */
export function closestMatch(query: string, candidates: string[]): string | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;

  let best: { candidate: string; distance: number } | undefined;
  for (const candidate of candidates) {
    const distance = levenshtein(q, candidate.toLowerCase());
    if (!best || distance < best.distance) {
      best = { candidate, distance };
    }
  }

  if (!best) return undefined;
  const threshold = Math.max(2, Math.floor(q.length * 0.4));
  return best.distance <= threshold && best.candidate.toLowerCase() !== q
    ? best.candidate
    : undefined;
}
