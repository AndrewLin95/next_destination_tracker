import Image from "next/image";
import { FC } from "react";

interface Props {
  submitNewProject: (e: React.FormEvent<HTMLFormElement>) => void;
}

const NewProject: FC<Props> = ({ submitNewProject }) => {
  return (
    <div className="flex h-[420px] w-full justify-center items-center mt-8">
      <div className="flex flex-col border border-dashed w-4/12 h-[420px] p-6">
        <form onSubmit={submitNewProject}>
          <input
            className="w-full mb-2 px-2"
            placeholder="Target Destination"
            name="destination"
          />
          <input
            className="w-full mb-2 px-2"
            placeholder="Project Name"
            name="projectName"
          />
          <input
            className="w-full mb-2 px-2"
            placeholder="Project Description"
            name="projectDescription"
          />
          <div className="flex flex-row mb-2">
            <div className="w-64">Planned Start Date:</div>
            <input className="w-full px-2" type="date" name="startDate" />
          </div>
          <div className="flex flex-row mb-2">
            <div className="w-64">Planned End Date:</div>
            <input className="w-full px-2" type="date" name="endDate" />
          </div>
          <Image
            alt="vacation image"
            src="/seasideVacation.jpg"
            className="h-auto w-full max-h-40 object-cover"
            width={288}
            height={288}
          />
          <div className="flex justify-end w-full">
            <button className="bg-PrimaryButton mt-3 w-60" type="submit">
              Track new project!
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProject;
