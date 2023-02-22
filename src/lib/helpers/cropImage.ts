/* eslint-disable no-promise-executor-return */

import loadImage from './loadImage';

/**
 * Crop image to aspect ratio 1:1 on top
 * @returns Cropped Blob
 * @throws Error
 */
export default function cropImage(input: HTMLImageElement | File) {
  return new Promise<Blob>((resolve, reject) => {
    (async () => {
      const img = input instanceof File ? await loadImage(input) : input;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Failed to get canvas context'));
      }

      const size = 512;
      canvas.width = size;
      canvas.height = size;

      const min = Math.min(img.width, img.height);
      const ratio = size / min;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ctx.drawImage(img, 0, 0, img.width * ratio, img.height * ratio);
      canvas.toBlob((blob) => {
        if (!blob) {
          return reject(new Error('Failed to crop image'));
        }

        resolve(blob);
      }, 'image/jpeg');
    })();
  });
}
