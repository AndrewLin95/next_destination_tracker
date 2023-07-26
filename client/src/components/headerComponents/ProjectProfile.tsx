import Image from "next/image";
import { FC, Dispatch, SetStateAction } from "react";

interface Props {
  setProjectSettingsToggle: Dispatch<SetStateAction<Boolean>>;
}

const ProjectProfile: FC<Props> = ({ setProjectSettingsToggle }) => {
  return (
    <div onClick={() => setProjectSettingsToggle(true)}>
      <Image
        src="/user-profile.png"
        alt="User Profile"
        width={144}
        height={144}
        className="h-8 w-auto pr-2"
      />
    </div>
  );
};

export default ProjectProfile;
