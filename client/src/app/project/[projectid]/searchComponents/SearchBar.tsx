import { FC, Dispatch, SetStateAction } from "react";
import { DEFAULT_BUTTON } from "@/util/constants";

interface Props {
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
  handleSearch: () => void;
}

const SearchBar: FC<Props> = ({ searchText, setSearchText, handleSearch }) => {
  return (
    <div className="flex flex-row px-4">
      <input
        className="w-2/3 mr-2 p-2 border bg-accent1 border-dark_accent1 dark:bg-dark_accent1 dark:border-accent1"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <button className={`${DEFAULT_BUTTON}`} onClick={() => handleSearch()}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
