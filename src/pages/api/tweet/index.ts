import apiHandler from '@/lib/apiHandler';
import database from '@/lib/database';
import firebase from '@/lib/firebase';
import flattenZodError from '@/lib/helpers/flattenZodError';
import { File, IncomingForm } from 'formidable';
import { readFile } from 'fs/promises';
import { z } from 'zod';

const validator = z.object({
  text: z.string().max(250).min(1),
  replyToId: z.string().optional(),
});

const uploadHandler = new IncomingForm({
  maxFileSize: 20 * 1024 * 1024, // 20MB
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiHandler(['verifyJwt'])
  .get(async (req, res) => {
    const tweets = await database.tweet.findMany({
      where: {
        replyToId: null,
      },
      include: {
        author: {
          select: {
            id: true,
            image: true,
            username: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json({
      message: 'All tweets',
      tweets,
    });
  })
  .post(async (req, res) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    uploadHandler.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({
          message: 'Failed to upload image',
        });
      }

      const validated = await validator.safeParseAsync(fields);
      if (!validated.success) {
        return res.status(422).json({
          message: 'Invalid request',
          errors: flattenZodError(validated.error.flatten()),
        });
      }

      const data: { text: string; replyToId?: string; mediaUrl?: string } = {
        text: validated.data.text,
        replyToId: validated.data.replyToId,
      };

      const media = files.media as File;
      if (media) {
        const buffer = await readFile(media.filepath);
        const url = await firebase.uploadFile(
          `attachments/${media.originalFilename}`,
          buffer,
        );

        data.mediaUrl = url;
      }

      const hashtags = data.text
        .split(' ')
        .filter((t) => t.startsWith('#'))
        .map((t) => t.slice(1));

      const hashtagsId = await Promise.all(
        hashtags.map((name) =>
          database.hashtag.upsert({
            create: {
              name,
            },
            update: {},
            where: {
              name,
            },
          }),
        ),
      );

      const created = await database.tweet.create({
        data: {
          ...data,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          authorId: req.user!.id,
          tagged: {
            createMany: {
              data: hashtagsId.map((tag) => ({
                hashtagId: tag.id,
              })),
              skipDuplicates: true,
            },
          },
        },
        include: {
          author: {
            select: {
              id: true,
              image: true,
              username: true,
            },
          },
          _count: {
            select: {
              replies: true,
            },
          },
        },
      });

      return res.json({
        message: 'Tweet created',
        tweet: created,
      });
    });
  });
