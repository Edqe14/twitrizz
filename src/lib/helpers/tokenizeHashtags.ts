/**
 * Tokenize hashtags from a string
 */
export default function tokenizeHashtags(text?: string) {
  if (!text) return [];

  const tokens = text
    .split(/(#\w+)/)
    .map((token) => token.trim())
    .filter((token) => token !== '');

  return tokens;
}
