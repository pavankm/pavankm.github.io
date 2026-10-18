export const MAX_WORDS = 120;

export function tokenize(text) {
  return text.normalize("NFKC").replaceAll("\u2019", "'").toLowerCase()
    .match(/\p{L}[\p{L}\p{M}]*(?:'[\p{L}\p{M}]+)*/gu) ?? [];
}

export function countWords(content, stopWords) {
  const excluded = new Set(tokenize(stopWords));
  const frequencies = new Map();
  for (const text of tokenize(content)) {
    if (Array.from(text).length < 2 || excluded.has(text)) continue;
    frequencies.set(text, (frequencies.get(text) ?? 0) + 1);
  }
  const ranked = Array.from(frequencies, ([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count || a.text.localeCompare(b.text));
  return { words: ranked.slice(0, MAX_WORDS), uniqueCount: ranked.length };
}
