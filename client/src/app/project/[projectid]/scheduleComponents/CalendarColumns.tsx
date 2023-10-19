import { FC, useEffect, useState } from "react";
import {
  EachScheduleData,
  ProjectData,
  ScheduleHeaderData,
} from "@/util/models/ProjectModels";
import EachScheduleItem from "./EachScheduleItem";
import { getTimeInMinutes } from "../util";
import { set } from "date-fns";
import { is } from "date-fns/locale";

interface Props {
  timeData: Map<string, string>;
  headerData: ScheduleHeaderData;
  handleDrop: (
    e: React.DragEvent<HTMLDivElement>,
    time: string,
    date: string,
    dateUnix: number,
    enabledOrDisabled: boolean,
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
  const [resizable, setResizable] = useState(20);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>, note: EachScheduleData) => {
    const dropData = {
      noteName: note.noteName,
      noteMessage: note.noteMessage,
      notePriority: note.notePriority,
      locationID: note.locationID,
      isScheduleEdit: true,
    };
  
    e.dataTransfer.setData("application/json", JSON.stringify(dropData));
  };
  
  const allowDrop = (e: any) => {
    if (
      e.target.className ===
      "bg-transparent h-12 border border-primary5 dark:border-dark_primary5 p-1"
    ) {
      e.preventDefault();
    } else {
      return false;
    }
  };

  const startTime = getTimeInMinutes(projectData.scheduleConfig.startingTime);
  const endTime = getTimeInMinutes(projectData.scheduleConfig.endingTime);

  return (
    <div className="w-[calc((100vw-25rem)/7)] h-full">
      {Object.entries(timeData).map(([key, time]) => {
        const currTimeInMinutes = getTimeInMinutes(time);
        if (currTimeInMinutes < startTime || currTimeInMinutes > endTime + 30) {
          return null;
        }

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
            } h-12 border border-primary5 dark:border-dark_primary5 p-1`}
            style={{
              display: "flex",
              gap: stackedSegment ? "2px" : "",
            }}
            key={key}
            onDragOver={(e) => allowDrop(e)}
            onDrop={(e) =>
              handleDrop(
                e,
                time,
                headerData.date,
                headerData.dateUnix,
                headerData.enabled,
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
                      handleDrag={handleDrag}
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
