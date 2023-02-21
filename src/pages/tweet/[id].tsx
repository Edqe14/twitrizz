/* eslint-disable @next/next/no-img-element */
import Button from '@/components/Button';
import Head from '@/components/Head';
import TweetRenderer from '@/components/Tweet';
import TweetMediaPreview from '@/components/TweetMediaPreview';
import Twemoji from '@/components/Twemoji';
import MainLayout from '@/components/layout/Main';
import useUser from '@/hooks/useUser';
import { USER_IMAGE_PLACEHOLDER } from '@/lib/constants';
import fetcher from '@/lib/helpers/axios';
import openComposeTweet from '@/lib/helpers/openComposeTweet';
import protectedGetServerProps from '@/lib/helpers/protectedGetServerProps';
import tokenizeHashtags from '@/lib/helpers/tokenizeHashtags';
import { LoadingOverlay, Menu } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, DotsThree, Pencil, Trash } from 'phosphor-react';
import { useMemo } from 'react';
import { useAsync } from 'react-use';
import useSWR from 'swr';

interface Props {
  id: string;
}

export default function TweetPage({ id }: Props) {
  const router = useRouter();
  const { user } = useUser();

  // eslint-disable-next-line prettier/prettier
  const { data, isLoading, mutate } = useSWR<{ tweet: TweetPreview & { replies: TweetPreviews }}>(`/tweet/${id}`);
  const tweet = data?.tweet;
  const tokens = tokenizeHashtags(tweet?.text);

  const date = useMemo(
    () => (tweet?.createdAt ? DateTime.fromJSDate(tweet.createdAt) : null),
    [tweet],
  );

  const replyTo = useAsync(async () => {
    if (!tweet || !tweet.replyToId) return;

    return fetcher
      .get<{ tweet: TweetPreview }>(`/tweet/${tweet.replyToId}`)
      .then((res) => res.data);
  }, [tweet?.replyToId]);

  return (
    <>
      <Head
        title={tweet ? `${tweet.author.username}'s tweet` : 'Loading tweet'}
      />

      <MainLayout className="overflow-hidden relative flex flex-col group">
        <LoadingOverlay visible={isLoading} />

        {tweet && date && (
          <>
            <section className="p-5 bg-white border-b">
              <h2 className="text-2xl font-bold flex items-center gap-4 text-blue-bayoux-700">
                <ArrowLeft
                  onClick={() => router.back()}
                  weight="bold"
                  className="cursor-pointer"
                />

                {`${tweet.author.username}'s tweet`}
              </h2>
            </section>

            <section className="group-hover:overflow-y-auto">
              <section className="flex p-5 pb-2 gap-4 justify-between items-center">
                <Link
                  href={`/u/${tweet.author.username}`}
                  className="flex gap-4 items-center"
                >
                  <img
                    src={tweet.author.image ?? USER_IMAGE_PLACEHOLDER}
                    alt=""
                    className="w-12 h-12 rounded-full bg-pattens-blue-50"
                  />

                  <h3 className="font-semibold text-lg text-blue-bayoux-700">
                    {tweet.author.username}
                  </h3>
                </Link>

                {user?.id === tweet.author.id && (
                  <Menu position="bottom-end" width={150}>
                    <Menu.Target>
                      <DotsThree
                        size={24}
                        weight="bold"
                        className="text-blue-bayoux-700 cursor-pointer"
                      />
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Item
                        color="blue"
                        icon={<Pencil size={16} />}
                        onClick={() =>
                          openComposeTweet({
                            edit: true,
                            id: tweet.id,
                            onClose: mutate,
                            mediaUrl: tweet.mediaUrl,
                            text: tweet.text,
                          })
                        }
                      >
                        Edit
                      </Menu.Item>

                      <Menu.Item
                        color="red"
                        icon={<Trash size={16} />}
                        onClick={async () => {
                          try {
                            await fetcher.delete(`/tweet/${tweet.id}`);
                            await router.push('/');

                            showNotification({
                              title: 'Success',
                              message: 'Tweet deleted',
                              color: 'green',
                            });
                          } catch {
                            showNotification({
                              title: 'Error',
                              message: 'Something went wrong',
                              color: 'red',
                            });
                          }
                        }}
                      >
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                )}
              </section>

              <section className="px-5 pb-5 border-b">
                {tweet.replyToId && replyTo.value && (
                  <p className="text-sm text-blue-bayoux-300 my-1">
                    Replying to{' '}
                    <span className="text-dodger-blue-600">
                      @{replyTo.value.tweet.author.username}
                    </span>
                  </p>
                )}

                <Twemoji className="font-poppins text-lg text-zinc-800 mb-1 flex gap-2 items-center">
                  {tokens.map((t) =>
                    t.startsWith('#') ? (
                      <Link
                        className="text-dodger-blue-600"
                        href={`/search?q=${encodeURIComponent(t)}`}
                        key={t}
                      >
                        {t}
                      </Link>
                    ) : (
                      t
                    ),
                  )}
                </Twemoji>

                {tweet.mediaUrl && <TweetMediaPreview media={tweet.mediaUrl} />}

                <span className="text-sm text-blue-bayoux-500 gap-2 flex mt-3">
                  {date.toFormat('t')}
                  <p>•</p>
                  {date.toFormat('DD')}
                </span>
              </section>

              <section className="py-3 px-5 border-b">
                <Button
                  onClick={() =>
                    openComposeTweet({ replyToId: tweet.id, onClose: mutate })
                  }
                  compact
                  className="px-4 py-2 text-sm"
                >
                  Comment
                </Button>
              </section>

              {/* Comment renderer */}
              <section className="relative divide-y">
                <LoadingOverlay visible={isLoading} />

                {tweet.replies.map((tw) => (
                  <TweetRenderer {...tw} key={tw.id} mutate={mutate} />
                ))}

                <section className="flex justify-center items-center py-4 opacity-25">
                  •
                </section>
              </section>
            </section>
          </>
        )}
      </MainLayout>
    </>
  );
}

export const getServerSideProps = protectedGetServerProps(async (ctx) => {
  const id = ctx.query.id as string;

  return {
    props: {
      id,
    },
  };
});
