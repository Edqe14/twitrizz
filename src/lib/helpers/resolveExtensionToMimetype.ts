import {
  IMAGE_EXTENSION_MIMETYPE_MAP,
  VIDEO_EXTENSION_MIMETYPE_MAP,
} from '../constants';

const all: { [key: string]: string | undefined } = {
  ...IMAGE_EXTENSION_MIMETYPE_MAP,
  ...VIDEO_EXTENSION_MIMETYPE_MAP,
};

/**
 * Resolve file extension to mimetype
 */
export default function resolveExtensionToMimetype(ext: string) {
  return all[ext];
}
