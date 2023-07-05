import { LocationData, ProjectData, ScheduleDateData, ScheduleCalendarData } from "@/util/models";
import { Dispatch, SetStateAction } from 'react';
import { format, getUnixTime, isSaturday, isSunday, nextSaturday, previousSunday } from "date-fns";
import { MS_IN_DAY } from "@/util/constants";

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

  // Schedule Calender Data (used to generate the calender)
  let scheduleStartUnixTime; 
  let scheduleEndUnixTime;
  if (isSunday(startUnixTime)) {
    scheduleStartUnixTime = startUnixTime;
  } else {
    scheduleStartUnixTime = (getUnixTime(previousSunday(startUnixTime)) * 1000);
  }

  if (isSaturday(endUnixTime)) {
    scheduleEndUnixTime = endUnixTime
  } else {
    scheduleEndUnixTime = (getUnixTime(nextSaturday(endUnixTime)) * 1000);
  }

  // for calendarData, convert to a hashmap. Move to each component
  const tempCalendarData = [];

  let i = scheduleStartUnixTime;
  while (i <= scheduleEndUnixTime + MS_IN_DAY) {
    let enabledStatus;
    if (i >= startUnixTime && i <= (endUnixTime + MS_IN_DAY)) {
      enabledStatus = true;
    } else {
      enabledStatus = false;
    }

    const calendarData = {
      enabled: enabledStatus,
      date: format(new Date(i), "PPP"),
      startUnix: i,
      endUnix: i + MS_IN_DAY - 1,
      dayOfWeek: format( new Date(i), "EEEE"),
    }

    tempCalendarData.push(calendarData);
    i = i + MS_IN_DAY;
  }

  const scheduleConfigData: ScheduleCalendarData = {
    calendar: tempCalendarData,
    config: {
      startingTime: projectData.scheduleConfig.startingTime,
      endingTime: projectData.scheduleConfig.endingTime,
      segments: projectData.scheduleConfig.segments,
    },
    projectID: projectData.projectID
  }

  return scheduleConfigData
  
}