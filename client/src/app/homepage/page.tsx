/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import UserContext from "../context/UserProfileContext";
import { ImageListType } from "react-images-uploading/dist/typings";

import Header from "./Header";
import NewProject from "./NewProject";
import ExistingProjects from "./ExistingProjects";
import axios from "axios";
import { ProjectData } from "@/util/models/ProjectModels";
import { UserProfileState } from "@/util/models/AuthModels";
import { setUserProfile } from "@/util/authUtil";
import { VERIFY_TOKEN_RESPONSE } from "@/util/constants";

const HomePage: NextPage = () => {
  const router = useRouter();

  const { userProfileState, setUserProfileState } = useContext(UserContext);
  const [uploadedImage, setUploadedImage] = useState<any[]>([]);
  const [existingProjectsList, setExistingProjectsList] = useState<
    ProjectData[]
  >([]);

  useEffect(() => {
    if ((userProfileState as UserProfileState).token === undefined) {
      const userToken: string = JSON.parse(
        localStorage.getItem("token") as string
      );

      if (userToken === null) {
        router.push("/");
        return;
      }

      const verifyToken = async () => {
        const response: VERIFY_TOKEN_RESPONSE = await setUserProfile(
          userToken,
          setUserProfileState
        );
        if (response === VERIFY_TOKEN_RESPONSE.NoToken) {
          router.push("/");
        }
      };
      verifyToken();
    }
  }, []);

  useEffect(() => {
    if ((userProfileState as UserProfileState).token !== undefined) {
      const url = `/api/project/getprojects/${
        (userProfileState as UserProfileState).userID
      }`;
      const authConfig = {
        headers: {
          Authorization: `Bearer ${
            (userProfileState as UserProfileState).token
          }`,
        },
      };

      const getProjectData = async () => {
        const response = await axios.get(url, authConfig);
        const existingProjectData: ProjectData[] = response.data;

        setExistingProjectsList(existingProjectData);
        console.log(existingProjectData);
      };
      getProjectData();
    }
  }, [userProfileState]);

  const submitNewProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const destination: string = (e.target as HTMLFormElement).destination.value;
    const projectName: string = (e.target as HTMLFormElement).projectName.value;
    const projectDescription: string = (e.target as HTMLFormElement)
      .projectDescription.value;
    const startDate: string = (e.target as HTMLFormElement).startDate.value;
    const endDate: string = (e.target as HTMLFormElement).endDate.value;

    try {
      const url = "/api/project/newproject";
      const body = {
        userID: (userProfileState as UserProfileState).userID,
        projectName: projectName,
        projectDescription: projectDescription,
        projectStartDate: startDate,
        projectEndDate: endDate,
        projectDestination: destination,
        projectImage: uploadedImage[0].dataURL,
      };
      const authConfig = {
        headers: {
          Authorization: `Bearer ${
            (userProfileState as UserProfileState).token
          }`,
        },
      };
      const response = await axios.post(url, body, authConfig);
      const newProjectData = response.data;

      const tempProjectList: ProjectData[] = [
        ...existingProjectsList,
        newProjectData,
      ];
      setExistingProjectsList(tempProjectList);
    } catch (err) {
      console.log(err);
    }
  };

  const handleImageUploadChange = (imageList: ImageListType) => {
    setUploadedImage(imageList as never[]);
  };

  const handleEachProjectClick = (projectID: string) => {
    router.push(`/project/${projectID}`);
  };

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col justify-center items-center">
      <Header />
      <div className="flex flex-col w-full h-full">
        <NewProject
          submitNewProject={submitNewProject}
          uploadedImage={uploadedImage}
          handleImageUploadChange={handleImageUploadChange}
        />
        <ExistingProjects
          existingProjectsList={existingProjectsList}
          handleEachProjectClick={handleEachProjectClick}
        />
      </div>
    </div>
  );
};

export default HomePage;
