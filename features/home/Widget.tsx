import ImageWrapper from 'components/ui/ImageWrapper';

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
        <div className="widget-header">
          <h3>{title}</h3>
        </div>
        <p className="text-xl text-forrest my-6">{description}</p>
      </div>
    </div>
  );
};

export default Widget;
