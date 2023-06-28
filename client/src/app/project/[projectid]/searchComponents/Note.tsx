import { NoteData } from "@/util/models";
import { FC, useState } from "react";
import {
  PRIORITY_DEFAULT_STYLE,
  PRIORITY_SELECTED_STYLE,
  SIMPLE_BUTTON_STYLE,
} from "@/util/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import {
  faPerson,
  faPersonWalking,
  faPersonRunning,
} from "@fortawesome/free-solid-svg-icons";
import {
  NOTE_PRIORITY_LOW,
  NOTE_PRIORITY_MED,
  NOTE_PRIORITY_HIGH,
} from "@/util/constants";

interface Props {
  note: NoteData;
  handleEditNoteDialog: (note: NoteData) => void;
}

const Note: FC<Props> = ({ note, handleEditNoteDialog }) => {
  const [expandState, setExpandState] = useState(false);

  // TODO: API calls to edit
  // TODO: API call to embed and add picture
  // TODO: Priority

  const renderPriorityIcons = () => {
    return (
      <>
        <FontAwesomeIcon
          icon={faPerson}
          size="lg"
          className={
            note.priority === NOTE_PRIORITY_LOW
              ? PRIORITY_SELECTED_STYLE
              : PRIORITY_DEFAULT_STYLE
          }
        />
        <FontAwesomeIcon
          icon={faPersonWalking}
          size="lg"
          className={
            note.priority === NOTE_PRIORITY_MED
              ? PRIORITY_SELECTED_STYLE
              : PRIORITY_DEFAULT_STYLE
          }
        />
        <FontAwesomeIcon
          icon={faPersonRunning}
          size="lg"
          className={
            note.priority === NOTE_PRIORITY_HIGH
              ? PRIORITY_SELECTED_STYLE
              : PRIORITY_DEFAULT_STYLE
          }
        />
      </>
    );
  };

  return (
    <div className="pb-8 w-full flex flex-col justify-center items-center">
      <div className="flex justify-between w-full items-center p-1">
        <button
          type="button"
          className={`${SIMPLE_BUTTON_STYLE} capitalize w-full flex justify-start px-1 truncate`}
          onClick={() => setExpandState(!expandState)}
        >
          {note.noteName}
        </button>
        <FontAwesomeIcon
          icon={faPenToSquare}
          style={{ color: "#b070b2" }}
          onClick={() => handleEditNoteDialog(note)}
          className="pr-1"
        />
        <FontAwesomeIcon icon={faTrashCan} style={{ color: "#b070b2" }} />
      </div>
      {expandState ? (
        <div className="flex flex-col h-48 w-full border border-grey p-2">
          <div className="font-bold pb-2">
            Address:{" "}
            <div className="text-xs font-light">{note.formattedAddress}</div>
          </div>
          <div className="font-bold">
            Notes:
            <div className="text-xs font-light h-20 overflow-y-auto overflow-x-hidden">
              {note.customNote ? note.customNote : "Add a custom note"}
            </div>
          </div>
          <div className="flex justify-between items-center w-full font-light text-sm">
            <div>{renderPriorityIcons()}</div>
            <div>
              {note.openHours
                ? `Hours: ${note.openHours} - ${note.closeHours}`
                : "Add hours"}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Note;
