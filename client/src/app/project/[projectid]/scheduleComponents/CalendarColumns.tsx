import { FC } from "react";
import { ScheduleData, ScheduleHeaderData } from "@/util/models";

interface Props {
  timeData: Map<string, string>;
  headerData: ScheduleHeaderData;
}

const CalendarColumns: FC<Props> = ({ timeData, headerData }) => {
  return (
    <div className="w-[calc((100vw-25rem)/7)] h-full">
      {Object.entries(timeData).map(([key, data]) => {
        return (
          <div
            className={`${
              headerData.enabled ? "bg-transparent" : "bg-slate-500/20"
            } h-12 border border-Background_Lighter/50`}
            key={key}
          ></div>
        );
      })}
    </div>
  );
};

export default CalendarColumns;
