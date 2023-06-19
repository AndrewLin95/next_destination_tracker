/* eslint-disable @next/next/no-img-element */
import { FC } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { maxNumOfImages } from "@/util/constants";

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
      <div className="flex flex-col border border-dashed w-4/12 h-[420px] p-6">
        <form onSubmit={submitNewProject}>
          <input
            className="w-full mb-2 px-2"
            placeholder="Target Destination"
            name="destination"
            required
          />
          <input
            className="w-full mb-2 px-2"
            placeholder="Project Name"
            name="projectName"
            required
          />
          <input
            className="w-full mb-2 px-2"
            placeholder="Project Description"
            name="projectDescription"
            required
          />
          <div className="flex flex-row mb-2">
            <div className="w-64">Planned Start Date:</div>
            <input className="w-full px-2" type="date" name="startDate" />
          </div>
          <div className="flex flex-row mb-2">
            <div className="w-64">Planned End Date:</div>
            <input className="w-full px-2" type="date" name="endDate" />
          </div>
          <ImageUploading
            value={uploadedImage}
            onChange={handleImageUploadChange}
            maxNumber={maxNumOfImages}
          >
            {({ imageList, onImageUpload, onImageRemoveAll }) => (
              <div className="upload__image-wrapper">
                {imageList[0] ? (
                  <button onClick={onImageRemoveAll}>Remove image</button>
                ) : (
                  <button onClick={onImageUpload}>Upload Image</button>
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
