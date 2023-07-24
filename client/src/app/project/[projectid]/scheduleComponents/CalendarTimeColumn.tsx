import { FC } from "react";
import { ProjectData } from "@/util/models/ProjectModels";
import { getTimeInMinutes } from "../util";

interface Props {
  projectData: ProjectData;
  timeValueData: Map<string, string>;
}

const CalendarTimeColumn: FC<Props> = ({ timeValueData, projectData }) => {
  const startTime = getTimeInMinutes(projectData.scheduleConfig.startingTime);
  const endTime = getTimeInMinutes(projectData.scheduleConfig.endingTime);

  return (
    <div className="w-16 h-full pr-1">
      {Object.entries(timeValueData).map(([key, value]) => {
        const currTimeInMinutes = getTimeInMinutes(value);
        if (currTimeInMinutes < startTime || currTimeInMinutes > endTime) {
          return null;
        }

        if (value.split(":")[1] === "30") {
          return null;
        }
        return (
          <div className="h-24 w-16 flex justify-center text-sm pt-1" key={key}>
            {value}
          </div>
        );
      })}
    </div>
  );
};

export default CalendarTimeColumn;
