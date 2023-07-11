import { NoteData } from "@/util/models";
import { FC, useState } from "react";
import { SIMPLE_BUTTON_STYLE, VIEW_TYPES } from "@/util/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import RenderAllPriorityIcons from "../components/RenderPriorityIcons";
import SelectivelyRenderPriorityIcons from "../components/SelectivelyRenderPriorityIcons";
import { format } from "date-fns";

interface Props {
  note: NoteData;
  handleEditNoteDialog: (note: NoteData) => void;
  handleDeleteNote: (locationID: string) => void;
  activeLocationID: string | null;
  handleActiveNote: (locationID: string) => void;
  viewToggle: VIEW_TYPES;
  handleDrag: (e: React.DragEvent<HTMLDivElement>, note: NoteData) => void;
}

const Note: FC<Props> = ({
  note,
  handleEditNoteDialog,
  handleDeleteNote,
  activeLocationID,
  handleActiveNote,
  viewToggle,
  handleDrag,
}) => {
  const [expandState, setExpandState] = useState(false);
  // TODO: https://lokeshdhakar.com/projects/color-thief/
  let formattedDate;
  if (note.scheduleDate !== undefined) {
    formattedDate = format(new Date(note.scheduleDate), "iii");
  }

  return (
    <div
      className={`mb-8 w-full flex flex-col justify-center items-center ${
        activeLocationID === note.locationID
          ? "bg-gradient-to-b from-slate-500/60 to-transparent"
          : "bg-transparent border border-Background_Lighter"
      }`}
      onClick={() => handleActiveNote(note.locationID)}
      draggable={viewToggle === VIEW_TYPES.Schedule ? true : false}
      onDragStart={(e) => handleDrag(e, note)}
    >
      <div className="flex justify-between w-full items-center p-1">
        <button
          type="button"
          className={`${SIMPLE_BUTTON_STYLE} capitalize w-full flex justify-start items-center px-1 truncate`}
          onClick={() => setExpandState(!expandState)}
        >
          <SelectivelyRenderPriorityIcons priority={note.priority} />
          <div className="flex flex-row w-full justify-around items-center">
            <div className="underline">{note.noteName}</div>
            {note.scheduleDate === undefined ? null : (
              <div className="text-xs pt-1">{formattedDate}</div>
            )}
          </div>
        </button>
        <button className={SIMPLE_BUTTON_STYLE}>
          <FontAwesomeIcon
            icon={faPenToSquare}
            style={{ color: "#b070b2" }}
            onClick={() => handleEditNoteDialog(note)}
            className="pr-1"
          />
        </button>
        <button className={SIMPLE_BUTTON_STYLE}>
          <FontAwesomeIcon
            icon={faTrashCan}
            style={{ color: "#b070b2" }}
            onClick={() => handleDeleteNote(note.locationID)}
          />
        </button>
      </div>
      {expandState ? (
        <div className="flex flex-col h-48 w-full p-2">
          <div className="font-bold pb-2">
            Address:
            <div className="text-xs font-light overflow-y-auto h-4">
              {note.formattedAddress}
            </div>
          </div>
          <div className="font-bold">
            Notes:
            <div className="text-xs font-light h-20 overflow-y-auto overflow-x-hidden">
              {note.customNote ? note.customNote : "Add a custom note"}
            </div>
          </div>
          <div className="flex justify-between items-center w-full font-light text-sm">
            <RenderAllPriorityIcons priority={note.priority} />
            <div>
              {note.openHours
                ? `Operating Hours: ${note.openHours} - ${note.closeHours}`
                : "Add Operating Hours"}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Note;
