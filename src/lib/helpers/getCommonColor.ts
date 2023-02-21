import sleep from './sleep';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-continue */
/* eslint-disable no-bitwise */

export default async function getCommonColor(image: HTMLImageElement) {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Unable to get 2D context for canvas');
  }

  context.drawImage(image, 0, 0, image.width, image.height);
  const imageData = context.getImageData(0, 0, image.width, image.height);
  const pixels = imageData.data;
  const colorCounts = new Map<number, number>();

  await sleep(0);

  for (let i = 0; i < pixels.length; i += 4) {
    const red = pixels[i];
    const green = pixels[i + 1];
    const blue = pixels[i + 2];
    const alpha = pixels[i + 3];

    // ignore transparent pixels
    if (alpha === 0) {
      continue;
    }

    const color = (red << 16) | (green << 8) | blue;
    colorCounts.set(color, (colorCounts.get(color) ?? 0) + 1);
  }

  let maxColor = 0;
  let maxCount = 0;

  colorCounts.forEach((count, color) => {
    if (count > maxCount) {
      maxCount = count;
      maxColor = color;
    }
  });

  const r = (maxColor >> 16) & 0xff;
  const g = (maxColor >> 8) & 0xff;
  const b = maxColor & 0xff;

  return `rgb(${r}, ${g}, ${b})`;
}
