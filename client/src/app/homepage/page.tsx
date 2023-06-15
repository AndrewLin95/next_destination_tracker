"use client";
import Header from "./Header";
import { NextPage } from "next";

const HomePage: NextPage = () => {
  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col justify-center items-center">
      <Header />
      <div className="flex flex-row w-full h-full">test</div>
    </div>
  );
};

export default HomePage;
