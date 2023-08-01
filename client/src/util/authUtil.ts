import { Dispatch, SetStateAction } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { AuthState } from "./models/AuthModels";
import { DecodedJWT } from "./models/AuthModels";
import { VERIFY_TOKEN_RESPONSE } from "./constants";

export const setUserProfile = async (userJWT: string, setUserProfileState: Dispatch<SetStateAction<AuthState>>) => {
  const body = {
    token: userJWT,
  };

  const response = await axios.post("api/auth/verifytoken", body);

  if (response.data === "Invalid token") {
    localStorage.removeItem("token");
    return VERIFY_TOKEN_RESPONSE.NoToken;
  } else {
    localStorage.setItem("token", JSON.stringify(response.data));
    const decodedJWT: DecodedJWT = jwtDecode(response.data);

    setUserProfileState({
      userID: decodedJWT.user._id,
      userEmail: decodedJWT.user.email,
      token: response.data,
    });
    return VERIFY_TOKEN_RESPONSE.TokenFound
  }
}