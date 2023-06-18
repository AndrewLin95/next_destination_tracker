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
import { UserProfileState } from "@/util/models";

const HomePage: NextPage = () => {
  // https://blog.logrocket.com/nextauth-js-for-next-js-client-side-authentication/
  // https://nextjs.org/docs/pages/building-your-application/routing/authenticating bring yourr own database
  // middleware.ts file. RUNS BEFORE routes? https://nextjs.org/docs/pages/building-your-application/routing/middleware
  const router = useRouter();

  const { userProfileState, setUserProfileState } = useContext(UserContext);
  const [uploadedImage, setUploadedImage] = useState<any[]>([]);

  useEffect(() => {
    if ((userProfileState as UserProfileState).token === undefined) {
      router.push("/");
    }
  }, []);

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
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const handleImageUploadChange = (imageList: ImageListType) => {
    setUploadedImage(imageList as never[]);
  };

  useEffect(() => {
    console.log(uploadedImage);
    console.log(userProfileState);
  }, [uploadedImage]);

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col justify-center items-center">
      <Header />
      <div className="flex flex-col w-full h-full">
        <NewProject
          submitNewProject={submitNewProject}
          uploadedImage={uploadedImage}
          handleImageUploadChange={handleImageUploadChange}
        />
        <ExistingProjects />
      </div>
    </div>
  );
};

export default HomePage;
