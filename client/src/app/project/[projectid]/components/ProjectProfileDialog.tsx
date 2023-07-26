import { ProjectData } from "@/util/models/ProjectModels";
import { FC, Dispatch, SetStateAction, useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { formatInTimeZone } from "date-fns-tz";

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
  const [projectImage, setProjectImage] = useState(
    projectData.project.projectImage
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
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[22rem] bg-Background flex flex-col p-4">
        <div className="text-xl font-bold pb-1 underline text-Accent">
          Edit Project Settings
        </div>
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
          {/* <ImageUploading
            value={uploadedImage}
            onChange={handleImageUploadChange}
            maxNumber={MAX_NUM_OF_IMAGES}
          >
            {({ imageList, onImageUpload, onImageRemoveAll }) => (
              <div className="upload__image-wrapper">
                {imageList[0] ? (
                  <button
                    type="button"
                    className="mb-2"
                    onClick={onImageRemoveAll}
                  >
                    Remove Banner
                  </button>
                ) : (
                  <button
                    type="button"
                    className="mb-2"
                    onClick={onImageUpload}
                  >
                    Upload Banner
                  </button>
                )}
                &nbsp;
                {imageList[0] ? (
                  imageList.map((image, index) => (
                    <div key={index} className="image-item">
                      <img
                        className="h-24 w-full object-cover"
                        src={image.dataURL}
                        alt="uploaded image"
                        width="100"
                      />
                      <div className="image-item__btn-wrapper"></div>
                    </div>
                  ))
                ) : (
                  <div className="h-24 w-full" />
                )}
              </div>
            )}
          </ImageUploading> */}
          <button type="submit">test</button>
        </form>
      </div>
    </>
  );
};

export default ProjectProfileDialog;
