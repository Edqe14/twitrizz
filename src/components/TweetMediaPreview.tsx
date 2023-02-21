/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @next/next/no-img-element */
import { EXTENDED_IMAGE_MIMETYPES, VIDEO_MIMETYPES } from '@/lib/constants';
import getFilenameFromUrl from '@/lib/helpers/getFilenameFromUrl';
import resolveExtensionToMimetype from '@/lib/helpers/resolveExtensionToMimetype';
import { File } from 'phosphor-react';

export default function TweetMediaPreview({
  media,
}: {
  media: File | string | null;
}) {
  if (!media) return null;

  const url = typeof media === 'string' ? media : URL.createObjectURL(media);
  if (!url) return null;

  const name =
    typeof media === 'string'
      ? (getFilenameFromUrl(media as string)
          .split('.')
          .pop() as string)
      : media.name;

  const mimetype =
    typeof media === 'string'
      ? (resolveExtensionToMimetype(
          getFilenameFromUrl(media as string)
            .split('.')
            .pop() as string,
        ) as string)
      : media.type;

  if (EXTENDED_IMAGE_MIMETYPES.includes(mimetype)) {
    return (
      <img
        src={url}
        alt=""
        className="object-cover max-h-96 rounded-xl bg-pattens-blue-100 border border-pattens-blue-400"
      />
    );
  }

  if (VIDEO_MIMETYPES.includes(mimetype)) {
    return <video src={url} controls className="rounded-xl" />;
  }

  return (
    <section className="flex">
      <File weight="fill" size={24} />

      <p>{name}</p>
    </section>
  );
}
