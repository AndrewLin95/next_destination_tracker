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
    dateUnix: number,
    enabledOrDisabled: boolean
  ) => void;
  scheduleInfoData: {
    [key: string]: EachScheduleData[];
  };
  projectData: ProjectData;
  handleDeleteSchedule: (locationID: string) => void;
}

const CalendarColumns: FC<Props> = ({
  timeData,
  headerData,
  handleDrop,
  scheduleInfoData,
  projectData,
  handleDeleteSchedule,
}) => {
  return (
    <div className="w-[calc((100vw-25rem)/7)] h-full">
      {Object.entries(timeData).map(([key, time]) => {
        const formattedKey = `${headerData.date} ${time}`;
        let stackedSegment = false;
        if (formattedKey in scheduleInfoData) {
          let numSegments = 0;
          scheduleInfoData[formattedKey].forEach((infoData) => {
            if (infoData.dataSegment) {
              numSegments++;
            }
          });
          if (numSegments === 2) {
            stackedSegment = true;
          }
        }

        return (
          <div
            className={`${
              headerData.enabled ? "bg-transparent" : "bg-slate-500/20"
            } h-12 border border-Background_Lighter/50 p-1`}
            style={{
              display: "flex",
              gap: stackedSegment ? "2px" : "",
            }}
            key={key}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) =>
              handleDrop(
                e,
                time,
                headerData.date,
                headerData.dateUnix,
                headerData.enabled
              )
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
                      handleDeleteSchedule={handleDeleteSchedule}
                      stackedSegment={stackedSegment}
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
