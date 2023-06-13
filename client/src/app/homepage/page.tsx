"use client";
import Header from "./Header";
import { NextPage } from "next";
import SearchModule from "./SearchModule";
import MapModule from "./MapModule";

const homepage: NextPage = () => {
  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col justify-center items-center">
      <Header />
      <div className="flex flex-row w-full h-full">
        <SearchModule />
        <MapModule />
      </div>
    </div>
  );
};

export default homepage;
