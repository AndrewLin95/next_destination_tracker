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
        allScheduleDatas.sort((a, b) => {
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
        allScheduleDatas[0].position = 0;
        allScheduleDatas[0].numColumns = 2;
        allScheduleDatas[1].position = 1;
        allScheduleDatas[1].numColumns = 2;
        sequencedData = allScheduleDatas;
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
    allScheduleDatas.sort((a, b) => {
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

    const firstEndSplit = (allScheduleDatas[0].timeTo as string).split(":");
    const lastStartSplit = (allScheduleDatas[1].timeFrom as string).split(":");
    const firstInMins = (parseInt(firstEndSplit[0]) * 60) + parseInt(firstEndSplit[1]);
    const lastInMins = (parseInt(lastStartSplit[0]) * 60) + parseInt(lastStartSplit[1]);

    if (firstInMins <= lastInMins && allScheduleDatas[1].position === 0) {
      newScheduleData.position = 1;
      newScheduleData.numColumns = 2;
      allScheduleDatas[0].numColumns = 2;
      allScheduleDatas[1].numColumns = 2;
      
      sequencedData = [allScheduleDatas[0], newScheduleData, allScheduleDatas[1]]
      return { sequencedData: sequencedData, clear: true }
    } else {
      return { sequencedData: undefined, clear: true }
    }
  }

  return { sequencedData: undefined, clear: false }
}

// newScheduleData !== null means that it is adding new Data 
// maybe create two schedule sequence utils. One for deleteing and one for adding.
export const handleScheduleSequence = (newScheduleData: EachScheduleData | null, conflictingData : EachScheduleData[], filteredScheduleData: ScheduleDataMongoResponse, originalScheduleData: ScheduleDataMongoResponse) => {
  const allScheduleDatas: EachScheduleData[] = [];
  if (newScheduleData !== null) {
    allScheduleDatas.push(newScheduleData);
  }
 
  conflictingData.forEach(eachScheduleData => {
    allScheduleDatas.push(eachScheduleData);
  });

  let targetLocationID = allScheduleDatas[0].locationID;
  let targetKey = filteredScheduleData.scheduleKeys.get(targetLocationID) ?? null;
  const startTimeInMins = (parseInt((allScheduleDatas[0].timeFrom as string).split(':')[0]) * 60) + parseInt((allScheduleDatas[0].timeFrom as string).split(':')[1])
  const duration = allScheduleDatas[0].duration as number

  if (allScheduleDatas.length === 1) {
    // always check if there is something else in the way. If there is, do not change
    if (targetKey !== null) {
      const tempDate = targetKey.key.split(" ")
      tempDate.pop()
      const date = tempDate.join(" ");
     
      const conflicts = identifyNumOfConflicts(targetLocationID, startTimeInMins, date, originalScheduleData.scheduleData, duration)

      // 1 means that it conflicts with itself
      if (conflicts.size === 1) {
        allScheduleDatas[0].position = 0;
        allScheduleDatas[0].numColumns = 1;
    
        return { allScheduleDatas: allScheduleDatas, skipClear: true };
      }
      // 2 means there is another conflict
      if (conflicts.size === 2) {
        if (newScheduleData !== null) {
          const dataSegments: EachScheduleData[] = [];
          conflicts.forEach(eachLocationID => {
            const tempDataSegments = findDataSegments(eachLocationID, originalScheduleData.scheduleData, originalScheduleData.scheduleKeys) as EachScheduleData
            dataSegments.push(tempDataSegments);
          });
  
          const originalSegment = dataSegments.find((dataSegment) => dataSegment.locationID !== newScheduleData.locationID);

          const originalDataSegmentPosition = originalSegment?.position;

          if (originalDataSegmentPosition === 1) {
            allScheduleDatas[0].position = 0
            allScheduleDatas[0].numColumns = 2
          } else {
            allScheduleDatas[0].position = 1;
            allScheduleDatas[0].numColumns = 2
          };
          return { allScheduleDatas: allScheduleDatas, skipClear: true };
        } else {
          return { allScheduleDatas: allScheduleDatas, skipClear: true };
        }
      } 
    }

    allScheduleDatas[0].position = 0;
    allScheduleDatas[0].numColumns = 1;

    return { allScheduleDatas: allScheduleDatas, skipClear: true };
  };

  if (allScheduleDatas.length === 2) {
    allScheduleDatas.sort((a, b) => {
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

    const sortedASplit = (allScheduleDatas[0].timeTo as string).split(":");
    const sortedBSplit = (allScheduleDatas[1].timeFrom as string).split(":");
    const sortedATimeInMins = (parseInt(sortedASplit[0]) * 60) + parseInt(sortedASplit[1]);
    const sortedBTimeInMins = (parseInt(sortedBSplit[0]) * 60) + parseInt(sortedBSplit[1]);

    // if they do not overlap, reset them 
    if (sortedATimeInMins <= sortedBTimeInMins) {
      allScheduleDatas[0].position = 0;
      allScheduleDatas[0].numColumns = 1;
      allScheduleDatas[1].position = 0;
      allScheduleDatas[1].numColumns = 1;
      return { allScheduleDatas: allScheduleDatas, skipClear: true };
    } 

    // if they do overlap. check what position the original one is in.
    if (newScheduleData !== null){
      allScheduleDatas.forEach(eachScheduleData => {
        if (eachScheduleData.locationID !== newScheduleData.locationID) {
          targetLocationID = eachScheduleData.locationID;
        }
      });
      targetKey = filteredScheduleData.scheduleKeys.get(targetLocationID) ?? null;
    }

    if (targetKey !== null) {
      const tempDate = targetKey.key.split(" ")
      tempDate.pop()
      const date = tempDate.join(" ");

      // check if the conflict requires its position
      const conflicts = identifyNumOfConflicts(targetLocationID, startTimeInMins, date, originalScheduleData.scheduleData, duration)

      // conflicts with just itself. can reset if it is in pos - 1
      if (conflicts.size === 1) {
        allScheduleDatas[0].position = 0;
        allScheduleDatas[0].numColumns = 2;
        allScheduleDatas[1].position = 1;
        allScheduleDatas[1].numColumns = 2;
        return { allScheduleDatas: allScheduleDatas, skipClear: true };
      } 

      // conflict needs to stay in its position
      if (conflicts.size === 2) {
        if (newScheduleData !== null) {
          const dataSegments: EachScheduleData[] = [];
          conflicts.forEach(eachLocationID => {
            const tempDataSegments = findDataSegments(eachLocationID, originalScheduleData.scheduleData, originalScheduleData.scheduleKeys) as EachScheduleData
            dataSegments.push(tempDataSegments);
          });
  
          const originalSegment = dataSegments.find((dataSegment) => dataSegment.locationID !== newScheduleData.locationID);
  
          const originalDataSegmentPosition = originalSegment?.position;
  
          if (originalDataSegmentPosition === 1) {
            allScheduleDatas[0].position = 0
            allScheduleDatas[0].numColumns = 2
          } else {
            allScheduleDatas[0].position = 1;
            allScheduleDatas[0].numColumns = 2
          };
          return { allScheduleDatas: allScheduleDatas, skipClear: true };
        } 
      }
    }
  }

  // for 3 scheduling conflicts, check if they can be fit in two columns
  if (allScheduleDatas.length === 3 && newScheduleData !== null) {
    allScheduleDatas.shift();
    // array only contains the conflicts
    allScheduleDatas.sort((a, b) => {
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

    const firstEndSplit = (allScheduleDatas[0].timeTo as string).split(":");
    const lastStartSplit = (allScheduleDatas[1].timeFrom as string).split(":");
    const firstInMins = (parseInt(firstEndSplit[0]) * 60) + parseInt(firstEndSplit[1]);
    const lastInMins = (parseInt(lastStartSplit[0]) * 60) + parseInt(lastStartSplit[1]);

    if (firstInMins <= lastInMins && allScheduleDatas[1].position === 0) {
      newScheduleData.position = 1;
      newScheduleData.numColumns = 2;
      allScheduleDatas[0].numColumns = 2;
      allScheduleDatas[1].numColumns = 2;
      return { allScheduleDatas: [allScheduleDatas[0], newScheduleData, allScheduleDatas[1]], skipClear: false }
    } else {
      return { allScheduleDatas: undefined, skipClear: true};
    }
  } 

  return { allScheduleDatas: allScheduleDatas, skipClear: false}
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

export const handleDeleteSchedule = async (scheduleData: ScheduleDataMongoResponse, locationIDToDelete: string, scheduleDateUnix: number, projectID: string) => {
  // need to unset scheduleKeys
  if (scheduleData.scheduleKeys.has(locationIDToDelete)) {
    const targetKey = scheduleData.scheduleKeys.get(locationIDToDelete) as ScheduleKeys;
    if (scheduleData.scheduleData.has(targetKey.key)){
      const targetData: EachScheduleData = retrieveDataSegmentFromKey(targetKey, scheduleData.scheduleData, locationIDToDelete)

      let currTimeInMinutes = (parseInt((targetData.timeFrom as string).split(':')[0]) * 60) + parseInt((targetData.timeFrom as string).split(':')[1])
      
      const date = format(new Date(scheduleDateUnix), "PPP");
      // need to delete, and update position + num columns
      const conflictingLocationIDs = identifyNumOfConflicts(locationIDToDelete, currTimeInMinutes, date, scheduleData.scheduleData, targetData.duration as number)

      const conflictingData: EachScheduleData[] = [];
      conflictingLocationIDs.forEach(eachLocationID => {
        const dataSegment = findDataSegments(eachLocationID, scheduleData.scheduleData, scheduleData.scheduleKeys)
        if (dataSegment !== null) {
          conflictingData.push(dataSegment);
        }
      });

      const filteredScheduleData: ScheduleDataMongoResponse = await clearScheduleData([...conflictingData, targetData], date, scheduleData.projectID);

      if (conflictingLocationIDs.size === 0) {
        return {
          status: DELETE_RESPONSE.Success,
          scheduleData: filteredScheduleData,
          targetData: targetData,
        }
      } else {
        // get the datas and return after modifying their numColumns and position /LOOK AT THIS
        const sequencedData = await handleScheduleSequence(null, conflictingData, filteredScheduleData, scheduleData);
        if (sequencedData.allScheduleDatas !== undefined) {
          const returnScheduleData = await generateFinalScheduleData(sequencedData.allScheduleDatas, filteredScheduleData, date);
          return { 
            status: DELETE_RESPONSE.Success,
            scheduleData: returnScheduleData,
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