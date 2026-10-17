import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

interface Props {
  name: string;
  quote: any;
}

const ReviewBlock = ({ name, quote }: Props) => (
  <figure className="quote">
    <blockquote className="text-gray-500 font-serif">
      {documentToReactComponents(quote.json)}
    </blockquote>
    <figcaption className="mt-2 text-forest-900 font-bold">
      <cite>{name}</cite>
    </figcaption>
  </figure>
);

export default ReviewBlock;
