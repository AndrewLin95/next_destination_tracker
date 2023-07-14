import { DELETE_RESPONSE } from "./constants";
import { EachScheduleData, ScheduleDataMongoResponse, ScheduleKeys } from "./types";
import { format } from "date-fns";
const ScheduleDataSchema = require('../models/scheduleDataSchema')

// Clear data is NOT required if there are 2 data to schedule AND there is a conflict.
// in this scenario, we only need to add the new data in the non conflicting position
export const handleScheduleSequenceAdd = (newScheduleData: EachScheduleData, conflictingData: EachScheduleData[], originalScheduleData: ScheduleDataMongoResponse) => {
  const allScheduleDatas: EachScheduleData[] = [newScheduleData];
  let sequencedData;

  conflictingData.forEach(eachScheduleData => {
    allScheduleDatas.push(eachScheduleData);
  });

  if (allScheduleDatas.length === 1) {
    allScheduleDatas[0].position = 0;
    allScheduleDatas[0].numColumns = 1;
    sequencedData = allScheduleDatas;
    return { sequencedData: sequencedData, clear: true };
  }

  // Identify additional conflicts originating from the conflictingData.
  // If conflict, conflict position needs to remain. new = opposite of conflict
  // If no conflict, sort then reassign position
  if (allScheduleDatas.length === 2) {
    const startTimeInMins = (parseInt((conflictingData[0].timeFrom as string).split(':')[0]) * 60) + parseInt((conflictingData[0].timeFrom as string).split(':')[1])
    const duration = conflictingData[0].duration as number
    const targetLocationID = conflictingData[0].locationID;
    const targetKey = originalScheduleData.scheduleKeys.get(targetLocationID) ?? null;

    if (targetKey !== null) {
      const tempDate = targetKey.key.split(" ")
      tempDate.pop()
      const date = tempDate.join(" ");
  
      const conflicts = identifyNumOfConflicts(targetLocationID, startTimeInMins, date, originalScheduleData.scheduleData, duration)
  
      if (conflicts.size === 0) {
        const sortedScheduleData = sortScheduleData(allScheduleDatas);

        sortedScheduleData[0].position = 0;
        sortedScheduleData[0].numColumns = 2;
        sortedScheduleData[1].position = 1;
        sortedScheduleData[1].numColumns = 2;
        sequencedData = sortedScheduleData;
        return { sequencedData: sequencedData, clear: true };
      } else {
        const conflictingDataPosition = conflictingData[0].position;

        newScheduleData.numColumns = 2;
        if (conflictingDataPosition === 0) {
          newScheduleData.position = 1;
        } else {
          newScheduleData.position = 0;
        }
        return { sequencedData: [newScheduleData], clear: false };
      }
    }
  }

  if (allScheduleDatas.length === 3) {
    allScheduleDatas.shift();
    // array only contains the conflicts
    const sortedScheduleData = sortScheduleData(allScheduleDatas);

    const firstEndSplit = (sortedScheduleData[0].timeTo as string).split(":");
    const lastStartSplit = (sortedScheduleData[1].timeFrom as string).split(":");
    const firstInMins = (parseInt(firstEndSplit[0]) * 60) + parseInt(firstEndSplit[1]);
    const lastInMins = (parseInt(lastStartSplit[0]) * 60) + parseInt(lastStartSplit[1]);

    if (firstInMins <= lastInMins && sortedScheduleData[1].position === 0) {
      newScheduleData.position = 1;
      newScheduleData.numColumns = 2;
      sortedScheduleData[0].numColumns = 2;
      sortedScheduleData[1].numColumns = 2;
      
      sequencedData = [sortedScheduleData[0], newScheduleData, sortedScheduleData[1]]
      return { sequencedData: sequencedData, clear: true }
    } else {
      return { sequencedData: undefined, clear: true }
    }
  }

  return { sequencedData: undefined, clear: false }
}

