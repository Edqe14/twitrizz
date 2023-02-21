/* eslint-disable @next/next/no-img-element */
import Head from '@/components/Head';
import TweetRenderer from '@/components/Tweet';
import Twemoji from '@/components/Twemoji';
import MainLayout from '@/components/layout/Main';
import useUser from '@/hooks/useUser';
import { USER_IMAGE_PLACEHOLDER } from '@/lib/constants';
import database from '@/lib/database';
import getCommonColor from '@/lib/helpers/getCommonColor';
import loadImage from '@/lib/helpers/loadImage';
import openUserSettings from '@/lib/helpers/openUserSettings';
import protectedGetServerProps from '@/lib/helpers/protectedGetServerProps';
import tokenizeHashtags from '@/lib/helpers/tokenizeHashtags';
import { LoadingOverlay, Tooltip } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, FadersHorizontal } from 'phosphor-react';
import { useAsync } from 'react-use';
import useSWR from 'swr';

interface Props {
  user: UserPreview;
}

export default function Profile({ user }: Props) {
  const router = useRouter();
  const { user: currentUser } = useUser();
  const hashtagTokens = tokenizeHashtags(user.bio);
  const commonColor = useAsync(async () => {
    if (!user.image) return '#BED4DD';

    const image = await loadImage(user.image);
    return getCommonColor(image);
  }, [user.image]);

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const { data, isLoading, mutate } = useSWR<{ tweets: TweetPreviews }>(
    `/tweet/search?u=${user.id}`,
  );

  const tweets = data?.tweets;

  return (
    <>
      <Head title={`${user.username}'s profile`} />

      <MainLayout className="overflow-hidden flex flex-col group">
        <section className="p-5 bg-white border-b">
          <h2 className="text-2xl font-bold flex items-center gap-4 text-blue-bayoux-700">
            <ArrowLeft
              onClick={() => router.back()}
              weight="bold"
              className="cursor-pointer"
            />

            {user.username}
          </h2>
        </section>

        <section className="overflow-hidden group-hover:overflow-y-auto">
          <section
            className="h-44 border-b relative"
            style={{ background: commonColor.value ?? '#BED4DD' }}
          >
            <img
              src={user.image ?? USER_IMAGE_PLACEHOLDER}
              alt=""
              className="w-40 h-40 translate-y-1/2 rounded-full bg-pattens-blue-50 absolute bottom-0 left-6 border-[10px] border-white"
            />
          </section>

          <section className="p-6 flex justify-end mb-4">
            {currentUser?.id === user.id && (
              <Tooltip label="Edit profile" color="blue" withArrow>
                <FadersHorizontal
                  onClick={() => openUserSettings(refreshData)}
                  size={24}
                  className="cursor-pointer text-blue-bayoux-600"
                  weight="bold"
                />
              </Tooltip>
            )}
          </section>

          <section className="px-8 pb-6 border-b">
            <h3 className="text-2xl font-bold text-blue-bayoux-600 mb-2">
              {user.username}
            </h3>

            <Twemoji className="font-poppins text-base text-zinc-800 mb-1">
              {hashtagTokens.map((t, i, a) =>
                t.startsWith('#') ? (
                  <Link
                    className="text-dodger-blue-600 inline"
                    href={`/search?q=${encodeURIComponent(t)}`}
                    key={t}
                  >
                    {t}
                  </Link>
                ) : (
                  `${i === a.length - 1 ? ' ' : ''}${t}${i === 0 ? ' ' : ''}`
                ),
              )}
            </Twemoji>
          </section>

          <section className="relative flex-grow overflow-auto divide-y">
            <LoadingOverlay visible={isLoading} />

            {tweets &&
              tweets.map((tw) => (
                <TweetRenderer {...tw} key={tw.id} mutate={mutate} />
              ))}

            <section className="flex justify-center items-center py-4 opacity-25">
              •
            </section>
          </section>
        </section>
      </MainLayout>
    </>
  );
}

export const getServerSideProps = protectedGetServerProps(async (ctx) => {
  const name = ctx.query?.name as string;

  const user = await database.user.findUnique({
    where: {
      username: name,
    },
    select: {
      id: true,
      image: true,
      bio: true,
      createdAt: true,
      username: true,
    },
  });

  if (!user) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user,
    },
  };
});
