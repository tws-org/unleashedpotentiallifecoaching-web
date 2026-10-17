import { memo } from 'react';

const ButtonContent = memo(function ButtonContent() {
  return (
    <>
      <p className="text-white font-serif italic font-bold text-center text-3xl">
        Take the first step
      </p>
      <p className="font-bold mb-0 text-base text-center">
        Get your first 1 hour session today!
      </p>
    </>
  );
});

export default ButtonContent;