// for re-scheduling data after a scheduled location needs to be deleted
export const handleScheduleSequenceDelete = async (conflictingData : EachScheduleData[], targetData: EachScheduleData, originalScheduleData: ScheduleDataMongoResponse) => {
  let sequencedData: EachScheduleData[] = [];
  let filteredScheduleData: ScheduleDataMongoResponse = originalScheduleData;

  const startTimeInMins = (parseInt((conflictingData[0].timeFrom as string).split(':')[0]) * 60) + parseInt((conflictingData[0].timeFrom as string).split(':')[1])
  const duration = conflictingData[0].duration as number
  const targetLocationID = conflictingData[0].locationID;
  const targetKey = originalScheduleData.scheduleKeys.get(targetLocationID) ?? null;

  if (conflictingData.length === 1) {
    if (targetKey !== null) {
      const tempDate = targetKey.key.split(" ")
      tempDate.pop()
      const date = tempDate.join(" ");
      
      const conflicts = identifyNumOfConflicts(targetLocationID, startTimeInMins, date, originalScheduleData.scheduleData, duration)

      // since we are using the original scheduled data, conflicts 1 means that it only conflicts with the one that we removed
      if (conflicts.size === 1) {
        conflictingData[0].position = 0;
        conflictingData[0].numColumns = 1;
        sequencedData = conflictingData;
      } else {
        let targetID;
        conflicts.forEach(eachLocationID => {
          if (eachLocationID !== conflictingData[0].locationID && eachLocationID !== targetData.locationID) {
            targetID = eachLocationID;
          }
        });
        // get the data for the new one
        if (targetID !== undefined) {
          const otherConflictingDataSegment = findDataSegments(targetID, originalScheduleData.scheduleData, originalScheduleData.scheduleKeys)
          if (otherConflictingDataSegment !== null) {
            conflictingData.push(otherConflictingDataSegment);
            const sortedScheduleData = sortScheduleData(conflictingData);

            filteredScheduleData = await clearScheduleData([...sortedScheduleData, targetData], date, originalScheduleData.projectID);

            sortedScheduleData[0].position = 0;
            sortedScheduleData[0].numColumns = 2;
            sortedScheduleData[1].position = 1;
            sortedScheduleData[1].numColumns = 2;
            sequencedData = sortedScheduleData
          }
        }
      } 
    }
  } else if (conflictingData.length === 2) {
    if (conflictingData.length === 2) {
      if (targetKey !== null) {
        const tempDate = targetKey.key.split(" ")
        tempDate.pop()
        const date = tempDate.join(" ");
  
        filteredScheduleData = await clearScheduleData([...conflictingData, targetData], date, originalScheduleData.projectID);
        const sortedScheduleData = sortScheduleData(conflictingData);

        sortedScheduleData[0].position = 0;
        sortedScheduleData[0].numColumns = 1;
        sortedScheduleData[1].position = 0;
        sortedScheduleData[1].numColumns = 1;
        sequencedData = sortedScheduleData
      }
    }
  }

  return { sequencedData: sequencedData, filteredScheduleData: filteredScheduleData }
}

export const sortScheduleData = (unsortedScheduleData: EachScheduleData[]) => {
  return unsortedScheduleData.sort((a, b) => {
    const aSplit = (a.timeFrom as string).split(":")
    const bSplit = (b.timeFrom as string).split(":")
    const aTimeInMins = (parseInt(aSplit[0]) * 60) + parseInt(aSplit[1]);
    const bTimeInMins = (parseInt(bSplit[0]) * 60) + parseInt(bSplit[1]);

    if (aTimeInMins > bTimeInMins) {
      return 1; 
    } else if (aTimeInMins < bTimeInMins) {
      return -1; 
    } else {
      return 0; 
    }
  })
}

export const findDataSegments = (targetLocationID: string, scheduleData: Map<string, EachScheduleData[]>, scheduleKeys: Map<string, ScheduleKeys>) => {
  const targetKey = scheduleKeys.get(targetLocationID) ?? null;

  if (targetKey === null) {
    return null
  } else {
    const targetData = scheduleData.get(targetKey.key) ?? null
    if (targetData === null) {
      return null
    } else {
      let targetScheduleData: EachScheduleData = {} as EachScheduleData;
      targetData.forEach(eachScheduleData => {
        if (eachScheduleData.locationID === targetLocationID){
          targetScheduleData = eachScheduleData;
        }
      });
      return targetScheduleData;
    }
  }
}

