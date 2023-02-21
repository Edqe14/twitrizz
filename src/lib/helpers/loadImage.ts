/**
 * Load image from string or file
 * @returns Image
 */
export default function loadImage(src: string | File) {
  const img = new Image();

  return new Promise<HTMLImageElement>((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    if (src instanceof File) {
      img.src = URL.createObjectURL(src);
    } else {
      img.src = src;
    }
  });
}
