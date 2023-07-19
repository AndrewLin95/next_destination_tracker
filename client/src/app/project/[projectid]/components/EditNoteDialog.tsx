/* eslint-disable @next/next/no-img-element */
import {
  FORM_SUBMIT_BUTTON,
  FORM_CANCEL_BUTTON,
  MAX_NUM_OF_IMAGES,
  REMOVE_IMG_BTN_STYLE,
  UPLOAD_IMG_BTN_STYLE,
  NOTE_PRIORITY,
  PRIORITY_STYLE,
} from "@/util/constants";
import { NoteData } from "@/util/models/ProjectModels";
import {
  faPerson,
  faPersonWalking,
  faPersonRunning,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";

interface Props {
  noteData: NoteData;
  setNoteDialogToggle: Dispatch<SetStateAction<Boolean>>;
  handleUpdateNotes: (newNoteData: NoteData) => void;
}

// TODO: ADD uploaded image to the preview

const EditNoteDialog: FC<Props> = ({
  noteData,
  setNoteDialogToggle,
  handleUpdateNotes,
}) => {
  const [noteName, setNoteName] = useState<string>(noteData.noteName);
  const [noteAddress, setNoteAddress] = useState<string>(
    noteData.formattedAddress
  );
  const [noteOpen, setNoteOpen] = useState<string>(
    noteData.openHours === undefined ? "" : noteData.openHours
  );
  const [noteClose, setNoteClose] = useState<string>(
    noteData.closeHours === undefined ? "" : noteData.closeHours
  );
  const [noteMessage, setNoteMessage] = useState<string>(
    noteData.customNote === undefined ? "" : noteData.customNote
  );
  const [priority, setPriority] = useState<string>(noteData.priority);
  const [existingImage, setExistingImage] = useState<string | undefined>(
    noteData.picture
  );
  const [uploadedImage, setUploadedImage] = useState<any[]>([]);

  const handleImageUploadChange = (imageList: ImageListType) => {
    setUploadedImage(imageList as never[]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // validation for things that are REQUIRED
    e.preventDefault();

    const locationID: string = noteData.locationID;
    const noteName: string = (e.target as HTMLFormElement).noteName.value;
    const formattedAddress: string = (e.target as HTMLFormElement).noteAddress
      .value;
    const openHours: string = (e.target as HTMLFormElement).noteOpen.value;
    const closeHours: string = (e.target as HTMLFormElement).noteClose.value;
    const customNote: string = (e.target as HTMLFormElement).noteMessage.value;
    const updatedPriority: string = priority;

    let picture: string;
    if (existingImage === "" || existingImage === undefined) {
      picture =
        uploadedImage[0]?.dataURL === undefined
          ? ""
          : uploadedImage[0]?.dataURL;
    } else {
      picture = existingImage;
    }

    const newNoteData = {
      locationID: locationID,
      noteName: noteName,
      priority: updatedPriority,
      formattedAddress: formattedAddress,
      customNote: customNote,
      openHours: openHours,
      closeHours: closeHours,
      picture: picture,
    };

    handleUpdateNotes(newNoteData);
  };

  return (
    <>
      <div
        className="absolute h-screen w-screen bg-slate-900/40"
        onClick={() => setNoteDialogToggle(false)}
      />
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[22rem] bg-Background flex flex-col p-4">
        <div className="text-xl font-bold pb-1 underline text-Accent">
          Edit Note
        </div>
        {/* add name prop to each input */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row w-full h-auto pb-1">
            <div className="mr-2 w-28 italic">Note Name:</div>
            <input
              type="text"
              value={noteName}
              name="noteName"
              className="px-2 text-sm w-[calc(100%-7rem)] bg-Background_Lighter capitalize"
              onChange={(e) => setNoteName(e.target.value)}
            />
          </div>
          <div className="flex flex-row w-full h-auto pb-1">
            <div className="mr-2 w-28 italic">Address:</div>
            <input
              type="text"
              value={noteAddress}
              name="noteAddress"
              className="px-2 text-sm w-[calc(100%-7rem)] bg-Background_Lighter"
              onChange={(e) => setNoteAddress(e.target.value)}
            />
          </div>
          <div className="flex flex-row w-full h-auto pb-1">
            <div className="mr-2 w-28 italic">Hours:</div>
            <input
              type="time"
              value={noteOpen}
              name="noteOpen"
              className="px-2 text-sm w-[calc(((100%-7rem)/2)-0.1275rem)] mr-1 bg-Background_Lighter"
              onChange={(e) => setNoteOpen(e.target.value)}
            />
            <input
              type="time"
              value={noteClose}
              name="noteClose"
              className="px-2 text-sm w-[calc(((100%-7rem)/2)-0.1275rem)] bg-Background_Lighter"
              onChange={(e) => setNoteClose(e.target.value)}
            />
          </div>
          <div className="flex flex-row w-full h-auto pb-1">
            <div className="mr-2 w-28 italic">Message:</div>
            <textarea
              rows={3}
              value={noteMessage}
              name="noteMessage"
              placeholder="Enter a custom note"
              className="px-2 text-sm w-[calc(100%-7rem)] resize-none overflow-y-auto bg-Background_Lighter"
              onChange={(e) => setNoteMessage(e.target.value)}
            />
          </div>
          <div className="flex w-full h-auto pb-1">
            <ImageUploading
              value={uploadedImage}
              onChange={handleImageUploadChange}
              maxNumber={MAX_NUM_OF_IMAGES}
            >
              {({ imageList, onImageUpload, onImageRemoveAll }) => (
                <div className="upload__image-wrapper w-full h-auto items-center flex flex-row">
                  {imageList[0] ? (
                    <button
                      type="button"
                      className={`${REMOVE_IMG_BTN_STYLE} w-[9.4rem] bg-SecondaryButton/40`}
                      onClick={onImageRemoveAll}
                    >
                      Remove Image:
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={`${UPLOAD_IMG_BTN_STYLE} w-[9.4rem] bg-Accent/40`}
                      onClick={onImageUpload}
                    >
                      Upload Image:
                    </button>
                  )}
                  &nbsp;
                  {imageList[0] ? (
                    imageList.map((image, index) => (
                      <div key={index} className="image-item w-full">
                        <img
                          className="h-24 w-full object-cover"
                          src={image.dataURL}
                          alt="uploaded image"
                          width="200"
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
          </div>
          <div className="flex flex-row justify-between items-center pt-1">
            <div className="flex flex-row justify-center items-center">
              <div className="pr-2 font-bold text-Accent2">Priority:</div>
              <FontAwesomeIcon
                icon={faPerson}
                size="lg"
                className={
                  priority === NOTE_PRIORITY.Low
                    ? PRIORITY_STYLE.Low
                    : PRIORITY_STYLE.Default
                }
                onClick={() => setPriority(NOTE_PRIORITY.Low)}
              />
              <FontAwesomeIcon
                icon={faPersonWalking}
                size="lg"
                className={
                  priority === NOTE_PRIORITY.Med
                    ? PRIORITY_STYLE.Med
                    : PRIORITY_STYLE.Default
                }
                onClick={() => setPriority(NOTE_PRIORITY.Med)}
              />
              <FontAwesomeIcon
                icon={faPersonRunning}
                size="lg"
                className={
                  priority === NOTE_PRIORITY.High
                    ? PRIORITY_STYLE.High
                    : PRIORITY_STYLE.Default
                }
                onClick={() => setPriority(NOTE_PRIORITY.High)}
              />
            </div>
            <div>
              <button
                type="submit"
                className={`${FORM_SUBMIT_BUTTON} h-10 w-32 mr-2`}
              >
                Submit
              </button>
              <button
                type="button"
                className={`${FORM_CANCEL_BUTTON} h-10 w-24 bg-SecondaryButton/80`}
                onClick={() => setNoteDialogToggle(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditNoteDialog;
