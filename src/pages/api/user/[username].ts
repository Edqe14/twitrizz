/* eslint-disable @typescript-eslint/indent */
import apiHandler from '@/lib/apiHandler';
import database from '@/lib/database';
import { verify } from 'jsonwebtoken';

export default apiHandler(['verifyJwt']).get(async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({
      message: 'Invalid credentials',
    });
  }

  const username =
    req.query.username === '@me'
      ? (verify(token, process.env.JWT_SECRET) as ExtendedJwtPayload).username
      : (req.query.username as string);

  const user = await database.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      image: true,
      bio: true,
      username: true,
      createdAt: true,
      ...(req.query.username === '@me'
        ? {
            email: true,
          }
        : {}),
    },
  });

  if (!user) {
    return res.status(404).json({
      message: 'User not found',
    });
  }

  return res.status(200).json({
    message: 'User found',
    user,
  });
});
