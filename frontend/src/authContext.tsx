import { useState, createContext, useContext } from "react";
import type { user } from "@kartik010700/common";

interface UserContextType {
  user: user | undefined;
  setUser: React.Dispatch<React.SetStateAction<user | undefined>>;
}

const AuthContext = createContext<UserContextType>({
  user: undefined,
  setUser: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<user | undefined>(undefined);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
