import { ISimplePageFields } from 'types/contentful';
import BlogPage from 'features/blog/BlogPage';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fetchContenfulAPI } from 'lib/contentful/api';
import { simplePageQuery } from 'lib/contentful/queries';

import { BLOG_PAGE_ID } from 'lib/constants';

const queryClient = new QueryClient();

const Blog = ({ page }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const blogPageProps = { page };

  return (
    <QueryClientProvider client={queryClient}>
      <BlogPage {...blogPageProps} />
    </QueryClientProvider>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const blogPageData = await fetchContenfulAPI(
    simplePageQuery(BLOG_PAGE_ID),
    {},
  );
  const page = blogPageData?.data?.simplePage as ISimplePageFields;

  return {
    props: {
      page,
    },
  };
};

export default Blog;
