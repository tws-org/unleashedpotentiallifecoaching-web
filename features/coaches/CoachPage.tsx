import BasicPage from 'features/coaches/BasicPage';
import SiteHead from 'components/layout/SiteHead';
import { ConstantsContext } from 'lib/ConstantsContext';
import Container from 'components/layout/Container';
import FadeInContainer from 'components/layout/FadeInContainer';
import React, { useContext } from 'react';
import { ICoachFields } from 'types/contentful';

interface Props {
  coach: ICoachFields;
}

const CoachPage = ({ coach }: Props) => {
  const {
    name,
    profileImage,
    welcomeMessage,
    biography,
    seoTitle,
    seoMetaDescription,
  } = coach;
  const { seo_defaults } = useContext(ConstantsContext);

  return (
    <FadeInContainer>
      <SiteHead
        title={seoTitle || seo_defaults.title}
        metaDescription={seoMetaDescription || seo_defaults.metaDescription}
      />
      <div>
        <Container>
          <BasicPage
            name={name as string}
            profileImage={profileImage}
            welcomeMessage={welcomeMessage}
            biography={biography}
          />
        </Container>
      </div>
    </FadeInContainer>
  );
};

export default CoachPage;
