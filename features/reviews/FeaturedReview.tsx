import styled from 'styled-components';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { fetchContenfulAPI } from 'utils/api';
import { featuredReview } from 'utils/queries';
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
          <Message>{documentToReactComponents((message as any).json)}</Message>
          <Name id="contact">
            - <p>{data?.[0]?.name}</p>
          </Name>
        </div>
      </div>
    );
  }

  return null;
};

const Message = styled.span`
  p {
    font-size: 2.3rem;
    line-height: 1.2;
    color: #ffffff;
    font-family: 'Playfair Display', serif;
    text-align: center;
    font-weight: 400;
    font-style: italic;
  }
`;

const Name = styled.span`
  p::before {
    content: '- ';
  }
  p {
    font-size: 2rem;
    line-height: 1.1;
    color: #ffffff;
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    text-align: right;
    margin-top: 0;
  }
`;

export default FeaturedReview;
