import Widget from 'components/molecules/Widget';

interface Props {
  widgets: {
    title: string | undefined;
    description: string | undefined;
    imageUrl: string | undefined;
  }[];
}

const WidgetWrapper = ({ widgets }: Props) => {
  return (
    <div className="flex flex-col my-12 lg:my-24 mx-0">
      {widgets.map((widget, index) => (
        <Widget {...widget} key={`${widget?.title}-${index}`} />
      ))}
    </div>
  );
};
export default WidgetWrapper;
