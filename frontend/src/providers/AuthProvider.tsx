import { useEffect, useState, type PropsWithChildren } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/firebase";
import { AuthContext } from "@/contexts/AuthContext";
import type { AuthContextValue } from "@/types";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsub;
  }, []);

  const value: AuthContextValue = { user, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
