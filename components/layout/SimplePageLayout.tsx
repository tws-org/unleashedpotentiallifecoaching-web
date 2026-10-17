import FadeInContainer from 'layouts/FadeInContainer';
import PageBanner from 'components/shared/PageBanner';
import SiteHead from 'components/shared/SiteHead';
import { ISimplePageFields } from 'types/contentful';

interface Props {
  page: ISimplePageFields;
  children: React.ReactNode;
}

const SimplePageLayout = ({ page, children }: Props) => {
  return (
    <FadeInContainer>
      <SiteHead
        title={page?.seoTitle}
        metaDescription={page?.seoMetaDescription}
      />
      <PageBanner
        title={page?.pageTitle as string}
        bannerImage={page?.banner?.url}
      />
      {children}
    </FadeInContainer>
  );
};
export default SimplePageLayout;
