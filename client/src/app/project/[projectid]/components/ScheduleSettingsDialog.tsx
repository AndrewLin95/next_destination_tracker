import { Dispatch, FC, SetStateAction } from "react";
import DateColorPicker from "./DateColorPicker";
import { ProjectData } from "@/util/models/ProjectModels";

interface Props {
  setScheduleSettingsToggle: Dispatch<SetStateAction<Boolean>>;
  projectData: ProjectData;
}

const ScheduleSettingsDialog: FC<Props> = ({
  setScheduleSettingsToggle,
  projectData,
}) => {
  return (
    <>
      <div
        className="absolute h-screen w-screen bg-slate-900/40"
        onClick={() => setScheduleSettingsToggle(false)}
      />
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[18rem] bg-Background flex flex-col p-4">
        <div className="text-xl font-bold pb-2 underline text-Accent">
          Edit Schedule Settings
        </div>
        <form>
          <DateColorPicker
            dayOfWeek={"Monday"}
            color={projectData.scheduleColors.Monday}
          />
        </form>
      </div>
    </>
  );
};

export default ScheduleSettingsDialog;
