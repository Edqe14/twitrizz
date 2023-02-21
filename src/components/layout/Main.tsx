/* eslint-disable @next/next/no-img-element */
import { ReactNode } from 'react';
// import useUser from '@/hooks/useUser';
import Link from 'next/link';
import Logo from '../Logo';
import UserBubble from '../UserBubble';
import NavLinks from '../NavLinks';
import SearchInput from '../SearchInput';

export default function MainLayout({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <main className="grid grid-cols-[1fr_minmax(35rem,_1fr)_1fr] w-screen h-screen">
      <section className="p-10 flex flex-col items-end justify-between border-r">
        <section className="flex flex-col gap-24 items-end">
          <Link href="/">
            <Logo />
          </Link>

          <NavLinks />
        </section>

        <UserBubble />
      </section>

      <section className={className}>{children}</section>

      <section className="border-l p-6">
        <SearchInput />
      </section>
    </main>
  );
}
