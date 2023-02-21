import { verify } from 'jsonwebtoken';
import { NextApiRequest } from 'next';

/**
 * Resolve username from request via cookie
 */
export default function resolveUsernameFromRequest(req: NextApiRequest) {
  const { token } = req.cookies;

  if (!token) return null;

  return req.query.username === '@me'
    ? (verify(token, process.env.JWT_SECRET) as ExtendedJwtPayload).username
    : (req.query.username as string);
}
