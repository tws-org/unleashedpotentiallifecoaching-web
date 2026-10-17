import ContentWrapper from 'components/layout/ContentWrapper';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const Biography = ({ biography }: { biography: any }) => {
  return (
    <ContentWrapper>
      {documentToReactComponents(biography?.json)}
    </ContentWrapper>
  );
};

export default Biography;
