/* eslint-disable react-hooks/exhaustive-deps */
import { ScheduleData } from "@/util/models";
import { FC } from "react";
import CalendarColumns from "./scheduleComponents/CalendarColumns";
import CalendarTimeColumn from "./scheduleComponents/CalendarTimeColumn";
import CalendarColumnTimeHeader from "./scheduleComponents/CalendarColumnTimeHeader";
import CalendarColumnHeader from "./scheduleComponents/CalendarColumnHeader";

interface Props {
  scheduleData: ScheduleData;
  handleDrop: (
    e: React.DragEvent<HTMLDivElement>,
    time: string,
    date: string,
    dateUnix: number
  ) => void;
}

const ScheduleModule: FC<Props> = ({ scheduleData, handleDrop }) => {
  return (
    <div className="h-full w-full">
      <div className="flex flex-row h-12 w-[calc(100%-1.4rem)] ml-2 border border-Background_Lighter">
        <CalendarColumnTimeHeader />
        {scheduleData.headerData.map((data, index) => {
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
        <CalendarTimeColumn timeValueData={scheduleData.timeValueData} />
        {scheduleData.headerData.map((data, index) => {
          return (
            <CalendarColumns
              key={data.date}
              timeData={scheduleData.timeData}
              headerData={data}
              handleDrop={handleDrop}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleModule;
