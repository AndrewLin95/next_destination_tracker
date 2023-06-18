"use client";

import { Dispatch, SetStateAction, createContext, useState } from "react";
import { UserProfileState } from "@/util/models";

const UserContext = createContext<{
  userProfileState: UserProfileState | {};
  setUserProfileState: Dispatch<SetStateAction<UserProfileState>>;
}>({
  userProfileState: {} as UserProfileState,
  setUserProfileState: () => null,
});

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userProfileState, setUserProfileState] = useState<
    UserProfileState | {}
  >({} as UserProfileState);

  return (
    <UserContext.Provider
      value={{
        userProfileState,
        setUserProfileState,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
