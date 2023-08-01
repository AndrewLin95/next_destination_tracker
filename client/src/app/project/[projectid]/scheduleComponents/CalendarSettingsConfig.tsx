import { Dispatch, FC, SetStateAction } from "react";
import Image from "next/image";
import { SIMPLE_BUTTON_STYLE } from "@/util/constants";

interface Props {
  setScheduleSettingsToggle: Dispatch<SetStateAction<Boolean>>;
}

const CalendarSettingsConfig: FC<Props> = ({ setScheduleSettingsToggle }) => {
  return (
    <div className="w-16 pr-1 flex justify-center items-center">
      <button
        type="button"
        className={`${SIMPLE_BUTTON_STYLE}`}
        onClick={() => setScheduleSettingsToggle(true)}
      >
        <Image
          src="/edit.png"
          alt="Edit Schedule Settings"
          width={144}
          height={144}
          className="h-8 w-auto"
        />
      </button>
    </div>
  );
};

export default CalendarSettingsConfig;
