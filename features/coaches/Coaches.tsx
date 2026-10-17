import CoachCard from 'components/molecules/CoachCard';
import React from 'react';
import { ICoachFields } from 'types/contentful';

const Coaches = ({ coaches }: { coaches: ICoachFields[] }) => {
  return (
    <div className="bg-forrest py-12">
      <p className="text-white font-serif italic font-bold text-center text-5xl mb-24">
        Take the first step
      </p>
      <div className="flex flex-col justify-center items-center xl:flex-row 2xl:justify-evenly my-82">
        {coaches
          .sort((a, b) =>
            (a.appearanceOrder as number) > (b.appearanceOrder as number)
              ? 1
              : -1,
          )
          .map((coach, index) => (
            <CoachCard
              key={`${coach.name}-${index}`}
              name={coach.name}
              url={coach?.bookTimePhoto?.url}
            />
          ))}
      </div>
    </div>
  );
};

export default Coaches;
