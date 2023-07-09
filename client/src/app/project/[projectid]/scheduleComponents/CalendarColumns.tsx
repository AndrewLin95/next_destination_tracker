import { FC } from "react";
import { ScheduleData, ScheduleHeaderData } from "@/util/models";

interface Props {
  timeData: Map<string, string>;
  headerData: ScheduleHeaderData;
  handleDrop: (
    e: React.DragEvent<HTMLDivElement>,
    time: string,
    date: string,
    dateUnix: number
  ) => void;
}

const CalendarColumns: FC<Props> = ({ timeData, headerData, handleDrop }) => {
  return (
    <div className="w-[calc((100vw-25rem)/7)] h-full">
      {Object.entries(timeData).map(([key, time]) => {
        return (
          <div
            className={`${
              headerData.enabled ? "bg-transparent" : "bg-slate-500/20"
            } h-12 border border-Background_Lighter/50`}
            key={key}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) =>
              handleDrop(e, time, headerData.date, headerData.dateUnix)
            }
          ></div>
        );
      })}
    </div>
  );
};

export default CalendarColumns;
