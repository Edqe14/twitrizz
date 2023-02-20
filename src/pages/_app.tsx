import '@/styles/globals.css';
import type { AppProps } from 'next/app';

import { Inter, Poppins } from '@next/font/google';
import cn from 'classnames';
import { SWRConfig } from 'swr';
import fetcher from '@/lib/helpers/axios';

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
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          fetcher(resource, init).then((res) => res.data),
      }}
    >
      <section
        className={cn(
          inter.variable,
          poppins.variable,
          'font-inter relative overflow-hidden',
        )}
      >
        <Component {...pageProps} />
      </section>
    </SWRConfig>
  );
}
