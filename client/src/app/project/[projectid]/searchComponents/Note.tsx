import { NoteData } from "@/util/models";
import { FC, useState } from "react";
import { SIMPLE_BUTTON_STYLE } from "@/util/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";

interface Props {
  note: NoteData;
  handleUpdateNotes: (locationID: string) => void;
}

const Note: FC<Props> = ({ note, handleUpdateNotes }) => {
  const [expandState, setExpandState] = useState(false);

  // TODO: API calls to edit
  // TODO: API call to embed and add picture
  // TODO: Priority
  return (
    <div className="pb-8 w-full flex flex-col justify-center items-center">
      <div className="flex justify-between w-full items-center">
        <button
          type="button"
          className={`${SIMPLE_BUTTON_STYLE} capitalize w-full flex justify-start `}
          onClick={() => setExpandState(!expandState)}
        >
          {note.noteName}
        </button>
        <FontAwesomeIcon icon={faPenToSquare} style={{ color: "#b070b2" }} />
      </div>
      {expandState ? (
        <div className="flex flex-col h-48 w-full border border-grey">
          <div className="font-bold">
            Address:{" "}
            <div className="text-sm font-light">{note.formattedAddress}</div>
          </div>
          <div className="font-bold">
            Notes:
            <div className="text-sm font-light h-20">
              {note.customNote ? note.customNote : "Enter a custom note"}
            </div>
          </div>
          <div className="flex justify-end w-full font-light text-sm">
            {note.openHours
              ? `${note.openHours} - ${note.closeHours}`
              : "Enter hours"}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Note;
