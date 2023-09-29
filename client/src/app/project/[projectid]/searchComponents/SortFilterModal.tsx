import {
  DEFAULT_BUTTON,
  FORM_CANCEL_BUTTON,
  FORM_SUBMIT_BUTTON,
} from "@/util/constants";
import { NoteData } from "@/util/models/ProjectModels";
import {
  faArrowDown,
  faArrowUp,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, FC, SetStateAction, useState } from "react";

interface Props {
  noteData: NoteData[];
  setLocationIDArray: Dispatch<SetStateAction<string[]>>;
  setSortValue: Dispatch<SetStateAction<string>>;
  sortValue: string;
  ascending: boolean;
  setAscending: Dispatch<SetStateAction<boolean>>;
}

const SortFilterModal: FC<Props> = ({
  noteData,
  setLocationIDArray,
  setSortValue,
  sortValue,
  ascending,
  setAscending,
}) => {
  const [expandModal, setExpandModal] = useState(false);
  const [filterValues, setFilterValues] = useState<string[]>([]);
  const [lastFilterValues, setLastFilterValues] = useState<string[]>([]);
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
      const filteredData = noteData.filter((note) =>
        filterValues.includes(note.priority)
      );
      filteredData.forEach((note) => {
        tempIDs.push(note.locationID);
      });
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

  const sortClick = (value: string) => {
    setSortValue(value);
    if (sortValue === value) {
      setAscending(!ascending);
    }
  };

  return (
    <div>
      <div className="flex flex-row justify-center items-center pb-4 text-2xl">
        <div className="pr-4 text-lg font-bold">Searched Places</div>
      </div>
      <div className="flex flex-row justify-between px-2 h-10">
        <button
          className={DEFAULT_BUTTON}
          type="button"
          onClick={() => {
            setExpandModal(!expandModal);
          }}
        >
          Filter
        </button>

        {expandModal && (
          <div className="h-full flex justify-center items-center bg-gray-600/50 absolute inset-0">
            <div className="flex justify-center flex-col rounded p-4 relative z-50 border bg-primary border-dark_accent1 dark:bg-dark_primary dark:border-accent1">
              <p className="text-xl font-bold pb-4 underline text-black dark:text-white">
                Filter
              </p>
              <div className="flex flex-col pl-4">
                <ul className="flex flex-col space-y-2 mb-5">
                  <li>
                    <input
                      type="checkbox"
                      id="priorityLow"
                      name="Low"
                      value="Low"
                      checked={filterValues.includes("Low")}
                      onChange={() => handleFilterChange("Low")}
                    />
                    <label htmlFor="priorityLow"> Low Priority</label>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      id="priorityMedium"
                      name="Medium"
                      value="Medium"
                      checked={filterValues.includes("Medium")}
                      onChange={() => handleFilterChange("Medium")}
                    />
                    <label htmlFor="priorityMedium"> Medium Priority</label>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      id="priorityHigh"
                      name="High"
                      value="High"
                      checked={filterValues.includes("High")}
                      onChange={() => handleFilterChange("High")}
                    />
                    <label htmlFor="priorityHigh"> High Priority</label>
                  </li>
                </ul>
              </div>
              <div className="flex flex-row justify-end h-full space-x-2">
                <button
                  onClick={applyFilter}
                  className={`${FORM_SUBMIT_BUTTON} h-10 w-45 px-5 mr-2 br-1 rounded bg-accent1 dark:bg-dark_accent1`}
                >
                  Apply Filters
                </button>
                <button
                  onClick={cancelFilter}
                  className={`${FORM_CANCEL_BUTTON} h-10 w-24 rounded bg-primary2 dark:bg-dark_primary2`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="relative h-10">
          <button
            onClick={() => setSortDropDown(!sortDropDown)}
            className={`${DEFAULT_BUTTON} capitalize space-x-2 flex flex-row h-10 items-center`}
          >
            <p>{sortValue}</p>
            <FontAwesomeIcon icon={faSortDown} className="relative bottom-1" />
          </button>

          {sortDropDown && (
            <ul className="flex flex-col space-y-2 absolute z-1 w-[6.5rem] ">
              <li>
                <button
                  onClick={() => sortClick("name")}
                  className="w-full flex flex-row items-center space-x-2 rounded-md text-sm border p-1 mt-2 bg-accent2/80 dark:bg-dark_accent2/60"
                  autoFocus={sortValue === "name"}
                >
                  <p>by Name</p>
                  {!ascending && sortValue === "name" ? (
                    <FontAwesomeIcon icon={faArrowDown} />
                  ) : (
                    <FontAwesomeIcon icon={faArrowUp} />
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => sortClick("date")}
                  className="w-full flex flex-row items-center space-x-2 rounded-md text-sm border p-1 bg-accent2/80 dark:bg-dark_accent2/60"
                  autoFocus={sortValue === "date"}
                >
                  <p>by Date</p>
                  {!ascending && sortValue === "date" ? (
                    <FontAwesomeIcon icon={faArrowDown} />
                  ) : (
                    <FontAwesomeIcon icon={faArrowUp} />
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => sortClick("priority")}
                  className="w-full flex flex-row items-center space-x-2 rounded-md text-sm border p-1 bg-accent2/80 dark:bg-dark_accent2/60"
                  autoFocus={sortValue === "priority"}
                >
                  <p>by Priority</p>
                  {!ascending && sortValue === "priority" ? (
                    <FontAwesomeIcon icon={faArrowDown} />
                  ) : (
                    <FontAwesomeIcon icon={faArrowUp} />
                  )}
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SortFilterModal;
