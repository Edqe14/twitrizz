/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient, Tweet, User } from '@prisma/client';
import { FirebaseApp } from 'firebase/app';
import { JwtPayload } from 'jsonwebtoken';
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiRequest,
} from 'next';
import { ParsedUrlQuery } from 'querystring';

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var prisma: PrismaClient | undefined;
  // eslint-disable-next-line vars-on-top, no-var
  var firebase: FirebaseApp | undefined;

  // eslint-disable-next-line prettier/prettier
  type JwtUser = Pick<User, 'id' | 'username' | 'email' | 'createdAt' | 'updatedAt'>;
  interface ExtendedRequest extends NextApiRequest {
    user?: JwtUser;
  }

  type ExtendedJwtPayload = JwtPayload & JwtUser;

  type GetServerSidePropsWithUser<
    P extends { [key: string]: any } = { [key: string]: any },
    Q extends ParsedUrlQuery = ParsedUrlQuery,
  > = (
    context: GetServerSidePropsContext<Q> & { user: JwtUser },
  ) => Promise<GetServerSidePropsResult<P>>;

  type TweetPreview = Tweet & {
    _count: {
      replies: number;
    };
    author: {
      id: string;
      username: string;
      image: string | null;
    };
  };

  type TweetPreviews = TweetPreview[];
}
