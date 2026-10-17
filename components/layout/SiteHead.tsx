import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { SEO_DEFAULTS, SITE_URL } from 'lib/constants';

interface Props {
  title?: string;
  metaDescription?: string;
}

const SITE_NAME = 'Unleashed Potential';
const SHARE_IMAGE = `${SITE_URL}site-icon-192x192.png`;

const structuredData = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
});

const SiteHead = ({ title, metaDescription }: Props) => {
  const router = useRouter();
  // Canonical URL: the one domain, no query string or hash, no trailing slash
  // (except the home page).
  const path = router.asPath.split(/[?#]/)[0].replace(/\/+$/, '');
  const canonicalUrl = `${SITE_URL}${path.replace(/^\//, '')}`;
  const pageTitle = title || SEO_DEFAULTS.title;
  const description = metaDescription || SEO_DEFAULTS.metaDescription;

  return (
    <Head>
      <title key="title">{pageTitle}</title>
      <meta key="description" name="description" content={description} />
      <link key="canonical" rel="canonical" href={canonicalUrl} />
      <meta key="og:title" property="og:title" content={pageTitle} />
      <meta key="og:locale" property="og:locale" content="en_US" />
      <meta key="og:url" property="og:url" content={canonicalUrl} />
      <meta key="og:image" property="og:image" content={SHARE_IMAGE} />
      <meta
        key="og:description"
        property="og:description"
        content={description}
      />
      <meta key="og:type" property="og:type" content="website" />
      <meta key="og:site_name" property="og:site_name" content={SITE_NAME} />
      <meta key="twitter:card" name="twitter:card" content="summary" />
      <meta key="twitter:title" name="twitter:title" content={pageTitle} />
      <meta
        key="twitter:description"
        name="twitter:description"
        content={description}
      />
      <meta key="twitter:image" name="twitter:image" content={SHARE_IMAGE} />
      <script
        key="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
    </Head>
  );
};

export default SiteHead;
