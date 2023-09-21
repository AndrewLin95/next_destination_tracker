export const getTimeInMinutes = (timeString: string) => {
  const timeSplit = timeString.split(":");
  const hours = parseInt(timeSplit[0]);
  const minutes = parseInt(timeSplit[1]);
  
  const timeInMinutes = (hours * 60) + minutes
  return timeInMinutes;
}