export const identifyNumOfConflicts = (targetLocationID: string, startTimeInMins: number, date: string, scheduleData: Map<string, EachScheduleData[]>, duration: number) => {
  let i = 0;
  const conflictingLocationIDs: Set<string> = new Set();
  let currTime = startTimeInMins;
  while (i < (duration / 30)) {
    const currFormattedTime = `${Math.floor(currTime / 60)}:${(currTime % 60 === 0 ? "00" : currTime % 60)}`
    const key = `${date} ${currFormattedTime}`;
    const hasKey = scheduleData.has(key);
    if (hasKey) {
      const originalData = scheduleData.get(key) as EachScheduleData[];
      originalData.forEach(scheduleData => {
        if (!conflictingLocationIDs.has(scheduleData.locationID) && scheduleData.locationID !== targetLocationID) {
          conflictingLocationIDs.add(scheduleData.locationID);
        }
      });
    }
    currTime = currTime + 30;
    i++
  }
  return conflictingLocationIDs 
}

export const retrieveDataSegmentFromKey = (targetKey: ScheduleKeys, scheduleData: Map<string, EachScheduleData[]>, targetLocationID: string) => {
  const targetSegment = scheduleData.get(targetKey.key) as EachScheduleData[];
  let targetData: EachScheduleData = targetSegment[0];
  targetSegment.forEach(eachScheduleData => {
    if (eachScheduleData.locationID === targetLocationID) {
      targetData = eachScheduleData;
    }
  });

  return targetData;
}

// delete all existing scheduleData in the current time slot. 
export const handleDeleteSchedule = async (originalScheduleData: ScheduleDataMongoResponse, locationIDToDelete: string, scheduleDateUnix: number) => {
  // need to unset scheduleKeys
  if (originalScheduleData.scheduleKeys.has(locationIDToDelete)) {
    const targetKey = originalScheduleData.scheduleKeys.get(locationIDToDelete) as ScheduleKeys;
    if (originalScheduleData.scheduleData.has(targetKey.key)){
      const targetData: EachScheduleData = retrieveDataSegmentFromKey(targetKey, originalScheduleData.scheduleData, locationIDToDelete)

      let currTimeInMinutes = (parseInt((targetData.timeFrom as string).split(':')[0]) * 60) + parseInt((targetData.timeFrom as string).split(':')[1])
      
      const date = format(new Date(scheduleDateUnix), "PPP");
      // need to delete, and update position + num columns
      const conflictingLocationIDs = identifyNumOfConflicts(locationIDToDelete, currTimeInMinutes, date, originalScheduleData.scheduleData, targetData.duration as number)

      const conflictingData: EachScheduleData[] = [];
      conflictingLocationIDs.forEach(eachLocationID => {
        const dataSegment = findDataSegments(eachLocationID, originalScheduleData.scheduleData, originalScheduleData.scheduleKeys)
        if (dataSegment !== null) {
          conflictingData.push(dataSegment);
        }
      });

      // if there is no conflicts, just return the filteredScheduleData
      if (conflictingLocationIDs.size === 0) {
        const filteredScheduleData: ScheduleDataMongoResponse = await clearScheduleData([targetData], date, originalScheduleData.projectID);

        return {
          status: DELETE_RESPONSE.Success,
          finalScheduleData: filteredScheduleData,
          targetData: targetData,
        }
      } else {
        // get the datas and return after modifying their numColumns and position /LOOK AT THIS
        const { sequencedData, filteredScheduleData } = await handleScheduleSequenceDelete(conflictingData, targetData, originalScheduleData);
        if (sequencedData.length !== 0) {
          const returnScheduleData = await generateFinalScheduleData(sequencedData, filteredScheduleData, date);
          return { 
            status: DELETE_RESPONSE.Success,
            finalScheduleData: returnScheduleData,
            targetData: targetData,
          };
        }
      }
    }
  } 

  return {
    status: DELETE_RESPONSE.NotPerformed,
  }
}

