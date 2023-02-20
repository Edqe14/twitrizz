import fetcher from '@/lib/helpers/axios';
import { User } from '@prisma/client';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';

const useUser = create(
  combine(
    {
      loading: true,
      error: false,
      user: null as User | null,
    },
    (set) => ({
      fetchUser: async () => {
        set({
          loading: true,
          error: false,
          user: null,
        });

        try {
          const res = await fetcher<{ user: User }>('/user/@me');

          set({
            loading: false,
            error: false,
            user: res.data.user,
          });
        } catch {
          set({ loading: false, error: true, user: null });
        }
      },
    }),
  ),
);

useUser.getState().fetchUser();

export default useUser;
