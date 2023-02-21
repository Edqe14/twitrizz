/* eslint-disable @typescript-eslint/indent */
import Head from '@/components/Head';
import TweetRenderer from '@/components/Tweet';
import MainLayout from '@/components/layout/Main';
import { LoadingOverlay } from '@mantine/core';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'phosphor-react';
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

      <MainLayout>
        <section className="p-5 bg-white border-b">
          <h2 className="text-2xl font-bold flex items-center gap-4 text-blue-bayoux-700">
            <ArrowLeft
              onClick={() => router.back()}
              weight="bold"
              className="cursor-pointer"
            />
            Search Results {tweets && `(${tweets.length})`}
          </h2>
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
      </MainLayout>
    </>
  );
}
