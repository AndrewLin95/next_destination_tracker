import { Dispatch, FC, SetStateAction } from "react";
import SearchBar from "./searchComponents/SearchBar";

interface Props {
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
  handleSearch: () => void;
}

const SearchModule: FC<Props> = ({
  searchText,
  setSearchText,
  handleSearch,
}) => {
  return (
    <div className="flex flex-col w-1/5 h-full border border-gray-600">
      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        handleSearch={handleSearch}
      />
    </div>
  );
};

export default SearchModule;
