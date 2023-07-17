import { NoteData, ScheduleColors } from "@/util/models";
import { FC, useState } from "react";
import {
  SIMPLE_BUTTON_STYLE,
  VIEW_TYPES,
  HEX_TRANSPARENCY,
  DAYS_OF_WEEK,
} from "@/util/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import RenderAllPriorityIcons from "../components/RenderPriorityIcons";
import SelectivelyRenderPriorityIcons from "../components/SelectivelyRenderPriorityIcons";
import { formatInTimeZone } from "date-fns-tz";

interface Props {
  note: NoteData;
  handleEditNoteDialog: (note: NoteData) => void;
  handleDeleteNote: (locationID: string) => void;
  activeLocationID: string | null;
  handleActiveNote: (locationID: string) => void;
  viewToggle: VIEW_TYPES;
  handleDrag: (e: React.DragEvent<HTMLDivElement>, note: NoteData) => void;
  scheduleColors: ScheduleColors;
}

const Note: FC<Props> = ({
  note,
  handleEditNoteDialog,
  handleDeleteNote,
  activeLocationID,
  handleActiveNote,
  viewToggle,
  handleDrag,
  scheduleColors,
}) => {
  const [expandState, setExpandState] = useState(false);
  // TODO: https://lokeshdhakar.com/projects/color-thief/
  let formattedDate;
  let dayOfWeek: DAYS_OF_WEEK | null = null;
  if (note.scheduleDate !== undefined) {
    formattedDate = formatInTimeZone(note.scheduleDate, "GMT", "iii");
    dayOfWeek = formatInTimeZone(
      note.scheduleDate,
      "GMT",
      "iiii"
    ) as DAYS_OF_WEEK;
  }

  return (
    <div
      className={`mb-8 w-full flex flex-col justify-center items-center border border-Background_Lighter`}
      style={{
        backgroundImage:
          activeLocationID === note.locationID
            ? `linear-gradient(#64748B${HEX_TRANSPARENCY.SixtyPercent}, transparent)`
            : dayOfWeek === null
            ? ""
            : `linear-gradient(${scheduleColors[dayOfWeek]}${HEX_TRANSPARENCY.ThirtyPercent}, transparent)`,
      }}
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
