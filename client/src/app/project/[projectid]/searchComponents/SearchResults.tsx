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
  const [expandFilter, setExpandFilter] = useState(false);
  const [data, setData] = useState(noteData);
  const [sorted, setSorted] = useState("");
  const [filterValues, setFilterValues] = useState<string []>([]);
  const [resort, setResort] = useState(false);

  const sortByValue = (value: string) => {
    if (value === "name") {
      data.sort((a,b) => a.noteName.localeCompare(b.noteName));
    }
    else if (value === "date") {
      data.sort((a,b) => a.scheduleDate ? b.scheduleDate ? a.scheduleDate - b.scheduleDate : -1 : 1);
    }
    else if (value === "priority") {
      const order = { 'Low': 1, 'Medium': 2, 'High': 3 }
      //Not sure why this error occurs
      data.sort((a,b) => order[b.priority] - order[a.priority]);
    }

    setData(data);
    setExpandSort(false);
    setSorted(value);
  };

  const handleFilterChange = (newVal: string) => {
    setFilterValues([...filterValues, newVal]);
  };

  const applyFilter = () => {
    const filteredData = noteData.filter((note) => filterValues.includes(note.priority));
    setData(filteredData);
    setResort(true);
    setExpandFilter(false);
    setFilterValues([]);
  };

  useEffect(() => {
    if (resort) {
      if (sorted != "") {
        sortByValue(sorted);
      }
    }
    setResort(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[resort]);

  if (noteData.length === 0) {
    return null;
  }

  return (
    <div className="h-full">
      <div className="flex flex-row justify-center items-center pb-4 text-2xl">
        <div className="pr-4 text-lg font-bold">Searched Places</div>
      </div>

      <button onClick={() => {
        setExpandSort(!expandSort);
        setExpandFilter(false);
      }}>Sort</button>

      <button onClick={() => {
        setExpandFilter(!expandFilter);
        setExpandSort(false);
      }}>Filter</button>
      
      {expandSort ? (
        <div>
          <ul>
            <li><button onClick={() => sortByValue("name")}>by Name</button></li>
            <li><button onClick={() => sortByValue("date")}>by Date</button></li>
            <li><button onClick={() => sortByValue("priority")}>by Priority</button></li>
          </ul>
        </div>
      ) : null}

      {expandFilter ? (
        <div>
          <ul>
            <li>
              <input type="checkbox" id="priorityLow" name="Low" value="Low" onChange={() => handleFilterChange("Low")}/>
              <label htmlFor="priorityLow"> Low Priority</label>
            </li>
            <li>
              <input type="checkbox" id="priorityMedium" name="Medium" value="Medium" onChange={() => handleFilterChange("Medium")}/>
              <label htmlFor="priorityMedium"> Medium Priority</label>
            </li>
            <li>
              <input type="checkbox" id="priorityHigh" name="High" value="High" onChange={() => handleFilterChange("High")}/>
              <label htmlFor="priorityHigh"> High Priority</label>
            </li>
          </ul>
          <button onClick={applyFilter}>Apply</button>
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
