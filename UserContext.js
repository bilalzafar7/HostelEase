// UserContext.js
import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);


  const setUserContext = (userId, details) => {
    setUserId(userId);
    setUserDetails(details);
  };

  return (
    <UserContext.Provider value={{ userId, userDetails, setUserContext }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
