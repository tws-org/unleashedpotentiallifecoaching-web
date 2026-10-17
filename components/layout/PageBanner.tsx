import Image from 'next/image';

interface Props {
  title: string;
  bannerImage?: string | null | undefined;
}

const PageBanner = ({ title, bannerImage }: Props) => {
  return (
    <div className="relative z-30">
      {bannerImage && (
        <Image
          src={bannerImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      )}
      <h1
        style={{ minHeight: '500px' }}
        className="relative text-5xl sm:text-6xl lg:text-7xl font-bold text-cream-200 m-auto font-serif italic flex flex-col items-center justify-center banner-shadow text-center"
      >
        {title}
      </h1>
    </div>
  );
};

export default PageBanner;
