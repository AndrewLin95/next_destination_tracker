"use client";
import Header from "./Header";
import { NextPage } from "next";

const HomePage: NextPage = () => {
  // Strategy:
  // load all associated projects on mount.
  // map to a component called AllProjects (name TBD)
  // load user information? Create context for user profile information

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col justify-center items-center">
      <Header />
      <div className="flex flex-row w-full h-full"></div>
    </div>
  );
};

export default HomePage;
