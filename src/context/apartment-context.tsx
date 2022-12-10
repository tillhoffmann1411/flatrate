import React, { createContext, FC, useState } from 'react';
import { IApartment } from '../interfaces/apartment';


// Define Context Type
interface IApartmentContext {
  apartment: undefined | IApartment,
  setApartment: (apartment: undefined | IApartment) => void
}

// Provider
const ApartmentContext = createContext<IApartmentContext>({} as IApartmentContext);

export const ApartmentProvider: FC = ({ children }) => {
  const [apartment, setApartment] = useState<IApartment | undefined>(undefined);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <ApartmentContext.Provider value={{ apartment, setApartment }}>
      {children}
    </ApartmentContext.Provider>
  );
};

// Export to app
export default ApartmentContext;
