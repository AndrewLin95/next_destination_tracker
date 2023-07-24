import { LocationData } from '@/util/models/ProjectModels';
import { Dispatch, SetStateAction } from 'react';

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

export const getTimeInMinutes = (timeString: string) => {
  const timeSplit = timeString.split(":");
  const hours = parseInt(timeSplit[0]);
  const minutes = parseInt(timeSplit[1]);
  
  const timeInMinutes = (hours * 60) + minutes
  return timeInMinutes;
}