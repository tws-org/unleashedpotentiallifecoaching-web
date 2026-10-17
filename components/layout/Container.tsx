interface Props {
  children: React.ReactNode;
}

const Container = ({ children }: Props) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">{children}</div>
);

export default Container;
