import FadeInContainer from 'components/layout/FadeInContainer';
import SiteHead from 'components/layout/SiteHead';
import HomeBanner from 'features/home/HomeBanner';
import Container from 'components/layout/Container';
import { ICoachFields, IHomePageFields } from 'types/contentful';
import { useMemo } from 'react';

interface Props {
  page: IHomePageFields;
  coaches: ICoachFields[];
}

import dynamic from 'next/dynamic';
import ButtonContent from 'components/ui/ButtonContent';

const FeaturedMessage = dynamic(() => import('features/home/FeaturedMessage'));
const CarouselCTA = dynamic(() => import('features/home/CarouselCTA'));
const WidgetWrapper = dynamic(() => import('features/home/WidgetWrapper'));

const HomePage = ({ page, coaches }: Props) => {
  const widgets = useMemo(
    () => [
      {
        title: page?.widgetOneTitle,
        imageUrl: page?.widgetOneImage?.url,
        description: page?.widgetOneMessage,
      },
      {
        title: page?.widgetTwoTitle,
        imageUrl: page?.widgetTwoImage?.url,
        description: page?.widgetTwoMessage,
      },
      {
        title: page?.widgetThreeTitle,
        imageUrl: page?.widgetThreeImage?.url,
        description: page?.widgetThreeMessage,
      },
      {
        title: page?.widgetFourTitle,
        imageUrl: page?.widgetFourImage?.url,
        description: page?.widgetFourMessage,
      },
    ],
    [page],
  );
  return (
    <FadeInContainer>
      <SiteHead
        title={page?.seoTitle}
        metaDescription={page?.seoMetaDescription}
      />
      <div>
        <HomeBanner
          imageUrl={page?.banner?.url}
          lineOne={page?.mainBannerText}
          lineTwo={page?.subBannerText}
        />
        <Container>
          <FeaturedMessage
            imageUrl={page?.featuredImage?.url}
            header={page?.featuredMessageHeader}
            body={page?.featuredMessageBody}
          />
        </Container>
        <CarouselCTA
          ButtonContent={ButtonContent}
          buttonLink="/coach/jessica-rebelo"
        />

        <Container>
          <WidgetWrapper widgets={widgets} />
        </Container>
      </div>
    </FadeInContainer>
  );
};

export default HomePage;
