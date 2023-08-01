import {
  ProjectData,
  ScheduleConfigData,
  ScheduleData,
} from "@/util/models/ProjectModels";
import { Dispatch, FC, SetStateAction } from "react";
import CalendarColumns from "./scheduleComponents/CalendarColumns";
import CalendarTimeColumn from "./scheduleComponents/CalendarTimeColumn";
import CalendarColumnHeader from "./scheduleComponents/CalendarColumnHeader";
import CalendarSettingsConfig from "./scheduleComponents/CalendarSettingsConfig";

interface Props {
  projectData: ProjectData;
  scheduleData: ScheduleData;
  scheduleConfig: ScheduleConfigData;
  handleDrop: (
    e: React.DragEvent<HTMLDivElement>,
    time: string,
    date: string,
    dateUnix: number,
    enabledOrDisabled: boolean
  ) => void;
  handleDeleteSchedule: (locationID: string) => void;
  setScheduleSettingsToggle: Dispatch<SetStateAction<Boolean>>;
}

const ScheduleModule: FC<Props> = ({
  projectData,
  scheduleData,
  scheduleConfig,
  handleDrop,
  handleDeleteSchedule,
  setScheduleSettingsToggle,
}) => {
  return (
    <div className="h-full w-full">
      <div className="flex flex-row h-12 w-[calc(100%-1.4rem)] ml-2 border border-Background_Lighter">
        <CalendarSettingsConfig
          setScheduleSettingsToggle={setScheduleSettingsToggle}
        />
        {scheduleConfig.headerData.map((data, index) => {
          return (
            <CalendarColumnHeader
              key={data.date}
              calendarDate={data.date}
              dayOfWeek={data.dayOfWeek}
              enabled={data.enabled}
            />
          );
        })}
      </div>
      <div className="flex flex-row h-[calc(100vh-8rem)] w-[calc(100%-1.4rem)] ml-2 overflow-y-auto border border-Background_Lighter">
        <CalendarTimeColumn
          timeValueData={scheduleConfig.timeValueData}
          projectData={projectData}
        />
        {scheduleConfig.headerData.map((data, index) => {
          return (
            <CalendarColumns
              key={data.date}
              timeData={scheduleConfig.timeData}
              headerData={data}
              handleDrop={handleDrop}
              scheduleInfoData={scheduleData.scheduleData}
              projectData={projectData}
              handleDeleteSchedule={handleDeleteSchedule}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleModule;
