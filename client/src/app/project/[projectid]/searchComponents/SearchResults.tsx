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
  const [expandModal, setExpandModal] = useState(false);
  const [data, setData] = useState(noteData);
  const [filterValues, setFilterValues] = useState<string []>([]);
  const [lastFilterValues, setLastFilterValues] = useState<string []>([]);
  const [sortValue, setSortValue] = useState("");
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
      data.sort((a,b) => order[b.priority] - order[a.priority]);
    } else {
      setData(noteData);
    }
    setSortValue(value);
    setData([...data]);
  };

  const handleFilterChange = (newVal: string) => {
    if (filterValues.includes(newVal)) {
      setFilterValues((curr) => curr.filter((val) => val != newVal));
    } else {
      setFilterValues([...filterValues, newVal]);
    }
  };

  const applyFilter = () => {
    if (filterValues.length != 0) {
      const filteredData = noteData.filter((note) => filterValues.includes(note.priority));
      setData(filteredData);
    } else {
      setData(noteData);
    }
    setResort(true);
    setLastFilterValues([...filterValues]);
    setExpandModal(false);
  };

  const cancelFilter = () => {
    setExpandModal(false);
    setFilterValues([...lastFilterValues]);
  };

  useEffect(() => {
    if (resort) {
      if (sortValue != "") {
        sortByValue(sortValue);
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
        setExpandModal(!expandModal);
      }}>Sort/Filter</button>

      {expandModal ? (
        <div className="h-full flex justify-center items-center bg-gray-600/50 absolute inset-0">
          <div className="flex justify-center flex-col items-center rounded-lg bg-white py-5 px-20 relative z-50">
            <p className="font-medium text-2xl mb-4">Sort</p>
            <ul>
              <li><button onClick={() => sortByValue("name")}>by Name</button></li>
              <li><button onClick={() => sortByValue("date")}>by Date</button></li>
              <li><button onClick={() => sortByValue("priority")}>by Priority</button></li>
            </ul>

            <p className="font-medium text-2xl my-4">Filter</p>
            <ul className="flex flex-col space-y-2 mb-5">
              <li>
                <input type="checkbox" id="priorityLow" name="Low" value="Low" checked={filterValues.includes("Low")} onChange={() => handleFilterChange("Low")}/>
                <label htmlFor="priorityLow"> Low Priority</label>
              </li>
              <li>
                <input type="checkbox" id="priorityMedium" name="Medium" value="Medium" checked={filterValues.includes("Medium")} onChange={() => handleFilterChange("Medium")}/>
                <label htmlFor="priorityMedium"> Medium Priority</label>
              </li>
              <li>
                <input type="checkbox" id="priorityHigh" name="High" value="High" checked={filterValues.includes("High")} onChange={() => handleFilterChange("High")}/>
                <label htmlFor="priorityHigh"> High Priority</label>
              </li>
            </ul>
            <button onClick={cancelFilter}>Cancel</button>
            <button onClick={applyFilter}>Apply Filters</button>
          </div>
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
