/**
 * Resolve stored media url to original filename
 *
 * @example
 * const input = 'http://localhost:9199/v0/b/experiment.appspot.com/o/attachments%2F00288.png?alt=media&token=32a3593a-8fe1-4e07-a19c-feade0d08fbc';
 * const output = getFilenameFromUrl(input); // 00288.png
 */
export default function getFilenameFromUrl(url: string) {
  // url format: http://localhost:9199/v0/b/experiment.appspot.com/o/attachments%2F00288.png?alt=media&token=32a3593a-8fe1-4e07-a19c-feade0d08fbc
  const decoded = decodeURIComponent(url);
  const clean = decoded.slice(decoded.indexOf('o/') + 2, decoded.indexOf('?'));

  return clean.split('/').pop() as string;
}
