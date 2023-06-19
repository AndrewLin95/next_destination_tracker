import { FC } from "react";
import { ProjectData } from "@/util/models";

interface Props {
  existingProjectsList: ProjectData;
}

const ExistingProjects: FC<Props> = ({ existingProjectsList }) => {
  return (
    <div className="flex h-1/2 w-full justify-center items-center border border-red-500">
      <div>Existing Projects</div>
    </div>
  );
};

export default ExistingProjects;
