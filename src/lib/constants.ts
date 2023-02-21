/* eslint-disable import/prefer-default-export */
export const USER_IMAGE_PLACEHOLDER = '/image/user-placeholder.png';

export const IMAGE_MIMETYPES = ['image/png', 'image/jpeg', 'image/webp'];
export const EXTENDED_IMAGE_MIMETYPES = [
  ...IMAGE_MIMETYPES,
  'image/gif',
  'image/avif',
];
export const VIDEO_MIMETYPES = ['video/mp4', 'video/webm'];

export const IMAGE_EXTENSION_MIMETYPE_MAP = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  avif: 'image/avif',
};

export const VIDEO_EXTENSION_MIMETYPE_MAP = {
  mp4: 'video/mp4',
  webm: 'video/webm',
};
