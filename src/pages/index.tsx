import Head from '@/components/Head';
import MainLayout from '@/components/layout/Main';
import protectedGetServerProps from '@/lib/helpers/protectedGetServerProps';
import TweetRenderer from '@/components/Tweet';
import useTweets from '@/hooks/useTweets';
import { LoadingOverlay } from '@mantine/core';
import { useEffect } from 'react';

export default function Home() {
  const { tweets: all, loading, fetchTweets } = useTweets();

  useEffect(() => {
    fetchTweets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head />

      <MainLayout className="relative flex flex-col overflow-hidden group">
        <section className="p-5 bg-white border-b">
          <h2 className="text-2xl font-bold text-blue-bayoux-700">
            Recent Tweets
          </h2>
        </section>

        <section className="relative flex-grow group-hover:overflow-y-auto divide-y">
          <LoadingOverlay visible={loading} />

          {all.map((tw) => (
            <TweetRenderer {...tw} key={tw.id} mutate={fetchTweets} />
          ))}

          <section className="flex justify-center items-center py-4 opacity-25">
            •
          </section>
        </section>
      </MainLayout>
    </>
  );
}

export const getServerSideProps = protectedGetServerProps();
