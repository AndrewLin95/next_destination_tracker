"use client";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import InLineTextButton from "@/components/InLineTextButton";

interface Props {}

const Home: NextPage<Props> = () => {
  const router = useRouter();
  const [signUpToggle, setSignUpToggle] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  useEffect(() => {
    const userToken: string = JSON.parse(
      localStorage.getItem("user") as string
    );

    if (userToken === null) {
      return;
    }

    const body = {
      token: userToken,
    };

    const validateJWT = async () => {
      const response = await axios.post("api/auth/verifytoken", body);

      if (response.data === "Invalid token") {
        localStorage.removeItem("user");
        return;
      } else {
        localStorage.setItem("user", JSON.stringify(response.data));

        router.push("/homepage");
      }
    };
    validateJWT();
  });

  const handleLogin = async () => {
    try {
      const body = {
        email: loginEmail,
        password: loginPassword,
      };
      const response = await axios.post("api/auth/login", body);
      localStorage.setItem("user", JSON.stringify(response.data.token));
      router.push("/homepage");
      // const items = JSON.parse(localStorage.getItem('user') as string);
    } catch (err) {
      window.alert(`error: ${err}`);
    }
  };

  const handleSignUp = async () => {
    try {
      const body = {
        signupEmail: signupEmail,
        signupPassword: signupPassword,
        signupFirstName: signupFirstName,
        signupLastName: signupLastName,
      };
      const response = await axios.post("api/auth/signup", body);
      // TODO: response handling
    } catch (err) {
      window.alert(`error: ${err}`);
    }
  };

  return (
    <>
      <div className="w-screen h-screen overflow-hidden flex flex-col justify-center items-center">
        <div className="h-5/12 w-4/5 max-w-sm flex flex-col py-12 px-8 border border-blue-200">
          {!signUpToggle ? (
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

          {!signUpToggle ? (
            // Login Component
            <div className="w-full">
              <input
                className="w-full my-2 p-2"
                placeholder="Email"
                type="email"
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <input
                className="w-full my-2 p-2"
                placeholder="Password"
                type="password"
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <button className="mt-4 w-full" onClick={() => handleLogin()}>
                Login
              </button>
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
              <div className="flex flex-row justify-around">
                <input
                  className="w-[50%] my-2 p-2 mr-2"
                  placeholder="First Name"
                  onChange={(e) => setSignupFirstName(e.target.value)}
                />
                <input
                  className="w-[50%] my-2 p-2"
                  placeholder="Last Name"
                  onChange={(e) => setSignupLastName(e.target.value)}
                />
              </div>
              <input
                className="w-full my-2 p-2"
                placeholder="Email"
                type="email"
                onChange={(e) => setSignupEmail(e.target.value)}
              />
              <input
                className="w-full my-2 p-2"
                placeholder="Password"
                type="password"
                onChange={(e) => setSignupPassword(e.target.value)}
              />
              <button className="mt-2 w-full" onClick={() => handleSignUp()}>
                Sign Up
              </button>
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
    </>
  );
};

export default Home;
