import SiteHead from 'components/shared/SiteHead';
import Container from 'layouts/Container';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { IDisclaimerFields } from 'types/contentful';
import { fetchContenfulAPI } from 'utils/api';
import { SITE_URL } from 'utils/constants';
import { disclaimerPageQuery } from 'utils/queries';

const Disclaimer = ({
  page,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const pageContent = page?.pageContent?.json?.content[0]?.content[0]?.value;
  return (
    <Container>
      <SiteHead
        title={page?.title}
        metaDescription={`Disclaimer notice for user of ${SITE_URL.replace(
          'https://',
          '',
        )}`}
      />
      <h1 className="text-3xl mb-5">{page?.title}</h1>
      <p className="text-xl mb-5">Last Updated: {page?.lastUpdated}</p>
      <h2 className="mb-5 text-2xl font-bold">{page?.secondaryTitle}</h2>
      <p className="text-xl">
        The information provided by Unleashed Potential: Life Coaching (“we,”
        “us”, or “our”) on
        <a
          className="mx-2 underline text-forrest"
          href={SITE_URL}
          rel="noopener noreferrer"
          target="_blank"
        >
          {SITE_URL}
        </a>
      </p>
      <span dangerouslySetInnerHTML={{ __html: pageContent }} />
    </Container>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const disclaimerPageData = await fetchContenfulAPI(disclaimerPageQuery, {});
  const page = disclaimerPageData?.data?.disclaimer as IDisclaimerFields;

  return {
    props: {
      page,
    },
  };
};

export default Disclaimer;
