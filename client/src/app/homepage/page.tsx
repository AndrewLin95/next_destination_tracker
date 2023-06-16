"use client";
import Header from "./Header";
import { NextPage } from "next";
import NewProject from "./NewProject";
import ExistingProjects from "./ExistingProjects";

const HomePage: NextPage = () => {
  // Strategy:
  // load all associated projects on mount.
  // map to a component called AllProjects (name TBD)
  // load user information? Create context for user profile information

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col justify-center items-center">
      <Header />
      <div className="flex flex-col w-full h-full">
        <NewProject />
        <ExistingProjects />
      </div>
    </div>
  );
};

export default HomePage;
