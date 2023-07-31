import {
  ProjectData,
  StatusPayload,
  UpdateProjectResponse,
} from "@/util/models/ProjectModels";
import {
  FORM_SUBMIT_BUTTON,
  FORM_CANCEL_BUTTON,
  STATUS_CODES,
} from "@/util/constants";
import { FC, Dispatch, SetStateAction, useState } from "react";
import { formatInTimeZone } from "date-fns-tz";
import Image from "next/image";
import { AuthState } from "@/util/models/AuthModels";
import axios, { AxiosError, isAxiosError } from "axios";

interface Props {
  projectData: ProjectData;
  setProjectSettingsToggle: Dispatch<SetStateAction<Boolean>>;
  authState: AuthState | {};
  setProjectData: Dispatch<SetStateAction<ProjectData>>;
  setErrorDialogToggle: Dispatch<SetStateAction<Boolean>>;
  setErrorDialogData: Dispatch<SetStateAction<StatusPayload>>;
}

const ProjectProfileDialog: FC<Props> = ({
  projectData,
  setProjectSettingsToggle,
  authState,
  setProjectData,
  setErrorDialogToggle,
  setErrorDialogData,
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

    const projectID = projectData.projectID;
    const projectName = (e.target as HTMLFormElement).projectName.value;
    const projectDescription = (e.target as HTMLFormElement).projectDescription
      .value;
    // const dateStart = (e.target as HTMLFormElement).dateStart.value;
    // const dateEnd = (e.target as HTMLFormElement).dateEnd.value;

    const handleUpdate = async () => {
      const url = `/api/project/updateproject`;
      const authConfig = {
        headers: {
          Authorization: `Bearer ${(authState as AuthState).token}`,
        },
      };
      const body = {
        projectID: projectID,
        projectName: projectName,
        projectDescription: projectDescription,
        dateStart: projectData.project.projectStartDate,
        dateEnd: projectData.project.projectStartDate,
        projectImage: projectData.project.projectImage,
        projectCoords: projectData.project.projectCoords,
      };
      try {
        const response = await axios.put<UpdateProjectResponse>(
          url,
          body,
          authConfig
        );
        const responseData = response.data;
        setProjectData(responseData.projectData as ProjectData);
      } catch (err: AxiosError | unknown) {
        if (axios.isAxiosError(err)) {
          const responseBody: StatusPayload = err.response?.data.status;
          if (responseBody.statusCode === STATUS_CODES.BadRequest) {
            setProjectSettingsToggle(false);
            setErrorDialogData(responseBody);
            setErrorDialogToggle(true);
          }
        }
      }
    };

    handleUpdate();
  };

  return (
    <>
      <div
        className="absolute h-screen w-screen bg-slate-900/40"
        onClick={() => setProjectSettingsToggle(false)}
      />
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[18rem] bg-Background flex flex-col p-4">
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
          {/* <div className="flex flex-row w-full h-auto pb-1">
            <div className="mr-2 w-28 italic">Dates:</div>
            <input
              type="date"
              value={projectStartDate}
              name="dateStart"
              className="px-2 text-sm w-[calc(((100%-7rem)/2)-0.1275rem)] mr-1 bg-Background_Lighter"
              onChange={(e) => setProjectStartDate(e.target.value)}
            />
            <input
              type="date"
              value={projectEndDate}
              name="dateEnd"
              className="px-2 text-sm w-[calc(((100%-7rem)/2)-0.1275rem)] bg-Background_Lighter"
              onChange={(e) => setProjectEndDate(e.target.value)}
            />
          </div> */}
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
