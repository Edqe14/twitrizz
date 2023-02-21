import apiHandler from '@/lib/apiHandler';
import database from '@/lib/database';
import firebase from '@/lib/firebase';
import flattenZodError from '@/lib/helpers/flattenZodError';
import { File, IncomingForm } from 'formidable';
import { readFile } from 'fs/promises';
import { z } from 'zod';

const validator = z.object({
  text: z.string().max(250).min(1).optional(),
});

const uploadHandler = new IncomingForm({
  maxFileSize: 20 * 1024 * 1024, // 20MB
});

export const config = {
  api: {
    bodyParser: false,
  },
};

// TODO: update & delete tweet
export default apiHandler(['verifyJwt'])
  .get(async (req, res) => {
    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({
        message: 'Invalid request',
      });
    }

    const tweet = await database.tweet.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            id: true,
            image: true,
            username: true,
          },
        },
        replies: {
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
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    if (!tweet) {
      return res.status(404).json({
        message: 'Tweet not found',
      });
    }

    return res.json({
      message: 'Get tweet',
      tweet,
    });
  })
  .put(async (req, res) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const tweet = await database.tweet.findUnique({
      where: {
        id: req.query.id as string,
      },
    });

    if (!tweet) {
      return res.status(404).json({
        message: 'Tweet not found',
      });
    }

    if (tweet.authorId !== req.user.id) {
      return res.status(403).json({
        message: 'Forbidden',
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

      const data: { text?: string; mediaUrl?: string | null } = {
        text: validated.data.text,
      };

      const media = files.media as File | null | undefined;
      if (media) {
        const buffer = await readFile(media.filepath);
        const url = await firebase.uploadFile(
          `attachments/${media.originalFilename}`,
          buffer,
        );

        data.mediaUrl = url;
      } else if (fields.media === 'null') {
        data.mediaUrl = null;
      }

      if (data.text) {
        await database.hashtaggedTweet.deleteMany({
          where: {
            tweetId: tweet.id,
          },
        });

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

        await database.hashtaggedTweet.createMany({
          data: hashtagsId.map((tag) => ({
            hashtagId: tag.id,
            tweetId: tweet.id,
          })),
          skipDuplicates: true,
        });
      }

      const updated = await database.tweet.update({
        where: {
          id: tweet.id,
        },
        data,
        include: {
          author: {
            select: {
              id: true,
              image: true,
              username: true,
            },
          },
          replies: {
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
          },
          _count: {
            select: {
              replies: true,
            },
          },
        },
      });

      return res.json({
        message: 'Tweet updated',
        tweet: updated,
      });
    });
  })
  .delete(async (req, res) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const tweet = await database.tweet.findUnique({
      where: {
        id: req.query.id as string,
      },
    });

    if (!tweet) {
      return res.status(404).json({
        message: 'Tweet not found',
      });
    }

    if (tweet.authorId !== req.user.id) {
      return res.status(403).json({
        message: 'Forbidden',
      });
    }

    await database.tweet.delete({
      where: {
        id: tweet.id,
      },
    });

    return res.json({
      message: 'Tweet deleted',
    });
  });
