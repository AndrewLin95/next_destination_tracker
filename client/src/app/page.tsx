/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Image from "next/image";
import jwtDecode from "jwt-decode";

import InLineTextButton from "@/components/InLineTextButton";
import AuthContext from "./context/AuthContext";
import { DecodedJWT } from "@/util/models/AuthModels";
import { setUserProfile } from "@/util/authUtil";
import { FORM_SUBMIT_BUTTON, VERIFY_TOKEN_RESPONSE } from "@/util/constants";
import DarkModeButton from "@/components/DarkMode/DarkMode";

const Home: NextPage = () => {
  const router = useRouter();
  const { authState, setAuthState } = useContext(AuthContext);
  const [signUpToggle, setSignUpToggle] = useState(false);

  useEffect(() => {
    const userToken: string = JSON.parse(
      localStorage.getItem("token") as string
    );

    if (userToken === null) {
      return;
    }

    const verifyToken = async () => {
      const response: VERIFY_TOKEN_RESPONSE = await setUserProfile(
        userToken,
        setAuthState
      );
      if (response === VERIFY_TOKEN_RESPONSE.TokenFound) {
        router.push("/homepage");
      }
    };
    verifyToken();
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email: string = (e.target as HTMLFormElement).email.value;
    const password: string = (e.target as HTMLFormElement).password.value;
    try {
      const body = {
        email: email,
        password: password,
      };
      const response = await axios.post("api/auth/login", body);
      localStorage.setItem("token", JSON.stringify(response.data.token));

      const decodedJWT: DecodedJWT = jwtDecode(response.data.token);

      setAuthState({
        userID: decodedJWT.user._id,
        userEmail: decodedJWT.user.email,
        token: response.data.token,
      });

      router.push("/homepage");
    } catch (err) {
      window.alert(`error: ${err}`);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const firstName: string = (e.target as HTMLFormElement).firstName.value;
    const lastName: string = (e.target as HTMLFormElement).lastName.value;
    const email: string = (e.target as HTMLFormElement).email.value;
    const password: string = (e.target as HTMLFormElement).password.value;

    try {
      const body = {
        signupEmail: email,
        signupPassword: password,
        signupFirstName: firstName,
        signupLastName: lastName,
      };
      const response = await axios.post("api/auth/signup", body);
      // TODO: response handling
    } catch (err) {
      window.alert(`error: ${err}`);
    }
  };

  return (
    <>
      <div className="w-screen h-screen overflow-hidden flex flex-col justify-center items-center bg-primary text-black dark:bg-dark_primary dark:text-white">
        <div className="text-green-500 rounded-md" />
        <div className="text-red-500" />
        <div className="text-yellow-500" />
        <div className="h-5/12 w-4/5 max-w-sm flex flex-col py-12 px-8 border bg-primary3 border-dark_accent2 dark:bg-dark_primary3 dark:border-accent2">
          {!signUpToggle ? (
            <div className="flex justify-center text-5xl text-dark_accent3 dark:text-accent1">
              Welcome{" "}
            </div>
          ) : (
            <div className="flex justify-center text-5xl"> Sign Up </div>
          )}

          <div className="flex w-full h-auto justify-center my-4">
            <Image
              alt="Destination Tracker Logo"
              src="/destination.png"
              className="h-32 w-32 my-12"
              width={144}
              height={144}
            />
          </div>

          {!signUpToggle ? (
            // Login Component
            <div className="w-full">
              <form onSubmit={handleLogin}>
                <input
                  className="w-full my-2 p-2 border rounded bg-accent1_lighter border-dark_accent1 dark:bg-dark_accent1_lighter/60 dark:border-accent1"
                  placeholder="Email"
                  type="email"
                  name="email"
                  required
                />
                <input
                  className="w-full my-2 p-2 border rounded bg-accent1_lighter border-dark_accent1 dark:bg-dark_accent1_lighter/60 dark:border-accent1"
                  placeholder="Password"
                  type="password"
                  name="password"
                  required
                />
                <button
                  className={`${FORM_SUBMIT_BUTTON} mt-2 w-full h-10`}
                  type="submit"
                >
                  Login
                </button>
              </form>
              <div className="flex justify-center pt-3">
                Do not have an account? &nbsp;
                <span onClick={() => setSignUpToggle(true)}>
                  <InLineTextButton buttonText="Sign Up" />
                </span>
              </div>
            </div>
          ) : (
            // Sign up Component
            <div className="w-full">
              <form onSubmit={handleSignUp}>
                <div className="flex flex-row justify-around">
                  <input
                    className="w-[50%] my-2 p-2 mr-2 border rounded bg-accent1_lighter border-dark_accent1 dark:bg-dark_accent1_lighter/60 dark:border-accent1"
                    placeholder="First Name"
                    name="firstName"
                    required
                  />
                  <input
                    className="w-[50%] my-2 p-2 border rounded bg-accent1_lighter border-dark_accent1 dark:bg-dark_accent1_lighter/60 dark:border-accent1"
                    placeholder="Last Name"
                    name="lastName"
                    required
                  />
                </div>
                <input
                  className="w-full my-2 p-2 border rounded bg-accent1_lighter border-dark_accent1 dark:bg-dark_accent1_lighter/60 dark:border-accent1"
                  placeholder="Email"
                  type="email"
                  name="email"
                  required
                />
                <input
                  className="w-full my-2 p-2 border rounded bg-accent1_lighter border-dark_accent1 dark:bg-dark_accent1_lighter/60 dark:border-accent1"
                  placeholder="Password"
                  type="password"
                  name="password"
                  required
                />
                <button
                  className={`${FORM_SUBMIT_BUTTON} mt-2 w-full h-10`}
                  type="submit"
                >
                  Sign Up
                </button>
              </form>
              <div className="flex justify-center pt-3">
                Already have an account? &nbsp;
                <span onClick={() => setSignUpToggle(false)}>
                  <InLineTextButton buttonText="Log In" />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <DarkModeButton />
    </>
  );
};

export default Home;
