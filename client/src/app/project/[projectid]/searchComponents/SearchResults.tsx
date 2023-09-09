import { NoteData, ScheduleColors } from "@/util/models/ProjectModels";
import { FC, useState } from "react";
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
  const [expandSort, setExpandSort] = useState(false);
  const [data, setData] = useState(noteData);

  const sortByName = () => {
    data.sort((a,b) => a.noteName.localeCompare(b.noteName));
    setData(data);
    setExpandSort(false);
  };

  const sortByDate = () => {
    data.sort((a,b) => a.scheduleDate ? b.scheduleDate ? a.scheduleDate - b.scheduleDate : -1 : 1);
    setData(data);
    setExpandSort(false);
  };

  const sortByPriority = () => {
    const order = { 'Low': 1, 'Medium': 2, 'High': 3 }
    //Not sure why this error occurs
    data.sort((a,b) => order[b.priority] - order[a.priority]);
    setData(data);
    setExpandSort(false);
  };

  if (noteData.length === 0) {
    return null;
  }

  return (
    <div className="h-full">
      <div className="flex flex-row justify-center items-center pb-4 text-2xl">
        <div className="pr-4 text-lg font-bold">Searched Places</div>
      </div>

      <button onClick={() => setExpandSort(!expandSort)}>Sort</button>
      {expandSort ? (
        <div>
          <ul>
            <li><button onClick={sortByName}>by Name</button></li>
            <li><button onClick={sortByDate}>by Date</button></li>
            <li><button onClick={sortByPriority}>by Priority</button></li>
          </ul>
        </div>
      ) : null}

      <div className="flex flex-col items-center h-[calc(100vh-15rem)] overflow-y-auto pt-4">
        {data.map((note) => {
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
          )
        })}
      </div>
    </div>
  );
};

export default SearchResults;
