import React, { useState, type ReactNode } from "react";

interface User {
    "_id": string,
    "email": string,
    "equipe"?: {
        "_id": string,
        "nome": string,
    }
    "nome": string,
    "senha": string,
}

const UserContext = React.createContext<{
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
} | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);
  
  const value = { user, setUser };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;