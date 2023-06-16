"use client";
import Header from "./Header";
import { NextPage } from "next";
import SearchModule from "./SearchModule";
import MapModule from "./MapModule";
import { useContext, useState } from "react";

const ProjectPage: NextPage = () => {
  const [searchText, setSearchText] = useState<string>("");

  const handleSearch = () => {
    //https://developers.google.com/maps/documentation/geocoding/requests-geocoding#json

    const query = searchText.split(" ").join("+");
  };

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col justify-center items-center">
      <Header />
      <div className="flex flex-row w-full h-full">
        <SearchModule
          searchText={searchText}
          setSearchText={setSearchText}
          handleSearch={handleSearch}
        />
        <MapModule />
      </div>
    </div>
  );
};

export default ProjectPage;
