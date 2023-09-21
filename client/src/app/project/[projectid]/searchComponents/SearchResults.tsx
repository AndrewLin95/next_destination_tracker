import { NoteData, ScheduleColors } from "@/util/models/ProjectModels";
import { FC, useEffect, useState } from "react";
import Note from "./Note";
import { VIEW_TYPES } from "@/util/constants";

interface Props {
  sortedNoteData: NoteData[];
  handleEditNoteDialog: (note: NoteData) => void;
  handleDeleteNote: (locationID: string) => void;
  activeLocationID: string | null;
  handleActiveNote: (locationID: string) => void;
  viewToggle: VIEW_TYPES;
  handleDrag: (e: React.DragEvent<HTMLDivElement>, note: NoteData) => void;
  scheduleColors: ScheduleColors;
  locationIDArray: string[];
}

const SearchResults: FC<Props> = ({
  sortedNoteData,
  handleEditNoteDialog,
  handleDeleteNote,
  activeLocationID,
  handleActiveNote,
  viewToggle,
  handleDrag,
  scheduleColors,
  locationIDArray
}) => {

  if (sortedNoteData.length === 0) {
    return null;
  } 
  
  return (
    <div className="h-full">
      <div className="flex flex-col items-center h-[calc(100vh-15rem)] overflow-y-auto pt-4">
        {sortedNoteData.map((note) => {
          if (locationIDArray.length === 0 || locationIDArray.includes(note.locationID)) {
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
            )}
        })}
      </div>
    </div>
  );
};

export default SearchResults;
