import '@/styles/globals.css';
import type { AppProps } from 'next/app';

import { Inter, Poppins } from '@next/font/google';
import cn from 'classnames';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700'],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <section
      className={cn(
        inter.variable,
        poppins.variable,
        'font-inter relative overflow-hidden',
      )}
    >
      <Component {...pageProps} />
    </section>
  );
}
