import {
  DroppedParsedData,
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
  editScheduleDuration: (
    time: string,
    date: string,
    dateUnix: number,
    data: DroppedParsedData,
  ) => void;
}

const ScheduleModule: FC<Props> = ({
  projectData,
  scheduleData,
  scheduleConfig,
  handleDrop,
  handleDeleteSchedule,
  setScheduleSettingsToggle,
  editScheduleDuration,
}) => {
  return (
    <div className="h-full w-full">
      <div className="flex flex-row h-12 w-[calc(100%-1.4rem)] ml-2 border border-primary5 dark:border-dark_primary5">
        <CalendarSettingsConfig
          setScheduleSettingsToggle={setScheduleSettingsToggle}
        />
        {scheduleConfig.headerData.map((data) => {
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
      <div className="flex flex-row h-[calc(100vh-8rem)] w-[calc(100%-1.4rem)] ml-2 overflow-y-auto border border-primary5 dark:border-dark_primary5">
        <CalendarTimeColumn
          timeValueData={scheduleConfig.timeValueData}
          projectData={projectData}
        />
        {scheduleConfig.headerData.map((data) => {
          return (
            <CalendarColumns
              key={data.date}
              timeData={scheduleConfig.timeData}
              headerData={data}
              handleDrop={handleDrop}
              scheduleInfoData={scheduleData.scheduleData}
              projectData={projectData}
              handleDeleteSchedule={handleDeleteSchedule}
              editScheduleDuration={editScheduleDuration}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleModule;
