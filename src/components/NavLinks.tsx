import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { House, User } from 'phosphor-react';
import openComposeTweet from '@/lib/helpers/openComposeTweet';
import Button from './Button';

const LINKS = [
  {
    label: 'Home',
    href: '/',
    icon: House,
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: User,
  },
];

export default function NavLinks() {
  const router = useRouter();

  return (
    <section className="flex flex-col gap-12 px-6">
      <section className="flex flex-col gap-4">
        {LINKS.map(({ label, href, icon: Icon }) => (
          <Link key={label} href={href} className="flex items-center gap-4">
            <Icon
              className="text-dodger-blue"
              weight={router.pathname === href ? 'fill' : 'regular'}
              size={35}
            />
            <h2
              className={classNames(
                'text-xl  font-semibold tracking-tighter',
                router.pathname === href ? 'text-blue-bayoux' : 'text-casper',
              )}
            >
              {label}
            </h2>
          </Link>
        ))}
      </section>

      <Button className="-mx-6" onClick={() => openComposeTweet()}>
        Tweet
      </Button>
    </section>
  );
}
