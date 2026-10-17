import ImageWrapper from 'components/atoms/ImageWrapper';
import styled from 'styled-components';

interface Props {
  description: string | undefined;
  title: string | undefined;
  imageUrl: string | undefined;
}

const Widget = ({ description, title, imageUrl }: Props) => {
  const altText: string = (title as string) || 'widget';
  const srcUrl: string = imageUrl ? imageUrl : '';

  return (
    <div className="flex flex-col mb-32 p-4 lg:flex-row lg:justify-between lg:p-0 lg:odd:flex-row-reverse">
      <ImageWrapper
        url={srcUrl as string}
        width={525}
        height={525}
        name={altText}
      />
      <div style={{ maxWidth: '500px' }} className="my-24 mx-0">
        <Header>
          <h3>{title}</h3>
        </Header>
        <p className="text-xl text-forrest my-6">{description}</p>
      </div>
    </div>
  );
};

const Header = styled.div`
  h3 {
    font-size: 2rem;
    line-height: 1.2;
    color: rgb(80, 105, 103);
    font-family: 'Playfair Display', serif;
    font-style: italic;
    text-shadow: rgb(0 0 0 / 40%) 0px 4px 4px;
  }
`;

export default Widget;
