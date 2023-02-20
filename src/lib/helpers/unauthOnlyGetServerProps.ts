import { deleteCookie } from 'cookies-next';
import { verify } from 'jsonwebtoken';

/**
 * Get server side props with extra handler for unauthenticated views only.
 *
 * @example
 * export const getServerSideProps = unauthOnlyGetServerProps();
 */
const unauthOnlyGetServerProps = (handler?: GetServerSidePropsWithUser) => {
  const internal: GetServerSidePropsWithUser = async (ctx) => {
    if (ctx.req.cookies.token) {
      const { token } = ctx.req.cookies;

      try {
        verify(token, process.env.JWT_SECRET) as ExtendedJwtPayload;

        return {
          redirect: {
            permanent: true,
            destination: '/',
          },
        };
      } catch {
        deleteCookie('token', {
          httpOnly: true,
          req: ctx.req,
          res: ctx.res,
        });
      }
    }

    if (!handler) {
      return {
        props: {},
      };
    }

    return handler(ctx);
  };

  return internal;
};

export default unauthOnlyGetServerProps;
