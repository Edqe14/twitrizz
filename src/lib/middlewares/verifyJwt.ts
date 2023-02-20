import { Middleware } from 'next-connect';
import { NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';
import { getCookie } from 'cookies-next';

/**
 * Verify JWT token from request (from header or query)
 *
 * @requires API Handler (next-connect or express)
 */
const verifyJwt: Middleware<ExtendedRequest, NextApiResponse> = (
  req,
  res,
  next,
) => {
  const token =
    (getCookie('token', { req, res }) as string | undefined) ??
    req.headers.authorization?.split(' ')?.[1] ??
    (req.query.token as string | undefined);
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET) as ExtendedJwtPayload;
    req.user = decoded;

    next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export default verifyJwt;
