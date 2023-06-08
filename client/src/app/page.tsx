"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [signUpToggle, setSignUpToggle] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  return (
    <>
      <div className="w-screen h-screen overflow-hidden flex flex-col justify-center items-center">
        <div className="h-5/12 w-1/5 flex flex-col py-12 px-8 border border-blue-200">
          {signUpToggle ? (
            <div className="flex justify-center text-5xl"> Welcome </div>
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

          {signUpToggle ? (
            <div className="w-full">
              <input
                className="w-full my-2 p-2"
                placeholder="Email"
                type="email"
                v-model="loginEmail"
              />
              <input
                className="w-full my-2 p-2"
                placeholder="Password"
                type="password"
                v-model="loginPassword"
              />
              <button
                className="mt-4 w-full"
                // @click="handleLogin()"
              >
                Login
              </button>
              <div className="flex justify-center pt-3">
                Don&#39t have an account? &nbsp;
                <span
                  className="font-bold text-blue-300"
                  // @click="handleSignUpToggle(true)"
                >
                  Sign Up
                </span>
              </div>
            </div>
          ) : (
            <div v-else className="w-full">
              <div className="flex flex-row justify-around">
                <input
                  className="w-[50%] my-2 p-2 mr-2"
                  placeholder="First Name"
                  v-model="signupFirstName"
                />
                <input
                  className="w-[50%] my-2 p-2"
                  placeholder="Last Name"
                  v-model="signupLastName"
                />
              </div>
              <input
                className="w-full my-2 p-2"
                placeholder="Email"
                type="email"
                v-model="signupEmail"
              />
              <input
                className="w-full my-2 p-2"
                placeholder="Password"
                type="password"
                v-model="signupPassword"
              />
              <button className="mt-2 w-full">Sign Up</button>
              <div className="flex justify-center pt-3">
                Already have an account? &nbsp;
                <span
                  className="font-bold text-blue-300"
                  // @click="handleSignUpToggle(false)"
                >
                  Log In
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
