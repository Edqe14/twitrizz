/* eslint-disable @typescript-eslint/indent */
import apiHandler from '@/lib/apiHandler';
import database from '@/lib/database';
import tokenizeHashtags from '@/lib/helpers/tokenizeHashtags';

export default apiHandler(['verifyJwt']).get(async (req, res) => {
  const query = req.query.q as string;
  const user = req.query.u as string;

  const tokens = tokenizeHashtags(query);
  const hashtags = tokens
    .filter((t) => t.startsWith('#'))
    .map((t) => t.slice(1));
  const textOnly = tokens.filter((t) => !t.startsWith('#'));

  const all = await database.tweet.findMany({
    where: {
      ...(textOnly.length
        ? {
            text: {
              search: textOnly.join(' <-> '),
            },
          }
        : {}),
      ...(hashtags.length
        ? {
            tagged: {
              some: {
                hashtag: {
                  name: {
                    in: hashtags,
                  },
                },
              },
            },
          }
        : {}),
      ...(user
        ? {
            authorId: user,
          }
        : {}),
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
    message: 'Search tweet',
    tweets: all,
  });
});
