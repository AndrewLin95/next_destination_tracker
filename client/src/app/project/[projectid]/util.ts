import { LocationData, ProjectData } from "@/util/models";
import { Dispatch, SetStateAction } from 'react';
import { format, getUnixTime, isSaturday, isSunday, nextSaturday, previousSunday } from "date-fns";

export const handleValidatePagination = (type: string, locationData: LocationData[], numberOfPages: number, setNumberOfPages: Dispatch<SetStateAction<number>> ) => {
  let newNumberOfPages;
  if (type === "+") {
    newNumberOfPages = Math.ceil(locationData.length / 10);
  } else {
    newNumberOfPages = Math.ceil(locationData.length / 10);
  }

  if (newNumberOfPages !== numberOfPages) {
    setNumberOfPages(newNumberOfPages);
  }
};

export const handleScheduleInit = (projectData: ProjectData) => {
  const startUnixTime = projectData.project.projectStartDate;
  const endUnixTime = projectData.project.projectEndDate;
  const startDate = format(new Date(startUnixTime), "PPP");
  const endDate = format(new Date(endUnixTime), "PPP");

  const projectConfigData = {
    start: startDate,
    startUnix: startUnixTime,
    end: endDate,
    endUnix: endUnixTime,
  };

  let scheduleStartUnixTime; 
  let scheduleEndUnixTime;
  if (isSunday(startUnixTime)) {
    scheduleStartUnixTime = startUnixTime;
  } else {
    scheduleStartUnixTime = getUnixTime(previousSunday(startUnixTime));
  }

  if (isSaturday(endUnixTime)) {
    scheduleEndUnixTime = endUnixTime
  } else {
    scheduleEndUnixTime = getUnixTime(nextSaturday(endUnixTime));
  }

  const scheduleStartDate = format(new Date(scheduleStartUnixTime), "PPP");
  const scheduleEndDate = format(new Date(scheduleEndUnixTime), "PPP");

  const scheduleConfigData = {
    start: scheduleStartDate,
    startUnix: scheduleStartUnixTime,
    end: scheduleEndDate,
    endUnix: scheduleEndUnixTime
  }

  return {
    project: projectConfigData,
    schedule: scheduleConfigData,
  }
}