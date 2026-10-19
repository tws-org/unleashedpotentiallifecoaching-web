import React from 'react';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import PostPage from 'features/blog/PostPage';
import { IBlogPostFields } from 'types/contentful';
import { fetchContenfulAPI } from 'lib/contentful/api';
import { blogPostQuery, allBlogPostsQuery } from 'lib/contentful/queries';
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';

const Post = ({ post }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();

  if (router.isFallback) return <ErrorPage statusCode={404} />;
  return <PostPage post={post} postContent={post?.postContent} />;
};

export const getStaticPaths = async () => {
  const postsData = await fetchContenfulAPI(allBlogPostsQuery, {});
  const posts = postsData?.data?.blogPostCollection.items;

  return {
    fallback: true,
    paths: posts
      ?.map((post: any) => `/post/${post?.slugText}`)
      .filter((post: any) => post !== null),
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const postData = await fetchContenfulAPI(blogPostQuery(slug), {});

  if (!postData?.data?.blogPostCollection?.items?.length) {
    return {
      notFound: true,
      revalidate: 300,
    };
  }

  const post = postData?.data?.blogPostCollection?.items.find(
    ({ slugText }: { slugText: string }) => slugText === slug,
  ) as IBlogPostFields;

  return {
    props: {
      post,
    },
    revalidate: 300,
  };
};

export default Post;
