import { FC } from "react";
import { CalendarData } from "@/util/models";

interface Props {
  calendarData: CalendarData;
}

const CalendarColumns: FC<Props> = ({ calendarData }) => {
  return (
    <div className="w-[calc((100vw-25rem)/7)] h-full">
      {calendarData.mappingArray.map((segment, index) => {
        return (
          <div className="h-12 border border-Background_Lighter/50" key={index}>
            {" "}
          </div>
        );
      })}
    </div>
  );
};

export default CalendarColumns;
