import { useState, createContext, useContext } from "react";
import type { user } from "@kartik010700/common";

 interface UserContextType {
  user: user | undefined; // allow undefined to match useState
  setUser: React.Dispatch<React.SetStateAction<user | undefined>>;
}

 const AuthContext = createContext<UserContextType>({
  user: undefined,
  setUser: () => {},
});

 export const useAuth = ()=> useContext(AuthContext); 


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<user | undefined>(undefined);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
