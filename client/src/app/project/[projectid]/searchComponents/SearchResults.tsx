import { NoteData, ScheduleColors } from "@/util/models/ProjectModels";
import { FC, useEffect, useState } from "react";
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
  sortValue:string;
  locationIDArray: string[];
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
  sortValue,
  locationIDArray
}) => {

  const [noteDisplayData, setNoteDisplayData] = useState<NoteData[]>([...noteData]);

  useEffect(() => {
    const sortByValue = (value: string) => {
      let tempNoteData: NoteData[] = [...noteData];
  
      if (value === "name") {
        tempNoteData.sort((a,b) => a.noteName.localeCompare(b.noteName));
      }
      else if (value === "date") {
        tempNoteData.sort((a,b) => a.scheduleDate ? b.scheduleDate ? a.scheduleDate - b.scheduleDate : -1 : 1);
      }
      else if (value === "priority") {
        const order = { 'Low': 1, 'Medium': 2, 'High': 3 }
        tempNoteData.sort((a,b) => order[b.priority] - order[a.priority]);
      } 
  
      if (value != "") setNoteDisplayData(tempNoteData);
    };

    sortByValue(sortValue);

  },[sortValue, noteData]);

  if (noteData.length === 0) {
    return null;
  } 
  
  return (
    <div className="h-full">
      <div className="flex flex-col items-center h-[calc(100vh-15rem)] overflow-y-auto pt-4">
        {noteDisplayData.map((note) => {
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
