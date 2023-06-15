"use client";

import { Dispatch, SetStateAction, createContext, useState } from "react";

// TODO: update to store user shared state

const ProjectContext = createContext<{
  projectState: string;
  setProjectState: Dispatch<SetStateAction<string>>;
}>({ projectState: "1", setProjectState: () => null });

export const ProjectProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [projectState, setProjectState] = useState("1");

  return (
    <ProjectContext.Provider
      value={{
        projectState,
        setProjectState,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContext;
