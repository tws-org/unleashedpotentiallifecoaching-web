import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { IBlogPostFields } from 'types/contentful';
import { fetchContenfulAPI } from 'lib/contentful/api';
import { SITE_URL, CACHE_CONTROL, CACHE_LIFE } from 'lib/constants';
import { removeSlashFromSlug, siteConstants } from 'lib/helpers';
import { allBlogPostsQuery } from 'lib/contentful/queries';

const Sitemap = () => null;
export default Sitemap;

// Only internal pages, on the one canonical domain. lastmod is set only when
// the real date is known (blog posts), so search engines can trust it.
const generateXML = (path: string, lastmod?: string) => {
  const url = `${SITE_URL}${removeSlashFromSlug(path)}`;
  return `
  <url>
    <loc>${url}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
  </url>`;
};

const isInternal = (slug: string | null | undefined): slug is string =>
  typeof slug === 'string' && slug.startsWith('/');

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const { res } = context;
  const blogPostsData = await fetchContenfulAPI(allBlogPostsQuery, {});
  const posts = blogPostsData?.data?.blogPostCollection
    ?.items as IBlogPostFields[];
  const constants = siteConstants;

  const postLinks = posts
    .filter((post: IBlogPostFields) => post?.slugText)
    .map((post: IBlogPostFields) =>
      generateXML(
        `/post/${post?.slugText}`,
        new Date(post?.publishDate as string).toISOString(),
      ),
    )
    .join('');

  const navPaths = constants.site_navigation.flatMap((nav) =>
    nav?.children ? nav.children.map((child) => child.slug) : [nav?.slug],
  );
  const servicePaths = constants.service_list.map((service) => service.slug);
  const otherPaths = ['/disclaimer'];

  const siteLinks = Array.from(
    new Set([...navPaths, ...servicePaths, ...otherPaths]),
  )
    .filter(isInternal)
    .map((path) => generateXML(path))
    .join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">      
      ${siteLinks}
      ${postLinks}
  </urlset>`;

  res.setHeader(CACHE_CONTROL, CACHE_LIFE);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};
