import apiHandler from '@/lib/apiHandler';
import database from '@/lib/database';

export default apiHandler(['verifyJwt']).get(async (req, res) => {
  const all = await database.hashtag.findMany({
    include: {
      _count: {
        select: {
          tagged: true,
        },
      },
    },
    orderBy: {
      tagged: {
        _count: 'desc',
      },
    },
    take: 5,
  });

  return res.json({
    message: 'Get popular tag',
    data: all,
  });
});
