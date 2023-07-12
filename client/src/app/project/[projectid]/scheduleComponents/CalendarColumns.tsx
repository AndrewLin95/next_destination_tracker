import { FC } from "react";
import {
  EachScheduleData,
  ProjectData,
  ScheduleHeaderData,
} from "@/util/models";
import EachScheduleItem from "./EachScheduleItem";

interface Props {
  timeData: Map<string, string>;
  headerData: ScheduleHeaderData;
  handleDrop: (
    e: React.DragEvent<HTMLDivElement>,
    time: string,
    date: string,
    dateUnix: number
  ) => void;
  scheduleInfoData: {
    [key: string]: EachScheduleData[];
  };
  projectData: ProjectData;
}

const CalendarColumns: FC<Props> = ({
  timeData,
  headerData,
  handleDrop,
  scheduleInfoData,
  projectData,
}) => {
  return (
    <div className="w-[calc((100vw-25rem)/7)] h-full">
      {Object.entries(timeData).map(([key, time]) => {
        const formattedKey = `${headerData.date} ${time}`;
        return (
          <div
            className={`${
              headerData.enabled ? "bg-transparent" : "bg-slate-500/20"
            } h-12 border border-Background_Lighter/50 p-1`}
            key={key}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) =>
              handleDrop(e, time, headerData.date, headerData.dateUnix)
            }
          >
            {formattedKey in scheduleInfoData
              ? scheduleInfoData[formattedKey].map((data, index) => {
                  return (
                    <EachScheduleItem
                      key={index}
                      eachSchedule={data}
                      configSegments={projectData.scheduleConfig.minPerSegment}
                      scheduleColors={projectData.scheduleColors}
                      dateUnix={headerData.dateUnix}
                    />
                  );
                })
              : null}
          </div>
        );
      })}
    </div>
  );
};

export default CalendarColumns;
