import AnimatedButton from 'components/atoms/AnimatedButton';
import Carousel from 'components/atoms/Carousel';
import Link from 'next/link';
import React, { useMemo } from 'react';
import { CTA_CAROUSEL_ITEMS } from 'utils/constants';

const CarouselCTA = ({
  buttonLink,
  ButtonContent,
}: {
  buttonLink: string;
  ButtonContent: React.ComponentType;
}) => {
  const settings = useMemo(
    () => ({
      dots: false,
      fade: true,
      infinite: true,
      autoplay: true,
      speed: 3000,
      autoplaySpeed: 2500,
      cssEase: 'ease-in',
      slidesPerRow: 3,
      pauseOnHover: false,
      arrows: false,
    }),
    [],
  );

  return (
    <>
      <div className="relative z-10 flex justify-center inline-block inset-y-56">
        <AnimatedButton>
          <Link href={buttonLink}>
            <ButtonContent />
          </Link>
        </AnimatedButton>
      </div>
      <Carousel
        settings={settings}
        photoArray={CTA_CAROUSEL_ITEMS}
        carouselHeight="h-96"
        borderStyle="border-t-2 border-b-2 border-black"
      />
    </>
  );
};

export default CarouselCTA;
