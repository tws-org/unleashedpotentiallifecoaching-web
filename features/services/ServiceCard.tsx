import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/legacy/image';

const BookTimeUp = dynamic(() => import('components/shared/BookTimePopup'));

const ServiceCard = ({
  name,
  bookTimePhoto,
}: {
  name: string;
  bookTimePhoto: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-12 flex flex-col items-center justify-center space-y-4 lg:space-y-2 lg:flex-row">
      <div className="w-full sm:max-w-md lg:w-1/2 lg:inline ">
        <Image
          src={bookTimePhoto}
          alt={name}
          width={500}
          height={500}
          layout="intrinsic"
        />
      </div>
      <div className="bg-white shadow-xl rounded border z-30 w-full sm:max-w-md lg:-ml-12">
        <div className="mx-3 my-4 flex flex-col items-center rounded border border-black">
          <p className="uppercase text-forrest text-base font-bold text-center mt-8">
            1 Hour Session with {name}
          </p>
          <div className="mx-auto text-center py-5">
            <button
              onClick={() => setIsOpen(true)}
              className="bg-forrest-900 hover:bg-forrest  text-white text-center py-4 px-12 text-xl rounded"
            >
              Book now
            </button>

            <BookTimeUp open={isOpen} setOpen={setIsOpen} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
