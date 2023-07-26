"use client";

import { Dispatch, SetStateAction, createContext, useState } from "react";
import { AuthState } from "@/util/models/AuthModels";

const AuthContext = createContext<{
  authState: AuthState | {};
  setAuthState: Dispatch<SetStateAction<AuthState>>;
}>({
  authState: {} as AuthState,
  setAuthState: () => null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState | {}>({} as AuthState);

  return (
    <AuthContext.Provider
      value={{
        authState,
        setAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
