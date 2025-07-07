// UserContext.tsx
import { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: number;
  nome: string;
  funcao: number;
  ruf: number;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
      fetch("https://batback.onrender.com/session", {
        method: "GET",
        credentials: "include",
      })
        .then(res => res.json())
        .then(data => {
          setUser(data);
        });
    
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser deve estar dentro do UserProvider");
  return context;
}
