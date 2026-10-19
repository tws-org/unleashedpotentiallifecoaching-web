import type { AppProps } from 'next/app';
import React, { useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { CoachesProvider } from 'features/coaches/CoachesContext';
import Header from 'components/layout/Header';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'styles/globals.css';
import { ConstantsProvider } from 'lib/ConstantsContext';
import { GoogleAnalytics } from '@next/third-parties/google';
import { GA_ID } from 'lib/constants';
import { initAnalytics } from 'lib/analytics';
import { EmailsProvider } from 'features/forms/FormSubmissionContext';
import 'react-toastify/dist/ReactToastify.css';
import { MotionConfig } from 'framer-motion';

const queryClient = new QueryClient();
const Footer = dynamic(() => import('components/layout/Footer'));

// Tags shared by every page. Per-page title, description and canonical
// come from components/layout/SiteHead.
const AppHead = () => (
  <Head>
    <meta charSet="utf-8" />
    <meta
      content="width=device-width,initial-scale=1,shrink-to-fit=no"
      name="viewport"
    />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta name="msvalidate.01" content="D568BE2730F6C27E33061E84F8DE58B1" />
    {/* No pages/_document.tsx: vinext turns off its shared page cache when a
        custom _document exists. The fonts and the html lang live here instead. */}
    <script
      dangerouslySetInnerHTML={{ __html: "document.documentElement.lang='en'" }}
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
    <link
      href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,700&display=swap"
      rel="stylesheet"
    />
    <link rel="icon" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/site-icon-apple.png" />
    <meta name="theme-color" content="#ffffff" />
  </Head>
);

const UnleashedPotentialApp = ({ Component, pageProps }: AppProps) => {
  useEffect(initAnalytics, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ConstantsProvider>
          <CoachesProvider>
            <EmailsProvider>
              <AppHead />
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-forrest-900 focus:px-4 focus:py-2 focus:rounded focus:shadow"
              >
                Skip to main content
              </a>
              <Header />
              <MotionConfig reducedMotion="user">
                <main
                  id="main-content"
                  tabIndex={-1}
                  className="focus:outline-none"
                >
                  <Component {...pageProps} />
                </main>
                <Footer />
              </MotionConfig>
            </EmailsProvider>
          </CoachesProvider>
        </ConstantsProvider>
      </QueryClientProvider>
      <GoogleAnalytics gaId={GA_ID} />
    </>
  );
};

export default UnleashedPotentialApp;
