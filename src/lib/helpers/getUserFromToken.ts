import { verify } from 'jsonwebtoken';
import database from '../database';

export default async function getUserFromToken(token: string) {
  try {
    const decoded = verify(token, process.env.JWT_SECRET) as ExtendedJwtPayload;

    const user = await database.user.findUniqueOrThrow({
      where: {
        id: decoded.id,
      },
    });

    return user;
  } catch {
    return null;
  }
}
