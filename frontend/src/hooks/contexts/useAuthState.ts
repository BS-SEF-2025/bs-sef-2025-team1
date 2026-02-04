import { useContext } from "react";

import { AuthContext } from "@/contexts/AuthContext";

const useAuthState = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthState must be used within an AuthProvider");
  }

  return context;
};

export default useAuthState;
