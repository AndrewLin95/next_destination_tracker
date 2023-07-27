import { SIMPLE_BUTTON_STYLE } from "@/util/constants";
import Image from "next/image";
import { FC, Dispatch, SetStateAction } from "react";

interface Props {
  setProjectSettingsToggle: Dispatch<SetStateAction<Boolean>>;
}

const ProjectProfile: FC<Props> = ({ setProjectSettingsToggle }) => {
  return (
    <button
      type="button"
      className={`${SIMPLE_BUTTON_STYLE}`}
      onClick={() => setProjectSettingsToggle(true)}
    >
      <Image
        src="/settings-icon.png"
        alt="User Profile"
        width={144}
        height={144}
        className="h-8 w-auto pr-2"
      />
    </button>
  );
};

export default ProjectProfile;
