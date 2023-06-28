import { NoteData } from "@/util/models";
import { FC, useState } from "react";
import { SIMPLE_BUTTON_STYLE } from "@/util/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import RenderAllPriorityIcons from "../components/RenderPriorityIcons";
import SelectivelyRenderPriorityIcons from "../components/SelectivelyRenderPriorityIcons";

interface Props {
  note: NoteData;
  handleEditNoteDialog: (note: NoteData) => void;
}

const Note: FC<Props> = ({ note, handleEditNoteDialog }) => {
  const [expandState, setExpandState] = useState(false);

  return (
    <div className="mb-8 w-full flex flex-col justify-center items-center border border-Background_Lighter">
      <div className="flex justify-between w-full items-center p-1">
        <button
          type="button"
          className={`${SIMPLE_BUTTON_STYLE} capitalize w-full flex justify-start px-1 truncate`}
          onClick={() => setExpandState(!expandState)}
        >
          <SelectivelyRenderPriorityIcons priority={note.priority} />
          <div className="underline">{note.noteName}</div>
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
          <FontAwesomeIcon icon={faTrashCan} style={{ color: "#b070b2" }} />
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
