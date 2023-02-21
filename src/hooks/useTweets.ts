import fetcher from '@/lib/helpers/axios';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';

const useTweets = create(
  combine(
    {
      loading: false,
      error: false,
      tweets: [] as TweetPreviews,
    },
    (set) => ({
      fetchTweets: async () => {
        set({
          loading: true,
          error: false,
        });

        try {
          const res = await fetcher<{ tweets: TweetPreviews }>('/tweet');

          set({
            loading: false,
            error: false,
            tweets: res.data.tweets,
          });
        } catch {
          set({ loading: false, error: true, tweets: [] });
        }
      },
    }),
  ),
);

export default useTweets;
