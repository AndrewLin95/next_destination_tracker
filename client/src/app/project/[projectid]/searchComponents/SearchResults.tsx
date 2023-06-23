import { FC } from "react";

const SearchResults: FC = ({}) => {
  return (
    <div className="h-full">
      <div className="flex flex-row justify-center items-center p-4 text-2xl">
        <div className="pr-4 text-lg">Searched Places</div>
        <button className="text-lg">Delete</button>
      </div>
      <div className="flex flex-col items-center h-full pb-32">
        {/* <div v-for="(value, key) in searchHistoryDisplayData" 
          className="pb-8 w-full flex justify-center items-center"
        >
          <input 
            type="checkbox"
            @click="handleDeleteFlagClickAction(($event.target as HTMLInputElement).checked, value.id)"
            :checked="value.deleteFlag"
            className="w-14 ml-12"
          />
          <div className="w-full">
            {{ value.location }}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default SearchResults;
