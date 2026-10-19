import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { fetchContenfulAPI } from 'lib/contentful/api';
import { featuredReview } from 'lib/contentful/queries';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { IReviewFields } from 'types/contentful';

const useGetReviews = () => {
  return useQuery<IReviewFields[]>({
    queryKey: ['reviews'],
    queryFn: async () => {
      const request = await fetchContenfulAPI(featuredReview, {});
      return request?.data?.reviewCollection?.items;
    },
    placeholderData: keepPreviousData,
  });
};

const FeaturedReview = () => {
  const { isLoading, isError, data } = useGetReviews();

  if (isLoading || isError) {
    return null;
  }

  if (data && data.length > 0) {
    const message = data?.[0]?.quote;
    return (
      <div className="bg-forrest py-12 lg:mb-12">
        <p className="text-white font-serif italic font-bold text-center text-5xl mb-12">
          Client Review
        </p>
        <div className="px-12 py-8 lg:py-0 lg:px-48">
          <span className="review-message">
            {documentToReactComponents((message as any).json)}
          </span>
          <span className="review-name" id="contact">
            - <p>{data?.[0]?.name}</p>
          </span>
        </div>
      </div>
    );
  }

  return null;
};

export default FeaturedReview;
