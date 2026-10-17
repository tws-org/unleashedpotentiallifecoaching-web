import Container from 'layouts/Container';
import { IInterviewsFields, ISimplePageFields } from 'types/contentful';
import { useEffect, useState } from 'react';
import { useGetPosts } from 'utils/api';
import { interviewCollectionQuery } from 'utils/queries';
import SimplePageLayout from 'layouts/SimplePageLayout';
import Link from 'next/link';
import Image from 'next/legacy/image';
import { format } from 'date-fns';
import usePagination from 'hooks/usePagination';

interface Props {
  page: ISimplePageFields;
}

const InterviewsPage = ({ page }: Props) => {
  const [limit, setLimit] = useState(4);
  const { isLoading, data } = useGetPosts(
    'interviews',
    interviewCollectionQuery,
    {
      limit,
    },
  );

  const [disableBtn, handleAmountChange] = usePagination(
    data?.interviewsCollection?.total,
    limit,
    setLimit,
  );

  return (
    <SimplePageLayout page={page}>
      <Container>
        <div className="flex flex-col items-center justify-center">
          {/** @ts-ignore */}
          {data?.interviewsCollection?.items.map((post: IInterviewsFields) => (
            <Link
              href={post?.link as string}
              key={JSON.stringify(post)}
              legacyBehavior
            >
              <a
                className="flex flex-col pb-12 my-8 border-b sm:flex-row"
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src={post?.publicationImage?.url}
                  alt={(post?.title as string) || 'Image not found'}
                  width={(post?.publicationImage?.width as number) / 2}
                  height={(post?.publicationImage?.height as number) / 2}
                />
                <div className="mt-3 sm:mt-0 sm:ml-8 blog-post-excerpt">
                  <p className="text-2xl text-forrest">{post?.title}</p>
                  <p className="flex flex-row items-center my-2">
                    <span className="mr-1 font-bold leading-snug text-stone-500">
                      Date:{' '}
                    </span>
                    <span className="mr-3 text-base text-stone-500">
                      {format(
                        new Date(post?.publicationDate as string),
                        'MMMM dd, yyyy',
                      )}
                    </span>
                    <span className="mr-1 font-bold leading-snug text-stone-500">
                      Publication:
                    </span>
                    <span className="text-base text-stone-500">
                      {post?.publication}
                    </span>
                  </p>
                  <p className="font-serif text-base leading-7">
                    {post?.description}
                  </p>
                  <button className="px-6 py-3 my-6 text-xl text-white rounded-sm bg-forrest">
                    Read More
                  </button>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </Container>
      <div className="flex flex-row justify-center w-full mb-8">
        <button
          onClick={() => handleAmountChange()}
          disabled={disableBtn || isLoading}
          className={` ${
            Boolean(disableBtn || isLoading) ? 'opacity-25' : ''
          } mb-4 sm:mb-0 font-bold w-full sm:w-2/4 text-center py-3 rounded bg-forrest text-white text-2xl`}
        >
          Load More
        </button>
      </div>
    </SimplePageLayout>
  );
};

export default InterviewsPage;
