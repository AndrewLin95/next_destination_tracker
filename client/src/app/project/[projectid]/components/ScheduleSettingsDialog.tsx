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
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);
    console.log((e.target as HTMLFormElement).SundayColor.value);
  };

  return (
    <>
      <div
        className="absolute h-screen w-screen bg-slate-900/40"
        onClick={() => setScheduleSettingsToggle(false)}
      />
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[18rem] bg-Background flex flex-col p-4">
        <div className="text-xl font-bold pb-2 underline text-Accent">
          Edit Schedule Settings
        </div>
        <form onSubmit={handleSubmit}>
          <div className="underline pb-2 pl-1">Schedule Colors</div>
          <div className="flex flex-row pb-3">
            <DateColorPicker
              dayOfWeek={"Monday"}
              color={projectData.scheduleColors.Monday}
            />
            <DateColorPicker
              dayOfWeek={"Tuesday"}
              color={projectData.scheduleColors.Tuesday}
            />
            <DateColorPicker
              dayOfWeek={"Wednesday"}
              color={projectData.scheduleColors.Wednesday}
            />
            <DateColorPicker
              dayOfWeek={"Thursday"}
              color={projectData.scheduleColors.Thursday}
            />
          </div>
          <div className="flex flex-row pb-3">
            <DateColorPicker
              dayOfWeek={"Friday"}
              color={projectData.scheduleColors.Friday}
            />
            <DateColorPicker
              dayOfWeek={"Saturday"}
              color={projectData.scheduleColors.Saturday}
            />
            <DateColorPicker
              dayOfWeek={"Sunday"}
              color={projectData.scheduleColors.Sunday}
            />
          </div>
          <div className="underline pb-2 pl-1">
            Schedule Start and End Times
          </div>
          <button type="submit">Submit Test</button>
        </form>
      </div>
    </>
  );
};

export default ScheduleSettingsDialog;
