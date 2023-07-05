/* eslint-disable react-hooks/exhaustive-deps */
import { ScheduleCalendarData, ScheduleColumnData } from "@/util/models";
import { FC, useEffect, useState } from "react";
import CalendarColumns from "./scheduleComponents/CalendarColumns";
import CalendarTimeColumn from "./scheduleComponents/CalendarTimeColumn";
import CalendarColumnTimeHeader from "./scheduleComponents/CalendarColumnTimeHeader";
import CalendarColumnHeader from "./scheduleComponents/CalendarColumnHeader";

interface Props {
  scheduleCalendarData: ScheduleCalendarData;
}

const ScheduleModule: FC<Props> = ({ scheduleCalendarData }) => {
  const [loading, setLoading] = useState(true);
  const [timeData, setTimeData] = useState<string[]>([]);
  const [scheduleColumnData, setScheduleColumnData] =
    useState<ScheduleColumnData>({} as ScheduleColumnData);

  useEffect(() => {
    // generate time columns
    const tempMappingArray = [];
    let i = 0;
    while (i < 24 / scheduleCalendarData.config.segments) {
      tempMappingArray.push(`${i}:00`);
      i++;
    }
    setTimeData(tempMappingArray);

    // generate calendar columns
    let hashTable: ScheduleColumnData = {};
    scheduleCalendarData.calendar.forEach((eachDay) => {
      let date = eachDay.date;
      hashTable[date] = {
        columnData: eachDay,
      };

      i = 0;
      while (i < (24 * 2) / scheduleCalendarData.config.segments) {
        let time;
        if (i === 0) {
          time = "0:00";
        } else if (i % 2 === 1) {
          time = `${Math.floor(i / 2)}:30`;
        } else {
          time = `${Math.floor(i / 2)}:00`;
        }

        hashTable[date][time] = "";
        i++;
      }
    });
    setScheduleColumnData(hashTable);
    setLoading(false);
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className="h-full w-full">
      <div className="flex flex-row h-12 w-[calc(100%-1.4rem)] ml-2 border border-Background_Lighter">
        <CalendarColumnTimeHeader />
        {scheduleCalendarData.calendar.map((data, index) => {
          return (
            <CalendarColumnHeader
              key={index}
              calendarDate={data.date}
              dayOfWeek={data.dayOfWeek}
              enabled={data.enabled}
            />
          );
        })}
      </div>
      <div className="flex flex-row h-[calc(100vh-8rem)] w-[calc(100%-1.4rem)] ml-2 overflow-y-auto border border-Background_Lighter">
        <CalendarTimeColumn timeData={timeData} />
        {Object.entries(scheduleColumnData).map(([key, data]) => {
          return <CalendarColumns key={key} calendarData={data} />;
        })}
      </div>
    </div>
  );
};

export default ScheduleModule;
