import { Dispatch, FC, SetStateAction } from "react";
import GithubLink from "@/components/headerComponents/GithubLink";
import HeaderTitle from "@/components/headerComponents/HeaderTitle";
import ProjectProfile from "@/components/headerComponents/ProjectProfile";
import Image from "next/image";

interface Props {
  setProjectSettingsToggle: Dispatch<SetStateAction<Boolean>>;
  projectImage: string;
  projectName: string;
}

const Header: FC<Props> = ({
  setProjectSettingsToggle,
  projectImage,
  projectName,
}) => {
  return (
    <div className="w-screen h-16 flex flex-row justify-between items-center">
      <HeaderTitle />
      <div className="flex flex-row items-center">
        <div className="absolute left-1/2 transform -translate-x-1/2">
          {projectName}
        </div>
        <Image
          src={projectImage}
          alt="Project Image"
          height={144}
          width={144}
          className="h-16 w-80 object-cover mr-14"
        />
      </div>

      <div className="pl-8 flex flex-row pr-8">
        <ProjectProfile setProjectSettingsToggle={setProjectSettingsToggle} />
        <GithubLink />
      </div>
    </div>
  );
};

export default Header;
