import { FORM_CANCEL_BUTTON, FORM_SUBMIT_BUTTON } from "@/util/constants";
import { NoteData } from "@/util/models/ProjectModels";
import { faArrowDown, faArrowUp, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, FC, SetStateAction, useState } from "react";

interface Props {
  noteData: NoteData[];
  setLocationIDArray: Dispatch<SetStateAction<string []>>;
  setSortValue: Dispatch<SetStateAction<string>>;
  sortValue: string;
  ascending: boolean;
  setAscending: Dispatch<SetStateAction<boolean>>;
}

const SortFilterModal:FC<Props> = ({
  noteData,
  setLocationIDArray,
  setSortValue,
  sortValue,
  ascending,
  setAscending
}) => {
  const [expandModal, setExpandModal] = useState(false);
  const [filterValues, setFilterValues] = useState<string []>([]);
  const [lastFilterValues, setLastFilterValues] = useState<string []>([]);
  const [sortDropDown, setSortDropDown] = useState(false);
  

  //update filterValues on change of filter checkboxes
  const handleFilterChange = (newVal: string) => {
    if (filterValues.includes(newVal)) {
      setFilterValues((curr) => curr.filter((val) => val != newVal));
    } else {
      setFilterValues([...filterValues, newVal]);
    }
  };

  //add location IDs of filtered data to be later passed on to map and search modules
  const applyFilter = () => {
    const tempIDs: string[] = [];

    if (filterValues.length != 0) {
      const filteredData = noteData.filter((note) => filterValues.includes(note.priority));
      filteredData.forEach((note)=>{tempIDs.push(note.locationID)});
      setLocationIDArray(tempIDs);
    } else {
      setLocationIDArray([]);
    }
    setLastFilterValues([...filterValues]);
    setExpandModal(false);
  };

  //close modal and set filterValues to last set chosen by user
  const cancelFilter = () => {
    setExpandModal(false);
    setFilterValues([...lastFilterValues]);
  };

  const sortClick = (value:string) => {
    setSortValue(value);
    if (sortValue === value) {
      setAscending(!ascending);
    }
  }

  return (
    <div>
      <div className="flex flex-row justify-center items-center pb-4 text-2xl">
        <div className="pr-4 text-lg font-bold">Searched Places</div>
      </div>
      <div className="flex flex-row justify-between px-2">
        <button onClick={() => {
          setExpandModal(!expandModal);
        }}>Sort/Filter</button>

        {expandModal &&
          <div className="h-full flex justify-center items-center bg-gray-600/50 absolute inset-0">
            <div className="flex justify-center flex-col items-center rounded-lg bg-Background_Lighter py-5 px-10 relative z-50">
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
              <div className="flex flex-row justify-end h-full space-x-2">
                <button onClick={applyFilter} className={`${FORM_SUBMIT_BUTTON} h-10 w-45 px-5`}>Apply Filters</button>
                <button onClick={cancelFilter} className={`${FORM_CANCEL_BUTTON} h-10 mb-2 px-5`}>Cancel</button>
              </div>
            </div>
          </div>
        }

        <div className="relative inline-block">
          <button onClick={() => setSortDropDown(!sortDropDown)} className="capitalize flex space-x-2">
            <p>{sortValue}</p>
            <FontAwesomeIcon icon={faSortDown} />
          </button>
          
          {sortDropDown && 
            <ul className="flex flex-col space-y-2 absolute z-1">
              <li>
                <button onClick={() => sortClick("name")} className="w-full flex flex-row items-center space-x-2" autoFocus={sortValue === "name"}>
                  <p>by Name</p>
                  {(!ascending && sortValue === "name") ? <FontAwesomeIcon icon={faArrowDown} /> : <FontAwesomeIcon icon={faArrowUp} />}
                </button>
              </li>
              <li>
                <button onClick={() => sortClick("date")} className="w-full flex flex-row items-center space-x-2" autoFocus={sortValue === "date"}>
                  <p>by Date</p>
                  {(!ascending && sortValue === "date") ? <FontAwesomeIcon icon={faArrowDown} /> : <FontAwesomeIcon icon={faArrowUp} />}
                </button>
              </li>
              <li>
                <button onClick={() => sortClick("priority")} className="w-full flex flex-row items-center space-x-2" autoFocus={sortValue === "priority"}>
                  <p>by Priority</p>
                  {(!ascending && sortValue === "priority") ? <FontAwesomeIcon icon={faArrowDown} /> : <FontAwesomeIcon icon={faArrowUp} />}
                </button>
              </li>
            </ul>
          }
        </div>
      </div>
    </div>
  ); 
};

export default SortFilterModal;