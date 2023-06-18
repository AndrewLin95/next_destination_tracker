"use client";
import { NextPage } from "next";
import { useContext, useState, useEffect } from "react";
import UserContext from "../context/UserProfileContext";
import { ImageListType } from "react-images-uploading/dist/typings";

import Header from "./Header";
import NewProject from "./NewProject";
import ExistingProjects from "./ExistingProjects";

const HomePage: NextPage = () => {
  // https://blog.logrocket.com/nextauth-js-for-next-js-client-side-authentication/
  // https://nextjs.org/docs/pages/building-your-application/routing/authenticating bring yourr own database
  // middleware.ts file. RUNS BEFORE routes? https://nextjs.org/docs/pages/building-your-application/routing/middleware

  // Strategy:
  // load all associated projects on mount.
  // map to a component called AllProjects (name TBD)
  // load user information? Create context for user profile information
  const { userProfileState, setUserProfileState } = useContext(UserContext);
  const [uploadedImage, setUploadedImage] = useState<ImageListType[]>([]);

  const submitNewProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const destination: string = (e.target as HTMLFormElement).destination.value;
    const projectName: string = (e.target as HTMLFormElement).projectName.value;
    const projectDescription: string = (e.target as HTMLFormElement)
      .projectDescription.value;
    const startDate: string = (e.target as HTMLFormElement).startDate.value;
    const endDate: string = (e.target as HTMLFormElement).endDate.value;

    console.log(startDate);
    console.log(userProfileState);
  };

  const handleImageUploadChange = (imageList: ImageListType) => {
    setUploadedImage(imageList as never[]);
  };

  useEffect(() => {
    console.log(uploadedImage);
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
