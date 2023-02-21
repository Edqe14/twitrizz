import '@/styles/globals.css';
import type { AppProps } from 'next/app';

import { Inter, Poppins } from '@next/font/google';
import cn from 'classnames';
import { SWRConfig } from 'swr';
import fetcher from '@/lib/helpers/axios';
import { MantineProvider, createEmotionCache } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700'],
});

const cache = createEmotionCache({
  key: 'mantine',
  prepend: false,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider
      withGlobalStyles
      withCSSVariables
      emotionCache={cache}
      theme={{
        colorScheme: 'light',
        fontFamily: 'Inter, sans-serif',
        components: {
          Menu: {
            classNames: {
              dropdown: 'rounded-xl shadow-md border-pattens-blue-50 bg-white',
              item: 'rounded-xl',
            },
          },
          Modal: {
            defaultProps: {
              centered: true,
              overlayOpacity: 0.3,
              transitionDuration: 200,
              transtion: 'fade',
            },
            classNames: {
              title: 'text-blue-bayoux font-semibold text-lg',
              modal: 'rounded-xl',
            },
          },
          InputWrapper: {
            classNames: {
              root: 'flex flex-col gap-2',
              label: 'text-blue-bayoux font-semibold font-inter',
            },
          },
          Textarea: {
            classNames: {
              input: 'rounded-xl',
            },
          },
        },
      }}
    >
      <ModalsProvider>
        <NotificationsProvider>
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
        </NotificationsProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}
