import React, { createContext, FC, useState } from 'react';
import { IUser } from '../interfaces/user';


// Define Context Type
interface IUserContext {
  user: undefined | IUser,
  setUser: (user: undefined | IUser) => void
}

// Provider
const UserContext = createContext<IUserContext>({} as IUserContext);

export const UserProvider: FC = ({ children }) => {
  const [user, setUser] = useState<IUser | undefined>(undefined);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Export to app
export default UserContext;
