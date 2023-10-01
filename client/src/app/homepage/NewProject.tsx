/* eslint-disable @next/next/no-img-element */
import { FC } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import {
  FORM_SUBMIT_BUTTON,
  MAX_NUM_OF_IMAGES,
  REMOVE_IMG_BTN_STYLE,
  UPLOAD_IMG_BTN_STYLE,
} from "@/util/constants";

interface Props {
  submitNewProject: (e: React.FormEvent<HTMLFormElement>) => void;
  uploadedImage: ImageListType;
  handleImageUploadChange: (imageList: ImageListType) => void;
}

const NewProject: FC<Props> = ({
  submitNewProject,
  uploadedImage,
  handleImageUploadChange,
}) => {
  return (
    <div className="flex h-[420px] w-full justify-center items-center mt-8">
      <div className="flex flex-col border border-dashed w-80 h-[420px] p-6 bg-primary3 border-dark_accent2 dark:bg-dark_primary3 dark:border-accent2">
        <form onSubmit={submitNewProject}>
          <input
            className="w-full mb-2 px-2 border rounded bg-accent1_lighter border-dark_accent1 dark:bg-dark_accent1_lighter/60 dark:border-accent1"
            placeholder="Target Destination"
            name="destination"
            required
          />
          <input
            className="w-full mb-2 px-2 border rounded bg-accent1_lighter border-dark_accent1 dark:bg-dark_accent1_lighter/60 dark:border-accent1"
            placeholder="Project Name"
            name="projectName"
            required
          />
          <input
            className="w-full mb-2 px-2 border rounded bg-accent1_lighter border-dark_accent1 dark:bg-dark_accent1_lighter/60 dark:border-accent1"
            placeholder="Project Description"
            name="projectDescription"
            required
          />
          <div className="flex flex-row mb-2 ">
            <div className="w-64">Start Date:</div>
            <input
              className="w-full px-2 border rounded bg-accent1_lighter border-dark_accent1 dark:bg-dark_accent1_lighter/60 dark:border-accent1"
              type="date"
              name="startDate"
            />
          </div>
          <div className="flex flex-row mb-2">
            <div className="w-64">End Date:</div>
            <input
              className="w-full px-2 border rounded bg-accent1_lighter border-dark_accent1 dark:bg-dark_accent1_lighter/60 dark:border-accent1"
              type="date"
              name="endDate"
            />
          </div>
          <ImageUploading
            value={uploadedImage}
            onChange={handleImageUploadChange}
            maxNumber={MAX_NUM_OF_IMAGES}
          >
            {({ imageList, onImageUpload, onImageRemoveAll }) => (
              <div className="upload__image-wrapper">
                {imageList[0] ? (
                  <button
                    type="button"
                    className={`${REMOVE_IMG_BTN_STYLE} mb-2 `}
                    onClick={onImageRemoveAll}
                  >
                    Remove Banner
                  </button>
                ) : (
                  <button
                    type="button"
                    className={`${UPLOAD_IMG_BTN_STYLE}`}
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
          </ImageUploading>
          <div className="flex justify-end w-full">
            <button
              className={`${FORM_SUBMIT_BUTTON} mt-3 w-60 h-12`}
              type="submit"
            >
              Track new project!
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProject;
