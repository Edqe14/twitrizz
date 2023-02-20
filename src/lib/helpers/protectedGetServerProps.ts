import { deleteCookie } from 'cookies-next';
import { verify } from 'jsonwebtoken';

/**
 * Get server props with extra handler for protected views.
 *
 * @example
 * export const getServerSideProps = protectedGetServerProps();
 */
const protectedGetServerProps = (handler?: GetServerSidePropsWithUser) => {
  const internalHandler: GetServerSidePropsWithUser = async (ctx) => {
    const { token } = ctx.req.cookies;

    if (!token) {
      return {
        redirect: {
          permanent: true,
          destination: '/login',
        },
      };
    }

    try {
      const decoded = verify(
        token,
        process.env.JWT_SECRET,
      ) as ExtendedJwtPayload;

      ctx.user = decoded;

      if (!handler) {
        return {
          props: {
            decoded,
          },
        };
      }

      return handler(ctx);
    } catch {
      deleteCookie('token', {
        httpOnly: true,
        req: ctx.req,
        res: ctx.res,
      });

      return {
        redirect: {
          permanent: true,
          destination: '/login',
        },
      };
    }
  };

  return internalHandler;
};

export default protectedGetServerProps;
