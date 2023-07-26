import { Dispatch, FC, SetStateAction } from "react";
import GithubLink from "@/components/headerComponents/GithubLink";
import HeaderTitle from "@/components/headerComponents/HeaderTitle";
import ProjectProfile from "@/components/headerComponents/ProjectProfile";

interface Props {
  setProjectSettingsToggle: Dispatch<SetStateAction<Boolean>>;
}

const Header: FC<Props> = ({ setProjectSettingsToggle }) => {
  return (
    <div className="w-screen h-16 flex flex-row justify-between items-center">
      <HeaderTitle />
      <div className="pl-8 flex flex-row pr-8">
        <ProjectProfile setProjectSettingsToggle={setProjectSettingsToggle} />
        <GithubLink />
      </div>
    </div>
  );
};

export default Header;
