import { NoteData, ScheduleColors } from "@/util/models/ProjectModels";
import { FC } from "react";
import Note from "./Note";
import { VIEW_TYPES } from "@/util/constants";

interface Props {
  noteData: NoteData[];
  handleEditNoteDialog: (note: NoteData) => void;
  handleDeleteNote: (locationID: string) => void;
  activeLocationID: string | null;
  handleActiveNote: (locationID: string) => void;
  viewToggle: VIEW_TYPES;
  handleDrag: (e: React.DragEvent<HTMLDivElement>, note: NoteData) => void;
  scheduleColors: ScheduleColors;
}

const SearchResults: FC<Props> = ({
  noteData,
  handleEditNoteDialog,
  handleDeleteNote,
  activeLocationID,
  handleActiveNote,
  viewToggle,
  handleDrag,
  scheduleColors,
}) => {
  if (noteData.length === 0) {
    return null;
  }

  return (
    <div className="h-full">
      <div className="flex flex-row justify-center items-center pb-4 text-2xl">
        <div className="pr-4 text-lg font-bold">Searched Places</div>
      </div>
      <div className="flex flex-col items-center h-[calc(100vh-15rem)] overflow-y-auto">
        {noteData.map((note) => {
          return (
            <Note
              key={note.locationID}
              note={note}
              handleEditNoteDialog={handleEditNoteDialog}
              handleDeleteNote={handleDeleteNote}
              activeLocationID={activeLocationID}
              handleActiveNote={handleActiveNote}
              viewToggle={viewToggle}
              handleDrag={handleDrag}
              scheduleColors={scheduleColors}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults;
