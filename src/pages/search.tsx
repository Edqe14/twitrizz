/* eslint-disable @typescript-eslint/indent */
import Head from '@/components/Head';
import TweetRenderer from '@/components/Tweet';
import MainLayout from '@/components/layout/Main';
import { LoadingOverlay } from '@mantine/core';
import { useRouter } from 'next/router';
import { ArrowLeft, MagnifyingGlass, Warning } from 'phosphor-react';
import useSWR from 'swr';

export default function Search() {
  const router = useRouter();
  const query = router.query.q as string;

  const { data, isLoading, mutate } = useSWR<{ tweets: TweetPreviews }>(
    `/tweet/search?q=${encodeURIComponent(query)}`,
    {
      revalidateOnFocus: false,
    },
  );

  const tweets = data?.tweets;

  return (
    <>
      <Head
        title={
          router.query.q
            ? `${tweets ? `(${tweets.length}) ` : ''}${
                router.query.q
              } - Search results`
            : 'Twitrizz Search'
        }
      />

      <MainLayout className="flex flex-col overflow-hidden group">
        <section className="p-5 bg-white border-b">
          <h2 className="text-2xl font-bold flex items-center gap-4 text-blue-bayoux-700">
            <ArrowLeft
              onClick={() => router.back()}
              weight="bold"
              className="cursor-pointer"
            />

            {!query ? 'Search Tweets' : `Search Results (${tweets?.length})`}
          </h2>
        </section>

        {!!tweets?.length && (
          <section className="relative flex-grow group-hover:overflow-y-auto divide-y">
            <LoadingOverlay visible={isLoading} />

            {tweets &&
              tweets.map((tw) => (
                <TweetRenderer {...tw} key={tw.id} mutate={mutate} />
              ))}

            <section className="flex justify-center items-center py-4 opacity-25">
              •
            </section>
          </section>
        )}

        {tweets && tweets.length === 0 && (
          <section className="flex flex-col justify-center items-center flex-grow text-blue-bayoux-500 gap-4 opacity-25">
            <Warning size={128} className="animate-bounce" />
            <h2 className="font-semibold text-2xl">No result</h2>
          </section>
        )}

        {!query && (
          <section className="flex flex-col justify-center items-center flex-grow text-blue-bayoux-500 gap-4 opacity-25">
            <MagnifyingGlass size={128} className="animate-bounce" />
            <h2 className="font-semibold text-2xl">Search Twitrizz</h2>
          </section>
        )}
      </MainLayout>
    </>
  );
}
