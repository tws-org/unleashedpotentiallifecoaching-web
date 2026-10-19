import ImageWrapper from 'components/ui/ImageWrapper';
import { ConstantsContext } from 'lib/ConstantsContext';
import React, { useContext } from 'react';

interface Props {
  imageUrl: string | undefined;
  header: string | undefined;
  body: string | undefined;
}

const FeaturedMessage = ({ imageUrl, header, body }: Props) => {
  const { site_title } = useContext(ConstantsContext);
  return (
    <div className="flex flex-col my-24 mx-0 lg:flex-row lg:justify-between">
      <div className="featured-message">
        <h2>{header}</h2>
        <p>{body}</p>
      </div>
      <ImageWrapper
        url={imageUrl as string}
        width={450}
        height={450}
        name={site_title}
      />
    </div>
  );
};

export default FeaturedMessage;
