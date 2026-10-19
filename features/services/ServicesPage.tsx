import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';
import ServiceCard from 'features/services/ServiceCard';
import Container from 'components/layout/Container';
import ContentWrapper from 'components/layout/ContentWrapper';
import React from 'react';
import { ICoachFields, IPageFields } from 'types/contentful';
import { urlify } from 'lib/helpers';
import SimplePageLayout from 'components/layout/SimplePageLayout';
import CarouselCTA from 'features/home/CarouselCTA';
import ButtonContent from 'components/ui/ButtonContent';

interface Props {
  coaches: ICoachFields[];
  page: IPageFields;
  pageContent: any;
}

function renderOptions(links: any) {
  if (!links?.assets?.block) {
    return {};
  }
  // create an asset map
  const assetMap = new Map();

  // loop through the linked assets and add them to a map
  for (const asset of links?.assets?.block) {
    assetMap.set(asset?.sys?.id, asset);
  }

  return {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node: any, next: any) => {
        // find the asset in the assetMap by ID
        const asset = assetMap.get(node.data.target.sys.id);

        switch (asset.contentType) {
          case 'video/mp4':
            return (
              <video width="100%" height="100%" controls>
                <source src={asset.url} type="video/mp4" />
              </video>
            );
          case 'image/png':
            return (
              <img
                src={asset.url}
                height={asset.height}
                width={asset.width}
                alt={asset.description}
                className={urlify(asset.title)}
              />
            );
          case 'image/jpeg':
            return (
              <img
                src={asset.url}
                height={asset.height}
                width={asset.width}
                alt={asset.description}
                className={urlify(asset.title)}
              />
            );
          case 'image/webp':
            return (
              <img
                src={asset.url}
                height={asset.height}
                width={asset.width}
                alt={asset.description}
                className={urlify(asset.title)}
              />
            );
          default:
            return 'Nothing to see here...';
        }
      },
    },
  };
}

const ServicesPage = ({ page, pageContent, coaches }: Props) => {
  return (
    <SimplePageLayout page={page}>
      <Container>
        <ContentWrapper>
          {documentToReactComponents(
            pageContent?.json,
            renderOptions(pageContent?.links),
          )}
        </ContentWrapper>
      </Container>
      <CarouselCTA
        ButtonContent={ButtonContent}
        buttonLink="/coach/jessica-rebelo"
      />
    </SimplePageLayout>
  );
};

export default ServicesPage;
