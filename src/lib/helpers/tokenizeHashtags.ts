/**
 * Tokenize hashtags from a string
 */
export default function tokenizeHashtags(text?: string | null) {
  if (!text) return [];

  const tokens = text
    .split(/(#\w+)/)
    .map((v) => v.split(/(\n)/))
    .flat()
    .filter((token) => token !== '');

  return tokens;
}
