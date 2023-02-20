import { NextApiResponse } from 'next';
import nc, { Middleware } from 'next-connect';
import middlewares from './middlewares';

/**
 * Create new api handler with middlewares
 *
 * @example
 * export default apiHandler().post((req, res) => {
 *  res.json({ message: 'Hello world' });
 * });
 */
export default function apiHandler(
  useMiddlewares: (
    | keyof typeof middlewares
    | Middleware<ExtendedRequest, NextApiResponse>
  )[] = [],
) {
  const handler = nc<ExtendedRequest, NextApiResponse>({
    onError(error, req, res) {
      // eslint-disable-next-line no-console
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    },
    onNoMatch(req, res) {
      res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    },
  });

  useMiddlewares.forEach((m) => {
    if (typeof m === 'string') {
      return handler.use(middlewares[m]);
    }

    handler.use(m);
  });

  return handler;
}
