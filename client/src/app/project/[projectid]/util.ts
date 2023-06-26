import { LocationData } from "@/util/models";
import { Dispatch, SetStateAction } from 'react';

export const handleValidatePagination = (type: string, locationData: LocationData[], numberOfPages: number, setNumberOfPages: Dispatch<SetStateAction<number>> ) => {
  let newNumberOfPages;
  if (type === "+") {
    newNumberOfPages = Math.ceil((locationData.length + 1) / 10);
  } else {
    newNumberOfPages = Math.ceil((locationData.length - 1) / 10);
  }

  if (newNumberOfPages !== numberOfPages) {
    setNumberOfPages(newNumberOfPages);
  }
};