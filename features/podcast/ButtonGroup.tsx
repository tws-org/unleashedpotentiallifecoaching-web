import React from 'react';

interface Props {
  setTriggerNextPage: (e: boolean) => void;
  nextPageToken: string;
}
const ButtonGroup = ({ setTriggerNextPage, nextPageToken }: Props) => {
  return (
    <div className="flex flex-row justify-center w-full">
      <button
        onClick={() => setTriggerNextPage(true)}
        className={` ${
          !Boolean(nextPageToken) ? 'opacity-25' : ''
        } mb-4 sm:mb-0 font-bold w-full sm:w-2/4 text-center py-3 rounded bg-forrest text-white text-2xl`}
      >
        Show More
      </button>
    </div>
  );
};

export default ButtonGroup;
