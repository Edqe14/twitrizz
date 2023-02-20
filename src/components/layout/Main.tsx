/* eslint-disable @next/next/no-img-element */
import { ReactNode } from 'react';
import useUser from '@/hooks/useUser';
import { House } from 'phosphor-react';
import Link from 'next/link';
import Logo from '../Logo';
import UserBubble from '../UserBubble';
import NavLinks from '../NavLinks';

export default function MainLayout({ children }: { children?: ReactNode }) {
  const { user } = useUser();

  console.log(user);
  return (
    <main className="grid grid-cols-3 w-screen h-screen">
      <section className="p-10 flex flex-col items-end justify-between border-r border-dodger-blue-300">
        <section className="flex flex-col gap-12 items-end">
          <Logo />

          <NavLinks />
        </section>

        <UserBubble />
      </section>

      <section className="">{children}</section>

      <section className="border-l border-dodger-blue-300"></section>
    </main>
  );
}
