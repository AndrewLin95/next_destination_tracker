"use client";
import Header from "./Header";
import { NextPage } from "next";
import SearchModule from "./SearchModule";
import MapModule from "./MapModule";
import { useContext, useEffect, useState } from "react";
import UserContext from "@/app/context/UserProfileContext";
import { UserProfileState, ProjectMapData } from "@/util/models";
import axios from "axios";

interface Props {
  params: any;
}

const ProjectPage: NextPage<Props> = ({ params }) => {
  const { userProfileState, setUserProfileState } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState<ProjectMapData[]>();

  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    const fetchInitPageData = async () => {
      const url = `/api/project/geteachproject/${params.projectid}`;
      const authConfig = {
        headers: {
          Authorization: `Bearer ${
            (userProfileState as UserProfileState).token
          }`,
        },
      };

      const response = await axios.get(url, authConfig);
      const responseData: ProjectMapData[] = response.data;
      console.log(responseData);

      setPageData(responseData);
      setLoading(false);
    };
    fetchInitPageData();
  }, []);

  const handleSearch = () => {
    //https://developers.google.com/maps/documentation/geocoding/requests-geocoding#json

    const query = searchText.split(" ").join("+");
  };

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col justify-center items-center">
      <Header />
      {loading ? (
        // TODO: loading component
        <></>
      ) : (
        <div className="flex flex-row w-full h-full">
          <SearchModule
            searchText={searchText}
            setSearchText={setSearchText}
            handleSearch={handleSearch}
          />
          <MapModule />
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
