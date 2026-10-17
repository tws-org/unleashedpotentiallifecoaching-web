import React from 'react';
import Image from 'next/image';

interface Banner {
  imageUrl: string | undefined;
  lineOne: string | undefined;
  lineTwo: string | undefined;
}

const HomeBanner = ({ imageUrl, lineOne, lineTwo }: Banner) => {
  return (
    <div className="relative z-30">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      )}
      <div
        className="relative flex flex-col items-center justify-center text-center"
        style={{ minHeight: '575px' }}
      >
        <h1 className="m-0 p-0 banner-shadow  text-cream-200 font-bold text-7xl">
          {lineOne}
        </h1>
        <h2 className="m-0 p-0 banner-shadow  text-white italic font-serif font-bold text-7xl">
          {lineTwo}
        </h2>
      </div>
    </div>
  );
};

export default HomeBanner;
