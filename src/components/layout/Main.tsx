/* eslint-disable @next/next/no-img-element */
import { ReactNode } from 'react';
// import useUser from '@/hooks/useUser';
import Logo from '../Logo';
import UserBubble from '../UserBubble';
import NavLinks from '../NavLinks';

export default function MainLayout({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  // const { user } = useUser();
  return (
    <main className="grid grid-cols-[1fr_minmax(32rem,_1fr)_1fr] w-screen h-screen">
      <section className="p-10 flex flex-col items-end justify-between border-r">
        <section className="flex flex-col gap-24 items-end">
          <Logo />

          <NavLinks />
        </section>

        <UserBubble />
      </section>

      <section className={className}>{children}</section>

      <section className="border-l"></section>
    </main>
  );
}
