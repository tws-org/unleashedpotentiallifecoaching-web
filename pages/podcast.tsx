import React from 'react';
import PodcastPage from 'features/podcast/PodcastPage';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fetchContenfulAPI } from 'lib/contentful/api';
import { simplePageQuery } from 'lib/contentful/queries';

import { PODCAST_PAGE_ID } from 'lib/constants';

const queryClient = new QueryClient();

const PodCast = ({ page }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const podcastPageProps = {
    page,
  };
  return (
    <QueryClientProvider client={queryClient}>
      <PodcastPage {...podcastPageProps} />
    </QueryClientProvider>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const podcastPageData = await fetchContenfulAPI(
    simplePageQuery(PODCAST_PAGE_ID),
    {},
  );
  const page = podcastPageData?.data?.simplePage;

  return {
    props: {
      page,
    },
  };
};

export default PodCast;
