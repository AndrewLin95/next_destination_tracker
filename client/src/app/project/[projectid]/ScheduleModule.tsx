import { ScheduleDateData, ScheduleCalendarData } from "@/util/models";
import { FC } from "react";
import CalendarColumns from "./scheduleComponents/CalendarColumns";
import CalendarTimeColumn from "./scheduleComponents/CalendarTimeColumn";
import CalendarColumnTimeHeader from "./scheduleComponents/CalendarColumnTimeHeader";
import CalendarColumnHeader from "./scheduleComponents/CalendarColumnHeader";

interface Props {
  projectStartEnd: ScheduleDateData | null;
  scheduleCalendarData: ScheduleCalendarData | null;
}

const ScheduleModule: FC<Props> = ({
  projectStartEnd,
  scheduleCalendarData,
}) => {
  if (scheduleCalendarData === null) {
    return null;
  }

  return (
    <div className="h-full w-full">
      <div className="flex flex-row h-12 w-[calc(100%-1.4rem)] ml-2 border border-slate-500/30">
        <CalendarColumnTimeHeader />
        {scheduleCalendarData.calendar.map((data, index) => {
          return (
            <CalendarColumnHeader
              key={index}
              calendarDate={data.date}
              dayOfWeek={data.dayOfWeek}
            />
          );
        })}
      </div>
      <div className="flex flex-row h-[calc(100vh-8rem)] w-[calc(100%-1.4rem)] ml-2 overflow-y-auto border border-slate-500/30">
        <CalendarTimeColumn
          timeMappingArray={scheduleCalendarData.config.mappingArray}
        />
        {scheduleCalendarData.calendar.map((data, index) => {
          return <CalendarColumns key={index} calendarData={data} />;
        })}
      </div>
    </div>
  );
};

export default ScheduleModule;
