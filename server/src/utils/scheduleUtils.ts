import { EachScheduleData } from "./types";

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

export const handleScheduleSequence = (conflictingScheduleIDs: Set<string>, newScheduleData: EachScheduleData, date: string, scheduleData: Map<string, EachScheduleData[]>, currTimeInMinutes: number) => {
  const allScheduleKeyMap: Map<string, string> = new Map();
  const allScheduleDatas: EachScheduleData[] = [newScheduleData];

  const recursivelyFindDataSegments = (currTimeInMinutes: number, depth: number, direction: string) => {
    if (allScheduleKeyMap.size === conflictingScheduleIDs.size || depth > (newScheduleData.duration as number/30)) {
      return;
    }

    const currFormattedTime = `${Math.floor(currTimeInMinutes / 60)}:${(currTimeInMinutes % 60 === 0 ? "00" : currTimeInMinutes % 60)}`
    const key = `${date} ${currFormattedTime}`;
    const hasKey = scheduleData.has(key);
    if (hasKey) {
      const currTimeScheduleData = scheduleData.get(key) as EachScheduleData[];
      currTimeScheduleData.forEach(data => {
        if (data.noteName !== undefined && conflictingScheduleIDs.has(data.scheduleID)) {
          allScheduleKeyMap.set(data.locationID, key);
          allScheduleDatas.push(data);
        }
      });
    } 
    const newDepth = depth + 1;
    if (direction === "increase") {
      recursivelyFindDataSegments(currTimeInMinutes + 30, newDepth, 'increase');
    } else {
      recursivelyFindDataSegments(currTimeInMinutes - 30, newDepth, 'decrease');
    }
  }
  
  recursivelyFindDataSegments(currTimeInMinutes, 0, 'increase');
  recursivelyFindDataSegments(currTimeInMinutes, 0, 'decrease');

  // for a max of 2 scheduled conflicts, if the data is already in the second position, 
  // it means that we can just slot the new one in the 1st position
  if (allScheduleDatas[1].position === 1) {
    allScheduleDatas[0].numColumns = 2;
    return { allScheduleDatas: allScheduleDatas, skipClear: true };
  }

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
  
  let i = 0;
  while (i < allScheduleDatas.length) {
    allScheduleDatas[i].position = i;
    allScheduleDatas[i].numColumns = 2;
    i++;
  }

  return { allScheduleDatas: allScheduleDatas, skipClear: false}

  // 3 columns below: needs to be improved if decide to include
  //   let numColumns = 3;

  //   const firstEndSplit = (allScheduleDatas[0].timeTo as string).split(":");
  //   const lastStartSplit = (allScheduleDatas[2].timeFrom as string).split(":");
  //   const firstInMins = (parseInt(firstEndSplit[0]) * 60) + parseInt(firstEndSplit[1]);
  //   const lastInMins = (parseInt(lastStartSplit[0]) * 60) + parseInt(lastStartSplit[1]);

  //   // identify if we need 3 columns, or just 2 based on the overlap between 1st and last scheduled item
  //   if (firstInMins > lastInMins) {
  //     numColumns = 3;
  //   } else {
  //     numColumns = 2;
  //   }

  //   if (numColumns === 2) {
  //     let i = 0;
  //     while (i < allScheduleDatas.length) {
  //       if (i === 2) {
  //         allScheduleDatas[i].position = 0;
  //         allScheduleDatas[i].numColumns = numColumns;
  //       } else {
  //         allScheduleDatas[i].position = i;
  //         allScheduleDatas[i].numColumns = numColumns;
  //       }
  //       i++;
  //     }
  //     return allScheduleDatas
  //   } else {
  //     let i = 0;
  //     while (i < allScheduleDatas.length) {
  //       allScheduleDatas[i].position = i;
  //       allScheduleDatas[i].numColumns = numColumns;
  //       i++;
  //     }
  //     return allScheduleDatas
  //   }
}

export const identifyNumOfConflicts = (startTimeInMins: number, date: string, scheduleData: Map<string, EachScheduleData[]>, duration: number) => {
  let i = 0;
  let maxNumInSchedule = 0;
  const conflictingScheduleIDs: Set<string> = new Set();;
  let currTime = startTimeInMins;
  while (i < (duration / 30)) {
    const currFormattedTime = `${Math.floor(currTime / 60)}:${(currTime % 60 === 0 ? "00" : currTime % 60)}`
    const key = `${date} ${currFormattedTime}`;
    const hasKey = scheduleData.has(key);
    if (hasKey) {
      const originalData = scheduleData.get(key) as EachScheduleData[];
      originalData.forEach(scheduleData => {
        if (!conflictingScheduleIDs.has(scheduleData.scheduleID)) {
          conflictingScheduleIDs.add(scheduleData.scheduleID)
        }
      });
      if (originalData.length > maxNumInSchedule) {
        maxNumInSchedule = originalData.length
      }
    }
    currTime = currTime + 30;
    i++;
  }
  return conflictingScheduleIDs
}