import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import DateColorPicker from "./DateColorPicker";
import { ProjectData } from "@/util/models/ProjectModels";
import { AuthState } from "@/util/models/AuthModels";
import { FORM_SUBMIT_BUTTON, FORM_CANCEL_BUTTON } from "@/util/constants";
import authConfigData from "@/util/authConfig";

interface Props {
  setScheduleSettingsToggle: Dispatch<SetStateAction<Boolean>>;
  projectData: ProjectData;
  authState: AuthState | {};
}

const ScheduleSettingsDialog: FC<Props> = ({
  setScheduleSettingsToggle,
  projectData,
  authState,
}) => {
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState<string>();
  const [endTime, setEndTime] = useState<string>();

  useEffect(() => {
    const startTime = projectData.scheduleConfig.startingTime.split(":");
    const endTime = projectData.scheduleConfig.endingTime.split(":");

    if (startTime[0].length === 1) {
      const formattedStartTime = `0${startTime[0]}:${startTime[1]}`;
      setStartTime(formattedStartTime);
    } else {
      setStartTime(projectData.scheduleConfig.startingTime);
    }

    if (endTime[0].length === 1) {
      const formattedEndTime = `0${endTime[0]}:${endTime[1]}`;
      setEndTime(formattedEndTime);
    } else {
      setEndTime(projectData.scheduleConfig.endingTime);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTimeChange = (time: string, type: string) => {
    const splitTime = time.split(":");
    const minutes = parseInt(splitTime[1]);

    let newMinutes;
    if (minutes < 30) {
      newMinutes = "00";
    } else if (minutes < 60) {
      newMinutes = "30";
    }

    const formattedTime = `${splitTime[0]}:${newMinutes}`;
    if (type === "start") {
      setStartTime(formattedTime);
    } else {
      setEndTime(formattedTime);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const eTarget = e.target as HTMLFormElement;

    const monColor = eTarget.MondayColor.value;
    const tueColor = eTarget.TuesdayColor.value;
    const wedColor = eTarget.WednesdayColor.value;
    const thurColor = eTarget.ThursdayColor.value;
    const friColor = eTarget.FridayColor.value;
    const satColor = eTarget.SaturdayColor.value;
    const sunColor = eTarget.SundayColor.value;

    const newProjectObject: ProjectData = {
      project: projectData.project,
      projectID: projectData.projectID,
      userID: projectData.userID,
      deleteFlag: projectData.deleteFlag,
      scheduleColors: {
        Monday: monColor,
        Tuesday: tueColor,
        Wednesday: wedColor,
        Thursday: thurColor,
        Friday: friColor,
        Saturday: satColor,
        Sunday: sunColor,
      },
      scheduleConfig: {
        startingTime: startTime as string,
        endingTime: endTime as string,
        minPerSegment: projectData.scheduleConfig.minPerSegment,
        segments: projectData.scheduleConfig.segments,
      },
    };

    console.log(newProjectObject);

    // TODO: route to api and error handling
    const handleEditData = async () => {
      const url = `/api/project/`;
      const authConfig = authConfigData((authState as AuthState).token);
    };
    handleEditData();

    console.log(e);
    console.log((e.target as HTMLFormElement).SundayColor.value);
  };

  if (loading) {
    return null;
  }

  return (
    <>
      <div
        className="absolute h-screen w-screen bg-slate-900/40"
        onClick={() => setScheduleSettingsToggle(false)}
      />
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[18rem] bg-Background flex flex-col p-4">
        <div className="text-xl font-bold pb-2 underline text-Accent">
          Edit Schedule Settings
        </div>
        <form onSubmit={handleSubmit}>
          <div className="underline pb-2">Schedule Colors</div>
          <div className="flex flex-row pb-3">
            <DateColorPicker
              dayOfWeek={"Monday"}
              color={projectData.scheduleColors.Monday}
            />
            <DateColorPicker
              dayOfWeek={"Tuesday"}
              color={projectData.scheduleColors.Tuesday}
            />
            <DateColorPicker
              dayOfWeek={"Wednesday"}
              color={projectData.scheduleColors.Wednesday}
            />
            <DateColorPicker
              dayOfWeek={"Thursday"}
              color={projectData.scheduleColors.Thursday}
            />
          </div>
          <div className="flex flex-row pb-3">
            <DateColorPicker
              dayOfWeek={"Friday"}
              color={projectData.scheduleColors.Friday}
            />
            <DateColorPicker
              dayOfWeek={"Saturday"}
              color={projectData.scheduleColors.Saturday}
            />
            <DateColorPicker
              dayOfWeek={"Sunday"}
              color={projectData.scheduleColors.Sunday}
            />
          </div>
          <div className="underline pb-2">Schedule Start and End Times</div>
          <div className="flex flex-row">
            <div className="pr-4 flex flex-row justify-center items-center">
              <div className="pr-2 text-sm">Start:</div>
              <input
                type="time"
                value={startTime}
                name="startTime"
                className="bg-Background_Lighter"
                onChange={(e) => handleTimeChange(e.target.value, "start")}
                step={1800}
              />
            </div>
            <div className="flex flex-row justify-center items-center">
              <div className="pr-2 text-sm">End:</div>
              <input
                type="time"
                value={endTime}
                name="endTime"
                className="bg-Background_Lighter"
                onChange={(e) => handleTimeChange(e.target.value, "end")}
                step={1800}
              />
            </div>
          </div>
          <div className="flex flex-row justify-end mt-2">
            <button
              type="submit"
              className={`${FORM_SUBMIT_BUTTON} h-10 w-32 mr-2`}
            >
              Submit
            </button>
            <button
              type="button"
              className={`${FORM_CANCEL_BUTTON} h-10 w-24 bg-SecondaryButton/80`}
              onClick={() => setScheduleSettingsToggle(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ScheduleSettingsDialog;
