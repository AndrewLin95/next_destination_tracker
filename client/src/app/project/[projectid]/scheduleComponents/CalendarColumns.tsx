import { FC } from "react";
import { EachScheduleColumnData } from "@/util/models";

interface Props {
  calendarData: EachScheduleColumnData;
}

const CalendarColumns: FC<Props> = ({ calendarData }) => {
  return (
    <div className="w-[calc((100vw-25rem)/7)] h-full">
      {Object.entries(calendarData).map(([key, data]) => {
        return (
          <div
            className={`${
              calendarData.columnData.enabled
                ? "bg-transparent"
                : "bg-slate-500/20"
            } h-12 border border-Background_Lighter/50`}
            key={key}
          >
            {" "}
          </div>
        );
      })}
    </div>
  );
};

export default CalendarColumns;
