import { ISimplePageFields } from 'types/contentful';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fetchContenfulAPI } from 'lib/contentful/api';
import { simplePageQuery } from 'lib/contentful/queries';

import InterviewsPage from 'features/podcast/InterviewsPage';
import { INTERVIEWS_PAGE_ID } from 'lib/constants';

const queryClient = new QueryClient();

const Interviews = ({
  page,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const interviewsPageProps = { page };
  return (
    <QueryClientProvider client={queryClient}>
      <InterviewsPage {...interviewsPageProps} />
    </QueryClientProvider>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const interviewsPageData = await fetchContenfulAPI(
    simplePageQuery(INTERVIEWS_PAGE_ID),
    {},
  );
  const page = interviewsPageData?.data?.simplePage as ISimplePageFields;

  return {
    props: {
      page,
    },
  };
};

export default Interviews;
