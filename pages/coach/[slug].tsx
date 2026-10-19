import CoachPage from 'features/coaches/CoachPage';
import { CoachesContext } from 'features/coaches/CoachesContext';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import ErrorPage from 'next/error';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { ICoachFields } from 'types/contentful';
import { fetchContenfulAPI } from 'lib/contentful/api';
import { siteConstants, urlify } from 'lib/helpers';
import { coachQuery } from 'lib/contentful/queries';

const CoachProfile = ({
  coach,
  coaches,
  slug,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const { coaches: contextCoaches, setCoaches } = useContext(CoachesContext);
  useEffect(() => {
    if (!contextCoaches && setCoaches) {
      setCoaches(coaches);
    }
  }, [coaches, contextCoaches, setCoaches]);

  if (router.isFallback && !slug) {
    return <ErrorPage statusCode={404} />;
  }

  return <CoachPage coach={coach} />;
};

export const getStaticPaths = async () => {
  const constants = siteConstants;
  const coachesItem = constants.site_navigation.filter(
    (nav: any) => nav.id === 2,
  )[0];
  const coacheSlugs = coachesItem?.children
    ?.filter((coach: any) => !coach?.slug?.includes('themendwellness'))
    .map((coach: any) => `${coach?.slug}`);

  return {
    fallback: true,
    paths: coacheSlugs,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug;
  const coachesData = await fetchContenfulAPI(coachQuery, {});
  const coaches = coachesData?.data?.coachCollection.items as ICoachFields[];

  const coach = coaches?.find(
    (coach) => urlify(coach?.name as string) === slug,
  ) as ICoachFields;

  if (!coach) {
    return {
      notFound: true,
      revalidate: 300,
    };
  }

  return {
    props: {
      coach,
      coaches,
      slug,
    },
    revalidate: 300,
  };
};

export default CoachProfile;
