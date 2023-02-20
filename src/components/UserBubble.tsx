/* eslint-disable @next/next/no-img-element */
import useUser from '@/hooks/useUser';
import { DotsThreeVertical } from 'phosphor-react';

export default function UserBubble() {
  const { user } = useUser();

  return (
    <section className="bg-pattens-blue rounded-full p-2 pr-5 flex items-center gap-8">
      <section className="flex gap-3 items-center">
        <img
          src={user?.image ?? '/image/user-placeholder.png'}
          alt=""
          className="rounded-full bg-pattens-blue-50 w-12"
        />

        <h3 className="font-semibold text-lg text-blue-bayoux">
          {user?.username}
        </h3>
      </section>

      <DotsThreeVertical
        className="text-blue-bayoux cursor-pointer"
        size={24}
        weight="bold"
      />
    </section>
  );
}
