import { ProjectData } from "@/util/models/ProjectModels";
import { FORM_SUBMIT_BUTTON, FORM_CANCEL_BUTTON } from "@/util/constants";
import { FC, Dispatch, SetStateAction, useState } from "react";
import { formatInTimeZone } from "date-fns-tz";
import Image from "next/image";

interface Props {
  projectData: ProjectData;
  setProjectSettingsToggle: Dispatch<SetStateAction<Boolean>>;
}

const ProjectProfileDialog: FC<Props> = ({
  projectData,
  setProjectSettingsToggle,
}) => {
  const [projectName, setProjectName] = useState(
    projectData.project.projectName
  );

  const [projectDescription, setProjectDescription] = useState(
    projectData.project.projectDescription
  );

  const [projectStartDate, setProjectStartDate] = useState(
    formatInTimeZone(projectData.project.projectStartDate, "gmt", "yyyy-MM-dd")
  );

  const [projectEndDate, setProjectEndDate] = useState(
    formatInTimeZone(projectData.project.projectEndDate, "gmt", "yyyy-MM-dd")
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <>
      <div
        className="absolute h-screen w-screen bg-slate-900/40"
        onClick={() => setProjectSettingsToggle(false)}
      />
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[20rem] bg-Background flex flex-col p-4">
        <div className="text-xl font-bold pb-2 underline text-Accent">
          Edit Project Settings
        </div>
        <Image
          src={projectData.project.projectImage}
          alt="project Image"
          className="w-full h-20 object-cover mb-4"
          width={256}
          height={256}
        />
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row w-full h-auto pb-1">
            <div className="mr-2 w-28 italic">Project Name</div>
            <input
              type="text"
              value={projectName}
              name="projectName"
              className="px-2 text-sm w-[calc(100%-7rem)] bg-Background_Lighter"
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className="flex flex-row w-full h-auto pb-1">
            <div className="mr-2 w-28 italic">Project Description</div>
            <input
              type="textarea"
              value={projectDescription}
              name="projectDescription"
              className="px-2 text-sm w-[calc(100%-7rem)] bg-Background_Lighter"
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </div>
          <div className="flex flex-row w-full h-auto pb-1">
            <div className="mr-2 w-28 italic">Dates:</div>
            <input
              type="date"
              value={projectStartDate}
              name="noteOpen"
              className="px-2 text-sm w-[calc(((100%-7rem)/2)-0.1275rem)] mr-1 bg-Background_Lighter"
              onChange={(e) => setProjectStartDate(e.target.value)}
            />
            <input
              type="date"
              value={projectEndDate}
              name="noteClose"
              className="px-2 text-sm w-[calc(((100%-7rem)/2)-0.1275rem)] bg-Background_Lighter"
              onChange={(e) => setProjectEndDate(e.target.value)}
            />
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
              onClick={() => setProjectSettingsToggle(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProjectProfileDialog;
