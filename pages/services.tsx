import { ICoachFields, IPageFields } from 'types/contentful';
import ServicesPage from 'features/services/ServicesPage';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { fetchContenfulAPI } from 'lib/contentful/api';
import { coachesQuery, servicesPageQuery } from 'lib/contentful/queries';

const Services = ({
  page,
  coaches,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const servicesPageProps = {
    page,
    coaches,
    pageContent: page?.pageContent,
  };

  return <ServicesPage {...servicesPageProps} />;
};

export const getStaticProps: GetStaticProps = async () => {
  const servicesPageData = await fetchContenfulAPI(servicesPageQuery, {});
  const coachesData = await fetchContenfulAPI(coachesQuery, {});

  const page = servicesPageData?.data?.page as IPageFields;
  const coaches = coachesData?.data?.coachCollection?.items as ICoachFields[];

  return {
    props: {
      page,
      coaches,
    },
    revalidate: 300,
  };
};

export default Services;
