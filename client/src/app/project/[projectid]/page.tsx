"use client";
import Header from "./Header";
import { NextPage } from "next";
import SearchModule from "./SearchModule";
import MapModule from "./MapModule";
import { useContext, useEffect, useState } from "react";
import UserContext from "@/app/context/UserProfileContext";
import { UserProfileState, ProjectMapData, ProjectData } from "@/util/models";
import axios from "axios";

interface InitResponseData {
  projectData: ProjectData;
  locationData: ProjectMapData[];
}

interface Props {
  params: any;
}

const ProjectPage: NextPage<Props> = ({ params }) => {
  const { userProfileState, setUserProfileState } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState<ProjectData>();
  const [locationData, setLocationData] = useState<ProjectMapData[]>();

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
      const responseData: InitResponseData = response.data;
      console.log(responseData);

      setProjectData(responseData.projectData);
      setLocationData(responseData.locationData);

      setLoading(false);
    };
    fetchInitPageData();
  }, []);

  const handleSearch = () => {
    //https://developers.google.com/maps/documentation/geocoding/requests-geocoding#json
    const fetchSearchData = async () => {
      const url = `/api/project/searchlocation`;
      const authConfig = {
        headers: {
          Authorization: `Bearer ${
            (userProfileState as UserProfileState).token
          }`,
        },
      };
      const body = {
        userID: (userProfileState as UserProfileState).userID,
        projectID: params.projectid as string,
        query: searchText.split(" ").join("+"),
      };

      const response = await axios.post(url, body, authConfig);
      const responseData = response.data;
      console.log(responseData);
    };
    fetchSearchData();
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
          <MapModule projectData={projectData} />
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
