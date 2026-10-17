import ContentWrapper from 'layouts/ContentWrapper';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const Biography = ({ biography }: { biography: any }) => {
  return (
    <ContentWrapper>
      {documentToReactComponents(biography?.json)}
    </ContentWrapper>
  );
};

export default Biography;