export const clearFromAndTo = (allScheduleDatas: EachScheduleData[]) => {
  const fromArray: number[] = [];
  const toArray: number[] = [];

  allScheduleDatas.forEach(eachScheduleData => {
    const fromSplit = (eachScheduleData.timeFrom as string).split(":");
    const toSplit = (eachScheduleData.timeTo as string).split(":");
    const fromInMins = (parseInt(fromSplit[0]) * 60) + parseInt(fromSplit[1]);
    const toInMins = (parseInt(toSplit[0]) * 60) + parseInt(toSplit[1]);

    fromArray.push(fromInMins);
    toArray.push(toInMins);
  });

  const fromInMins = Math.min(...fromArray);
  const toInMins = Math.max(...toArray);

  return { fromInMins, toInMins }
}

export const clearScheduleData = async (scheduleData: EachScheduleData[], formattedDate: string, projectID: string) => {
  const { fromInMins, toInMins } = clearFromAndTo(scheduleData);
  let clearFrom = fromInMins;
  const clearTo = toInMins

  const keysToUnset = [];

  while (clearFrom < clearTo) {
    const currFormattedTime = `${Math.floor(clearFrom / 60)}:${((clearFrom % 60 === 0) ? "00" : clearFrom % 60)}`
    const key = `${formattedDate} ${currFormattedTime}`;

    keysToUnset.push(key);
    clearFrom = clearFrom + 30;
  }
  const filter = {'projectID': projectID}
  const unsetObj = keysToUnset.reduce((acc, key) => ({ ...acc, [`scheduleData.${key}`]: '' }), {});
  let filteredScheduleData: ScheduleDataMongoResponse 
  filteredScheduleData = await ScheduleDataSchema.findOneAndUpdate(filter, {$unset: unsetObj}, {returnOriginal: false});
  return filteredScheduleData;
}

export const generateFinalScheduleData = async (sequencedData:EachScheduleData[], scheduleDataToAddTo: ScheduleDataMongoResponse, formattedDate: string) => {
  sequencedData.forEach(eachScheduleData => {
    let alreadySetData = false;
    let currTimeInMinutes = (parseInt((eachScheduleData.timeFrom as String).split(':')[0]) * 60) + parseInt((eachScheduleData.timeFrom as String).split(':')[1]);
    const startTime = JSON.parse(JSON.stringify(currTimeInMinutes));

    const nonDataScheduleSegment = {
      scheduleID: eachScheduleData.scheduleID,
      locationID: eachScheduleData.locationID,
      dataSegment: false,
      position: eachScheduleData.position,
    }
    
    while (currTimeInMinutes < (startTime + (eachScheduleData.duration as number))) {
      const currFormattedTime = `${Math.floor(currTimeInMinutes / 60)}:${(currTimeInMinutes % 60 === 0 ? "00" : currTimeInMinutes % 60)}`
      const key = `${formattedDate} ${currFormattedTime}`;

      const hasKey = scheduleDataToAddTo.scheduleData.has(key);

      if (hasKey) {
        const originalData = scheduleDataToAddTo.scheduleData.get(key) as EachScheduleData[];
        if (alreadySetData) {
          scheduleDataToAddTo.scheduleData.set(key, [...originalData, nonDataScheduleSegment])
        } else {
          scheduleDataToAddTo.scheduleData.set(key, [...originalData, eachScheduleData]);
          alreadySetData = true;
        }
      } else {
        if (alreadySetData) {
          scheduleDataToAddTo.scheduleData.set(key, [nonDataScheduleSegment])
        } else {
          scheduleDataToAddTo.scheduleData.set(key, [eachScheduleData]);
          alreadySetData = true;
        }
      }
      currTimeInMinutes = currTimeInMinutes + 30;
    }
  });
  const finalScheduleData = scheduleDataToAddTo;

  return finalScheduleData;
}