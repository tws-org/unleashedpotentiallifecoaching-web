import React, { createContext, useState } from 'react';
import { ICoachFields } from 'types/contentful';

interface ContextProps {
  coaches: ICoachFields[];
  setCoaches: (e: ICoachFields[]) => void;
}

const defaultProps = {
  coaches: [],
  setCoaches: () => {},
};

export const CoachesContext = createContext<ContextProps>(defaultProps);

export const CoachesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [coaches, setCoaches] = useState<unknown | ICoachFields[]>();
  const values = { coaches, setCoaches } as ContextProps;

  return (
    <CoachesContext.Provider value={values}>{children}</CoachesContext.Provider>
  );
};
