"use client";

import { Dispatch, createContext, useState } from "react";

const ProjectContext = createContext<{
  projectState: string;
  setProjectState: Dispatch<string>;
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
