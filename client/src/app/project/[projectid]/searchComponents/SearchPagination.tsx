import { FC } from "react";

interface Props {
  paginationState: (string | number)[];
}

const SearchPagination: FC<Props> = ({ paginationState }) => {
  if (paginationState.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-row justify-center pb-4">
      <button className="w-12 h-12 border">{"<"}</button>
      {paginationState.map((paginationValue, index) => {
        return (
          <button key={index} className="w-12 h-12 border">
            {paginationValue}
          </button>
        );
      })}
      <button className="w-12 h-12 border">{">"}</button>
    </div>
  );
};

export default SearchPagination;
